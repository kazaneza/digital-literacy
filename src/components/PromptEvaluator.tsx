import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

const PromptEvaluator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const correctAnswer = `Based on the data table:

**Gasabo District:**
- Jean Bosco Nkurunziza
- Eric Habimana

**Kicukiro District:**
- Aline Uwase
- Patrick Mugisha

**Rubavu District:**
- Diane Ingabire`;

  const evaluatePrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/evaluate-prompt', {
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
    <div className="w-full space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Question */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Assessment Question</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <p className="text-gray-800 font-medium text-sm">
            Under each district, list the full names of the people who live there?
          </p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Your AI Prompt</h3>
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here to answer the question above..."
            className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={evaluatePrompt}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Evaluate Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className={`bg-white rounded-lg border-2 p-4 ${getOverallColor(evaluation.score)}`}>
          <div className="flex items-center space-x-3 mb-3">
            {evaluation.isGoodPrompt ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <h3 className="text-sm font-semibold text-gray-800">
              Prompt Evaluation Results
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCriteriaColor(evaluation.score)}`}>
              {evaluation.score}%
            </span>
          </div>

          {/* Criteria Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800 text-sm">Evaluation Criteria:</h4>
              {Object.entries(evaluation.criteria).map(([criterion, score]) => (
                <div key={criterion} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize text-sm">{criterion}:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getCriteriaColor(score)}`}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800 text-sm">Feedback:</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>
          </div>

          {/* Answer */}
          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Answer:</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {evaluation.answer}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptEvaluator;