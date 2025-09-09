import React, { useState, useEffect } from 'react';
import { Zap, Send, CheckCircle, XCircle, Loader2, Clock, Settings } from 'lucide-react';

interface ProductivityScenario {
  title: string;
  description: string;
  current_process: string;
  scenario: string;
  requirements: string[];
  prompt: string;
}

interface ProductivityEvaluation {
  isGoodAutomation: boolean;
  score: number;
  criteria: {
    process_analysis: number;
    automation_strategy: number;
    ai_tool_selection: number;
    efficiency_improvement: number;
    implementation_feasibility: number;
  };
  feedback: string;
  suggestions: string[];
  grade: string;
  efficiency_gain: string;
  recommended_tools: string[];
  implementation_timeline: string;
}

interface ProductivityStepProps {
  onComplete: (results: ProductivityEvaluation) => void;
  isCompleted: boolean;
}

const ProductivityStep: React.FC<ProductivityStepProps> = ({ onComplete, isCompleted }) => {
  const [selectedAutomation, setSelectedAutomation] = useState<string>('email_automation');
  const [scenarioDetails, setScenarioDetails] = useState<ProductivityScenario | null>(null);
  const [workflow, setWorkflow] = useState('');
  const [evaluation, setEvaluation] = useState<ProductivityEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const automationTypes = [
    { 
      id: 'email_automation', 
      name: 'Email Management', 
      icon: '📧', 
      description: 'AI-powered email automation and intelligent responses' 
    },
    { 
      id: 'report_generation', 
      name: 'Report Generation', 
      icon: '📊', 
      description: 'Automated reporting with AI-driven insights' 
    },
    { 
      id: 'meeting_scheduling', 
      name: 'Meeting & Calendar', 
      icon: '📅', 
      description: 'AI-enhanced scheduling and calendar optimization' 
    },
    { 
      id: 'document_processing', 
      name: 'Document Processing', 
      icon: '📄', 
      description: 'AI-driven document analysis and workflow automation' 
    }
  ];

  useEffect(() => {
    fetchScenarioDetails();
  }, [selectedAutomation]);

  const fetchScenarioDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/assessment/productivity-scenario/${selectedAutomation}`);
      if (response.ok) {
        const scenario = await response.json();
        setScenarioDetails(scenario);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const evaluateProductivity = async () => {
    if (!workflow.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiResponse = await fetch('http://localhost:8000/assessment/evaluate-productivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automation_type: selectedAutomation,
          workflow_description: workflow,
          current_process: scenarioDetails?.current_process || '',
          automation_goals: scenarioDetails?.requirements || []
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setEvaluation(result);
      onComplete(result);
    } catch (error) {
      console.error('Error evaluating productivity:', error);
      setError('Failed to evaluate productivity automation. Please make sure the backend server is running.');
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

  const getEfficiencyColor = (gain: string) => {
    if (gain === 'High') return 'text-green-600 bg-green-100';
    if (gain === 'Medium') return 'text-blue-600 bg-blue-100';
    if (gain === 'Low') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h2 className="text-3xl font-bold text-gray-900">Automating Workflows & Enhancing Productivity</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demonstrate your ability to identify automation opportunities and implement AI-powered solutions 
          to streamline workflows, reduce manual effort, and significantly boost productivity.
        </p>
      </div>

      {/* Automation Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Automation Scenario</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {automationTypes.map((automation) => (
            <button
              key={automation.id}
              onClick={() => setSelectedAutomation(automation.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedAutomation === automation.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-yellow-300'
              }`}
            >
              <div className="text-2xl mb-2">{automation.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{automation.name}</div>
              <div className="text-sm text-gray-600">{automation.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Details */}
      {scenarioDetails && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{scenarioDetails.title}</h3>
          <p className="text-gray-700 mb-4">{scenarioDetails.description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Current Process:</span>
            </h4>
            <p className="text-gray-600 whitespace-pre-line text-sm">{scenarioDetails.current_process}</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Business Context:</h4>
            <p className="text-gray-600">{scenarioDetails.scenario}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Automation Requirements:</h4>
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

      {/* Workflow Design Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your AI-Powered Automation Solution</h3>
        <div className="space-y-4">
          <textarea
            value={workflow}
            onChange={(e) => setWorkflow(e.target.value)}
            placeholder="Design your comprehensive automation solution. Include:
• Current process analysis and bottleneck identification
• Specific AI tools and technologies you would implement
• Step-by-step automation workflow design
• Integration approach with existing systems
• Expected efficiency improvements and time savings
• Implementation strategy and timeline
• Risk mitigation and quality assurance measures..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {workflow.length} characters
            </span>
            <button
              onClick={evaluateProductivity}
              disabled={loading || !workflow.trim()}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
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
              {evaluation.isGoodAutomation ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Productivity Automation Evaluation Results
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-lg border-2 font-bold text-xl ${getGradeColor(evaluation.grade)}`}>
                Grade: {evaluation.grade}
              </div>
              <div className={`px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${getEfficiencyColor(evaluation.efficiency_gain)}`}>
                <Settings className="w-4 h-4" />
                <span>{evaluation.efficiency_gain} Gain</span>
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
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Timeline:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {evaluation.implementation_timeline}
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
                  <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
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

export default ProductivityStep;