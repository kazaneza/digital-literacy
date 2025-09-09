import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
  // Generate QR code using a public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <img 
          src={qrCodeUrl} 
          alt="QR Code to join assessment" 
          className="w-48 h-48"
        />
      </div>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code with your phone to start the assessment
      </p>
    </div>
  );
};

export default QRCode;