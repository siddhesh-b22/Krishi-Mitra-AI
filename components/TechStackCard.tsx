
import React from 'react';

interface TechStackCardProps {
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

export const TechStackCard: React.FC<TechStackCardProps> = ({ name, category, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden text-center p-6 border border-gray-200 flex flex-col items-center">
      <div className="w-16 h-16 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-sm font-semibold text-green-600 mb-2">{category}</p>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};
