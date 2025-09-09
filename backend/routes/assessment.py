from fastapi import APIRouter, HTTPException
from models.assessment import (
    PromptRequest, 
    WritingRequest,
    TaskManagementRequest,
    DataAnalysisRequest,
    EvaluationResponse, 
    WritingEvaluationResponse,
    TaskManagementEvaluationResponse,
    DataAnalysisEvaluationResponse,
    AssessmentType
)
from services.prompt_evaluator import PromptEvaluatorService
from services.writing_evaluator import WritingEvaluatorService
from services.task_management_evaluator import TaskManagementEvaluatorService
from services.data_analysis_evaluator import DataAnalysisEvaluatorService
import json

router = APIRouter(prefix="/assessment", tags=["assessment"])

# Initialize services
prompt_service = PromptEvaluatorService()
writing_service = WritingEvaluatorService()
task_management_service = TaskManagementEvaluatorService()
data_analysis_service = DataAnalysisEvaluatorService()

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

@router.post("/evaluate-task-management", response_model=TaskManagementEvaluationResponse)
async def evaluate_task_management(request: TaskManagementRequest):
    try:
        return await task_management_service.evaluate_task_management(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating task management: {str(e)}")

@router.post("/evaluate-data-analysis", response_model=DataAnalysisEvaluationResponse)
async def evaluate_data_analysis(request: DataAnalysisRequest):
    try:
        return await data_analysis_service.evaluate_data_analysis(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating data analysis: {str(e)}")

@router.get("/writing-tasks")
async def get_writing_tasks():
    """Get available writing task types and their details"""
    return {
        "tasks": writing_service.writing_tasks
    }

@router.get("/task-management-scenarios")
async def get_task_management_scenarios():
    """Get available task management scenario types and their details"""
    return {
        "scenarios": task_management_service.scenarios
    }

@router.get("/task-management-scenario/{scenario_type}")
async def get_task_management_scenario(scenario_type: str):
    """Get specific task management scenario details"""
    scenario = task_management_service.get_scenario(scenario_type)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario type not found")
    return scenario

@router.get("/data-analysis-scenarios")
async def get_data_analysis_scenarios():
    """Get available data analysis scenario types and their details"""
    return {
        "scenarios": data_analysis_service.analysis_scenarios
    }

@router.get("/data-analysis-scenario/{analysis_type}")
async def get_data_analysis_scenario(analysis_type: str):
    """Get specific data analysis scenario details"""
    scenario = data_analysis_service.get_analysis_scenario(analysis_type)
    if not scenario:
        raise HTTPException(status_code=404, detail="Analysis type not found")
    return scenario

@router.get("/writing-task/{task_type}")
async def get_writing_task(task_type: str):
    """Get specific writing task details"""
    task = writing_service.get_writing_task(task_type)
    if not task:
        raise HTTPException(status_code=404, detail="Task type not found")
    return task