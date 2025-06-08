
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { CartItem, GeminiSuggestion } from '../types';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

interface GeminiAssistantProps {
  cartItems: CartItem[];
  onClose: () => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ cartItems, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GeminiSuggestion[]>([]);
  const [apiKeyExists, setApiKeyExists] = useState(true);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyExists(false);
      setError("Gemini API Key (API_KEY environment variable) is not configured. AI features are disabled.");
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (!apiKeyExists) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const cartItemNames = cartItems.map(item => `${item.name} (Quantity: ${item.quantity})`).join(', ');
    let promptText = "You are a helpful shopping assistant. ";
    if (cartItems.length > 0) {
      promptText += `Based on the following items in the shopping cart: ${cartItemNames}. `;
      promptText += "Provide 2-3 concise and actionable shopping tips or healthy meal ideas. Format your response as a JSON array of objects, where each object has a 'title' (string, short and catchy) and a 'suggestion' (string, 1-2 sentences). Example: [{'title': 'Smart Snacking', 'suggestion': 'Apples are great for snacks. Pair them with almond butter for a protein boost.'}]";
    } else {
      promptText += "Provide 2-3 general smart shopping tips for groceries. Format your response as a JSON array of objects, where each object has a 'title' (string, short and catchy) and a 'suggestion' (string, 1-2 sentences).";
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const parsedSuggestions: GeminiSuggestion[] = JSON.parse(jsonStr);
      if (Array.isArray(parsedSuggestions) && parsedSuggestions.every(s => s.title && s.suggestion)) {
        setSuggestions(parsedSuggestions);
      } else {
        throw new Error("Received malformed suggestions from AI.");
      }

    } catch (e: any) {
      console.error("Error fetching suggestions from Gemini:", e);
      setError(`Failed to get suggestions. ${e.message || 'Please try again.'}`);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, apiKeyExists]); // fetchSuggestions depends on cartItems

  useEffect(() => {
    // Fetch suggestions when the modal opens and API key exists
    if (apiKeyExists) {
        fetchSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSuggestions, apiKeyExists]); // Re-run if fetchSuggestions changes (due to cartItems change) or apiKeyExists status changes.


  return (
    <Modal isOpen={true} onClose={onClose} title="AI Shopping Assistant" size="lg">
      {!apiKeyExists && error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Configuration Error</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-40">
          <LoadingSpinner />
          <p className="mt-2 text-gray-600">Thinking of some great ideas for you...</p>
        </div>
      )}

      {!isLoading && error && apiKeyExists && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Oops! Something went wrong.</p>
          <p>{error}</p>
          <Button onClick={fetchSuggestions} variant="danger" className="mt-2">Try Again</Button>
        </div>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">Here are some suggestions based on your cart:</p>
          {suggestions.map((s, index) => (
            <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-700 text-lg mb-1">{s.title}</h4>
              <p className="text-indigo-600 text-sm">{s.suggestion}</p>
            </div>
          ))}
          <Button onClick={fetchSuggestions} variant="primary" className="mt-4">Get New Suggestions</Button>
        </div>
      )}

      {!isLoading && !error && suggestions.length === 0 && apiKeyExists && (
         <div className="text-center py-4">
            <p className="text-gray-500">No suggestions available right now. Try again?</p>
            <Button onClick={fetchSuggestions} variant="primary" className="mt-2">Get Suggestions</Button>
        </div>
      )}

    </Modal>
  );
};

export default GeminiAssistant;
