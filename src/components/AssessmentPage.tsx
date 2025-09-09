import React from 'react';
import BKLogo from './BKLogo';
import DataTable from './DataTable';
import PromptEvaluator from './PromptEvaluator';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface AssessmentPageProps {
  onBackToLanding: () => void;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex justify-center flex-1">
            <BKLogo />
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
        
        {/* Assessment Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">AI Literacy Assessment</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your ability to create effective AI prompts by analyzing the data below and crafting a prompt to answer the question.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Data Table */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Employee Database</h3>
            <DataTable />
          </div>

          {/* Prompt Evaluator */}
          <div>
            <PromptEvaluator />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200 bg-white/50 mt-12">
        <p className="text-gray-500">
          © 2025 Bank of Kigali Digital Literacy Program.
        </p>
      </div>
    </div>
  );
};

export default AssessmentPage;