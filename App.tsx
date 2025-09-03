import React, { useState } from 'react';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { FeatureCard } from './components/FeatureCard';
import { UIDemoCard } from './components/UIDemoCard';
import { ChatView } from './components/ChatView';
import { DiseaseDetectionView } from './components/DiseaseDetectionView';
import { FeatureView } from './components/FeatureView';
import { 
  ChatIcon, CropIcon, MarketIcon, PestIcon, SchemeIcon, 
  CameraScanIcon, SoilIcon, ImpactIcon
} from './constants';

type ViewState = 
  | { name: 'home' }
  | { name: 'chat' }
  | { name: 'disease' }
  | { name: 'feature'; id: string; title: string; systemInstruction: string };

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ name: 'home' });

  const featureSystemInstructions: { [key: string]: string } = {
    market: `You are "Mandi Mitra", an AI expert on Indian agricultural market prices. Provide current prices for crops from nearby Mandis when asked. Also, offer a short-term price forecast. If the user doesn't provide a location, ask for it. Keep responses concise and formatted in a table if possible. Start your first message with a welcome and ask which crop price they're interested in.`,
    crop: `You are "Fasal Salahkaar", an AI crop advisory expert for Indian farmers. Provide personalized advice on crop selection, sowing times, and irrigation methods. Ask for the user's location and soil type if not provided to give tailored recommendations. Start your first message with a welcome and ask about their farm.`,
    soil: `You are "Bhumi Guide", a smart soil health advisor. Provide recommendations on fertilizers, nutrient management, and organic practices to improve soil health and crop yield. Ask about the user's crop and soil test results if available for better advice. Start your first message with a welcome and ask how you can help with their soil.`,
    alerts: `You are "Mausam Chetna", a weather and pest alert AI. Provide the latest weather forecasts for a user's location. Also, give information on potential pest threats for their specific crops and suggest preventative measures. Ask for location and crop type. Start with a welcome and ask for their location to provide alerts.`,
    scheme: `You are "Yojana Jankari", an AI assistant specializing in Indian government agricultural schemes. Explain schemes, subsidies, and insurance options in simple terms. Help the user understand eligibility and application processes. Start with a welcome and ask which scheme they'd like to know about.`,
  };

  const coreFeatures = [
    { id: 'disease', title: 'AI-Powered Disease Detection', description: 'Take a photo of a crop leaf and our AI will help identify diseases, suggesting immediate remedies to protect your harvest.', icon: <CameraScanIcon /> },
    { id: 'chat', title: 'Ask Savi - Your AI Assistant', description: 'Ask any general farming question in your local language. Savi provides instant, easy-to-understand answers.', icon: <ChatIcon /> },
    { id: 'market', title: 'Live Mandi Prices & Forecasts', description: 'Get real-time market prices from your nearby Mandis. Our AI predicts future prices to help you sell at the best time.', icon: <MarketIcon /> },
    { id: 'crop', title: 'Personalized Crop Advisory', description: 'Receive tailored advice on which crops to plant, when to sow, and how to irrigate, based on your farm\'s location and soil type.', icon: <CropIcon /> },
    { id: 'soil', title: 'Smart Soil Health Advisory', description: 'Understand your soil\'s needs. Get recommendations on fertilizers and nutrients to improve soil health and increase yield.', icon: <SoilIcon /> },
    { id: 'alerts', title: 'Weather & Pest Alerts', description: 'Receive timely alerts about upcoming bad weather, potential pest attacks, and disease outbreaks in your area.', icon: <PestIcon /> },
    { id: 'scheme', title: 'Government Scheme Info', description: 'Easily find and understand government schemes, subsidies, and insurance options that can benefit you.', icon: <SchemeIcon /> },
  ];
  
  const uiDemos = [
    { title: 'AI Disease Scan', imageUrl: 'https://placehold.co/400x700/e2f5e5/166534?text=Leaf+Scan\n\n[+]\n\nTap+to+identify+disease', description: 'A simple camera interface. Just point and shoot at a diseased leaf to get an instant analysis and solution.' },
    { title: 'Chat with Savi', imageUrl: 'https://placehold.co/400x700/e2f5e5/166534?text=AI+Assistant\n\nAsk+me+anything\nin+your+language', description: 'An intuitive chat interface with voice input support, allowing farmers to ask questions naturally in their local language.' },
    { title: 'Market Dashboard', imageUrl: 'https://placehold.co/400x700/e2f5e5/166534?text=Mandi+Prices\n\nTomato:+₹25/kg+▲\nOnion:+₹18/kg+▼', description: 'Visualizes current and predicted prices for various crops in nearby markets (mandis) with easy-to-read charts.' },
    { title: 'Weather & Pest Alerts', imageUrl: 'https://placehold.co/400x700/e2f5e5/166534?text=Weather+Alert\n\nHeavy+Rain\nExpected+in+2+hours', description: 'Push notifications and a dedicated section for timely alerts on adverse weather conditions and potential pest threats.' },
  ];

  const handleFeatureClick = (feature: typeof coreFeatures[0]) => {
    if (feature.id === 'chat') {
      setView({ name: 'chat' });
    } else if (feature.id === 'disease') {
      setView({ name: 'disease' });
    } else {
      const systemInstruction = featureSystemInstructions[feature.id];
      if (systemInstruction) {
        setView({ 
          name: 'feature', 
          id: feature.id,
          title: feature.title,
          systemInstruction: systemInstruction,
        });
      } else {
        alert('This feature is coming soon!');
      }
    }
  };

  const renderHome = () => (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Your Smart Farming Assistant
          </h1>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Get instant, data-driven advice for a better, more profitable harvest. Krishi Mitra AI is here to help you every step of the way.
          </p>
          <button 
            onClick={() => setView({ name: 'chat' })}
            className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition duration-300 text-lg shadow-lg">
            Ask Savi
          </button>
        </section>

        <Section title="Real-Time Features for Your Farm" icon={<CropIcon />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map(feature => (
              <FeatureCard 
                key={feature.id} 
                {...feature} 
                onClick={() => handleFeatureClick(feature)} 
              />
            ))}
          </div>
        </Section>
        
        <Section title="How The App Helps You" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {uiDemos.map(demo => <UIDemoCard key={demo.title} {...demo} />)}
          </div>
        </Section>
        
        <Section title="Benefits for Your Farm" icon={<ImpactIcon />}>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <ul className="space-y-4 text-lg text-gray-700 list-disc list-inside">
                    <li><span className="font-semibold">Increase Your Yield:</span> Make smarter decisions with data-driven insights to optimize every crop cycle.</li>
                    <li><span className="font-semibold">Improve Your Profit:</span> Reduce costs by using the right amount of fertilizer and protect crops from pests. Sell at the best market prices.</li>
                    <li><span className="font-semibold">Reduce Farming Risks:</span> Get early warnings for bad weather and diseases, giving you time to act and protect your farm.</li>
                    <li><span className="font-semibold">Promote Sustainable Farming:</span> Use resources like water and fertilizers more efficiently for a healthier farm and environment.</li>
                </ul>
            </div>
        </Section>
      </main>
      <footer className="text-center py-6 bg-gray-100 mt-12">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Krishi Mitra AI. A Concept for a Better Farming Future.</p>
      </footer>
    </>
  );

  const renderContent = () => {
    switch (view.name) {
      case 'chat':
        return <ChatView onBack={() => setView({ name: 'home' })} />;
      case 'disease':
        return <DiseaseDetectionView onBack={() => setView({ name: 'home' })} />;
      case 'feature':
        return <FeatureView 
                  onBack={() => setView({ name: 'home' })} 
                  title={view.title} 
                  systemInstruction={view.systemInstruction} 
                />;
      default:
        return renderHome();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      {renderContent()}
    </div>
  );
}

export default App;