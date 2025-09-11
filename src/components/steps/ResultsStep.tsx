import React from 'react';
import { Trophy, Award, Target, TrendingUp, Home, FileText, Download, Share2 } from 'lucide-react';
import { AssessmentResults } from '../AssessmentFlow';
import BKLogo from '../BKLogo';

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
    if (results.productivity?.score) scores.push(results.productivity.score);
    
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getOverallLevel = (score: number) => {
    if (score >= 75) return { level: 'Innovator', color: 'text-purple-600 bg-purple-100', icon: Trophy, description: 'Advanced AI user ready to lead digital transformation' };
    if (score >= 50) return { level: 'Practitioner', color: 'text-blue-600 bg-blue-100', icon: Award, description: 'Competent AI user with solid foundational skills' };
    return { level: 'Explorer', color: 'text-green-600 bg-green-100', icon: Target, description: 'Beginning AI journey with curiosity and basic understanding' };
  };

  const overallScore = calculateOverallScore();
  const levelInfo = getOverallLevel(overallScore);
  const LevelIcon = levelInfo.icon;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAutomationReadiness = () => {
    if (results.productivity?.score) {
      if (results.productivity.score >= 75) return { level: 'High', color: 'text-green-600 bg-green-100' };
      if (results.productivity.score >= 50) return { level: 'Medium', color: 'text-blue-600 bg-blue-100' };
      return { level: 'Low', color: 'text-orange-600 bg-orange-100' };
    }
    return { level: 'Not Assessed', color: 'text-gray-600 bg-gray-100' };
  };

  const handleDownloadReport = () => {
    // Create a printable version by opening a new window with print styles
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Literacy Assessment Report - Bank of Kigali</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .subtitle { color: #6b7280; font-size: 14px; }
            .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .score-card { display: inline-block; text-align: center; margin: 10px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .assessment { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .assessment-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
            .criteria { margin: 10px 0; }
            .criteria-item { display: flex; justify-content: space-between; margin: 5px 0; }
            .recommendations { background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏦 Bank of Kigali</div>
            <div class="subtitle">Digital Literacy Program</div>
            <h1>AI Literacy Assessment Report</h1>
            <p>Assessment completed on ${getCurrentDate()}</p>
          </div>

          <div class="summary">
            <h2>Executive Summary</h2>
            <div class="score-card">
              <h3>${levelInfo.level}</h3>
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${overallScore}%</div>
              <div>Overall AI Literacy Score</div>
            </div>
            <div class="score-card">
              <h3>${automationReadiness.level}</h3>
              <div>Automation Interest</div>
            </div>
            <div class="score-card">
              <h3>${Object.keys(results).length}</h3>
              <div>Assessments Completed</div>
            </div>
          </div>

          <div>
            <h2>Detailed Assessment Results</h2>
            ${results.promptEngineering ? `
              <div class="assessment">
                <div class="assessment-title">1. Prompt Engineering - ${results.promptEngineering.score}%</div>
                <div class="criteria">
                  ${Object.entries(results.promptEngineering.criteria).map(([criterion, score]) => 
                    `<div class="criteria-item"><span>${criterion}:</span><span>${score}%</span></div>`
                  ).join('')}
                </div>
                <p><strong>Feedback:</strong> ${results.promptEngineering.feedback}</p>
              </div>
            ` : ''}
            
            ${results.writingAssessment ? `
              <div class="assessment">
                <div class="assessment-title">2. AI Tool Usage Assessment - ${results.writingAssessment.score}%</div>
                <p><strong>Assessment:</strong> Familiarity and usage of AI productivity tools</p>
                <p><strong>Feedback:</strong> ${results.writingAssessment.feedback}</p>
              </div>
            ` : ''}
            
            ${results.taskManagement ? `
              <div class="assessment">
                <div class="assessment-title">3. Task Management & Workflow - ${results.taskManagement.score}%</div>
                <div class="criteria">
                  ${Object.entries(results.taskManagement.criteria).map(([criterion, score]) => 
                    `<div class="criteria-item"><span>${criterion.replace('_', ' ')}:</span><span>${score}%</span></div>`
                  ).join('')}
                </div>
                <p><strong>Feedback:</strong> ${results.taskManagement.feedback}</p>
              </div>
            ` : ''}
            
            ${results.dataAnalysis ? `
              <div class="assessment">
                <div class="assessment-title">4. Data Analysis & Visualization - ${results.dataAnalysis.score}%</div>
                <div class="criteria">
                  ${Object.entries(results.dataAnalysis.criteria).map(([criterion, score]) => 
                    `<div class="criteria-item"><span>${criterion.replace('_', ' ')}:</span><span>${score}%</span></div>`
                  ).join('')}
                </div>
                <p><strong>Recommended Tools:</strong> ${results.dataAnalysis.recommended_tools.slice(0, 3).join(', ')}</p>
                <p><strong>Feedback:</strong> ${results.dataAnalysis.feedback}</p>
              </div>
            ` : ''}
            
            ${results.productivity ? `
              <div class="assessment">
                <div class="assessment-title">5. AI Automation Interest - ${results.productivity.score}%</div>
                <p><strong>Assessment:</strong> Interest and readiness for AI automation tools</p>
                <p><strong>Automation Readiness:</strong> ${automationReadiness.level}</p>
                <p><strong>Feedback:</strong> ${results.productivity.feedback}</p>
              </div>
            ` : ''}
          </div>

          <div class="recommendations">
            <h2>Development Recommendations</h2>
            <h3>Immediate Actions</h3>
            ${overallScore >= 75 ? `
              <ul>
                <li>Lead AI adoption initiatives within your team</li>
                <li>Explore advanced AI applications in your field</li>
                <li>Consider mentoring others in AI tool usage</li>
              </ul>
            ` : overallScore >= 50 ? `
              <ul>
                <li>Practice more complex AI prompting techniques</li>
                <li>Experiment with different AI tools for various tasks</li>
                <li>Focus on improving weaker assessment areas</li>
              </ul>
            ` : `
              <ul>
                <li>Take additional training on AI fundamentals</li>
                <li>Practice basic prompting techniques regularly</li>
                <li>Start with simple AI tools and gradually advance</li>
              </ul>
            `}
            
            <h3>Long-term Development</h3>
            <ul>
              <li>Stay updated with latest AI developments</li>
              <li>Participate in Bank of Kigali's AI training programs</li>
              <li>Build a portfolio of AI-enhanced work examples</li>
              <li>Network with other AI practitioners in the organization</li>
            </ul>
          </div>

          <div class="footer">
            <p>© 2025 Bank of Kigali Digital Literacy Program</p>
            <p>This assessment is designed to evaluate and improve AI literacy skills across the organization</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    // Auto-trigger print dialog
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const automationReadiness = getAutomationReadiness();

  return (
    <div className="space-y-8">
      {/* Header with Logo */}
      <div className="text-center border-b border-gray-200 pb-8">
        <div className="flex justify-center mb-6">
          <BKLogo />
        </div>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">AI Literacy Assessment Report</h1>
        </div>
        <p className="text-lg text-gray-600 mb-2">
          Comprehensive evaluation of AI skills and automation readiness
        </p>
        <p className="text-sm text-gray-500">
          Assessment completed on {getCurrentDate()}
        </p>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Executive Summary</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Overall AI Literacy Level */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full ${levelInfo.color} mb-4`}>
              <LevelIcon className="w-5 h-5" />
              <span className="font-bold">{levelInfo.level}</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{overallScore}%</div>
            <div className="text-sm text-gray-600">Overall AI Literacy Score</div>
            <p className="text-xs text-gray-500 mt-2">{levelInfo.description}</p>
          </div>

          {/* Automation Readiness */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${automationReadiness.color} mb-4`}>
              <span className="font-bold">{automationReadiness.level}</span>
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-2">Automation Interest</div>
            <div className="text-sm text-gray-600">Readiness for AI Tools</div>
            <p className="text-xs text-gray-500 mt-2">
              {automationReadiness.level === 'High' ? 'Eager to adopt AI automation' :
               automationReadiness.level === 'Medium' ? 'Selective about AI adoption' :
               automationReadiness.level === 'Low' ? 'Prefers traditional methods' :
               'Assessment not completed'}
            </p>
          </div>

          {/* Assessments Completed */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Object.keys(results).length}
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-2">Assessments</div>
            <div className="text-sm text-gray-600">Completed</div>
            <p className="text-xs text-gray-500 mt-2">Out of 5 total assessments</p>
          </div>
        </div>
      </div>

      {/* Detailed Assessment Results */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Assessment Results</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Prompt Engineering */}
          {results.promptEngineering && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <span>Prompt Engineering</span>
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.promptEngineering.score)}`}>
                  {results.promptEngineering.score}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Assessment:</strong> AI prompting skills and instruction clarity
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Performance Breakdown:</span>
                  {Object.entries(results.promptEngineering.criteria).map(([criterion, score]) => (
                    <div key={criterion} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 capitalize">{criterion}:</span>
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

          {/* Writing Assessment */}
          {results.writingAssessment && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <span>AI Tool Usage Assessment</span>
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.writingAssessment.score)}`}>
                  {results.writingAssessment.score}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Assessment:</strong> Familiarity and usage of AI productivity tools
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Tool Proficiency:</span>
                  <div className="text-sm text-gray-600">
                    Evaluated across Microsoft Office AI features, Canva, ChatGPT, and other productivity tools
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {results.writingAssessment.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Task Management */}
          {results.taskManagement && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">3</span>
                  </div>
                  <span>Task Management & Workflow</span>
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.taskManagement.score)}`}>
                  {results.taskManagement.score}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Assessment:</strong> AI-enhanced project management and workflow optimization
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Performance Breakdown:</span>
                  {Object.entries(results.taskManagement.criteria).map(([criterion, score]) => (
                    <div key={criterion} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 capitalize">{criterion.replace('_', ' ')}:</span>
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

          {/* Data Analysis */}
          {results.dataAnalysis && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">4</span>
                  </div>
                  <span>Data Analysis & Visualization</span>
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.dataAnalysis.score)}`}>
                  {results.dataAnalysis.score}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Assessment:</strong> AI-powered data analysis and business intelligence
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Performance Breakdown:</span>
                  {Object.entries(results.dataAnalysis.criteria).map(([criterion, score]) => (
                    <div key={criterion} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 capitalize">{criterion.replace('_', ' ')}:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Recommended Tools:</span>
                  <div className="flex flex-wrap gap-1">
                    {results.dataAnalysis.recommended_tools.slice(0, 4).map((tool, index) => (
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

          {/* Productivity/Automation Interest */}
          {results.productivity && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">5</span>
                  </div>
                  <span>AI Automation Interest</span>
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(results.productivity.score)}`}>
                  {results.productivity.score}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Assessment:</strong> Interest and readiness for AI automation tools
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Automation Preferences:</span>
                  <div className="text-sm text-gray-600">
                    Survey responses indicate {automationReadiness.level.toLowerCase()} interest in AI-powered workflow automation
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {results.productivity.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Immediate Actions</h3>
            <div className="space-y-2">
              {overallScore >= 75 ? (
                <>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Lead AI adoption initiatives within your team</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Explore advanced AI applications in your field</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Consider mentoring others in AI tool usage</span>
                  </p>
                </>
              ) : overallScore >= 50 ? (
                <>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Practice more complex AI prompting techniques</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Experiment with different AI tools for various tasks</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Focus on improving weaker assessment areas</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Take additional training on AI fundamentals</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Practice basic prompting techniques regularly</span>
                  </p>
                  <p className="text-gray-700 flex items-start space-x-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Start with simple AI tools and gradually advance</span>
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Long-term Development</h3>
            <div className="space-y-2">
              <p className="text-gray-700 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Stay updated with latest AI developments</span>
              </p>
              <p className="text-gray-700 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Participate in Bank of Kigali's AI training programs</span>
              </p>
              <p className="text-gray-700 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Build a portfolio of AI-enhanced work examples</span>
              </p>
              <p className="text-gray-700 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Network with other AI practitioners in the organization</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-gray-200 pt-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </button>
        </div>
        
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold mx-auto transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Return to Home</span>
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>© 2025 Bank of Kigali Digital Literacy Program</p>
          <p>This assessment is designed to evaluate and improve AI literacy skills across the organization</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;