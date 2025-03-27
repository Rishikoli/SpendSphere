'use client';

import React, { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Transaction {
  type: 'expense' | 'income';
  title: string;
  category: string;
  amount: number;
}

interface FinancialAssistantProps {
  transactions: Transaction[];
  monthlyIncome: number;
  apiKey: string;
}

interface AIInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
}

const FinancialAssistant: React.FC<FinancialAssistantProps> = ({ 
  transactions, 
  monthlyIncome,
  apiKey 
}) => {
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);

  const getAIInsight = async () => {
    if (!apiKey || transactions.length === 0) return;

    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Get recent transactions (last 5)
      const recentTransactions = transactions.slice(-5);
      
      const prompt = `As an AI financial assistant, analyze these recent transactions and provide a key financial insight that will help improve financial health:
      Monthly Income: ₹${monthlyIncome}
      Recent Transactions:
      ${recentTransactions.map(t => 
        `${t.type}: ${t.title} - ₹${t.amount} (${t.category})`
      ).join('\n')}

      Provide the insight in this JSON format:
      {
        "title": "short_impactful_title",
        "description": "actionable_advice_with_specific_numbers",
        "type": "positive/warning/neutral"
      }
      
      Make the insight specific, actionable, and based on actual transaction patterns.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const insight = JSON.parse(jsonMatch[0]);
        setAiInsight(insight);
      }
    } catch (error) {
      console.error('Error getting AI insight:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAIInsight();
  }, [transactions]);

  return (
    <div className="w-full p-6">
      <div className="flex flex-col items-center">
        {/* AI Insight Orb */}
        <div className="relative mb-8">
          <div className={`
            w-64 h-64 rounded-full 
            bg-gradient-to-br transition-all duration-500
            flex items-center justify-center
            cursor-pointer hover:scale-105 transform
            ${loading ? 'animate-pulse' : ''}
            ${aiInsight?.type === 'positive' ? 'from-green-400 to-blue-500' :
              aiInsight?.type === 'warning' ? 'from-orange-400 to-red-500' :
              'from-blue-400 to-purple-500'}
          `}>
            {/* Glass effect overlay */}
            <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative p-6 text-center text-white">
              {loading ? (
                <div className="flex items-center justify-center">
                  <FaSync className="animate-spin text-2xl" />
                </div>
              ) : aiInsight ? (
                <>
                  <h3 className="text-xl font-bold mb-3">{aiInsight.title}</h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    {aiInsight.description}
                  </p>
                </>
              ) : (
                <p className="text-sm opacity-90">
                  No recent transactions to analyze
                </p>
              )}
            </div>
          </div>

          {/* Decorative rings */}
          <div className="absolute -inset-4 rounded-full border-2 border-white/20 animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-white/10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-dark-text mb-2">
          Financial Assistant
        </h2>
        <p className="text-sm text-dark-text/60 text-center max-w-md">
          Your AI-powered financial companion. Get real-time insights and recommendations based on your spending patterns.
        </p>
      </div>
    </div>
  );
};

export default FinancialAssistant;
