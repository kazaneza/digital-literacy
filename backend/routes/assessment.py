from fastapi import APIRouter, HTTPException
from models.assessment import (
    PromptRequest, 
    WritingRequest,
    TaskManagementRequest,
    DataAnalysisRequest,
    PresentationRequest,
    ProductivityRequest,
    EvaluationResponse, 
    WritingEvaluationResponse,
    TaskManagementEvaluationResponse,
    DataAnalysisEvaluationResponse,
    PresentationEvaluationResponse,
    ProductivityEvaluationResponse,
    AssessmentType
)
from services.prompt_evaluator import PromptEvaluatorService
from services.writing_evaluator import WritingEvaluatorService
from services.task_management_evaluator import TaskManagementEvaluatorService
from services.data_analysis_evaluator import DataAnalysisEvaluatorService
from services.presentation_evaluator import PresentationEvaluatorService
from services.productivity_evaluator import ProductivityEvaluatorService
import json

router = APIRouter(prefix="/assessment", tags=["assessment"])

# Initialize services
prompt_service = PromptEvaluatorService()
writing_service = WritingEvaluatorService()
task_management_service = TaskManagementEvaluatorService()
data_analysis_service = DataAnalysisEvaluatorService()
presentation_service = PresentationEvaluatorService()
productivity_service = ProductivityEvaluatorService()

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

@router.post("/evaluate-presentation", response_model=PresentationEvaluationResponse)
async def evaluate_presentation(request: PresentationRequest):
    try:
        return await presentation_service.evaluate_presentation(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating presentation: {str(e)}")

@router.post("/evaluate-productivity", response_model=ProductivityEvaluationResponse)
async def evaluate_productivity(request: ProductivityRequest):
    try:
        return await productivity_service.evaluate_productivity(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating productivity: {str(e)}")
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

@router.get("/presentation-scenarios")
async def get_presentation_scenarios():
    """Get available presentation scenario types and their details"""
    return {
        "scenarios": presentation_service.presentation_scenarios
    }

@router.get("/presentation-scenario/{presentation_type}")
async def get_presentation_scenario(presentation_type: str):
    """Get specific presentation scenario details"""
    scenario = presentation_service.get_presentation_scenario(presentation_type)
    if not scenario:
        raise HTTPException(status_code=404, detail="Presentation type not found")
    return scenario

@router.get("/productivity-scenarios")
async def get_productivity_scenarios():
    """Get available productivity automation scenario types and their details"""
    return {
        "scenarios": productivity_service.automation_scenarios
    }

@router.get("/productivity-scenario/{automation_type}")
async def get_productivity_scenario(automation_type: str):
    """Get specific productivity automation scenario details"""
    scenario = productivity_service.get_automation_scenario(automation_type)
    if not scenario:
        raise HTTPException(status_code=404, detail="Automation type not found")
    return scenario
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