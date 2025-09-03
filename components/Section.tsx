
import React from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            {icon}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
};
