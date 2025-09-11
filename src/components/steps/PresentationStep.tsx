import React, { useState, useEffect } from 'react';
import { Presentation, Send, CheckCircle, XCircle, Loader2, Users, Sparkles } from 'lucide-react';

interface PresentationScenario {
  title: string;
  description: string;
  audience_context: string;
  scenario: string;
  requirements: string[];
  prompt: string;
}

interface PresentationEvaluation {
  isGoodPresentation: boolean;
  score: number;
  criteria: {
    content_structure: number;
    visual_design: number;
    ai_integration: number;
    audience_engagement: number;
    storytelling: number;
  };
  feedback: string;
  suggestions: string[];
  grade: string;
  engagement_level: string;
  recommended_tools: string[];
}

interface PresentationStepProps {
  onComplete: (results: PresentationEvaluation) => void;
  isCompleted: boolean;
}

const PresentationStep: React.FC<PresentationStepProps> = ({ onComplete, isCompleted }) => {
  const [selectedPresentation, setSelectedPresentation] = useState<string>('executive_briefing');
  const [scenarioDetails, setScenarioDetails] = useState<PresentationScenario | null>(null);
  const [approach, setApproach] = useState('');
  const [evaluation, setEvaluation] = useState<PresentationEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presentationTypes = [
    { 
      id: 'executive_briefing', 
      name: 'Executive Briefing', 
      icon: '👔', 
      description: 'AI-enhanced board presentation with strategic insights' 
    },
    { 
      id: 'training_session', 
      name: 'Training Session', 
      icon: '🎓', 
      description: 'Interactive AI-powered employee training presentation' 
    },
    { 
      id: 'project_proposal', 
      name: 'Project Proposal', 
      icon: '📋', 
      description: 'AI-assisted persuasive project proposal presentation' 
    },
    { 
      id: 'client_presentation', 
      name: 'Client Presentation', 
      icon: '🤝', 
      description: 'AI-personalized client-facing business presentation' 
    }
  ];

  useEffect(() => {
    fetchScenarioDetails();
  }, [selectedPresentation]);

  const fetchScenarioDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/assessment/presentation-scenario/${selectedPresentation}`);
      if (response.ok) {
        const scenario = await response.json();
        setScenarioDetails(scenario);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const evaluatePresentation = async () => {
    if (!approach.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiResponse = await fetch('http://localhost:8000/assessment/evaluate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presentation_type: selectedPresentation,
          content_approach: approach,
          audience_context: scenarioDetails?.audience_context || '',
          presentation_requirements: scenarioDetails?.requirements || []
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setEvaluation(result);
      onComplete(result);
    } catch (error) {
      console.error('Error evaluating presentation:', error);
      setError('Failed to evaluate presentation approach. Please make sure the backend server is running.');
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

  const getEngagementColor = (level: string) => {
    if (level === 'Excellent') return 'text-green-600 bg-green-100';
    if (level === 'Good') return 'text-blue-600 bg-blue-100';
    if (level === 'Fair') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Presentation className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI-Powered Presentations</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demonstrate your ability to create compelling presentations using AI tools for content development, 
          visual design, and audience engagement. Show how AI can enhance storytelling and presentation impact.
        </p>
      </div>

      {/* Presentation Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Presentation Scenario</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {presentationTypes.map((presentation) => (
            <button
              key={presentation.id}
              onClick={() => setSelectedPresentation(presentation.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPresentation === presentation.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="text-2xl mb-2">{presentation.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{presentation.name}</div>
              <div className="text-sm text-gray-600">{presentation.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Details */}
      {scenarioDetails && (
        <div className="bg-pink-50 rounded-lg border border-pink-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{scenarioDetails.title}</h3>
          <p className="text-gray-700 mb-4">{scenarioDetails.description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Target Audience:</span>
            </h4>
            <p className="text-gray-600">{scenarioDetails.audience_context}</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Presentation Context:</h4>
            <p className="text-gray-600 whitespace-pre-line">{scenarioDetails.scenario}</p>
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

      {/* Presentation Approach Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your AI-Enhanced Presentation Approach</h3>
        <div className="space-y-4">
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Describe your comprehensive approach to creating this presentation with AI assistance. Include:
• Content development strategy and AI tools for research
• Visual design approach and AI-powered design tools
• Storytelling techniques and narrative structure
• Audience engagement strategies and interactive elements
• Specific AI tools for presentation creation and enhancement
• How you would ensure professional quality and impact..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {approach.length} characters
            </span>
            <button
              onClick={evaluatePresentation}
              disabled={loading || !approach.trim()}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
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
              {evaluation.isGoodPresentation ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Presentation Evaluation Results
              </h3>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold ${getCriteriaColor(evaluation.score)}`}>
              {evaluation.score}%
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
                  <span key={index} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Presentation className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
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
                <span className="text-green-800 font-medium">Step completed! You can proceed to the next assessment.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PresentationStep;