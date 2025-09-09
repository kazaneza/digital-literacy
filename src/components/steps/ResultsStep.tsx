import React from 'react';
import { Trophy, Award, Target, TrendingUp, Home } from 'lucide-react';
import { AssessmentResults } from '../AssessmentFlow';

interface ResultsStepProps {
  results: AssessmentResults;
  onBackToLanding: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ results, onBackToLanding }) => {
  const calculateOverallScore = () => {
    const scores = [];
    if (results.promptEngineering?.score) scores.push(results.promptEngineering.score);
    if (results.writingAssessment?.score) scores.push(results.writingAssessment.score);
    if (results.taskManagement?.score) scores.push(results.taskManagement.score);
    if (results.dataAnalysis?.score) scores.push(results.dataAnalysis.score);
    
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getOverallLevel = (score: number) => {
    if (score >= 85) return { level: 'Innovator', color: 'text-purple-600 bg-purple-100', icon: Trophy };
    if (score >= 70) return { level: 'Practitioner', color: 'text-blue-600 bg-blue-100', icon: Award };
    return { level: 'Explorer', color: 'text-green-600 bg-green-100', icon: Target };
  };

  const overallScore = calculateOverallScore();
  const levelInfo = getOverallLevel(overallScore);
  const LevelIcon = levelInfo.icon;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
        </div>
        <p className="text-lg text-gray-600">
          Congratulations on completing the AI Literacy Assessment!
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${levelInfo.color} mb-4`}>
          <LevelIcon className="w-6 h-6" />
          <span className="text-xl font-bold">{levelInfo.level}</span>
        </div>
        <div className="text-4xl font-bold text-gray-800 mb-2">{overallScore}%</div>
        <div className="text-lg text-gray-600">Overall AI Literacy Score</div>
      </div>

      {/* Individual Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Prompt Engineering Results */}
        {results.promptEngineering && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <span>Prompt Engineering</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.promptEngineering.score)}`}>
                  {results.promptEngineering.score}%
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">Criteria Breakdown:</span>
                {Object.entries(results.promptEngineering.criteria).map(([criterion, score]) => (
                  <div key={criterion} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 capitalize">{criterion}:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score as number)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.promptEngineering.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Writing Assessment Results */}
        {results.writingAssessment && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <span>Writing & Document Automation</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grade:</span>
                <span className={`px-3 py-1 rounded-lg border-2 font-bold ${
                  results.writingAssessment.grade === 'A' ? 'text-green-600 bg-green-100 border-green-300' :
                  results.writingAssessment.grade === 'B' ? 'text-blue-600 bg-blue-100 border-blue-300' :
                  results.writingAssessment.grade === 'C' ? 'text-yellow-600 bg-yellow-100 border-yellow-300' :
                  'text-red-600 bg-red-100 border-red-300'
                }`}>
                  {results.writingAssessment.grade}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.writingAssessment.score)}`}>
                  {results.writingAssessment.score}%
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">Criteria Breakdown:</span>
                {Object.entries(results.writingAssessment.criteria).map(([criterion, score]) => (
                  <div key={criterion} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 capitalize">{criterion.replace('_', ' ')}:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score as number)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.writingAssessment.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Management Results */}
        {results.taskManagement && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <span>Task Management & Workflow</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grade:</span>
                <span className={`px-3 py-1 rounded-lg border-2 font-bold ${
                  results.taskManagement.grade === 'A' ? 'text-green-600 bg-green-100 border-green-300' :
                  results.taskManagement.grade === 'B' ? 'text-blue-600 bg-blue-100 border-blue-300' :
                  results.taskManagement.grade === 'C' ? 'text-yellow-600 bg-yellow-100 border-yellow-300' :
                  'text-red-600 bg-red-100 border-red-300'
                }`}>
                  {results.taskManagement.grade}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Efficiency:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  results.taskManagement.efficiency_rating === 'Excellent' ? 'text-green-600 bg-green-100' :
                  results.taskManagement.efficiency_rating === 'Good' ? 'text-blue-600 bg-blue-100' :
                  results.taskManagement.efficiency_rating === 'Fair' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {results.taskManagement.efficiency_rating}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.taskManagement.score)}`}>
                  {results.taskManagement.score}%
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">Criteria Breakdown:</span>
                {Object.entries(results.taskManagement.criteria).map(([criterion, score]) => (
                  <div key={criterion} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 capitalize">{criterion.replace('_', ' ')}:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score as number)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.taskManagement.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Analysis Results */}
        {results.dataAnalysis && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">4</span>
              </div>
              <span>Data Analysis & Visualization</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grade:</span>
                <span className={`px-3 py-1 rounded-lg border-2 font-bold ${
                  results.dataAnalysis.grade === 'A' ? 'text-green-600 bg-green-100 border-green-300' :
                  results.dataAnalysis.grade === 'B' ? 'text-blue-600 bg-blue-100 border-blue-300' :
                  results.dataAnalysis.grade === 'C' ? 'text-yellow-600 bg-yellow-100 border-yellow-300' :
                  'text-red-600 bg-red-100 border-red-300'
                }`}>
                  {results.dataAnalysis.grade}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Insight Quality:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  results.dataAnalysis.insight_quality === 'Excellent' ? 'text-green-600 bg-green-100' :
                  results.dataAnalysis.insight_quality === 'Good' ? 'text-blue-600 bg-blue-100' :
                  results.dataAnalysis.insight_quality === 'Fair' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {results.dataAnalysis.insight_quality}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.dataAnalysis.score)}`}>
                  {results.dataAnalysis.score}%
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">Criteria Breakdown:</span>
                {Object.entries(results.dataAnalysis.criteria).map(([criterion, score]) => (
                  <div key={criterion} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 capitalize">{criterion.replace('_', ' ')}:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score as number)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">Recommended Tools:</span>
                <div className="flex flex-wrap gap-1">
                  {results.dataAnalysis.recommended_tools.slice(0, 3).map((tool, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.dataAnalysis.feedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps & Recommendations</h3>
        <div className="space-y-3">
          {overallScore >= 85 ? (
            <>
              <p className="text-gray-700">🎉 Excellent work! You demonstrate advanced AI literacy skills.</p>
              <p className="text-gray-700">• Consider mentoring others in AI tool usage</p>
              <p className="text-gray-700">• Explore advanced AI applications in your field</p>
              <p className="text-gray-700">• Stay updated with the latest AI developments</p>
            </>
          ) : overallScore >= 70 ? (
            <>
              <p className="text-gray-700">👍 Good progress! You have solid foundational AI skills.</p>
              <p className="text-gray-700">• Practice more complex prompting techniques</p>
              <p className="text-gray-700">• Experiment with different AI tools for various tasks</p>
              <p className="text-gray-700">• Focus on improving weaker areas identified in the assessment</p>
            </>
          ) : (
            <>
              <p className="text-gray-700">🌱 Great start! Continue building your AI literacy foundation.</p>
              <p className="text-gray-700">• Take additional training on AI fundamentals</p>
              <p className="text-gray-700">• Practice basic prompting techniques regularly</p>
              <p className="text-gray-700">• Start with simple AI tools and gradually advance</p>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onBackToLanding}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 mx-auto transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;