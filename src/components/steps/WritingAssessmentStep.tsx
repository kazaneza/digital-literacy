import React, { useState, useEffect } from 'react';
import { FileText, Send, CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react';

interface WritingTask {
  title: string;
  description: string;
  scenario: string;
  requirements: string[];
}

interface WritingEvaluation {
  isGoodWork: boolean;
  score: number;
  criteria: {
    structure: number;
    professionalism: number;
    ai_utilization: number;
    completeness: number;
  };
  feedback: string;
  suggestions: string[];
  grade: string;
}

interface WritingAssessmentStepProps {
  onComplete: (results: WritingEvaluation) => void;
  isCompleted: boolean;
}

const WritingAssessmentStep: React.FC<WritingAssessmentStepProps> = ({ onComplete, isCompleted }) => {
  const [selectedTask, setSelectedTask] = useState<string>('business_email');
  const [taskDetails, setTaskDetails] = useState<WritingTask | null>(null);
  const [content, setContent] = useState('');
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taskTypes = [
    { id: 'business_email', name: 'Business Email', icon: '📧', description: 'Professional client communication' },
    { id: 'project_report', name: 'Project Report', icon: '📊', description: 'Comprehensive status reporting' },
    { id: 'proposal', name: 'Business Proposal', icon: '📋', description: 'Service offering proposals' }
  ];

  useEffect(() => {
    fetchTaskDetails();
  }, [selectedTask]);

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/assessment/writing-task/${selectedTask}`);
      if (response.ok) {
        const task = await response.json();
        setTaskDetails(task);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const evaluateWriting = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/assessment/evaluate-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_type: selectedTask,
          content: content,
          requirements: taskDetails?.requirements || []
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEvaluation(result);
      onComplete(result);
    } catch (error) {
      console.error('Error evaluating writing:', error);
      setError('Failed to evaluate writing. Please make sure the backend server is running.');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">Writing & Document Automation</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demonstrate your ability to create professional documents with AI assistance. 
          Choose a task type and create high-quality business content.
        </p>
      </div>

      {/* Task Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Writing Task</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {taskTypes.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTask === task.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-2">{task.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{task.name}</div>
              <div className="text-sm text-gray-600">{task.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Task Details */}
      {taskDetails && (
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{taskDetails.title}</h3>
          <p className="text-gray-700 mb-4">{taskDetails.description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Scenario:</h4>
            <p className="text-gray-600 italic">{taskDetails.scenario}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              {taskDetails.requirements.map((req, index) => (
                <li key={index} className="text-gray-600">{req}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Writing Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Document</h3>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your document here. Use AI tools to help with grammar, structure, and professional language..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length} characters
            </span>
            <button
              onClick={evaluateWriting}
              disabled={loading || !content.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
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
              {evaluation.isGoodWork ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Writing Evaluation Results
              </h3>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-bold text-xl ${getGradeColor(evaluation.grade)}`}>
              Grade: {evaluation.grade}
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
                    <BookOpen className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
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

export default WritingAssessmentStep;