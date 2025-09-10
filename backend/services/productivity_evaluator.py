import openai
import json
import os
from typing import List
from models.assessment import ProductivityRequest, ProductivityEvaluationResponse, ProductivityCriteria

class ProductivityEvaluatorService:
    def __init__(self):
        # Initialize OpenAI client properly
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        self.automation_scenarios = {
            "email_automation": {
                "title": "AI-Powered Email Management & Automation",
                "description": "Implement intelligent email automation and management systems using AI",
                "current_process": """Current email workflow at Bank of Kigali:
- 200+ customer service emails daily
- Manual sorting and categorization (30 min/day)
- Template responses for common queries (45 min/day)
- Follow-up tracking in spreadsheets (20 min/day)
- Escalation decisions made manually (15 min/day)
- Response time: Average 4-6 hours
- Staff time: 110 minutes daily per agent (8 agents = 880 min total)""",
                "scenario": """The customer service team wants to reduce email processing time by 60% while improving response quality and consistency. They handle inquiries about account balances, transaction disputes, loan applications, and general banking questions. The goal is to maintain personalization while achieving efficiency gains.""",
                "requirements": [
                    "Automated email categorization and prioritization",
                    "AI-generated response suggestions and templates",
                    "Smart escalation rules and routing",
                    "Automated follow-up scheduling and tracking",
                    "Performance analytics and reporting",
                    "Integration with existing CRM and banking systems"
                ],
                "prompt": "How would you design an AI-powered email automation system for this scenario? Describe your approach to email processing, response generation, workflow automation, and the specific AI tools you would implement."
            },
            "report_generation": {
                "title": "Automated Report Generation with AI",
                "description": "Create intelligent reporting systems that generate insights automatically",
                "current_process": """Current monthly reporting process:
- Data collection from 5 different systems (4 hours)
- Manual data cleaning and validation (3 hours)
- Excel analysis and calculations (6 hours)
- Chart and graph creation (2 hours)
- Report writing and formatting (4 hours)
- Review and approval process (2 hours)
- Distribution to 25 stakeholders (1 hour)
Total time: 22 hours monthly per report (5 reports = 110 hours)""",
                "scenario": """The finance department needs to automate their monthly reporting process for branch performance, loan portfolio analysis, customer acquisition metrics, risk assessments, and regulatory compliance. Reports must maintain accuracy while reducing preparation time by 70%.""",
                "requirements": [
                    "Automated data collection and integration",
                    "AI-powered data analysis and insight generation",
                    "Dynamic visualization and chart creation",
                    "Automated report writing and formatting",
                    "Smart distribution and stakeholder notifications",
                    "Version control and audit trail maintenance"
                ],
                "prompt": "How would you implement AI-driven automated report generation for this scenario? Detail your approach to data integration, analysis automation, visualization creation, and the AI tools you would use for intelligent reporting."
            },
            "meeting_scheduling": {
                "title": "AI-Enhanced Meeting & Calendar Management",
                "description": "Optimize scheduling and meeting management using intelligent automation",
                "current_process": """Current meeting coordination process:
- 50+ meetings weekly across departments
- Manual calendar checking for availability (15 min per meeting)
- Email back-and-forth for scheduling (20 min per meeting)
- Meeting room booking and resource allocation (10 min per meeting)
- Agenda preparation and distribution (25 min per meeting)
- Follow-up and rescheduling when conflicts arise (30 min per meeting)
Total time: 100 minutes per meeting × 50 meetings = 5,000 minutes weekly""",
                "scenario": """The operations team wants to streamline meeting coordination across all departments, reduce scheduling conflicts by 80%, and improve meeting productivity. They need to coordinate between internal staff, external clients, and management while optimizing room utilization and resource allocation.""",
                "requirements": [
                    "Intelligent calendar analysis and conflict detection",
                    "Automated meeting scheduling with multiple participants",
                    "Smart room and resource allocation",
                    "AI-generated agenda suggestions and preparation",
                    "Automated reminders and follow-up actions",
                    "Meeting analytics and productivity insights"
                ],
                "prompt": "How would you create an AI-powered meeting and calendar management system? Describe your approach to intelligent scheduling, conflict resolution, resource optimization, and the AI tools you would implement for enhanced productivity."
            },
            "document_processing": {
                "title": "AI-Driven Document Processing & Management",
                "description": "Automate document workflows using AI for processing and organization",
                "current_process": """Current document processing workflow:
- 500+ loan applications monthly
- Manual document review and verification (20 min per application)
- Data extraction and entry into systems (15 min per application)
- Compliance checking and validation (10 min per application)
- Document classification and filing (5 min per application)
- Status updates and communication (10 min per application)
Total time: 60 minutes per application × 500 applications = 500 hours monthly""",
                "scenario": """The loan processing department needs to automate document handling to reduce processing time by 75% while maintaining accuracy and compliance. Documents include ID verification, income statements, collateral documentation, and legal agreements in multiple formats (PDF, images, handwritten forms).""",
                "requirements": [
                    "Automated document classification and sorting",
                    "AI-powered data extraction and validation",
                    "Intelligent compliance checking and flagging",
                    "Automated workflow routing and approvals",
                    "Digital filing and retrieval systems",
                    "Real-time processing status and notifications"
                ],
                "prompt": "How would you implement AI-driven document processing automation for this scenario? Detail your approach to document analysis, data extraction, workflow automation, and the specific AI technologies you would deploy."
            }
        }

    def get_automation_scenario(self, automation_type: str) -> dict:
        return self.automation_scenarios.get(automation_type, self.automation_scenarios["email_automation"])

    async def evaluate_productivity(self, request: ProductivityRequest) -> ProductivityEvaluationResponse:
        scenario_info = self.get_automation_scenario(request.automation_type)
        
        evaluation_prompt = f"""
        You are evaluating a workflow automation and productivity enhancement assessment for AI literacy.
        
        SCENARIO: {scenario_info['title']}
        DESCRIPTION: {scenario_info['description']}
        CURRENT PROCESS: {scenario_info['current_process']}
        BUSINESS CONTEXT: {scenario_info['scenario']}
        QUESTION: {scenario_info['prompt']}
        
        REQUIREMENTS:
        {chr(10).join(f"- {req}" for req in scenario_info['requirements'])}
        
        USER'S WORKFLOW DESCRIPTION:
        {request.workflow_description}
        
        EVALUATION CRITERIA (score each out of 100):
        1. Process Analysis: How well does the user understand the current process and identify improvement opportunities?
        2. Automation Strategy: Is the automation approach comprehensive and well-planned?
        3. AI Tool Selection: How appropriate and effective are the chosen AI tools and technologies?
        4. Efficiency Improvement: Does the solution demonstrate significant productivity gains?
        5. Implementation Feasibility: How realistic and practical is the proposed implementation?
        
        Please respond in this exact JSON format:
        {{
            "process_analysis": <score 0-100>,
            "automation_strategy": <score 0-100>,
            "ai_tool_selection": <score 0-100>,
            "efficiency_improvement": <score 0-100>,
            "implementation_feasibility": <score 0-100>,
            "feedback": "<detailed feedback about the automation approach and AI usage>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
            "efficiency_gain": "<High/Medium/Low/Minimal>",
            "recommended_tools": ["<tool 1>", "<tool 2>", "<tool 3>"],
            "implementation_timeline": "<estimated timeline for implementation>",
            "grade_justification": "<explanation of the overall grade>"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a workflow automation and productivity expert evaluating AI-driven process improvement solutions. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        
        criteria_scores = {
            "process_analysis": result["process_analysis"],
            "automation_strategy": result["automation_strategy"],
            "ai_tool_selection": result["ai_tool_selection"],
            "efficiency_improvement": result["efficiency_improvement"],
            "implementation_feasibility": result["implementation_feasibility"]
        }
        
        overall_score = sum(criteria_scores.values()) // 5
        is_good_automation = overall_score >= 75
        
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
        
        return ProductivityEvaluationResponse(
            isGoodAutomation=is_good_automation,
            score=overall_score,
            criteria=ProductivityCriteria(**criteria_scores),
            feedback=result["feedback"],
            suggestions=result["suggestions"],
            grade=grade,
            efficiency_gain=result["efficiency_gain"],
            recommended_tools=result["recommended_tools"],
            implementation_timeline=result["implementation_timeline"]
        )