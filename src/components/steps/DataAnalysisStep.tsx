import React, { useState, useEffect } from 'react';
import { BarChart3, Send, CheckCircle, XCircle, Loader2, TrendingUp, Database } from 'lucide-react';

interface DataAnalysisScenario {
  title: string;
  description: string;
  dataset_context: string;
  scenario: string;
  requirements: string[];
  prompt: string;
}

interface DataAnalysisEvaluation {
  isGoodAnalysis: boolean;
  score: number;
  criteria: {
    data_understanding: number;
    analytical_approach: number;
    ai_tool_usage: number;
    visualization_quality: number;
    insights_generation: number;
  };
  feedback: string;
  suggestions: string[];
  grade: string;
  insight_quality: string;
  recommended_tools: string[];
}

interface DataAnalysisStepProps {
  onComplete: (results: DataAnalysisEvaluation) => void;
  isCompleted: boolean;
}

const DataAnalysisStep: React.FC<DataAnalysisStepProps> = ({ onComplete, isCompleted }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('sales_analysis');
  const [scenarioDetails, setScenarioDetails] = useState<DataAnalysisScenario | null>(null);
  const [approach, setApproach] = useState('');
  const [evaluation, setEvaluation] = useState<DataAnalysisEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analysisTypes = [
    { 
      id: 'sales_analysis', 
      name: 'Sales Performance Analysis', 
      icon: '📊', 
      description: 'AI-powered quarterly sales data analysis and insights' 
    },
    { 
      id: 'customer_insights', 
      name: 'Customer Behavior Analysis', 
      icon: '👥', 
      description: 'AI-enhanced customer segmentation and behavior patterns' 
    },
    { 
      id: 'financial_reporting', 
      name: 'Financial Reporting Automation', 
      icon: '💰', 
      description: 'Automated financial analysis and reporting with AI' 
    },
    { 
      id: 'risk_assessment', 
      name: 'Risk Analysis & Monitoring', 
      icon: '⚠️', 
      description: 'AI-driven risk assessment and predictive monitoring' 
    }
  ];

  useEffect(() => {
    fetchScenarioDetails();
  }, [selectedAnalysis]);

  const fetchScenarioDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/assessment/data-analysis-scenario/${selectedAnalysis}`);
      if (response.ok) {
        const scenario = await response.json();
        setScenarioDetails(scenario);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const evaluateDataAnalysis = async () => {
    if (!approach.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiResponse = await fetch('http://localhost:8000/assessment/evaluate-data-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_type: selectedAnalysis,
          user_approach: approach,
          dataset_context: scenarioDetails?.dataset_context || '',
          visualization_requirements: scenarioDetails?.requirements || []
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setEvaluation(result);
      onComplete(result);
    } catch (error) {
      console.error('Error evaluating data analysis:', error);
      setError('Failed to evaluate data analysis approach. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getCriteriaColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-green-600 bg-green-100 border-green-300';
    if (grade === 'B') return 'text-blue-600 bg-blue-100 border-blue-300';
    if (grade === 'C') return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    if (grade === 'D') return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getInsightColor = (quality: string) => {
    if (quality === 'Excellent') return 'text-green-600 bg-green-100';
    if (quality === 'Good') return 'text-blue-600 bg-blue-100';
    if (quality === 'Fair') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI-Driven Data Analysis & Visualization</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demonstrate your ability to leverage AI tools for data analysis, pattern recognition, and creating compelling visualizations. 
          Choose an analysis scenario and show how you'd use AI to generate actionable business insights.
        </p>
      </div>

      {/* Analysis Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Analysis Scenario</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {analysisTypes.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => setSelectedAnalysis(analysis.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedAnalysis === analysis.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-2xl mb-2">{analysis.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{analysis.name}</div>
              <div className="text-sm text-gray-600">{analysis.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Details */}
      {scenarioDetails && (
        <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{scenarioDetails.title}</h3>
          <p className="text-gray-700 mb-4">{scenarioDetails.description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Dataset Context:</span>
            </h4>
            <p className="text-gray-600 whitespace-pre-line text-sm">{scenarioDetails.dataset_context}</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Business Scenario:</h4>
            <p className="text-gray-600">{scenarioDetails.scenario}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              {scenarioDetails.requirements.map((req, index) => (
                <li key={index} className="text-gray-600">{req}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Your Challenge:</h4>
            <p className="text-gray-700 font-medium">{scenarioDetails.prompt}</p>
          </div>
        </div>
      )}

      {/* Analysis Approach Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your AI-Powered Analysis Approach</h3>
        <div className="space-y-4">
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Describe your comprehensive approach to this data analysis challenge. Include:
• Specific AI tools you would use for data processing and analysis
• Your analytical methodology and techniques
• Types of visualizations and dashboards you would create
• How you would generate actionable insights
• Expected outcomes and business impact..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {approach.length} characters
            </span>
            <button
              onClick={evaluateDataAnalysis}
              disabled={loading || !approach.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit for Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {evaluation.isGoodAnalysis ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Data Analysis Evaluation Results
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-lg border-2 font-bold text-xl ${getGradeColor(evaluation.grade)}`}>
                Grade: {evaluation.grade}
              </div>
              <div className={`px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${getInsightColor(evaluation.insight_quality)}`}>
                <TrendingUp className="w-4 h-4" />
                <span>{evaluation.insight_quality}</span>
              </div>
            </div>
          </div>

          {/* Score and Criteria */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Evaluation Criteria</h4>
              <div className="space-y-3">
                {Object.entries(evaluation.criteria).map(([criterion, score]) => (
                  <div key={criterion} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">
                      {criterion.replace('_', ' ')}:
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${getCriteriaColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Overall Score:</span>
                  <span className={`px-4 py-2 rounded-lg font-bold ${getCriteriaColor(evaluation.score)}`}>
                    {evaluation.score}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Feedback</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                {evaluation.feedback}
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Recommended AI Tools</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {evaluation.recommended_tools.map((tool, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Step completed! You can proceed to view your results.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataAnalysisStep;