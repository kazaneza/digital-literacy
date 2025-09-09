from fastapi import APIRouter, HTTPException
from ..models.assessment import (
    PromptRequest, 
    WritingRequest,
    EvaluationResponse, 
    WritingEvaluationResponse,
    AssessmentType
)
from ..services.prompt_evaluator import PromptEvaluatorService
from ..services.writing_evaluator import WritingEvaluatorService
import json

router = APIRouter(prefix="/assessment", tags=["assessment"])

# Initialize services
prompt_service = PromptEvaluatorService()
writing_service = WritingEvaluatorService()

@router.post("/evaluate-prompt", response_model=EvaluationResponse)
async def evaluate_prompt(request: PromptRequest):
    try:
        return await prompt_service.evaluate_prompt(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating prompt: {str(e)}")

@router.post("/evaluate-writing", response_model=WritingEvaluationResponse)
async def evaluate_writing(request: WritingRequest):
    try:
        return await writing_service.evaluate_writing(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating writing: {str(e)}")

@router.get("/writing-tasks")
async def get_writing_tasks():
    """Get available writing task types and their details"""
    return {
        "tasks": writing_service.writing_tasks
    }

@router.get("/writing-task/{task_type}")
async def get_writing_task(task_type: str):
    """Get specific writing task details"""
    task = writing_service.get_writing_task(task_type)
    if not task:
        raise HTTPException(status_code=404, detail="Task type not found")
    return task