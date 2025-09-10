import openai
import json
import os
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
        
        EVALUATION CRITERIA (score each out of 100):
        1. Clarity: Is the prompt clear and easy to understand?
        2. Specificity: Does it specify exactly what data is needed?
        3. Completeness: Does it ask for all necessary information to answer the question?
        4. Relevance: Is the prompt relevant to answering the question about districts and names?
        
        CRITICAL: The user's prompt must generate an answer that matches the expected format. 
        The question asks for "full names of people under each district" - the answer must include:
        - District names as headers/categories
        - Full names (first + last name) of people listed under each district
        - All people from the data table properly categorized
        
        If the generated answer does NOT include the full names of people organized by district, 
        the scores should be significantly lower (especially completeness and relevance).
        
        Compare the generated answer with the expected answer:
        Expected: Lists districts with full names of people under each
        Generated: {generated_answer}
        
        Score harshly if the generated answer doesn't serve the actual purpose of the question.
        
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
            
            result = json.loads(response.choices[0].message.content)
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            # Fallback evaluation
            result = {
                "clarity": 50,
                "specificity": 50,
                "completeness": 50,
                "relevance": 50,
                "feedback": "Error evaluating prompt. Please try again.",
                "answer": generated_answer
            }
        except Exception as e:
            print(f"Error in evaluation: {e}")
            # Fallback evaluation
            result = {
                "clarity": 50,
                "specificity": 50,
                "completeness": 50,
                "relevance": 50,
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