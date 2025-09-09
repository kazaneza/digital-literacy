from pydantic import BaseModel
from typing import Dict, List, Optional
from enum import Enum

class AssessmentType(str, Enum):
    PROMPT_ENGINEERING = "prompt_engineering"
    WRITING_AUTOMATION = "writing_automation"
    TASK_MANAGEMENT = "task_management"
    DATA_ANALYSIS = "data_analysis"
    AI_PRESENTATIONS = "ai_presentations"
    WORKFLOW_AUTOMATION = "workflow_automation"

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

class DataAnalysisRequest(BaseModel):
    analysis_type: str  # sales_analysis, customer_insights, financial_reporting, etc.
    user_approach: str
    dataset_context: str
    visualization_requirements: List[str]

class PresentationRequest(BaseModel):
    presentation_type: str  # executive_briefing, training_session, project_proposal, etc.
    content_approach: str
    audience_context: str
    presentation_requirements: List[str]

class ProductivityRequest(BaseModel):
    automation_type: str  # email_automation, report_generation, meeting_scheduling, etc.
    workflow_description: str
    current_process: str
    automation_goals: List[str]
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

class DataAnalysisCriteria(BaseModel):
    data_understanding: int
    analytical_approach: int
    ai_tool_usage: int
    visualization_quality: int
    insights_generation: int

class PresentationCriteria(BaseModel):
    content_structure: int
    visual_design: int
    ai_integration: int
    audience_engagement: int
    storytelling: int

class ProductivityCriteria(BaseModel):
    process_analysis: int
    automation_strategy: int
    ai_tool_selection: int
    efficiency_improvement: int
    implementation_feasibility: int
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

class DataAnalysisEvaluationResponse(BaseModel):
    isGoodAnalysis: bool
    score: int
    criteria: DataAnalysisCriteria
    feedback: str
    suggestions: List[str]
    grade: str  # A, B, C, D, F
    insight_quality: str  # Excellent, Good, Fair, Needs Improvement
    recommended_tools: List[str]

class PresentationEvaluationResponse(BaseModel):
    isGoodPresentation: bool
    score: int
    criteria: PresentationCriteria
    feedback: str
    suggestions: List[str]
    grade: str  # A, B, C, D, F
    engagement_level: str  # Excellent, Good, Fair, Needs Improvement
    recommended_tools: List[str]

class ProductivityEvaluationResponse(BaseModel):
    isGoodAutomation: bool
    score: int
    criteria: ProductivityCriteria
    feedback: str
    suggestions: List[str]
    grade: str  # A, B, C, D, F
    efficiency_gain: str  # High, Medium, Low, Minimal
    recommended_tools: List[str]
    implementation_timeline: str
class AssessmentQuestion(BaseModel):
    id: str
    type: AssessmentType
    title: str
    description: str
    instructions: str
    sample_data: Optional[str] = None
    requirements: List[str]