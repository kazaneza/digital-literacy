import openai
import json
from typing import Dict, Any
from models.assessment import PromptRequest, EvaluationResponse, EvaluationCriteria

class PromptEvaluatorService:
    def __init__(self):
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
        evaluation_prompt = f"""
        You are an AI literacy assessment evaluator. Evaluate the following user prompt based on these criteria:
        
        CONTEXT:
        - Data Table: {self.sample_data}
        - Question to Answer: {self.assessment_question}
        - User's Prompt: "{request.prompt}"
        
        EVALUATION CRITERIA (score each out of 100):
        1. Clarity: Is the prompt clear and easy to understand?
        2. Specificity: Does it specify exactly what data is needed?
        3. Completeness: Does it ask for all necessary information to answer the question?
        4. Relevance: Is the prompt relevant to answering the question about districts and names?
        
        EXPECTED ANSWER:
        {self.correct_answer}
        
        Please respond in this exact JSON format:
        {{
            "clarity": <score 0-100>,
            "specificity": <score 0-100>,
            "completeness": <score 0-100>,
            "relevance": <score 0-100>,
            "feedback": "<detailed feedback about the prompt quality>",
            "answer": "<the answer that would be generated from this prompt, or 'Please refine your prompt' if inadequate>"
        }}
        """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI literacy assessment evaluator. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        result = json.loads(response.choices[0].message.content)
        
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