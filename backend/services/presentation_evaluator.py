import openai
import json
import os
from typing import List
from models.assessment import PresentationRequest, PresentationEvaluationResponse, PresentationCriteria

class PresentationEvaluatorService:
    def __init__(self):
        # Initialize OpenAI client properly
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        self.presentation_scenarios = {
            "executive_briefing": {
                "title": "AI-Enhanced Executive Briefing",
                "description": "Create a compelling executive presentation using AI tools for content and design",
                "audience_context": "Board of Directors and C-Suite executives at Bank of Kigali",
                "scenario": """You need to present the Q4 2024 Digital Transformation Initiative results to the Board of Directors. The presentation should cover:
- Project outcomes and ROI analysis
- Customer satisfaction improvements (15% increase)
- Operational efficiency gains (30% reduction in processing time)
- Technology adoption rates across branches
- Challenges faced and lessons learned
- Strategic recommendations for 2025
Time limit: 20 minutes with 10 minutes for Q&A""",
                "requirements": [
                    "Executive-level content with clear value propositions",
                    "Professional visual design and consistent branding",
                    "Data-driven insights with compelling visualizations",
                    "Strategic recommendations with implementation roadmap",
                    "Engaging storytelling that maintains attention",
                    "Demonstrate effective AI tool usage for content and design"
                ],
                "prompt": "How would you use AI tools to create this executive briefing? Describe your approach to content creation, visual design, data visualization, and presentation delivery. Include specific AI tools and techniques you would use."
            },
            "training_session": {
                "title": "AI-Powered Training Presentation",
                "description": "Design an interactive training session using AI for content development and engagement",
                "audience_context": "50 Bank of Kigali employees across different departments and experience levels",
                "scenario": """Create a 90-minute training session on 'Digital Banking Security Best Practices' for bank employees. The session should cover:
- Current cybersecurity threats in banking
- Password management and multi-factor authentication
- Phishing recognition and prevention
- Secure customer data handling procedures
- Incident reporting protocols
- Interactive exercises and real-world scenarios
- Assessment and certification component""",
                "requirements": [
                    "Interactive and engaging content for diverse audience",
                    "Clear learning objectives and outcomes",
                    "Visual aids and multimedia elements",
                    "Hands-on exercises and practical examples",
                    "Assessment tools and knowledge checks",
                    "Show AI integration for content creation and interactivity"
                ],
                "prompt": "How would you leverage AI tools to develop this comprehensive training presentation? Detail your approach to content creation, interactive elements, visual design, and engagement strategies using AI assistance."
            },
            "project_proposal": {
                "title": "AI-Assisted Project Proposal Presentation",
                "description": "Develop a persuasive project proposal presentation using AI for research and design",
                "audience_context": "Senior management team and department heads",
                "scenario": """Propose a new 'AI-Powered Customer Service Chatbot' project for Bank of Kigali. Your presentation should include:
- Market research and competitive analysis
- Technical requirements and architecture
- Implementation timeline (6 months)
- Budget breakdown ($150,000)
- Expected benefits and ROI projections
- Risk assessment and mitigation strategies
- Team requirements and resource allocation
- Success metrics and KPIs""",
                "requirements": [
                    "Compelling business case with clear ROI",
                    "Technical feasibility and implementation plan",
                    "Risk analysis and mitigation strategies",
                    "Professional design with supporting visuals",
                    "Persuasive narrative and logical flow",
                    "Demonstrate AI usage in research and presentation creation"
                ],
                "prompt": "How would you use AI tools to research, develop, and design this project proposal presentation? Describe your approach to market research, content development, visual design, and persuasive storytelling using AI assistance."
            },
            "client_presentation": {
                "title": "AI-Enhanced Client Presentation",
                "description": "Create a client-facing presentation using AI for personalization and impact",
                "audience_context": "High-value corporate client considering expanded banking services",
                "scenario": """Present a comprehensive banking solutions package to TechCorp Rwanda, a growing technology company with 200+ employees. The presentation should cover:
- Customized banking solutions for tech companies
- Corporate account management services
- Employee payroll and benefits integration
- International payment and forex services
- Business loan and credit facilities
- Digital banking platform features
- Competitive pricing and value proposition
- Implementation timeline and support""",
                "requirements": [
                    "Client-specific customization and personalization",
                    "Professional and polished visual presentation",
                    "Clear value propositions and benefits",
                    "Competitive analysis and differentiation",
                    "Interactive elements and engagement tools",
                    "Show AI integration for personalization and content optimization"
                ],
                "prompt": "How would you use AI tools to create this personalized client presentation? Detail your approach to client research, content customization, visual design, and presentation optimization using AI assistance."
            }
        }

    def get_presentation_scenario(self, presentation_type: str) -> dict:
        return self.presentation_scenarios.get(presentation_type, self.presentation_scenarios["executive_briefing"])

    async def evaluate_presentation(self, request: PresentationRequest) -> PresentationEvaluationResponse:
        scenario_info = self.get_presentation_scenario(request.presentation_type)
        
        evaluation_prompt = f"""
        You are evaluating an AI-powered presentation development assessment for AI literacy.
        
        SCENARIO: {scenario_info['title']}
        DESCRIPTION: {scenario_info['description']}
        AUDIENCE: {scenario_info['audience_context']}
        CONTEXT: {scenario_info['scenario']}
        QUESTION: {scenario_info['prompt']}
        
        REQUIREMENTS:
        {chr(10).join(f"- {req}" for req in scenario_info['requirements'])}
        
        USER'S APPROACH:
        {request.content_approach}
        
        EVALUATION CRITERIA (score each out of 100):
        1. Content Structure: How well-organized and logical is the presentation structure and flow?
        2. Visual Design: Does the approach show effective use of AI for visual design and aesthetics?
        3. AI Integration: How effectively are AI tools integrated into the presentation development process?
        4. Audience Engagement: Does the approach consider audience needs and engagement strategies?
        5. Storytelling: How well does the approach create a compelling narrative and story arc?
        
        Please respond in this exact JSON format:
        {{
            "content_structure": <score 0-100>,
            "visual_design": <score 0-100>,
            "ai_integration": <score 0-100>,
            "audience_engagement": <score 0-100>,
            "storytelling": <score 0-100>,
            "feedback": "<detailed feedback about the presentation approach and AI usage>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
            "engagement_level": "<Excellent/Good/Fair/Needs Improvement>",
            "recommended_tools": ["<tool 1>", "<tool 2>", "<tool 3>"],
            "grade_justification": "<explanation of the overall grade>"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a presentation design and communication expert evaluating AI-enhanced presentation development skills. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        
        criteria_scores = {
            "content_structure": result["content_structure"],
            "visual_design": result["visual_design"],
            "ai_integration": result["ai_integration"],
            "audience_engagement": result["audience_engagement"],
            "storytelling": result["storytelling"]
        }
        
        overall_score = sum(criteria_scores.values()) // 5
        is_good_presentation = overall_score >= 75
        
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
        
        return PresentationEvaluationResponse(
            isGoodPresentation=is_good_presentation,
            score=overall_score,
            criteria=PresentationCriteria(**criteria_scores),
            feedback=result["feedback"],
            suggestions=result["suggestions"],
            grade=grade,
            engagement_level=result["engagement_level"],
            recommended_tools=result["recommended_tools"]
        )