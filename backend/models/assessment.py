from pydantic import BaseModel
from typing import Dict, List, Optional
from enum import Enum

class AssessmentType(str, Enum):
    PROMPT_ENGINEERING = "prompt_engineering"
    WRITING_AUTOMATION = "writing_automation"
    TASK_MANAGEMENT = "task_management"

class PromptRequest(BaseModel):
    prompt: str
    context_data: str

class WritingRequest(BaseModel):
    task_type: str  # email, report, proposal, etc.
    content: str
    requirements: List[str]

class TaskManagementRequest(BaseModel):
    scenario_type: str  # project_planning, priority_matrix, workflow_optimization, etc.
    user_response: str
    scenario_data: str
class EvaluationCriteria(BaseModel):
    clarity: int
    specificity: int
    completeness: int
    relevance: int

class WritingCriteria(BaseModel):
    structure: int
    professionalism: int
    ai_utilization: int
    completeness: int

class TaskManagementCriteria(BaseModel):
    organization: int
    prioritization: int
    ai_integration: int
    efficiency: int
class EvaluationResponse(BaseModel):
    isGoodPrompt: bool
    score: int
    criteria: EvaluationCriteria
    feedback: str
    answer: str

class WritingEvaluationResponse(BaseModel):
    isGoodWork: bool
    score: int
    criteria: WritingCriteria
    feedback: str
    suggestions: List[str]
    grade: str  # A, B, C, D, F

class TaskManagementEvaluationResponse(BaseModel):
    isGoodApproach: bool
    score: int
    criteria: TaskManagementCriteria
    feedback: str
    suggestions: List[str]
    grade: str  # A, B, C, D, F
    efficiency_rating: str  # Excellent, Good, Fair, Needs Improvement
class AssessmentQuestion(BaseModel):
    id: str
    type: AssessmentType
    title: str
    description: str
    instructions: str
    sample_data: Optional[str] = None
    requirements: List[str]