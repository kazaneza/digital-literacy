import React from 'react';
import BKLogo from './BKLogo';
import QRCode from './QRCode';
import AssessmentLevels from './AssessmentLevels';
import { Smartphone, Monitor, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment }) => {
  // Get current URL for QR code
  const currentUrl = window.location.href;
  const assessmentUrl = `${currentUrl}?page=assessment`;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col overflow-hidden">
  {/* Main content fills available space minus footer */}
  <div className="flex-1 flex flex-col justify-between container mx-auto px-4 py-6">
    
    {/* Header */}
    <div className="flex justify-center mb-8">
      <BKLogo />
    </div>

    {/* Assessment Options */}
    <div className="grid lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
      {/* Mobile Option */}
      <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center flex flex-col justify-center">
  <div className="flex items-center justify-center mb-4">
    <div className="bg-blue-100 p-4 rounded-full">
      <Smartphone className="w-10 h-10 text-blue-600" />
    </div>
  </div>
  <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
    Take on Mobile
  </h3>
  <p className="text-sm lg:text-base text-gray-600 mb-6">
    Scan the QR code below with your phone camera to start the assessment on your mobile device.
  </p>
  <QRCode value={assessmentUrl} size={150} />
</div>


      {/* Desktop Option */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-12 text-center flex flex-col justify-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <Monitor className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6">
          Continue on Desktop
        </h3>
        <p className="text-base lg:text-lg text-gray-600 mb-8 lg:mb-12">
          Take the assessment right here on your computer for a full-screen experience.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onStartAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 lg:px-12 py-4 lg:py-6 rounded-lg text-lg lg:text-xl font-semibold flex items-center space-x-3 lg:space-x-4 transition-colors shadow-md hover:shadow-lg"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    
    {/* Footer */}
    <div className="text-center py-4 lg:py-6 border-t border-gray-200 bg-white/50">
      <p className="text-gray-500">
        © 2025 Bank of Kigali Digital Literacy Program.
      </p>
    </div>
  </div>
</div>
  );
};

export default LandingPage;