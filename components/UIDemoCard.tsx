
import React from 'react';

interface UIDemoCardProps {
  title: string;
  imageUrl: string;
  description: string;
}

export const UIDemoCard: React.FC<UIDemoCardProps> = ({ title, imageUrl, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group border border-gray-200">
      <div className="overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
};
