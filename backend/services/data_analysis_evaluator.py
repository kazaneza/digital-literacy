import openai
import json
import os
from dotenv import load_dotenv
from typing import List
from models.assessment import DataAnalysisRequest, DataAnalysisEvaluationResponse, DataAnalysisCriteria

# Load environment variables
load_dotenv()

class DataAnalysisEvaluatorService:
    def __init__(self):
        # Initialize OpenAI client properly with error handling
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = openai.OpenAI(api_key=api_key)
        
        self.analysis_scenarios = {
            "sales_analysis": {
                "title": "AI-Powered Sales Performance Analysis",
                "description": "Analyze quarterly sales data to identify trends, patterns, and opportunities using AI tools",
                "dataset_context": """Bank of Kigali Q4 2024 Sales Data:
- 15,000+ customer transactions across 25 branches
- Product categories: Savings, Loans, Credit Cards, Insurance, Investment
- Customer segments: Individual, SME, Corporate
- Geographic distribution: Kigali (60%), Other provinces (40%)
- Revenue: $12.5M total, 8% growth from Q3
- Key metrics: Customer acquisition cost, lifetime value, conversion rates""",
                "scenario": """You are tasked with analyzing Bank of Kigali's Q4 2024 sales performance data to prepare insights for the executive team. The data includes transaction volumes, revenue by product line, customer demographics, branch performance, and seasonal trends. Management wants to understand what drove the 8% quarterly growth and identify opportunities for Q1 2025.""",
                "requirements": [
                    "Identify key performance drivers and growth factors",
                    "Compare performance across branches and regions",
                    "Analyze customer segment behavior and preferences",
                    "Create executive-ready visualizations and dashboards",
                    "Provide actionable recommendations for Q1 strategy",
                    "Demonstrate effective use of AI analysis tools"
                ],
                "prompt": "How would you use AI tools to analyze this sales data and create compelling visualizations? Describe your analytical approach, the AI tools you'd use, and the specific insights and visualizations you'd create for the executive presentation."
            },
            "customer_insights": {
                "title": "AI-Enhanced Customer Behavior Analysis",
                "description": "Use AI to analyze customer data and generate actionable insights for personalized banking services",
                "dataset_context": """Customer Behavior Dataset:
- 50,000 active customers with 2+ years transaction history
- Demographics: Age, income, location, occupation, family status
- Banking behavior: Transaction frequency, channel preferences, product usage
- Digital engagement: Mobile app usage, online banking activity, support interactions
- Life events: Recent graduates, new homeowners, retirees, business owners
- Satisfaction scores and feedback from surveys""",
                "scenario": """The marketing team wants to launch personalized banking campaigns and improve customer experience. They need insights on customer segments, behavior patterns, and preferences to create targeted offers and improve service delivery. The goal is to increase customer engagement by 25% and cross-selling by 15%.""",
                "requirements": [
                    "Segment customers based on behavior and demographics",
                    "Identify patterns in product usage and preferences",
                    "Predict customer needs and life stage transitions",
                    "Create customer journey visualizations",
                    "Recommend personalization strategies",
                    "Show AI-driven predictive insights"
                ],
                "prompt": "How would you leverage AI tools to analyze customer behavior and create actionable insights for personalized banking? Detail your segmentation approach, the AI techniques you'd use, and the visualizations that would help the marketing team understand customer patterns."
            },
            "financial_reporting": {
                "title": "Automated Financial Reporting with AI",
                "description": "Create comprehensive financial reports and risk assessments using AI-powered analysis",
                "dataset_context": """Financial Data for Analysis:
- Monthly P&L statements for 12 months
- Balance sheet data with asset/liability breakdown
- Risk metrics: Credit risk, operational risk, market risk
- Regulatory compliance data and ratios
- Budget vs. actual performance across departments
- Economic indicators and market conditions impact""",
                "scenario": """The finance department needs to automate their monthly reporting process and create more insightful analysis for stakeholders. Currently, report preparation takes 5 days and involves manual data compilation from multiple sources. They want to reduce this to 1 day while improving the quality and depth of insights provided to management and regulators.""",
                "requirements": [
                    "Automate data collection and validation processes",
                    "Create dynamic financial dashboards and reports",
                    "Identify financial trends and anomalies",
                    "Generate risk assessment visualizations",
                    "Provide variance analysis and explanations",
                    "Ensure regulatory compliance reporting"
                ],
                "prompt": "How would you use AI tools to automate financial reporting and create comprehensive analysis? Describe your automation strategy, the AI tools for data processing and visualization, and how you'd ensure accuracy while reducing manual effort."
            },
            "risk_assessment": {
                "title": "AI-Driven Risk Analysis and Monitoring",
                "description": "Implement AI-powered risk assessment and create real-time monitoring dashboards",
                "dataset_context": """Risk Management Data:
- Loan portfolio: $500M across 10,000+ loans
- Default rates by segment, region, and loan type
- Economic indicators: GDP, inflation, unemployment rates
- Customer credit scores and payment histories
- Market volatility and interest rate changes
- Regulatory requirements and stress test scenarios""",
                "scenario": """The risk management team needs to enhance their risk monitoring capabilities with AI-powered analysis. They want to predict potential defaults, identify emerging risks, and create real-time dashboards for proactive risk management. The goal is to reduce default rates by 20% and improve early warning systems.""",
                "requirements": [
                    "Build predictive models for default probability",
                    "Create risk heat maps and monitoring dashboards",
                    "Identify correlations between risk factors",
                    "Develop early warning indicators",
                    "Visualize portfolio risk distribution",
                    "Generate automated risk reports and alerts"
                ],
                "prompt": "How would you implement AI-driven risk analysis and create comprehensive monitoring systems? Detail your predictive modeling approach, the AI tools for risk assessment, and the visualizations that would help the risk team proactively manage portfolio risks."
            }
        }

    def get_analysis_scenario(self, analysis_type: str) -> dict:
        return self.analysis_scenarios.get(analysis_type, self.analysis_scenarios["sales_analysis"])

    async def evaluate_data_analysis(self, request: DataAnalysisRequest) -> DataAnalysisEvaluationResponse:
        scenario_info = self.get_analysis_scenario(request.analysis_type)
        
        evaluation_prompt = f"""
        You are evaluating a data analysis and visualization assessment for AI literacy.
        
        SCENARIO: {scenario_info['title']}
        DESCRIPTION: {scenario_info['description']}
        DATASET CONTEXT: {scenario_info['dataset_context']}
        BUSINESS CONTEXT: {scenario_info['scenario']}
        QUESTION: {scenario_info['prompt']}
        
        REQUIREMENTS:
        {chr(10).join(f"- {req}" for req in scenario_info['requirements'])}
        
        USER'S APPROACH:
        {request.user_approach}
        
        EVALUATION CRITERIA (score each out of 100):
        1. Data Understanding: How well does the user understand the dataset and business context?
        2. Analytical Approach: Is the analytical methodology sound and appropriate for the problem?
        3. AI Tool Usage: How effectively are AI tools integrated into the analysis workflow?
        4. Visualization Quality: Are the proposed visualizations clear, relevant, and insightful?
        5. Insights Generation: Does the approach lead to actionable business insights?
        
        Please respond in this exact JSON format:
        {{
            "data_understanding": <score 0-100>,
            "analytical_approach": <score 0-100>,
            "ai_tool_usage": <score 0-100>,
            "visualization_quality": <score 0-100>,
            "insights_generation": <score 0-100>,
            "feedback": "<detailed feedback about the data analysis approach and AI usage>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
            "insight_quality": "<Excellent/Good/Fair/Needs Improvement>",
            "recommended_tools": ["<tool 1>", "<tool 2>", "<tool 3>"],
            "grade_justification": "<explanation of the overall grade>"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a data analysis and business intelligence expert evaluating AI-powered analytical approaches. Always respond with valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        
        criteria_scores = {
            "data_understanding": result["data_understanding"],
            "analytical_approach": result["analytical_approach"],
            "ai_tool_usage": result["ai_tool_usage"],
            "visualization_quality": result["visualization_quality"],
            "insights_generation": result["insights_generation"]
        }
        
        overall_score = sum(criteria_scores.values()) // 5
        is_good_analysis = overall_score >= 75
        
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
        
        return DataAnalysisEvaluationResponse(
            isGoodAnalysis=is_good_analysis,
            score=overall_score,
            criteria=DataAnalysisCriteria(**criteria_scores),
            feedback=result["feedback"],
            suggestions=result["suggestions"],
            grade=grade,
            insight_quality=result["insight_quality"],
            recommended_tools=result["recommended_tools"]
        )