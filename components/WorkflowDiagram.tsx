
import React from 'react';

const WorkflowStep: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full text-4xl mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Arrow: React.FC = () => (
    <div className="flex-1 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </div>
);

export const WorkflowDiagram: React.FC = () => {
    const steps = [
        { icon: '❓', title: '1. Farmer Asks Query', description: 'Using voice or text in their local language via the mobile app.' },
        { icon: '🧠', title: '2. AI Processing', description: 'NLP understands the query; the system fetches relevant data (weather, market, etc.).' },
        { icon: '💡', title: '3. Actionable Response', description: 'AI generates a clear, concise answer and personalized advice.' },
        { icon: '💾', title: '4. History & Learning', description: 'The interaction is saved to personalize future advice and improve the AI model.' },
        { icon: '🔔', title: '5. Proactive Alerts', description: 'The system sends timely alerts about weather, pests, or market changes based on user data.' },
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="hidden md:flex items-stretch justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.title}>
                        <div className="flex-1 max-w-[18%]">
                            <WorkflowStep {...step} />
                        </div>
                        {index < steps.length - 1 && <Arrow />}
                    </React.Fragment>
                ))}
            </div>
             <div className="md:hidden space-y-8">
                {steps.map((step) => <WorkflowStep key={step.title} {...step} />)}
            </div>
        </div>
    );
};
