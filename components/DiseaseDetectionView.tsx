import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';

interface DiseaseDetectionViewProps {
    onBack: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const DiseaseDetectionView: React.FC<DiseaseDetectionViewProps> = ({ onBack }) => {
    const [image, setImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!supportedTypes.includes(file.type)) {
                setError("Unsupported file type. Please upload a PNG, JPEG, or WEBP image.");
                setImage(null);
                setResult(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];

            const imagePart = {
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            };

            const textPart = {
                text: `You are an expert in plant pathology specializing in Indian agriculture. 
                Analyze this image of a crop leaf. 
                1. Identify the disease if present. If you are confident, state the name of the disease clearly.
                2. Describe the common symptoms of this disease.
                3. Suggest 2-3 practical organic and chemical treatment options suitable for Indian farmers.
                4. Provide a confidence score (e.g., High, Medium, Low) for your diagnosis.
                If the image is not a plant leaf or is too unclear to analyze, state that and ask for a better picture.
                Format the response using markdown.`
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            
            setResult(response.text);

        } catch (err) {
            console.error("Error analyzing image:", err);
            setError("Failed to analyze the image. The AI model may be temporarily unavailable. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const parseMarkdown = (text: string) => {
        const rawMarkup = marked(text, { breaks: true });
        return { __html: rawMarkup };
    };

    return (
        <div className="container mx-auto max-w-3xl p-4">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold">AI Disease Detection</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full mb-4 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition"
                >
                    {image ? "Change Image" : "Upload Crop Leaf Image"}
                </button>

                {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}

                {image && (
                    <div className="mb-4 text-center">
                        <img src={image} alt="Uploaded crop leaf" className="max-w-sm max-h-80 mx-auto rounded-lg shadow-sm" />
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={!image || isLoading}
                    className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? "Analyzing..." : "Analyze for Disease"}
                </button>

                {isLoading && (
                    <div className="text-center mt-6">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600">AI is analyzing the image. This may take a moment...</p>
                    </div>
                )}
                
                {result && (
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Analysis Result:</h3>
                        <div className="prose max-w-none" dangerouslySetInnerHTML={parseMarkdown(result)} />
                    </div>
                )}
            </div>
        </div>
    );
};