import openai
import json
from typing import List
from models.assessment import TaskManagementRequest, TaskManagementEvaluationResponse, TaskManagementCriteria

class TaskManagementEvaluatorService:
    def __init__(self):
        self.scenarios = {
            "project_planning": {
                "title": "AI-Assisted Project Planning",
                "description": "Create a comprehensive project plan using AI tools for a digital transformation initiative",
                "scenario": """You are leading a 6-month digital transformation project for Bank of Kigali's customer service department. The project involves:
- Implementing a new CRM system
- Training 50+ staff members
- Migrating customer data
- Integrating with existing banking systems
- Budget: $200,000
- Deadline: 6 months
- Team: 8 people (2 developers, 2 analysts, 2 trainers, 1 project coordinator, 1 QA specialist)""",
                "requirements": [
                    "Break down the project into phases and milestones",
                    "Identify potential risks and mitigation strategies",
                    "Create a resource allocation plan",
                    "Establish timeline with dependencies",
                    "Define success metrics and KPIs",
                    "Show how AI tools were used in planning process"
                ],
                "prompt": "How would you use AI tools to create and manage this project plan? Describe your approach, the AI tools you'd use, and provide a sample project structure."
            },
            "priority_matrix": {
                "title": "AI-Enhanced Priority Management",
                "description": "Use AI to create and manage task priorities using established frameworks",
                "scenario": """As a department manager at Bank of Kigali, you have these competing priorities this week:
1. Prepare quarterly performance report (due Friday)
2. Interview 3 candidates for analyst position (scheduled this week)
3. Resolve customer complaint escalation (urgent, affects VIP client)
4. Review and approve 15 loan applications (routine, but time-sensitive)
5. Attend 4 hours of mandatory compliance training (deadline next week)
6. Plan team building event for next month
7. Update department procedures manual (overdue by 2 weeks)
8. Prepare presentation for board meeting (next Monday)""",
                "requirements": [
                    "Use a priority framework (Eisenhower Matrix, MoSCoW, etc.)",
                    "Justify your prioritization decisions",
                    "Show time allocation for each task",
                    "Identify tasks that can be delegated or automated",
                    "Demonstrate AI tool usage for priority management",
                    "Create a daily schedule for the week"
                ],
                "prompt": "How would you use AI tools to prioritize and schedule these tasks? Show your priority matrix and explain your AI-assisted decision-making process."
            },
            "workflow_optimization": {
                "title": "AI-Driven Workflow Optimization",
                "description": "Optimize a repetitive business process using AI tools and automation",
                "scenario": """Your team processes 200+ loan applications monthly with this current workflow:
1. Receive application via email/portal (5 min per application)
2. Verify customer information in 3 different systems (15 min)
3. Calculate risk score manually using spreadsheet (10 min)
4. Generate initial assessment report (20 min)
5. Route to appropriate loan officer based on amount/type (5 min)
6. Send acknowledgment email to customer (5 min)
7. Update tracking spreadsheet (5 min)
Total: 65 minutes per application = 216 hours monthly""",
                "requirements": [
                    "Identify bottlenecks and inefficiencies",
                    "Propose AI-powered automation solutions",
                    "Estimate time savings and ROI",
                    "Address potential risks of automation",
                    "Create implementation timeline",
                    "Show specific AI tools and their applications"
                ],
                "prompt": "How would you use AI tools to optimize this loan application workflow? Provide a detailed optimization plan with specific AI solutions and expected improvements."
            }
        }

    def get_scenario(self, scenario_type: str) -> dict:
        return self.scenarios.get(scenario_type, self.scenarios["project_planning"])

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
        
        response = openai.chat.completions.create(
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