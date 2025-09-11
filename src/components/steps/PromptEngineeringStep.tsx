import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, Loader2, Brain } from 'lucide-react';
import DataTable from '../DataTable';

interface EvaluationResult {
  isGoodPrompt: boolean;
  score: number;
  criteria: {
    clarity: number;
    specificity: number;
    completeness: number;
    relevance: number;
  };
  feedback: string;
  answer: string;
}

interface PromptEngineeringStepProps {
  onComplete: (results: EvaluationResult) => void;
  isCompleted: boolean;
}

const PromptEngineeringStep: React.FC<PromptEngineeringStepProps> = ({ onComplete, isCompleted }) => {
  const [prompt, setPrompt] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isMaxAttemptsReached, setIsMaxAttemptsReached] = useState(false);
  const maxAttempts = 2;

  const evaluatePrompt = async () => {
    if (!prompt.trim()) return;

    // Check if max attempts reached
    if (attemptCount >= maxAttempts) {
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/assessment/evaluate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          context_data: "Employee database with ID, First Name, Last Name, District, and Occupation columns"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEvaluation(result);
      
      // Increment attempt count
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      // Check if this was the last attempt
      if (newAttemptCount >= maxAttempts) {
        setIsMaxAttemptsReached(true);
        // Auto-complete with current result after 2 attempts
        setTimeout(() => {
          onComplete(result);
        }, 3000); // Give user 3 seconds to see the result
      } else {
        // Only complete if they got a good score on first attempt
        if (result.score >= 75) {
          onComplete(result);
        }
      }
    } catch (error) {
      console.error('Error evaluating prompt:', error);
      setError('Failed to evaluate prompt. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getCriteriaColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOverallColor = (score: number) => {
    if (score >= 80) return 'border-green-500 bg-green-50';
    if (score >= 60) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Prompt Engineering Assessment</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Test your ability to create effective AI prompts by analyzing the data below and crafting a prompt to answer the question.
        </p>
      </div>

      {/* Data Table */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Employee Database</h3>
        <DataTable />
      </div>

      {/* Question */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Complex Analysis Challenge</h3>
        <div className="text-gray-800 space-y-2">
          <p className="font-medium">Analyze the employee database and provide a comprehensive report that includes:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
            <li>For each department, identify the highest-paid employee and their manager (if they have one)</li>
            <li>Calculate the average salary for employees with performance ratings above 4.0, grouped by years of experience (0-2 years, 3-5 years, 6+ years)</li>
            <li>List all employees who earn more than their direct manager (if applicable)</li>
            <li>Identify departments where the average salary is above 60,000 and list the project codes associated with those departments</li>
            <li>Find employees hired in the same year who work on different projects, and show their salary differences</li>
          </ol>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Challenge Level:</strong> This requires advanced prompt engineering skills including data relationships, conditional logic, grouping, calculations, and multi-step analysis.
          </p>
        </div>
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>⚠️ Important:</strong> Write a proper AI prompt (instructions to an AI assistant), not just a copy of the question above. 
            Good prompts start with phrases like "Please analyze...", "Based on the data...", "I need you to examine..."
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Prompt Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your AI Prompt</h3>
        
        {/* Attempt Counter */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Attempt {attemptCount} of {maxAttempts}
          </div>
          {attemptCount > 0 && attemptCount < maxAttempts && (
            <div className="text-sm text-blue-600">
              {maxAttempts - attemptCount} attempt{maxAttempts - attemptCount !== 1 ? 's' : ''} remaining
            </div>
          )}
        </div>
        
        {/* Max Attempts Warning */}
        {isMaxAttemptsReached && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-orange-800 font-medium">Maximum attempts reached</p>
                <p className="text-orange-700 text-sm">You've used both attempts. Moving to next assessment in a few seconds...</p>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isMaxAttemptsReached}
            placeholder="Write your AI prompt here (e.g., 'Please analyze the employee database systematically. First, examine each department to identify...'). Remember: write instructions TO an AI, not just a restatement of the question."
            className={`w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isMaxAttemptsReached ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <div className="flex justify-end">
            <button
              onClick={evaluatePrompt}
              disabled={loading || !prompt.trim() || isMaxAttemptsReached}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                isMaxAttemptsReached 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : isMaxAttemptsReached ? (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>Max Attempts Reached</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Evaluate Prompt ({maxAttempts - attemptCount} left)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className={`bg-white rounded-lg border-2 p-6 ${getOverallColor(evaluation.score)}`}>
          <div className="flex items-center space-x-3 mb-4">
            {evaluation.isGoodPrompt ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h3 className="text-xl font-semibold text-gray-800">
              Prompt Evaluation Results
            </h3>
            <div className={`px-4 py-2 rounded-full font-bold ${getCriteriaColor(evaluation.score)}`}>
              {evaluation.score}%
            </div>
          </div>

          {/* Criteria Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Evaluation Criteria:</h4>
              {Object.entries(evaluation.criteria).map(([criterion, score]) => (
                <div key={criterion} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{criterion}:</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getCriteriaColor(score)}`}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Feedback:</h4>
              <p className="text-gray-600 leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>
          </div>

          {/* Answer */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Generated Answer:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                {evaluation.answer}
              </pre>
            </div>
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Step completed! You can proceed to the next assessment.</span>
              </div>
            </div>
          )}
          
          {/* Show attempt-based completion message */}
          {evaluation && attemptCount >= maxAttempts && !isCompleted && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Assessment completed after {maxAttempts} attempts. Moving to next step...
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptEngineeringStep;