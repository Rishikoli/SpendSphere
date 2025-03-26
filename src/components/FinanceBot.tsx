'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Transaction {
  type: 'expense' | 'income';
  title: string;
  amount: number;
  category: string;
  date: Date | string;
}

interface FinanceBotProps {
  apiKey: string;
  transactions: Transaction[];
  monthlyIncome: number;
}

const FinanceBot: React.FC<FinanceBotProps> = ({ apiKey, transactions, monthlyIncome }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I am your personal finance assistant. I can help you with:\n\n• Analyzing your spending patterns\n• Providing budget recommendations\n• Answering questions about your finances\n• Offering financial tips and insights\n\nHow can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContext = () => {
    const context = {
      transactions: transactions.slice(-5), // Last 5 transactions
      monthlyIncome: monthlyIncome,
      totalSpent: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    };
    return JSON.stringify(context);
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages: Message[] = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const context = generateContext();
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful financial assistant.Limited answer in 100 words. Use this context to help answer the question: ${context}\n\nUser question: ${userMessage}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      // Check if the response is valid and contains the expected data
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const assistantMessage = data.candidates[0].content.parts[0].text;

      setMessages([...newMessages, { role: 'assistant' as const, content: assistantMessage }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessages([
        ...newMessages,
        { role: 'assistant' as const, content: `Sorry, I encountered an error: ${errorMessage}. Please try again later.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-card rounded-lg shadow-lg h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
        <FaRobot className="text-primary-purple text-xl" />
        <h2 className="text-xl font-bold text-dark-text">Finance Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* <h1 className="text-xl font-bold text-dark-text">Chat with Finance Assistant</h1> */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-purple text-white'
                  : 'bg-dark-background text-dark-text'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-background text-dark-text max-w-[70%] rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            id="finance-bot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your finances..."
            className="flex-1 bg-dark-background text-dark-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceBot;
