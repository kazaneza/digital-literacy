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
            "title": "Team Workflow Management",
            "description": "Organize a team project with multiple deadlines",
            "scenario": "You are leading a 3-person team on a project with 5 deadlines over 2 weeks. Tasks include writing, reviewing, and submitting reports. How would you organize the workflow to make sure nothing is missed?",
            "requirements": [],
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
        
        USER'S RESPONSE:
        {request.user_response}
        
        EVALUATION FRAMEWORK:
        Analyze the user's response to determine their AI literacy level based on the tools and approaches they mention:
        
        EXPLORER LEVEL (0-50%): Basic/manual approaches ONLY
        - Examples: "I'd just email or WhatsApp reminders", basic spreadsheets, manual tracking
        - Shows minimal or NO awareness of AI/digital tools for project management
        - Manual processes, basic communication tools
        - No mention of project management software or AI assistance
        
        PRACTITIONER LEVEL (51-75%): Some digital/AI tools mentioned
        - Examples: "I'd use Teams/Planner to assign tasks, set deadlines", Trello, basic project management tools
        - Must mention specific tools like Teams, Planner, Trello
        - Shows some understanding of digital project management
        
        INNOVATOR LEVEL (76-100%): Advanced AI integration and automation ONLY
        - Examples: "I'd set up Planner/Asana with task dependencies, automate reminders with Copilot/Power Automate, track progress dashboards"
        - Must mention automation, AI tools like Copilot/Power Automate
        - Shows sophisticated understanding of AI-powered workflow automation
        
        STRICT SCORING RULES:
        - If meaningless/single word responses (like "okay", "yes", "good"): Maximum 5% on all criteria
        - If NO digital tools mentioned: Maximum 25% on all criteria
        - If only basic communication (email/WhatsApp): Maximum 30% on all criteria
        - If mentions project tools but no AI: Maximum 50% on all criteria
        - If mentions AI tools like Copilot/Power Automate: Can score 70-85%
        - If mentions full automation + AI + dashboards: Can score 85-100%
        - Random or very short responses: Maximum 10% on all criteria
        
        CRITICAL: Check response length and meaningfulness:
        - Responses under 10 characters or single words: Maximum 5%
        - Responses like "okay", "yes", "good", "fine": Maximum 5%
        - Responses under 50 characters with no substance: Maximum 15%
        
        EVALUATION CRITERIA (score each out of 100):
        1. Organization: How well-structured and logical is the approach to task/project management?
        2. Prioritization: Does the response show effective prioritization and decision-making skills?
        3. AI Integration: How effectively are AI tools integrated into the workflow/management process?
        4. Efficiency: Does the solution demonstrate clear efficiency improvements and time savings?
        
        
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