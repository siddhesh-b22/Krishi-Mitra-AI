import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { marked } from 'marked';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatViewProps {
    onBack: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are "Savi", a friendly and expert agricultural assistant for Indian farmers. Your name is Savi.
    - Your goal is to provide concise, actionable, and easy-to-understand advice.
    - Respond in simple language.
    - If asked a question not related to farming, politely steer the conversation back to agriculture.
    - Keep responses brief and to the point. Use bullet points or numbered lists for steps.
    - Start your first message with a friendly welcome message introducing yourself as Savi.`,
  },
});

export const ChatView: React.FC<ChatViewProps> = ({ onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        const fetchInitialMessage = async () => {
            setIsLoading(true);
            try {
                // Using a predefined hello to get the initial welcome message from the AI's system prompt
                const response = await chat.sendMessage({ message: "Hello" });
                setMessages([{ role: 'model', text: response.text }]);
            } catch (error) {
                console.error("Failed to get initial message:", error);
                setMessages([{ role: 'model', text: "Hello! I am Savi. How can I help you with your farming today?" }]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialMessage();
    }, []);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: input });
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    const parseMarkdown = (text: string) => {
        const rawMarkup = marked(text, { breaks: true });
        return { __html: rawMarkup };
    };

    return (
        <div className="container mx-auto max-w-3xl h-[calc(100vh-100px)] flex flex-col p-4">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold">Savi - Your AI Assistant</h2>
            </div>
            <div className="flex-grow bg-white border border-gray-200 rounded-lg shadow-inner overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <div className="prose" dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-gray-200 text-gray-800">
                           <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Savi anything about farming..."
                    className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black placeholder-gray-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    className="bg-green-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-green-700 disabled:bg-green-300"
                    disabled={isLoading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};