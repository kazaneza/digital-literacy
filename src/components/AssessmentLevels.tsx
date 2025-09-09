import React from 'react';
import { Search, Wrench, Lightbulb } from 'lucide-react';

const AssessmentLevels: React.FC = () => {
  const levels = [
    {
      icon: Search,
      title: "Explorer",
      description: "Beginning your AI journey with curiosity and basic understanding",
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200"
    },
    {
      icon: Wrench,
      title: "Practitioner", 
      description: "Actively using AI tools and applying them in daily work",
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: Lightbulb,
      title: "Innovator",
      description: "Leading AI initiatives and creating innovative solutions",
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="w-full max-w-4xl">
      <div className="grid md:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const IconComponent = level.icon;
          return (
            <div 
              key={index}
              className={`bg-white rounded-xl p-6 border-2 ${level.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 rounded-lg ${level.color} flex items-center justify-center mb-4`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {level.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {level.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentLevels;