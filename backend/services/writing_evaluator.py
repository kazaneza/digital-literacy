import openai
import json
from typing import List
from models.assessment import WritingRequest, WritingEvaluationResponse, WritingCriteria

class WritingEvaluatorService:
    def __init__(self):
        self.writing_tasks = {
            "business_email": {
                "title": "Professional Business Email",
                "description": "Write a professional email to a client about a project delay",
                "requirements": [
                    "Professional tone and language",
                    "Clear explanation of the delay",
                    "Proposed solution or timeline",
                    "Appropriate email structure (subject, greeting, body, closing)",
                    "Demonstrates effective AI assistance usage"
                ],
                "scenario": "You need to inform your client that their website development project will be delayed by 2 weeks due to unexpected technical challenges with the payment integration system."
            },
            "project_report": {
                "title": "Project Status Report",
                "description": "Create a comprehensive project status report",
                "requirements": [
                    "Executive summary",
                    "Current progress overview",
                    "Key achievements and milestones",
                    "Challenges and risks",
                    "Next steps and timeline",
                    "Professional formatting and structure"
                ],
                "scenario": "Prepare a monthly status report for the Digital Banking Platform project that is 60% complete, has faced some API integration challenges, but is still on track for the December launch."
            },
            "proposal": {
                "title": "Business Proposal",
                "description": "Draft a business proposal for a new service offering",
                "requirements": [
                    "Clear problem statement",
                    "Proposed solution overview",
                    "Benefits and value proposition",
                    "Implementation timeline",
                    "Budget considerations",
                    "Professional presentation"
                ],
                "scenario": "Create a proposal for implementing an AI-powered customer service chatbot for Bank of Kigali that could handle 70% of routine customer inquiries and reduce wait times."
            }
        }

    def get_writing_task(self, task_type: str) -> dict:
        return self.writing_tasks.get(task_type, self.writing_tasks["business_email"])

    async def evaluate_writing(self, request: WritingRequest) -> WritingEvaluationResponse:
        task_info = self.get_writing_task(request.task_type)
        
        evaluation_prompt = f"""
        You are evaluating a writing assignment for AI literacy assessment. 
        
        TASK: {task_info['title']}
        DESCRIPTION: {task_info['description']}
        SCENARIO: {task_info['scenario']}
        
        REQUIREMENTS:
        {chr(10).join(f"- {req}" for req in task_info['requirements'])}
        
        USER'S SUBMISSION:
        {request.content}
        
        EVALUATION CRITERIA (score each out of 100):
        1. Structure: Is the document well-organized with clear sections and flow?
        2. Professionalism: Does it maintain appropriate tone and language for business context?
        3. AI Utilization: Does it show effective use of AI tools for enhancement (grammar, clarity, formatting)?
        4. Completeness: Does it address all requirements and provide necessary information?
        
        Please respond in this exact JSON format:
        {{
            "structure": <score 0-100>,
            "professionalism": <score 0-100>,
            "ai_utilization": <score 0-100>,
            "completeness": <score 0-100>,
            "feedback": "<detailed feedback about the writing quality and AI usage>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
            "grade_justification": "<explanation of the overall grade>"
        }}
        """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional writing instructor evaluating business writing assignments. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1200
        )
        
        result = json.loads(response.choices[0].message.content)
        
        criteria_scores = {
            "structure": result["structure"],
            "professionalism": result["professionalism"],
            "ai_utilization": result["ai_utilization"],
            "completeness": result["completeness"]
        }
        
        overall_score = sum(criteria_scores.values()) // 4
        is_good_work = overall_score >= 75
        
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
        
        return WritingEvaluationResponse(
            isGoodWork=is_good_work,
            score=overall_score,
            criteria=WritingCriteria(**criteria_scores),
            feedback=result["feedback"],
            suggestions=result["suggestions"],
            grade=grade
        )