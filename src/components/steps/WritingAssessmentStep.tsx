import React, { useState } from 'react';
import { FileText, CheckCircle, Sliders, MousePointer, Target } from 'lucide-react';

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
}

interface WritingAssessmentStepProps {
  onComplete: (results: WritingEvaluation) => void;
  isCompleted: boolean;
}

const WritingAssessmentStep: React.FC<WritingAssessmentStepProps> = ({ onComplete, isCompleted }) => {
  const [currentSection, setCurrentSection] = useState<'tools' | 'ranking' | 'results'>('tools');
  const [toolUsages, setToolUsages] = useState<ToolUsage[]>([]);
  const [rankedTools, setRankedTools] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);

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

  const initializeToolUsages = () => {
    if (toolUsages.length === 0) {
      const initialUsages = aiTools.map(tool => ({
        toolId: tool.id,
        familiarity: 0,
        frequency: 0,
        level: 0
      }));
      setToolUsages(initialUsages);
      setRankedTools(aiTools.map(tool => tool.id));
    }
  };

  React.useEffect(() => {
    initializeToolUsages();
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

  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    setDraggedItem(toolId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = rankedTools.indexOf(draggedItem);
    const newRankedTools = [...rankedTools];
    newRankedTools.splice(draggedIndex, 1);
    newRankedTools.splice(targetIndex, 0, draggedItem);
    
    setRankedTools(newRankedTools);
    setDraggedItem(null);
  };

  const calculateResults = () => {
    // Calculate overall scores
    const totalFamiliarity = toolUsages.reduce((sum, usage) => sum + usage.familiarity, 0) / toolUsages.length;
    const totalFrequency = toolUsages.reduce((sum, usage) => sum + usage.frequency, 0) / toolUsages.length;
    const totalLevel = toolUsages.reduce((sum, usage) => sum + usage.level, 0) / toolUsages.length;
    
    // Calculate weighted score based on tool ranking
    const weightedScore = rankedTools.reduce((score, toolId, index) => {
      const usage = toolUsages.find(u => u.toolId === toolId);
      if (!usage) return score;
      
      const weight = (rankedTools.length - index) / rankedTools.length; // Higher rank = higher weight
      const toolScore = (usage.familiarity + usage.frequency + usage.level) / 3;
      return score + (toolScore * weight);
    }, 0) / rankedTools.length;

    const overallScore = Math.round((totalFamiliarity + totalFrequency + totalLevel + weightedScore) / 4);

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

    const mockEvaluation: WritingEvaluation = {
      isGoodWork: overallScore >= 60,
      score: overallScore,
      criteria: {
        structure: Math.round(totalFamiliarity),
        professionalism: Math.round(totalFrequency),
        ai_utilization: Math.round(totalLevel),
        completeness: Math.round(weightedScore)
      },
      feedback: `Based on your responses, you demonstrate ${level.toLowerCase()} level AI tool usage. Your strongest area appears to be ${totalLevel > totalFrequency ? 'automation level' : 'usage frequency'}.`,
      suggestions: [
        level === 'Explorer' ? 'Start with basic AI features in familiar tools like Word' : 'Explore advanced automation features',
        level === 'Innovator' ? 'Consider mentoring others in AI tool usage' : 'Try integrating multiple AI tools in your workflow',
        'Focus on the tools you ranked highest for maximum impact'
      ],
      grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F',
      level,
      toolProficiency
    };

    setEvaluation(mockEvaluation);
    setCurrentSection('results');
    onComplete(mockEvaluation);
  };

  const renderToolsSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Rate Your AI Tool Experience</h3>
        <p className="text-gray-600">Use the sliders to indicate your familiarity, usage frequency, and automation level for each tool.</p>
      </div>

      <div className="space-y-6">
        {aiTools.map((tool) => {
          const usage = toolUsages.find(u => u.toolId === tool.id) || { familiarity: 0, frequency: 0, level: 0 };
          
          return (
            <div key={tool.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Familiarity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Familiarity: {usage.familiarity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={usage.familiarity}
                    onChange={(e) => updateToolUsage(tool.id, 'familiarity', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Never heard of it</span>
                    <span>Expert user</span>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage: {getFrequencyText(usage.frequency)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={usage.frequency}
                    onChange={(e) => updateToolUsage(tool.id, 'frequency', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Never</span>
                    <span>Daily</span>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level: {getLevelText(usage.level)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={usage.level}
                    onChange={(e) => updateToolUsage(tool.id, 'level', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Manual</span>
                    <span>Automated</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentSection('ranking')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <MousePointer className="w-5 h-5" />
          <span>Next: Rank Tools</span>
        </button>
      </div>
    </div>
  );

  const renderRankingSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Rank Tools by Importance</h3>
        <p className="text-gray-600">Drag and drop to rank these AI tools by how important they are to your work (most important at top).</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-3">
          {rankedTools.map((toolId, index) => {
            const tool = aiTools.find(t => t.id === toolId)!;
            const usage = toolUsages.find(u => u.toolId === toolId)!;
            const avgScore = Math.round((usage.familiarity + usage.frequency + usage.level) / 3);
            
            return (
              <div
                key={toolId}
                draggable
                onDragStart={(e) => handleDragStart(e, toolId)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`bg-white rounded-lg border-2 p-4 cursor-move transition-all ${
                  draggedItem === toolId ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="text-xl">{tool.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                      <p className="text-sm text-gray-600">Avg Score: {avgScore}%</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection('tools')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Tools
        </button>
        <button
          onClick={calculateResults}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Target className="w-5 h-5" />
          <span>Get My AI Level</span>
        </button>
      </div>
    </div>
  );

  const renderResultsSection = () => {
    if (!evaluation) return null;

    const getLevelColor = (level: string) => {
      if (level === 'Innovator') return 'text-purple-600 bg-purple-100 border-purple-300';
      if (level === 'Practitioner') return 'text-blue-600 bg-blue-100 border-blue-300';
      return 'text-green-600 bg-green-100 border-green-300';
    };

    const getLevelIcon = (level: string) => {
      if (level === 'Innovator') return '🚀';
      if (level === 'Practitioner') return '⚡';
      return '🌱';
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{getLevelIcon(evaluation.level)}</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Your AI Literacy Level</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 font-bold text-xl ${getLevelColor(evaluation.level)}`}>
                {evaluation.level}
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-600">Tool Proficiency: {evaluation.toolProficiency}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Your AI Tool Usage Profile</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Usage Breakdown</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tool Familiarity:</span>
                  <span className="font-semibold">{evaluation.criteria.structure}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Usage Frequency:</span>
                  <span className="font-semibold">{evaluation.criteria.professionalism}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Automation Level:</span>
                  <span className="font-semibold">{evaluation.criteria.ai_utilization}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Score:</span>
                  <span className="font-bold text-lg">{evaluation.score}%</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-3">Your Top 3 Tools</h5>
              <div className="space-y-2">
                {rankedTools.slice(0, 3).map((toolId, index) => {
                  const tool = aiTools.find(t => t.id === toolId)!;
                  const usage = toolUsages.find(u => u.toolId === toolId)!;
                  const avgScore = Math.round((usage.familiarity + usage.frequency + usage.level) / 3);
                  
                  return (
                    <div key={toolId} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <span className="font-bold text-gray-500">#{index + 1}</span>
                      <span>{tool.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">{tool.name}</span>
                        <span className="ml-2 text-sm text-gray-600">({avgScore}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-700 mb-3">Feedback & Recommendations</h5>
            <p className="text-gray-600 mb-4">{evaluation.feedback}</p>
            
            <div className="space-y-2">
              {evaluation.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Assessment completed! You can proceed to the next step.</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI Tool Usage Assessment</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Help us understand your current AI tool experience and usage patterns. 
          This interactive assessment will determine your AI literacy level.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          currentSection === 'tools' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <Sliders className="w-4 h-4" />
          <span>Rate Tools</span>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          currentSection === 'ranking' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <MousePointer className="w-4 h-4" />
          <span>Rank Tools</span>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          currentSection === 'results' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <Target className="w-4 h-4" />
          <span>Results</span>
        </div>
      </div>

      {/* Content */}
      {currentSection === 'tools' && renderToolsSection()}
      {currentSection === 'ranking' && renderRankingSection()}
      {currentSection === 'results' && renderResultsSection()}
    </div>
  );
};

export default WritingAssessmentStep;