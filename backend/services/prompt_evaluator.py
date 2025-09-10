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
ID | First Name | Last Name | District | Occupation
1  | Jean Bosco | Nkurunziza | Gasabo | Teacher
2  | Aline | Uwase | Kicukiro | Nurse
3  | Eric | Habimana | Gasabo | Software Dev
4  | Diane | Ingabire | Rubavu | Nurse
5  | Patrick | Mugisha | Kicukiro | (empty)
"""
        
        self.assessment_question = "Under each district, list the full names of the people who live there?"
        
        self.correct_answer = """Based on the data table:

**Gasabo District:**
- Jean Bosco Nkurunziza
- Eric Habimana

**Kicukiro District:**
- Aline Uwase
- Patrick Mugisha

**Rubavu District:**
- Diane Ingabire"""

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
        
        Consider both the quality of the prompt AND how well the generated answer matches the expected answer.
        
        Please respond in this exact JSON format:
        {{
            "clarity": <score 0-100>,
            "specificity": <score 0-100>,
            "completeness": <score 0-100>,
            "relevance": <score 0-100>,
            "feedback": "<detailed feedback about the prompt quality>",
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