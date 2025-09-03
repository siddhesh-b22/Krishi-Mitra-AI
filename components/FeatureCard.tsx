import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 border border-gray-200 h-full flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    >
      <div className="flex-shrink-0 mb-4 flex items-center">
        <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 flex-grow">{description}</p>
    </button>
  );
};