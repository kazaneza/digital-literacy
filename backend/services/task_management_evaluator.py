import openai
import json
import os
from dotenv import load_dotenv
from typing import List
from models.assessment import TaskManagementRequest, TaskManagementEvaluationResponse, TaskManagementCriteria

# Load environment variables
load_dotenv()

class TaskManagementEvaluatorService:
    def __init__(self):
        # Initialize OpenAI client properly with error handling
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = openai.OpenAI(api_key=api_key)
        
        self.scenarios = {
            "team_workflow": {
            "title": "AI-Enhanced Team Workflow Management",
            "description": "Organize a multi-person team project with multiple deadlines using AI tools",
            "scenario": """You are leading a 3-person team on a project with 5 deadlines over 2 weeks. Tasks include writing, reviewing, and submitting reports. How would you organize the workflow to make sure nothing is missed?

Team Members:
- You (Team Lead)
- Sarah (Writer/Researcher) 
- Mike (Reviewer/Editor)

5 Deadlines:
1. Initial research report (Day 3)
2. Draft analysis document (Day 6) 
3. Peer review completion (Day 9)
4. Final report revision (Day 12)
5. Final submission with presentation (Day 14)

Each deadline involves multiple sub-tasks that need coordination between team members.""",
            "requirements": [
                "Create a detailed workflow plan with task assignments",
                "Show how AI tools will help with project coordination",
                "Demonstrate task prioritization and dependency management",
                "Include communication and progress tracking strategies",
                "Show how to prevent missed deadlines and bottlenecks",
                "Explain AI-assisted quality control and review processes"
            ],
            "prompt": "You are leading a 3-person team on a project with 5 deadlines over 2 weeks. Tasks include writing, reviewing, and submitting reports. How would you organize the workflow to make sure nothing is missed?"
        }
        }

    def get_scenario(self, scenario_type: str) -> dict:
        return self.scenarios.get(scenario_type, self.scenarios["team_workflow"])

    async def evaluate_task_management(self, request: TaskManagementRequest) -> TaskManagementEvaluationResponse:
        scenario_info = self.get_scenario(request.scenario_type)
        
        evaluation_prompt = f"""
        You are evaluating a task management and workflow efficiency assessment for AI literacy.
        
        SCENARIO: {scenario_info['title']}
        DESCRIPTION: {scenario_info['description']}
        CONTEXT: {scenario_info['scenario']}
        QUESTION: {scenario_info['prompt']}
        
        REQUIREMENTS:
        {chr(10).join(f"- {req}" for req in scenario_info['requirements'])}
        
        USER'S RESPONSE:
        {request.user_response}
        
        EVALUATION CRITERIA (score each out of 100):
        1. Organization: How well-structured and logical is the approach to task/project management?
        2. Prioritization: Does the response show effective prioritization and decision-making skills?
        3. AI Integration: How effectively are AI tools integrated into the workflow/management process?
        4. Efficiency: Does the solution demonstrate clear efficiency improvements and time savings?
        
        SPECIAL FOCUS FOR AI EVALUATION:
        - Rate how well the user demonstrates understanding of AI tools for task management
        - Evaluate specific AI tool mentions and their appropriate usage
        - Assess the level of AI integration in workflow processes
        - Consider automation potential and smart scheduling approaches
        
        GRADING LEVELS:
        - Explorer (0-50%): Basic understanding, minimal AI integration
        - Practitioner (51-75%): Good AI tool usage, practical applications
        - Innovator (76-100%): Advanced AI integration, innovative workflow solutions
        
        Please respond in this exact JSON format:
        {{
            "organization": <score 0-100>,
            "prioritization": <score 0-100>,
            "ai_integration": <score 0-100>,
            "efficiency": <score 0-100>,
            "feedback": "<detailed feedback about the task management approach and AI usage>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
            "efficiency_rating": "<Excellent/Good/Fair/Needs Improvement>",
            "grade_justification": "<explanation of the overall grade>"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a productivity and workflow optimization expert evaluating task management skills with AI integration. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1200
        )
        
        result = json.loads(response.choices[0].message.content)
        
        criteria_scores = {
            "organization": result["organization"],
            "prioritization": result["prioritization"],
            "ai_integration": result["ai_integration"],
            "efficiency": result["efficiency"]
        }
        
        overall_score = sum(criteria_scores.values()) // 4
        is_good_approach = overall_score >= 75
        
        # Determine letter grade
        if overall_score >= 90:
            grade = "A"
        elif overall_score >= 80:
            grade = "B"
        elif overall_score >= 70:
            grade = "C"
        elif overall_score >= 60:
            grade = "D"
        else:
            grade = "F"
        
        return TaskManagementEvaluationResponse(
            isGoodApproach=is_good_approach,
            score=overall_score,
            criteria=TaskManagementCriteria(**criteria_scores),
            feedback=result["feedback"],
            suggestions=result["suggestions"],
            grade=grade,
            efficiency_rating=result["efficiency_rating"]
        )