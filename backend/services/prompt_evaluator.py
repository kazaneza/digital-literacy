import openai
import json
import os
import re
from dotenv import load_dotenv
from typing import Dict, Any
from models.assessment import PromptRequest, EvaluationResponse, EvaluationCriteria

# Load environment variables
load_dotenv()

class PromptEvaluatorService:
    def __init__(self):
        # Initialize OpenAI client properly with error handling
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = openai.OpenAI(api_key=api_key)
        
    def sanitize_json_string(self, text: str) -> str:
        """Remove invalid control characters from JSON string"""
        # Remove control characters except for \n, \r, \t
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
        # Escape any remaining problematic characters
        text = text.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
        return text

    def extract_json_from_response(self, response_text: str) -> dict:
        """Extract and parse JSON from OpenAI response with error handling"""
        try:
            # First, try to parse as-is
            return json.loads(response_text)
        except json.JSONDecodeError:
            try:
                # Sanitize the text and try again
                sanitized = self.sanitize_json_string(response_text)
                return json.loads(sanitized)
            except json.JSONDecodeError:
                try:
                    # Try to extract JSON from within the response
                    json_start = response_text.find('{')
                    json_end = response_text.rfind('}') + 1
                    if json_start != -1 and json_end > json_start:
                        json_part = response_text[json_start:json_end]
                        sanitized_json = self.sanitize_json_string(json_part)
                        return json.loads(sanitized_json)
                except json.JSONDecodeError:
                    pass
                
                # If all else fails, return a default structure
                return {
                    "clarity": 20,
                    "specificity": 20,
                    "completeness": 20,
                    "relevance": 20,
                    "feedback": "Unable to properly evaluate this prompt due to formatting issues. Please try a clearer, more structured prompt.",
                    "answer": "Error: Could not generate answer due to prompt formatting issues."
                }
        self.sample_data = """
Employee_ID | First_Name | Last_Name | Department | Position | Salary | Years_Experience | Manager_ID | Project_Code | Performance_Rating | Location | Join_Date
E001 | Jean | Uwimana | IT | Senior Developer | 85000 | 8 | E010 | PROJ_A | 4.2 | Kigali | 2016-03-15
E002 | Marie | Mukamana | Finance | Analyst | 45000 | 3 | E011 | PROJ_B | 3.8 | Kigali | 2021-07-20
E003 | Paul | Nkurunziza | IT | Junior Developer | 35000 | 1 | E001 | PROJ_A | 3.5 | Kigali | 2023-01-10
E004 | Grace | Uwase | HR | Manager | 75000 | 12 | NULL | PROJ_C | 4.5 | Musanze | 2012-09-05
E005 | David | Habimana | Finance | Senior Analyst | 65000 | 6 | E011 | PROJ_B | 4.1 | Kigali | 2018-11-30
E006 | Sarah | Ingabire | Marketing | Coordinator | 40000 | 2 | E012 | PROJ_D | 3.9 | Huye | 2022-05-18
E007 | James | Mugisha | IT | DevOps Engineer | 70000 | 5 | E010 | PROJ_A | 4.0 | Kigali | 2019-08-12
E008 | Alice | Nyirahabimana | Sales | Representative | 38000 | 4 | E013 | PROJ_E | 3.6 | Rubavu | 2020-02-28
E009 | Robert | Bizimana | Finance | Junior Analyst | 32000 | 1 | E005 | PROJ_B | 3.4 | Kigali | 2023-06-01
E010 | Emmanuel | Kayitare | IT | Department Head | 95000 | 15 | NULL | PROJ_A | 4.7 | Kigali | 2009-01-20
E011 | Claudine | Mukamazimpaka | Finance | Department Head | 90000 | 10 | NULL | PROJ_B | 4.3 | Kigali | 2014-04-10
E012 | Patrick | Nsengimana | Marketing | Department Head | 88000 | 9 | NULL | PROJ_D | 4.4 | Kigali | 2015-07-25
E013 | Immaculee | Uwimana | Sales | Department Head | 92000 | 11 | NULL | PROJ_E | 4.6 | Kigali | 2013-12-03
E014 | Thomas | Hakizimana | Operations | Manager | 72000 | 7 | NULL | PROJ_F | 4.2 | Gisenyi | 2017-10-14
E015 | Esperance | Mukandayisenga | HR | Specialist | 48000 | 5 | E004 | PROJ_C | 3.7 | Musanze | 2019-03-22
"""
        
        self.assessment_question = """Analyze the employee database and provide a comprehensive report that includes:
1. For each department, identify the highest-paid employee and their manager (if they have one)
2. Calculate the average salary for employees with performance ratings above 4.0, grouped by years of experience (0-2 years, 3-5 years, 6+ years)
3. List all employees who earn more than their direct manager (if applicable)
4. Identify departments where the average salary is above 60,000 and list the project codes associated with those departments
5. Find employees hired in the same year who work on different projects, and show their salary differences"""
        
        # Store the individual requirements for strict matching
        self.question_requirements = [
            "For each department, identify the highest-paid employee and their manager (if they have one)",
            "Calculate the average salary for employees with performance ratings above 4.0, grouped by years of experience (0-2 years, 3-5 years, 6+ years)",
            "List all employees who earn more than their direct manager (if applicable)",
            "Identify departments where the average salary is above 60,000 and list the project codes associated with those departments",
            "Find employees hired in the same year who work on different projects, and show their salary differences"
        ]
        
        self.correct_answer = """**COMPREHENSIVE EMPLOYEE ANALYSIS REPORT**

**1. Highest-Paid Employee per Department with Manager:**
- IT Department: Emmanuel Kayitare ($95,000) - No Manager (Department Head)
- Finance Department: Claudine Mukamazimpaka ($90,000) - No Manager (Department Head)  
- HR Department: Grace Uwase ($75,000) - No Manager (Department Head)
- Marketing Department: Patrick Nsengimana ($88,000) - No Manager (Department Head)
- Sales Department: Immaculee Uwimana ($92,000) - No Manager (Department Head)
- Operations Department: Thomas Hakizimana ($72,000) - No Manager (Department Head)

**2. Average Salary by Experience Level (Performance > 4.0):**
- 0-2 years experience: No employees with rating > 4.0
- 3-5 years experience: $70,000 (James Mugisha)
- 6+ years experience: $85,750 (Jean Uwimana: $85,000, David Habimana: $65,000, Grace Uwase: $75,000, Emmanuel Kayitare: $95,000, Claudine Mukamazimpaka: $90,000, Patrick Nsengimana: $88,000, Immaculee Uwimana: $92,000, Thomas Hakizimana: $72,000)

**3. Employees Earning More Than Their Manager:**
- No employees earn more than their direct managers in this dataset

**4. Departments with Average Salary > $60,000:**
- IT Department: Average $71,250 - Projects: PROJ_A
- Finance Department: Average $58,000 - Below threshold
- Marketing Department: Average $64,000 - Projects: PROJ_D  
- Sales Department: Average $65,000 - Projects: PROJ_E
- Operations Department: Average $72,000 - Projects: PROJ_F

**5. Same-Year Hires on Different Projects:**
- 2019: James Mugisha (PROJ_A, $70,000) vs Esperance Mukandayisenga (PROJ_C, $48,000) - Difference: $22,000
- 2023: Paul Nkurunziza (PROJ_A, $35,000) vs Robert Bizimana (PROJ_B, $32,000) - Difference: $3,000"""

    def similarity_ratio(self, str1, str2):
        """Calculate similarity ratio between two strings"""
        words1 = set(str1.split())
        words2 = set(str2.split())
        if not words1 or not words2:
            return 0
        intersection = words1.intersection(words2)
        return len(intersection) / min(len(words1), len(words2))

    def is_copying_question(self, user_prompt, question_text, requirements_list):
        """Detect if user is copying the question instead of writing a proper AI prompt"""
        user_lower = user_prompt.lower().strip()
        question_lower = question_text.lower().strip()
        
        # Check if user prompt contains large portions of the original question
        if len(user_lower) > 50:  # Only check substantial prompts
            # Check for direct copying of question text
            question_words = set(question_lower.split())
            user_words = set(user_lower.split())
            overlap_ratio = len(question_words.intersection(user_words)) / len(question_words)
            
            if overlap_ratio > 0.6:  # More than 60% word overlap
                return True
        
        # Check if user copied individual requirements
        for requirement in requirements_list:
            req_lower = requirement.lower().strip()
            # Check for exact or near-exact matches of requirements
            if req_lower in user_lower or self.similarity_ratio(req_lower, user_lower) > 0.8:
                return True
        
        # Check for common copying patterns
        copying_indicators = [
            "analyze the employee database and provide",
            "comprehensive report that includes",
            "for each department, identify the highest-paid employee and their manager",
            "calculate the average salary for employees with performance ratings above 4.0",
            "list all employees who earn more than their direct manager",
            "identify departments where the average salary is above 60,000",
            "find employees hired in the same year who work on different projects"
        ]
        
        for indicator in copying_indicators:
            if indicator in user_lower:
                return True
        
        return False
    async def evaluate_prompt(self, request: PromptRequest) -> EvaluationResponse:
        # First, let's test the user's prompt by generating an answer
        answer_prompt = f"""
        Given this data table:
        {self.sample_data}
        
        User's prompt: "{request.prompt}"
        
        Please follow the user's prompt exactly and provide the answer they are asking for.
        """
        
        try:
            # Generate answer using user's prompt
            answer_response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that follows user prompts exactly to analyze data."},
                    {"role": "user", "content": answer_prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            generated_answer = answer_response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating answer: {e}")
            generated_answer = "Error: Could not generate answer with the provided prompt."
        
        # Check if user is copying
        is_copying = self.is_copying_question(request.prompt, self.assessment_question, self.question_requirements)
        
        # Check if prompt is too short or meaningless
        is_too_short = len(request.prompt.strip().split()) < 5
        is_meaningless = any(word in request.prompt.lower().strip() for word in ['hello', 'hi', 'test', 'abc', '123'])
        
        # Check if prompt has proper AI instruction structure
        has_ai_instructions = any(phrase in request.prompt.lower() for phrase in [
            'please', 'analyze', 'based on', 'i need', 'can you', 'help me',
            'examine', 'look at', 'find', 'identify', 'calculate', 'list',
            'show me', 'tell me', 'determine', 'extract'
        ])
        
        # Check if prompt addresses the actual requirements
        addresses_requirements = any(keyword in request.prompt.lower() for keyword in [
            'department', 'salary', 'employee', 'manager', 'performance', 'rating',
            'experience', 'project', 'hire', 'year'
        ])
        
        # Now evaluate the prompt quality
        evaluation_prompt = f"""
        You are an AI literacy assessment evaluator. Evaluate the following user prompt based on these criteria:
        
        CONTEXT:
        - Data Table: 
        {self.sample_data}
        - Question to Answer: "{self.assessment_question}"
        - User's Prompt: "{request.prompt}"
        
        The correct answer should be:
        {self.correct_answer}
        
        Generated answer from user's prompt:
        {generated_answer}
        
        CRITICAL ANALYSIS:
        - Copying detected: {is_copying}
        - Too short/meaningless: {is_too_short or is_meaningless}
        - Has AI instruction phrases: {has_ai_instructions}
        - Addresses actual requirements: {addresses_requirements}
        
        MANDATORY EVALUATION RULES:
        1. IF COPYING DETECTED: ALL scores must be 0-25% maximum
        2. IF TOO SHORT OR MEANINGLESS (like "hello", "test", "abc"): ALL scores must be 0-15% maximum
        3. IF NO AI INSTRUCTION PHRASES: Maximum 30% on all criteria
        4. IF DOESN'T ADDRESS REQUIREMENTS: Maximum 40% on all criteria
        5. ONLY prompts that are proper AI instructions AND address the requirements can score above 60%
        
        EXAMPLES THAT MUST SCORE 0-15%:
        - "hello"
        - "test"
        - "abc"
        - "hi there"
        - Any single word or meaningless phrase
        
        EXAMPLES OF COPYING (must score 0-25%):
        - "For each department, identify the highest-paid employee and their manager"
        - "Calculate the average salary for employees with performance ratings above 4.0"
        - Any direct copying of the numbered requirements
        - Lists that match the original question structure
        
        EXAMPLES OF POOR PROMPTS (must score 0-40%):
        - "Show me the data"
        - "Give me information"
        - "What is this?"
        - Prompts without specific instructions
        
        EXAMPLES OF DECENT PROMPTS (can score 50-75%):
        - "Please analyze the employee data and show me salary information"
        - "Can you help me understand the employee database?"
        
        EXAMPLES OF GOOD PROMPTS (can score 75-100%):
        - "Please systematically analyze the employee database. Start by examining each department to find who earns the most and identify their reporting manager..."
        - "I need you to perform a comprehensive analysis of this employee data. Begin by processing departmental salary information..."
        - "Based on the employee table, can you help me understand the salary and performance relationships by first looking at..."
        
        EVALUATION CRITERIA (score each out of 100):
        1. Clarity: Is it clear and written as AI instructions (NOT copying)?
        2. Specificity: Does it specify HOW to analyze, not just WHAT to find?
        3. Completeness: Complete instructions without copying requirements?
        4. Relevance: Proper AI prompt structure, not question restatement?
        
        STRICT SCORING RULES:
        - If meaningless/too short: Maximum 15% on all criteria
        - If copying detected: Maximum 25% on all criteria
        - If no AI instruction phrases: Maximum 30% on all criteria
        - If doesn't address requirements: Maximum 40% on all criteria
        - If just listing requirements: Maximum 50% on all criteria
        - Only comprehensive AI prompts addressing all requirements can score above 75%
        
        User Prompt: "{request.prompt}"
        Copying Detected: {is_copying}
        Too Short/Meaningless: {is_too_short or is_meaningless}
        Has AI Instructions: {has_ai_instructions}
        Addresses Requirements: {addresses_requirements}
        
        IMPORTANT: Be extremely strict. Most prompts should score below 50%. Only truly excellent prompts that demonstrate real prompt engineering skills should score above 75%.
        
        Please respond in this exact JSON format:
        {{
            "clarity": <score 0-100>,
            "specificity": <score 0-100>,
            "completeness": <score 0-100>,
            "relevance": <score 0-100>,
            "feedback": "<detailed feedback about the prompt quality and whether it actually answers the question correctly>",
            "answer": "{generated_answer}"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful AI literacy assessment evaluator. Always respond with valid JSON."},
                    {"role": "user", "content": evaluation_prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            response_content = response.choices[0].message.content.strip()
            result = self.extract_json_from_response(response_content)
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error after all attempts: {e}")
            # Fallback evaluation
            result = {
                "clarity": 20,
                "specificity": 20,
                "completeness": 20,
                "relevance": 20,
                "feedback": "Error evaluating prompt due to formatting issues. Please ensure your prompt uses standard characters and try again.",
                "answer": generated_answer
            }
        except Exception as e:
            print(f"Error in evaluation: {e}")
            # Fallback evaluation
            result = {
                "clarity": 20,
                "specificity": 20,
                "completeness": 20,
                "relevance": 20,
                "feedback": f"Error evaluating prompt: {str(e)}",
                "answer": generated_answer
            }
        
        criteria_scores = {
            "clarity": result["clarity"],
            "specificity": result["specificity"], 
            "completeness": result["completeness"],
            "relevance": result["relevance"]
        }
        
        overall_score = sum(criteria_scores.values()) // 4
        is_good_prompt = overall_score >= 75
        
        return EvaluationResponse(
            isGoodPrompt=is_good_prompt,
            score=overall_score,
            criteria=EvaluationCriteria(**criteria_scores),
            feedback=result["feedback"],
            answer=result["answer"]
        )