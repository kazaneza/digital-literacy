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
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #1f2937; 
              line-height: 1.6;
              background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%);
              min-height: 100vh;
            }
            .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              color: white; 
              text-align: center; 
              padding: 40px 20px; 
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            .logo-section { position: relative; z-index: 1; margin-bottom: 20px; }
            .logo { font-size: 32px; font-weight: 800; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .subtitle { font-size: 16px; opacity: 0.9; font-weight: 500; }
            .report-title { font-size: 28px; font-weight: 700; margin: 20px 0 10px; position: relative; z-index: 1; }
            .report-date { font-size: 14px; opacity: 0.8; position: relative; z-index: 1; }
            
            .content { padding: 40px; }
            .summary { 
              background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); 
              padding: 30px; 
              border-radius: 16px; 
              margin-bottom: 40px;
              border: 1px solid #c7d2fe;
            }
            .summary h2 { color: #1e40af; font-size: 24px; margin-bottom: 25px; font-weight: 700; }
            .score-cards { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; }
            .score-card { 
              background: white; 
              text-align: center; 
              padding: 25px 20px; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 2px solid #e5e7eb;
              min-width: 180px;
              flex: 1;
            }
            .score-card h3 { color: #1f2937; font-size: 18px; margin-bottom: 10px; font-weight: 600; }
            .score-number { font-size: 36px; font-weight: 800; color: #3b82f6; margin: 10px 0; }
            .score-label { color: #6b7280; font-size: 14px; font-weight: 500; }
            .score-description { color: #6b7280; font-size: 12px; margin-top: 8px; line-height: 1.4; }
            
            .assessments-section h2 { color: #1f2937; font-size: 24px; margin-bottom: 25px; font-weight: 700; }
            .assessment { 
              margin-bottom: 25px; 
              padding: 25px; 
              border: 2px solid #e5e7eb; 
              border-radius: 12px; 
              background: white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .assessment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .assessment-title { 
              font-size: 20px; 
              font-weight: 700; 
              color: #1f2937; 
              display: flex; 
              align-items: center; 
              gap: 12px;
            }
            .assessment-number { 
              background: #3b82f6; 
              color: white; 
              width: 32px; 
              height: 32px; 
              border-radius: 8px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: 700; 
              font-size: 14px;
            }
            .assessment-score { 
              background: #dbeafe; 
              color: #1e40af; 
              padding: 8px 16px; 
              border-radius: 20px; 
              font-weight: 700; 
              font-size: 16px;
            }
            .assessment-description { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
            .criteria-section { margin-bottom: 15px; }
            .criteria-title { font-weight: 600; color: #374151; margin-bottom: 10px; }
            .criteria { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .criteria-item { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin: 8px 0; 
              padding: 4px 0;
            }
            .criteria-name { color: #6b7280; font-size: 14px; }
            .criteria-score { 
              background: #e0e7ff; 
              color: #3730a3; 
              padding: 4px 12px; 
              border-radius: 12px; 
              font-weight: 600; 
              font-size: 13px;
            }
            .feedback-section { border-top: 1px solid #e5e7eb; padding-top: 15px; }
            .feedback-title { font-weight: 600; color: #374151; margin-bottom: 8px; }
            .feedback-text { color: #6b7280; font-size: 14px; line-height: 1.6; }
            
            .recommendations { 
              background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); 
              padding: 30px; 
              border-radius: 16px; 
              margin-top: 40px;
              border: 1px solid #c7d2fe;
            }
            .recommendations h2 { color: #1e40af; font-size: 24px; margin-bottom: 25px; font-weight: 700; }
            .recommendations h3 { color: #1f2937; font-size: 18px; margin: 20px 0 15px; font-weight: 600; }
            .recommendations ul { margin: 0; padding-left: 0; list-style: none; }
            .recommendations li { 
              color: #374151; 
              margin: 10px 0; 
              padding-left: 25px; 
              position: relative; 
              line-height: 1.5;
            }
            .recommendations li::before { 
              content: '•'; 
              color: #3b82f6; 
              font-weight: bold; 
              position: absolute; 
              left: 0; 
              font-size: 18px;
            }
            
            .footer { 
              background: #f8fafc; 
              text-align: center; 
              padding: 30px 20px; 
              border-top: 1px solid #e5e7eb; 
              color: #6b7280; 
              font-size: 13px;
            }
            .footer p { margin: 5px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-section">
                <div class="logo">🏦 Bank of Kigali</div>
                <div class="subtitle">Digital Literacy Program</div>
              </div>
              <div class="report-title">AI Literacy Assessment Report</div>
              <div class="report-date">Assessment completed on ${getCurrentDate()}</div>
            </div>

            <div class="content">
              <div class="summary">
                <h2>Executive Summary</h2>
                <div class="score-cards">
                  <div class="score-card">
                    <h3>${levelInfo.level}</h3>
                    <div class="score-number">${overallScore}%</div>
                    <div class="score-label">Overall AI Literacy Score</div>
                    <div class="score-description">${levelInfo.description}</div>
                  </div>
                  <div class="score-card">
                    <h3>${automationReadiness.level}</h3>
                    <div class="score-label">Automation Interest</div>
                    <div class="score-description">
                      ${automationReadiness.level === 'High' ? 'Eager to adopt AI automation' :
                        automationReadiness.level === 'Medium' ? 'Selective about AI adoption' :
                        automationReadiness.level === 'Low' ? 'Prefers traditional methods' :
                        'Assessment not completed'}
                    </div>
                  </div>
                  <div class="score-card">
                    <div class="score-number">${Object.keys(results).length}</div>
                    <div class="score-label">Assessments Completed</div>
                    <div class="score-description">Out of 5 total assessments</div>
                  </div>
                </div>
              </div>

              <div class="assessments-section">
                <h2>Detailed Assessment Results</h2>
                
                ${results.promptEngineering ? `
                  <div class="assessment">
                    <div class="assessment-header">
                      <div class="assessment-title">
                        <div class="assessment-number">1</div>
                        <span>Prompt Engineering</span>
                      </div>
                      <div class="assessment-score">${results.promptEngineering.score}%</div>
                    </div>
                    <div class="assessment-description">AI prompting skills and instruction clarity</div>
                    <div class="criteria-section">
                      <div class="criteria-title">Performance Breakdown:</div>
                      <div class="criteria">
                        ${Object.entries(results.promptEngineering.criteria).map(([criterion, score]) => 
                          `<div class="criteria-item">
                            <span class="criteria-name">${criterion}:</span>
                            <span class="criteria-score">${score}%</span>
                          </div>`
                        ).join('')}
                      </div>
                    </div>
                    <div class="feedback-section">
                      <div class="feedback-title">Feedback:</div>
                      <div class="feedback-text">${results.promptEngineering.feedback}</div>
                    </div>
                  </div>
                ` : ''}
                
                ${results.writingAssessment ? `
                  <div class="assessment">
                    <div class="assessment-header">
                      <div class="assessment-title">
                        <div class="assessment-number">2</div>
                        <span>AI Tool Usage Assessment</span>
                      </div>
                      <div class="assessment-score">${results.writingAssessment.score}%</div>
                    </div>
                    <div class="assessment-description">Familiarity and usage of AI productivity tools</div>
                    <div class="feedback-section">
                      <div class="feedback-title">Feedback:</div>
                      <div class="feedback-text">${results.writingAssessment.feedback}</div>
                    </div>
                  </div>
                ` : ''}
                
                ${results.taskManagement ? `
                  <div class="assessment">
                    <div class="assessment-header">
                      <div class="assessment-title">
                        <div class="assessment-number">3</div>
                        <span>Task Management & Workflow</span>
                      </div>
                      <div class="assessment-score">${results.taskManagement.score}%</div>
                    </div>
                    <div class="assessment-description">AI-enhanced project management and workflow optimization</div>
                    <div class="criteria-section">
                      <div class="criteria-title">Performance Breakdown:</div>
                      <div class="criteria">
                        ${Object.entries(results.taskManagement.criteria).map(([criterion, score]) => 
                          `<div class="criteria-item">
                            <span class="criteria-name">${criterion.replace('_', ' ')}:</span>
                            <span class="criteria-score">${score}%</span>
                          </div>`
                        ).join('')}
                      </div>
                    </div>
                    <div class="feedback-section">
                      <div class="feedback-title">Feedback:</div>
                      <div class="feedback-text">${results.taskManagement.feedback}</div>
                    </div>
                  </div>
                ` : ''}
                
                ${results.dataAnalysis ? `
                  <div class="assessment">
                    <div class="assessment-header">
                      <div class="assessment-title">
                        <div class="assessment-number">4</div>
                        <span>Data Analysis & Visualization</span>
                      </div>
                      <div class="assessment-score">${results.dataAnalysis.score}%</div>
                    </div>
                    <div class="assessment-description">AI-powered data analysis and business intelligence</div>
                    <div class="criteria-section">
                      <div class="criteria-title">Performance Breakdown:</div>
                      <div class="criteria">
                        ${Object.entries(results.dataAnalysis.criteria).map(([criterion, score]) => 
                          `<div class="criteria-item">
                            <span class="criteria-name">${criterion.replace('_', ' ')}:</span>
                            <span class="criteria-score">${score}%</span>
                          </div>`
                        ).join('')}
                      </div>
                    </div>
                    <div class="criteria-section">
                      <div class="criteria-title">Recommended Tools:</div>
                      <div style="margin-top: 8px;">
                        ${results.dataAnalysis.recommended_tools.slice(0, 4).map(tool => 
                          `<span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px; display: inline-block; margin-bottom: 4px;">${tool}</span>`
                        ).join('')}
                      </div>
                    </div>
                    <div class="feedback-section">
                      <div class="feedback-title">Feedback:</div>
                      <div class="feedback-text">${results.dataAnalysis.feedback}</div>
                    </div>
                  </div>
                ` : ''}
                
                ${results.productivity ? `
                  <div class="assessment">
                    <div class="assessment-header">
                      <div class="assessment-title">
                        <div class="assessment-number">5</div>
                        <span>AI Automation Interest</span>
                      </div>
                      <div class="assessment-score">${results.productivity.score}%</div>
                    </div>
                    <div class="assessment-description">Interest and readiness for AI automation tools</div>
                    <div class="criteria-section">
                      <div class="criteria-title">Automation Preferences:</div>
                      <div class="feedback-text">Survey responses indicate ${automationReadiness.level.toLowerCase()} interest in AI-powered workflow automation</div>
                    </div>
                    <div class="feedback-section">
                      <div class="feedback-title">Feedback:</div>
                      <div class="feedback-text">${results.productivity.feedback}</div>
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="recommendations">
                <h2>Development Recommendations</h2>
                <h3>Immediate Actions</h3>
                <ul>
                  ${overallScore >= 75 ? `
                    <li>Lead AI adoption initiatives within your team</li>
                    <li>Explore advanced AI applications in your field</li>
                    <li>Consider mentoring others in AI tool usage</li>
                  ` : overallScore >= 50 ? `
                    <li>Practice more complex AI prompting techniques</li>
                    <li>Experiment with different AI tools for various tasks</li>
                    <li>Focus on improving weaker assessment areas</li>
                  ` : `
                    <li>Take additional training on AI fundamentals</li>
                    <li>Practice basic prompting techniques regularly</li>
                    <li>Start with simple AI tools and gradually advance</li>
                  `}
                </ul>
                
                <h3>Long-term Development</h3>
                <ul>
                  <li>Stay updated with latest AI developments</li>
                  <li>Participate in Bank of Kigali's AI training programs</li>
                  <li>Build a portfolio of AI-enhanced work examples</li>
                  <li>Network with other AI practitioners in the organization</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p><strong>© 2025 Bank of Kigali Digital Literacy Program</strong></p>
              <p>This assessment is designed to evaluate and improve AI literacy skills across the organization</p>
            </div>
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