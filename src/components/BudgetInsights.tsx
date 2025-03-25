import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface BudgetData {
  category: string;
  currentSpent: number;
  budgetLimit: number;
}

interface BudgetInsightsProps {
  budgets: BudgetData[];
}

const BudgetInsights: React.FC<BudgetInsightsProps> = ({ budgets }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const budgetSummary = budgets.map(budget => {
          const percentageUsed = (budget.currentSpent / budget.budgetLimit) * 100;
          return `${budget.category}: ${percentageUsed.toFixed(1)}% used (${budget.currentSpent}/${budget.budgetLimit})`;
        }).join('\n');

        const prompt = `Analyze this budget data and provide a brief, actionable insight (max 2 sentences):
        ${budgetSummary}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setInsights(text);
      } catch (error) {
        setInsights('Unable to generate insights. Please check your API key and try again.');
        console.error('Error generating insights:', error);
      } finally {
        setLoading(false);
      }
    };

    if (budgets.length > 0) {
      generateInsights();
    }
  }, [budgets]);

  return (
    <div className="bg-dark-card p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-dark-text mb-2">AI Budget Insights</h3>
      <div className="text-dark-text">
        {loading ? (
          <div className="animate-pulse">Analyzing your budget...</div>
        ) : (
          <p>{insights}</p>
        )}
      </div>
    </div>
  );
};

export default BudgetInsights;
