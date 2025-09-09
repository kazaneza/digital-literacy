import React from 'react';

const BKLogo: React.FC = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-2">
        <img 
          src="/brand-logo (31).png" 
          alt="Bank of Kigali Logo" 
          className="w-14 h-14 object-contain"
        />
        <div className="text-left flex flex-col">
          <h1 className="text-2xl font-bold text-blue-900">Bank of Kigali</h1>
          <p className="text-sm text-gray-600 font-medium">Digital Literacy Program</p>
        </div>
      </div>
    </div>
  );
};

export default BKLogo;