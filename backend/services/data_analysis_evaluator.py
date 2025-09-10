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
        
        # Use the same employee data from prompt engineering
        self.employee_data = """
Employee_ID | First_Name | Last_Name | Department | Position | Salary | Years_Experience | Manager_ID | Project_Code | Performance_Rating | Location | Join_Date
E001 | Jean | Uwimana | IT | Senior Developer | 85000 | 8 | E010 | PROJ_A | 4.2 | Kigali | 2016-03-15
E002 | Marie | Mukamana | Finance | Analyst | 45000 | 3 | E011 | PROJ_B | 3.8 | Kigali | 2021-07-20
E003 | Paul | Nkurunziza | IT | Junior Developer | 35000 | 1 | E001 | PROJ_A | 3.5 | Kigali | 2023-01-10
E004 | Grace | Uwase | HR | Manager | 75000 | 12 | NULL | PROJ_C | 4.5 | Musanze | 2012-09-05
E005 | David | Habimana | Finance | Senior Analyst | 65000 | 6 | E011 | PROJ_B | 4.1 | Kigali | 2018-11-30
E006 | Sarah | Ingabire | Marketing | Coordinator | 40000 | 2 | E012 | PROJ_D | 3.9 | Huye | 2022-05-18
E007 | James | Mugisha | IT | DevOps Engineer | 70000 | 5 | E010 | PROJ_A | 4.0 | Kigali | 2019-08-12
E008 | Alice | Nyirahabimana | Sales | Representative | 38000 | 4 | E013 | PROJ_E | 3.6 | Rubavu | 2020-02-28
E009 | Robert | Bizimana | Finance | Junior Analyst | 32000 | 1 | E005 | PROJ_B | 3.4 | Kigali | 2023-06-01
E010 | Emmanuel | Kayitare | IT | Department Head | 95000 | 15 | NULL | PROJ_A | 4.7 | Kigali | 2009-01-20
E011 | Claudine | Mukamazimpaka | Finance | Department Head | 90000 | 10 | NULL | PROJ_B | 4.3 | Kigali | 2014-04-10
E012 | Patrick | Nsengimana | Marketing | Department Head | 88000 | 9 | NULL | PROJ_D | 4.4 | Kigali | 2015-07-25
E013 | Immaculee | Uwimana | Sales | Department Head | 92000 | 11 | NULL | PROJ_E | 4.6 | Kigali | 2013-12-03
E014 | Thomas | Hakizimana | Operations | Manager | 72000 | 7 | NULL | PROJ_F | 4.2 | Gisenyi | 2017-10-14
E015 | Esperance | Mukandayisenga | HR | Specialist | 48000 | 5 | E004 | PROJ_C | 3.7 | Musanze | 2019-03-22
"""
        
        self.analysis_scenarios = {
            "employee_analysis": {
                "title": "Data Analysis & Visualization Challenge",
                "description": "Use AI tools to analyze complex business data and create insights",
                "dataset_context": "You have access to employee database with salary, performance, department, and experience data",
                "scenario": "The HR department has given you an employee database and needs you to analyze compensation gaps. They want to know the exact percentage salary increase needed to bring all low-performing employees (rating < 4.0) up to the average salary of high performers (rating >= 4.0), calculated by department, with total cost impact.",
                "requirements": [],
                "prompt": "The HR department has given you an employee database and needs you to analyze compensation gaps. They want to know the exact percentage salary increase needed to bring all low-performing employees (rating < 4.0) up to the average salary of high performers (rating >= 4.0), calculated by department, with total cost impact. How would you approach this complex data analysis task?"
            }
        }

    def get_analysis_scenario(self, analysis_type: str) -> dict:
        return self.analysis_scenarios.get(analysis_type, self.analysis_scenarios["employee_analysis"])

    async def evaluate_data_analysis(self, request: DataAnalysisRequest) -> DataAnalysisEvaluationResponse:
        scenario_info = self.get_analysis_scenario(request.analysis_type)
        
        evaluation_prompt = f"""
        You are evaluating a data analysis and visualization assessment for AI literacy.
        
        SCENARIO: {scenario_info['title']}
        DESCRIPTION: {scenario_info['description']}
        EMPLOYEE DATA TABLE: 
        {scenario_info['dataset_context']}
        BUSINESS CONTEXT: {scenario_info['scenario']}
        COMPLEX ANALYSIS QUESTION: {scenario_info['prompt']}
        
        The correct answer should involve:
        1. Identifying employees with ratings < 4.0 vs >= 4.0
        2. Calculating current average salaries for each group by department
        3. Determining the salary gap and percentage increase needed
        4. Computing total cost impact across all departments
        
        USER'S APPROACH:
        {request.user_approach}
        
        EVALUATION FRAMEWORK:
        Analyze the user's response to determine their AI data analysis literacy:
        
        EXPLORER LEVEL (0-50%): Basic approaches
        - Examples: "I'd use Excel to sort and calculate averages", manual calculations
        - Shows minimal awareness of AI tools for data analysis
        
        PRACTITIONER LEVEL (51-75%): Good use of AI-assisted tools
        - Examples: "I'd use Power BI with AI insights", "Excel with AI data analysis features"
        - Shows practical application of AI-enhanced analysis tools
        
        INNOVATOR LEVEL (76-100%): Advanced AI integration
        - Examples: "I'd use Python with AI libraries", "Power BI with custom AI models", "Copilot for advanced data analysis"
        - Shows sophisticated understanding of AI-powered analytics
        
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