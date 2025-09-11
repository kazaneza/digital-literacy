import React, { useState } from 'react';
import { Zap, CheckCircle, Bot, Sparkles, Settings, Users } from 'lucide-react';

interface SurveyResponse {
  scenario1: string; // approve_teams, check_outlook, either
  scenario2: string; // ai_summary, read_myself, sometimes
  scenario3: string; // yes_suggest, sometimes_suggest, write_own
  scenario4: string; // yes_automate, maybe_some, prefer_manual
  scenario5: string; // yes_chatbot, maybe_certain, no_chatbot
  scenario6: string; // fully_automatic, only_some, prefer_manual
}

interface ProductivityEvaluation {
  score: number;
  level: 'Explorer' | 'Practitioner' | 'Innovator';
  feedback: string;
  suggestions: string[];
  automationReadiness: string;
  responses: SurveyResponse;
}

interface ProductivityStepProps {
  onComplete: (results: ProductivityEvaluation) => void;
  isCompleted: boolean;
}

const ProductivityStep: React.FC<ProductivityStepProps> = ({ onComplete, isCompleted }) => {
  const [responses, setResponses] = useState<SurveyResponse>({
    scenario1: '',
    scenario2: '',
    scenario3: '',
    scenario4: '',
    scenario5: '',
    scenario6: ''
  });
  const [isStepCompletedInternally, setIsStepCompletedInternally] = useState(false);

  const scenarios = [
    {
      id: 'scenario1',
      title: 'Approving Documents in Teams',
      description: 'You just received a loan request or contract. How would you like to handle it?',
      icon: '📋',
      options: [
        { value: 'approve_teams', label: 'Approve directly in Teams with a short AI summary', emoji: '🟢', points: 3 },
        { value: 'check_outlook', label: 'Check the full email in Outlook first', emoji: '🟡', points: 1 },
        { value: 'either', label: 'Either way is fine', emoji: '⚪', points: 2 }
      ]
    },
    {
      id: 'scenario2',
      title: 'Summarizing Long Emails or Documents',
      description: 'You have a long report to read. What would you prefer?',
      icon: '📄',
      options: [
        { value: 'ai_summary', label: 'AI summarizes key points for me', emoji: '✨', points: 3 },
        { value: 'read_myself', label: 'I read it myself', emoji: '📝', points: 1 },
        { value: 'sometimes', label: 'Sometimes AI, sometimes I read myself', emoji: '🤷', points: 2 }
      ]
    },
    {
      id: 'scenario3',
      title: 'AI-Suggested Comments',
      description: 'When approving or rejecting a document, do you want AI to suggest comments?',
      icon: '💬',
      options: [
        { value: 'yes_suggest', label: 'Yes, suggest comments', emoji: '💡', points: 3 },
        { value: 'sometimes_suggest', label: 'Sometimes, if needed', emoji: '🤔', points: 2 },
        { value: 'write_own', label: 'No, I\'ll write my own', emoji: '✍️', points: 1 }
      ]
    },
    {
      id: 'scenario4',
      title: 'Automating Repetitive Tasks',
      description: 'Things like moving documents, sending reminders, or logging approvals could be automated. How do you feel?',
      icon: '⚙️',
      options: [
        { value: 'yes_automate', label: 'Yes, save me the time!', emoji: '🚀', points: 3 },
        { value: 'maybe_some', label: 'Maybe, only for some tasks', emoji: '🟡', points: 2 },
        { value: 'prefer_manual', label: 'No, I prefer doing it myself', emoji: '❌', points: 1 }
      ]
    },
    {
      id: 'scenario5',
      title: 'Using Chatbots',
      description: 'Imagine a Teams chatbot that can answer questions, fetch reports, or trigger tasks for you. Would you use it?',
      icon: '🤖',
      options: [
        { value: 'yes_chatbot', label: 'Yes, that would save me time', emoji: '🤖', points: 3 },
        { value: 'maybe_certain', label: 'Maybe, only for certain tasks', emoji: '🟡', points: 2 },
        { value: 'no_chatbot', label: 'No, I don\'t need a chatbot', emoji: '❌', points: 1 }
      ]
    },
    {
      id: 'scenario6',
      title: 'Agents Doing Tasks Behind the Scenes',
      description: 'Some tasks (like moving approved documents, notifying teams, updating dashboards) could be done automatically by "agents" without me doing anything. Would you like that?',
      icon: '🔄',
      options: [
        { value: 'fully_automatic', label: 'Yes, fully automatic', emoji: '⚡', points: 3 },
        { value: 'only_some', label: 'Only for some tasks', emoji: '🟡', points: 2 },
        { value: 'prefer_manual', label: 'No, I prefer manual handling', emoji: '❌', points: 1 }
      ]
    }
  ];

  const handleResponseChange = (scenarioId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [scenarioId]: value
    }));
  };

  const calculateResults = () => {
    const totalPoints = scenarios.reduce((sum, scenario) => {
      const response = responses[scenario.id as keyof SurveyResponse];
      const option = scenario.options.find(opt => opt.value === response);
      return sum + (option?.points || 0);
    }, 0);

    const maxPoints = scenarios.length * 3;
    const score = Math.round((totalPoints / maxPoints) * 100);

    let level: 'Explorer' | 'Practitioner' | 'Innovator';
    let automationReadiness: string;
    let feedback: string;
    let suggestions: string[];

    if (score >= 80) {
      level = 'Innovator';
      automationReadiness = 'High';
      feedback = 'You show strong enthusiasm for AI automation and are ready to embrace advanced productivity tools. You understand the value of AI assistance and are comfortable with automated workflows.';
      suggestions = [
        'Explore advanced AI automation tools like Power Automate and Copilot',
        'Consider implementing AI agents for routine tasks',
        'Lead AI adoption initiatives in your team'
      ];
    } else if (score >= 60) {
      level = 'Practitioner';
      automationReadiness = 'Medium';
      feedback = 'You have a balanced approach to AI automation, showing interest in some areas while preferring manual control in others. You\'re open to AI assistance but selective about implementation.';
      suggestions = [
        'Start with simple AI tools like document summarization',
        'Gradually introduce automation for repetitive tasks',
        'Experiment with AI-suggested content and comments'
      ];
    } else {
      level = 'Explorer';
      automationReadiness = 'Low';
      feedback = 'You prefer traditional manual approaches and may be cautious about AI automation. This is perfectly valid, and you can gradually explore AI tools at your own pace.';
      suggestions = [
        'Begin with basic AI features in familiar tools',
        'Try AI summarization for long documents',
        'Consider AI assistance for simple, low-risk tasks'
      ];
    }

    const evaluation: ProductivityEvaluation = {
      score,
      level,
      feedback,
      suggestions,
      automationReadiness,
      responses
    };

    setIsStepCompletedInternally(true);
    onComplete(evaluation);
  };

  const canComplete = Object.values(responses).every(response => response !== '');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Innovator') return 'text-purple-600 bg-purple-100 border-purple-300';
    if (level === 'Practitioner') return 'text-blue-600 bg-blue-100 border-blue-300';
    return 'text-green-600 bg-green-100 border-green-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI Automation Interest Survey</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Help us understand your interest in AI automation and productivity tools. 
          Choose the option that best represents your preference for each scenario.
        </p>
      </div>

      {/* Survey Scenarios */}
      <div className="space-y-6">
        {scenarios.map((scenario, index) => (
          <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{scenario.title}</h3>
                <p className="text-gray-600">{scenario.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {scenario.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    responses[scenario.id as keyof SurveyResponse] === option.value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={scenario.id}
                    value={option.value}
                    checked={responses[scenario.id as keyof SurveyResponse] === option.value}
                    onChange={(e) => handleResponseChange(scenario.id, e.target.value)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-gray-800 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <button
          onClick={calculateResults}
          disabled={!canComplete || isStepCompletedInternally}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Complete Survey</span>
        </button>
      </div>

      {/* Results Display */}
      {isStepCompletedInternally && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                AI Automation Interest Results
              </h3>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold ${getScoreColor(85)}`}>
              85%
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Your Profile</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Automation Readiness:</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getScoreColor(85)}`}>
                    High
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Literacy Level:</span>
                  <span className={`px-3 py-1 rounded-lg border-2 font-medium ${getLevelColor('Innovator')}`}>
                    Innovator
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Feedback</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                You show strong enthusiasm for AI automation and are ready to embrace advanced productivity tools.
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Bot className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Explore advanced AI automation tools</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Consider implementing AI agents</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Lead AI adoption initiatives</span>
                </li>
              </ul>
            </div>
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Survey completed! You can proceed to view your results.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductivityStep;