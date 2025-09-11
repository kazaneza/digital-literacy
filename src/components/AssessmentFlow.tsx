import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import PromptEngineeringStep from './steps/PromptEngineeringStep';
import WritingAssessmentStep from './steps/WritingAssessmentStep';
import TaskManagementStep from './steps/TaskManagementStep';
import DataAnalysisStep from './steps/DataAnalysisStep';
import ProductivityStep from './steps/ProductivityStep';
import ResultsStep from './steps/ResultsStep';

export interface AssessmentResults {
  promptEngineering?: {
    score: number;
    isGoodPrompt: boolean;
    feedback: string;
    criteria: any;
  };
  writingAssessment?: {
    score: number;
    grade: string;
    isGoodWork: boolean;
    feedback: string;
    criteria: any;
    suggestions: string[];
  };
  taskManagement?: {
    score: number;
    grade: string;
    isGoodApproach: boolean;
    feedback: string;
    criteria: any;
    suggestions: string[];
    efficiency_rating: string;
  };
  dataAnalysis?: {
    score: number;
    grade: string;
    isGoodAnalysis: boolean;
    feedback: string;
    criteria: any;
    suggestions: string[];
    insight_quality: string;
    recommended_tools: string[];
  };
  presentations?: {
    score: number;
    grade: string;
    isGoodPresentation: boolean;
    feedback: string;
    criteria: any;
    suggestions: string[];
    engagement_level: string;
    recommended_tools: string[];
  };
  productivity?: {
    score: number;
    grade: string;
    isGoodAutomation: boolean;
    feedback: string;
    criteria: any;
    suggestions: string[];
    efficiency_gain: string;
    recommended_tools: string[];
    implementation_timeline: string;
  };
}

interface AssessmentFlowProps {
  onBackToLanding: () => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onBackToLanding }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<AssessmentResults>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps = [
    { id: 1, title: 'Prompt Engineering', description: 'Test your AI prompting skills' },
    { id: 2, title: 'Writing & Document Automation', description: 'Create professional documents with AI' },
    { id: 3, title: 'Task Management & Workflow', description: 'Optimize processes with AI tools' },
    { id: 4, title: 'Data Analysis & Visualization', description: 'AI-powered data insights and visualization' },
    { id: 5, title: 'Workflow Automation', description: 'Automate processes and boost productivity' },
    { id: 6, title: 'Results', description: 'View your assessment results' }
  ];

  const handleStepComplete = (stepId: number, stepResults: any) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    if (stepId === 1) {
      setResults(prev => ({ ...prev, promptEngineering: stepResults }));
    } else if (stepId === 2) {
      setResults(prev => ({ ...prev, writingAssessment: stepResults }));
    } else if (stepId === 3) {
      setResults(prev => ({ ...prev, taskManagement: stepResults }));
    } else if (stepId === 4) {
      setResults(prev => ({ ...prev, dataAnalysis: stepResults }));
    } else if (stepId === 5) {
      setResults(prev => ({ ...prev, productivity: stepResults }));
    }
  };

  const canProceedToNext = () => {
    return completedSteps.has(currentStep);
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PromptEngineeringStep
            onComplete={(results) => handleStepComplete(1, results)}
            isCompleted={completedSteps.has(1)}
          />
        );
      case 2:
        return (
          <WritingAssessmentStep
            onComplete={(results) => handleStepComplete(2, results)}
            isCompleted={completedSteps.has(2)}
          />
        );
      case 3:
        return (
          <TaskManagementStep
            onComplete={(results) => handleStepComplete(3, results)}
            isCompleted={completedSteps.has(3)}
          />
        );
      case 4:
        return (
          <DataAnalysisStep
            onComplete={(results) => handleStepComplete(4, results)}
            isCompleted={completedSteps.has(4)}
          />
        );
      case 5:
        return (
          <ProductivityStep
            onComplete={(results) => handleStepComplete(5, results)}
            isCompleted={completedSteps.has(5)}
          />
        );
      case 6:
        return (
          <ResultsStep
            results={results}
            onBackToLanding={onBackToLanding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : completedSteps.has(step.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-800">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      completedSteps.has(step.id) ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentFlow;