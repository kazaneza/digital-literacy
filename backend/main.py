from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Literacy Assessment API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class PromptRequest(BaseModel):
    prompt: str
    context_data: str

class EvaluationCriteria(BaseModel):
    clarity: int
    specificity: int
    completeness: int
    relevance: int

class EvaluationResponse(BaseModel):
    isGoodPrompt: bool
    score: int
    criteria: EvaluationCriteria
    feedback: str
    answer: str

# Sample data for the assessment
SAMPLE_DATA = """
ID | First Name | Last Name | District | Occupation
1  | Jean Bosco | Nkurunziza | Gasabo | Teacher
2  | Aline | Uwase | Kicukiro | Nurse
3  | Eric | Habimana | Gasabo | Software Dev
4  | Diane | Ingabire | Rubavu | Nurse
5  | Patrick | Mugisha | Kicukiro | (empty)
"""

ASSESSMENT_QUESTION = "Under each district, list the full names of the people who live there?"

CORRECT_ANSWER = """Based on the data table:

**Gasabo District:**
- Jean Bosco Nkurunziza
- Eric Habimana

**Kicukiro District:**
- Aline Uwase
- Patrick Mugisha

**Rubavu District:**
- Diane Ingabire"""

@app.get("/")
async def root():
    return {"message": "AI Literacy Assessment API is running"}

@app.post("/evaluate-prompt", response_model=EvaluationResponse)
async def evaluate_prompt(request: PromptRequest):
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Create the evaluation prompt for OpenAI
        evaluation_prompt = f"""
        You are an AI literacy assessment evaluator. Evaluate the following user prompt based on these criteria:
        
        CONTEXT:
        - Data Table: {SAMPLE_DATA}
        - Question to Answer: {ASSESSMENT_QUESTION}
        - User's Prompt: "{request.prompt}"
        
        EVALUATION CRITERIA (score each out of 100):
        1. Clarity: Is the prompt clear and easy to understand?
        2. Specificity: Does it specify exactly what data is needed?
        3. Completeness: Does it ask for all necessary information to answer the question?
        4. Relevance: Is the prompt relevant to answering the question about districts and names?
        
        EXPECTED ANSWER:
        {CORRECT_ANSWER}
        
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
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI literacy assessment evaluator. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        # Parse the response
        import json
        result = json.loads(response.choices[0].message.content)
        
        # Calculate overall score
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
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse OpenAI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating prompt: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "openai_configured": bool(openai.api_key)}