import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { marked } from 'marked';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface FeatureViewProps {
    onBack: () => void;
    title: string;
    systemInstruction: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const FeatureView: React.FC<FeatureViewProps> = ({ onBack, title, systemInstruction }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    useEffect(() => {
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(newChat);
    }, [systemInstruction]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchInitialMessage = async () => {
            if (!chat) return;
            setIsLoading(true);
            try {
                const response = await chat.sendMessage({ message: "Hello" });
                setMessages([{ role: 'model', text: response.text }]);
            } catch (error) {
                console.error("Failed to get initial message:", error);
                setMessages([{ role: 'model', text: `Welcome to ${title}. How can I assist you?` }]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialMessage();
    }, [chat, title]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

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
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <div className="flex-grow bg-white border border-gray-200 rounded-lg shadow-inner overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <div className="prose" dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
                        </div>
                    </div>
                ))}
                 {isLoading && messages.length > 0 && (
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
                    placeholder={`Ask about ${title}...`}
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