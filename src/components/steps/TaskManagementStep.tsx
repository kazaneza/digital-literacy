import React, { useState, useEffect } from 'react';
import { CheckSquare, Send, CheckCircle, XCircle, Loader2, Target, Clock } from 'lucide-react';

interface TaskManagementScenario {
  title: string;
  description: string;
  scenario: string;
  requirements: string[];
  prompt: string;
}

interface TaskManagementEvaluation {
  isGoodApproach: boolean;
  score: number;
  criteria: {
    organization: number;
    prioritization: number;
    ai_integration: number;
    efficiency: number;
  };
  feedback: string;
  suggestions: string[];
  grade: string;
  efficiency_rating: string;
}

interface TaskManagementStepProps {
  onComplete: (results: TaskManagementEvaluation) => void;
  isCompleted: boolean;
}

const TaskManagementStep: React.FC<TaskManagementStepProps> = ({ onComplete, isCompleted }) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('team_workflow');
  const [scenarioDetails, setScenarioDetails] = useState<TaskManagementScenario | null>(null);
  const [response, setResponse] = useState('');
  const [evaluation, setEvaluation] = useState<TaskManagementEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scenarioTypes = [
    { 
      id: 'team_workflow', 
      name: 'Team Workflow Management', 
      icon: '👥', 
      description: 'AI-enhanced team coordination and deadline management' 
    }
  ];

  useEffect(() => {
    fetchScenarioDetails();
  }, [selectedScenario]);

  const fetchScenarioDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/assessment/task-management-scenario/${selectedScenario}`);
      if (response.ok) {
        const scenario = await response.json();
        setScenarioDetails(scenario);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const evaluateTaskManagement = async () => {
    if (!response.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiResponse = await fetch('http://localhost:8000/assessment/evaluate-task-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario_type: selectedScenario,
          user_response: response,
          scenario_data: scenarioDetails?.scenario || ''
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setEvaluation(result);
      onComplete(result);
    } catch (error) {
      console.error('Error evaluating task management:', error);
      setError('Failed to evaluate task management approach. Please make sure the backend server is running.');
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

  const getEfficiencyColor = (rating: string) => {
    if (rating === 'Excellent') return 'text-green-600 bg-green-100';
    if (rating === 'Good') return 'text-blue-600 bg-blue-100';
    if (rating === 'Fair') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CheckSquare className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-900">Task Management & Workflow Efficiency</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demonstrate your ability to use AI tools for project planning, task prioritization, and workflow optimization. 
          Choose a scenario and show how you'd leverage AI to improve efficiency.
        </p>
      </div>

      {/* Scenario Selection */}

      {/* Scenario Details */}
      {scenarioDetails && (
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{scenarioDetails.title}</h3>
          <p className="text-gray-700 mb-4">{scenarioDetails.description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Scenario:</h4>
            <p className="text-gray-600 whitespace-pre-line">{scenarioDetails.scenario}</p>
          </div>


          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Your Task:</h4>
            <p className="text-gray-700 font-medium">{scenarioDetails.prompt}</p>
          </div>
        </div>
      )}

      {/* Response Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your AI-Assisted Approach</h3>
        <div className="space-y-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Describe your approach to this scenario. Include specific AI tools you would use, your methodology, and expected outcomes..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {response.length} characters
            </span>
            <button
              onClick={evaluateTaskManagement}
              disabled={loading || !response.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
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
              {evaluation.isGoodApproach ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Task Management Evaluation Results
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-lg border-2 font-bold text-xl ${getGradeColor(evaluation.grade)}`}>
                Grade: {evaluation.grade}
              </div>
              <div className={`px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${
                evaluation.score >= 76 ? 'text-purple-600 bg-purple-100' :
                evaluation.score >= 51 ? 'text-blue-600 bg-blue-100' :
                'text-green-600 bg-green-100'
              }`}>
                <span>{evaluation.score >= 76 ? 'Innovator' : evaluation.score >= 51 ? 'Practitioner' : 'Explorer'}</span>
              </div>
              <div className={`px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${getEfficiencyColor(evaluation.efficiency_rating)}`}>
                <Clock className="w-4 h-4" />
                <span>{evaluation.efficiency_rating}</span>
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
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
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

export default TaskManagementStep;