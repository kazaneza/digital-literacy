import React, { useState } from 'react';
import { FileText, CheckCircle, Sliders } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ToolUsage {
  toolId: string;
  familiarity: number; // 0-100
  frequency: number; // 0-100
  level: number; // 0-100 (0=manual, 50=AI-assisted, 100=automated)
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
  level: 'Explorer' | 'Practitioner' | 'Innovator';
  toolProficiency: string;
  toolUsages: ToolUsage[];
}

interface WritingAssessmentStepProps {
  onComplete: (results: WritingEvaluation) => void;
  isCompleted: boolean;
}

const WritingAssessmentStep: React.FC<WritingAssessmentStepProps> = ({ onComplete, isCompleted }) => {
  const [toolUsages, setToolUsages] = useState<ToolUsage[]>([]);
  const [isStepCompletedInternally, setIsStepCompletedInternally] = useState(false);

  const aiTools: AITool[] = [
    {
      id: 'word-ai',
      name: 'Microsoft Word with AI',
      description: 'AI writing assistance, grammar checking, style suggestions',
      icon: '📝'
    },
    {
      id: 'canva',
      name: 'Canva AI',
      description: 'AI-powered design, templates, and content generation',
      icon: '🎨'
    },
    {
      id: 'copilot-word',
      name: 'Copilot in Word',
      description: 'AI content generation and document assistance',
      icon: '🤖'
    },
    {
      id: 'copilot-powerpoint',
      name: 'Copilot in PowerPoint',
      description: 'AI presentation creation and design assistance',
      icon: '📊'
    },
    {
      id: 'copilot-pdf',
      name: 'Copilot for PDFs',
      description: 'AI document analysis and summarization',
      icon: '📄'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT/Claude',
      description: 'AI chatbots for writing and content creation',
      icon: '💬'
    }
  ];

  React.useEffect(() => {
    if (toolUsages.length === 0) {
      const initialUsages = aiTools.map(tool => ({
        toolId: tool.id,
        familiarity: 0,
        frequency: 0,
        level: 0
      }));
      setToolUsages(initialUsages);
    }
  }, []);

  const updateToolUsage = (toolId: string, field: keyof Omit<ToolUsage, 'toolId'>, value: number) => {
    setToolUsages(prev => prev.map(usage => 
      usage.toolId === toolId ? { ...usage, [field]: value } : usage
    ));
  };

  const getSliderColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSliderTrackColor = (value: number) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-blue-100';
    if (value >= 40) return 'bg-yellow-100';
    if (value >= 20) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getLevelText = (value: number) => {
    if (value <= 25) return 'Manual';
    if (value <= 75) return 'AI-Assisted';
    return 'Automated';
  };

  const getFrequencyText = (value: number) => {
    if (value <= 20) return 'Never';
    if (value <= 40) return 'Rarely';
    if (value <= 60) return 'Sometimes';
    if (value <= 80) return 'Often';
    return 'Daily';
  };

  const calculateResults = () => {
    // Calculate overall scores
    const totalFamiliarity = toolUsages.reduce((sum, usage) => sum + usage.familiarity, 0) / toolUsages.length;
    const totalFrequency = toolUsages.reduce((sum, usage) => sum + usage.frequency, 0) / toolUsages.length;
    const totalLevel = toolUsages.reduce((sum, usage) => sum + usage.level, 0) / toolUsages.length;
    
    const overallScore = Math.round((totalFamiliarity + totalFrequency + totalLevel) / 3);

    // Determine level
    let level: 'Explorer' | 'Practitioner' | 'Innovator';
    let toolProficiency: string;
    
    if (overallScore >= 75) {
      level = 'Innovator';
      toolProficiency = 'Advanced';
    } else if (overallScore >= 50) {
      level = 'Practitioner';
      toolProficiency = 'Intermediate';
    } else {
      level = 'Explorer';
      toolProficiency = 'Beginner';
    }

    const evaluation: WritingEvaluation = {
      isGoodWork: overallScore >= 60,
      score: overallScore,
      criteria: {
        structure: Math.round(totalFamiliarity),
        professionalism: Math.round(totalFrequency),
        ai_utilization: Math.round(totalLevel),
        completeness: overallScore
      },
      feedback: `Based on your responses, you demonstrate ${level.toLowerCase()} level AI tool usage.`,
      suggestions: [
        level === 'Explorer' ? 'Start with basic AI features in familiar tools like Word' : 'Explore advanced automation features',
        level === 'Innovator' ? 'Consider mentoring others in AI tool usage' : 'Try integrating multiple AI tools in your workflow',
        'Focus on the tools you use most frequently for maximum impact'
      ],
      grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F',
      level,
      toolProficiency,
      toolUsages
    };

    setIsStepCompletedInternally(true);
    onComplete(evaluation);
  };

  const canComplete = toolUsages.some(usage => usage.familiarity > 0 || usage.frequency > 0 || usage.level > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI Tool Usage Assessment</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Rate your experience with these AI tools using the sliders below. 
          This will help us understand your current AI literacy level.
        </p>
      </div>

      {/* Tools Assessment */}
      <div className="space-y-6">
        {aiTools.map((tool) => {
          const usage = toolUsages.find(u => u.toolId === tool.id) || { familiarity: 0, frequency: 0, level: 0 };
          
          return (
            <div key={tool.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Familiarity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Familiarity: {usage.familiarity}%
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={usage.familiarity}
                      onChange={(e) => updateToolUsage(tool.id, 'familiarity', parseInt(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getSliderColor(usage.familiarity)} 0%, ${getSliderColor(usage.familiarity)} ${usage.familiarity}%, #e5e7eb ${usage.familiarity}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Never heard of it</span>
                    <span>Expert user</span>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Usage: {getFrequencyText(usage.frequency)}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={usage.frequency}
                      onChange={(e) => updateToolUsage(tool.id, 'frequency', parseInt(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getSliderColor(usage.frequency)} 0%, ${getSliderColor(usage.frequency)} ${usage.frequency}%, #e5e7eb ${usage.frequency}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Never</span>
                    <span>Daily</span>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Level: {getLevelText(usage.level)}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={usage.level}
                      onChange={(e) => updateToolUsage(tool.id, 'level', parseInt(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getSliderColor(usage.level)} 0%, ${getSliderColor(usage.level)} ${usage.level}%, #e5e7eb ${usage.level}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Manual</span>
                    <span>Automated</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <button
          onClick={calculateResults}
          disabled={!canComplete || isStepCompletedInternally}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Sliders className="w-5 h-5" />
          <span>Complete Assessment</span>
        </button>
      </div>

      {/* Completion Message */}
      {isStepCompletedInternally && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Assessment completed! You can proceed to the next step.</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid currentColor;
          cursor: pointer;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid currentColor;
          cursor: pointer;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }
        
        .slider {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default WritingAssessmentStep;