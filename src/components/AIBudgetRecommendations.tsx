'use client';

import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Transaction {
  type: "expense" | "income";
  title: string;
  category: string;
  amount: number;
}

interface AIBudgetRecommendationsProps {
  transactions: Transaction[];
  monthlyIncome: number;
  apiKey: string;
}

interface BudgetRecommendation {
  category: string;
  recommendedAmount: number;
  explanation: string;
}

interface AIResponse {
  recommendations: Array<{
    category: string;
    recommendedAmount: string | number;
    explanation: string;
  }>;
  generalAdvice: string;
}

const AIBudgetRecommendations: React.FC<AIBudgetRecommendationsProps> = ({ 
  transactions, 
  monthlyIncome,
  apiKey 
}) => {
  const [budgetRecommendations, setBudgetRecommendations] = useState<BudgetRecommendation[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdateId, setLastUpdateId] = useState<string>('');

  const getAIRecommendations = async (
    categorySpending: Record<string, number>,
    totalSpending: number,
    savingsRate: number
  ) => {
    if (!apiKey) return null;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `As a financial advisor, analyze this spending data and provide specific recommendations:
Monthly Income: ₹${monthlyIncome}
Total Spending: ₹${totalSpending}
Savings Rate: ${savingsRate.toFixed(1)}%

Category-wise Spending:
${Object.entries(categorySpending)
  .map(([category, amount]) => `${category}: ₹${amount} (${((amount/monthlyIncome)*100).toFixed(1)}% of income)`)
  .join('\n')}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "category": "category_name",
      "recommendedAmount": number,
      "explanation": "detailed_explanation"
    }
  ],
  "generalAdvice": "overall_financial_advice"
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]) as AIResponse;
        // Ensure all recommendedAmount values are numbers
        const validatedRecommendations = data.recommendations.map((rec) => ({
          ...rec,
          recommendedAmount: Number(rec.recommendedAmount) || 0
        }));
        return { recommendations: validatedRecommendations, generalAdvice: data.generalAdvice };
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    }
    return null;
  };

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setLoading(true);

        // Calculate category-wise spending
        const categorySpending = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, curr) => {
            // Ensure amount is a valid number
            const amount = typeof curr.amount === 'number' && !isNaN(curr.amount) ? curr.amount : 0;
            acc[curr.category] = (acc[curr.category] || 0) + amount;
            return acc;
          }, {} as Record<string, number>);

        const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
        const savingsRate = (monthlyIncome - totalSpending) / monthlyIncome * 100;

        // Create a unique update ID based on the current data
        const newUpdateId = JSON.stringify({ transactions, monthlyIncome });
        
        // Only update if data has changed
        if (newUpdateId !== lastUpdateId) {
          setLastUpdateId(newUpdateId);
          
          // Get AI-generated recommendations
          const aiResponse = await getAIRecommendations(categorySpending, totalSpending, savingsRate);

          if (aiResponse) {
            setBudgetRecommendations(aiResponse.recommendations);
            setGeneralAdvice(aiResponse.generalAdvice);
          } else {
            // Fallback to default recommendations if AI fails
            const defaultRecommendations = generateDefaultRecommendations(categorySpending, monthlyIncome);
            setBudgetRecommendations(defaultRecommendations);
            setGeneralAdvice(generateDefaultAdvice(savingsRate));
          }
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setGeneralAdvice('Unable to generate recommendations at the moment.');
        setBudgetRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (transactions.length > 0 && monthlyIncome > 0) {
      generateRecommendations();
    }
  }, [transactions, monthlyIncome, apiKey, lastUpdateId]);

  const generateDefaultRecommendations = (
    categorySpending: Record<string, number>,
    income: number
  ): BudgetRecommendation[] => {
    const budgetAllocations = {
      Housing: { percent: 0.33, explanation: 'Keep housing costs within 33% of income' },
      Food: { percent: 0.165, explanation: 'Allocate 16.5% for food and groceries' },
      Transportation: { percent: 0.11, explanation: 'Limit transportation to 11% of income' },
      Entertainment: { percent: 0.055, explanation: 'Keep entertainment within 5.5% of income' },
      Savings: { percent: 0.22, explanation: 'Aim to save 22% of your income' },
      Utilities: { percent: 0.11, explanation: 'Budget 11% for utilities and bills' },
      Other: { percent: 0.01, explanation: 'Keep miscellaneous expenses under 1% of income' }
    };

    return Object.entries(budgetAllocations).map(([category, { percent, explanation }]) => {
      const currentSpending = categorySpending[category] || 0;
      const recommendedAmount = income * percent;
      
      let adjustedExplanation = explanation;
      if (currentSpending > recommendedAmount * 1.1) {
        adjustedExplanation += `\nConsider reducing spending in this category (currently ${((currentSpending/income)*100).toFixed(1)}% of income)`;
      } else if (currentSpending < recommendedAmount * 0.9) {
        adjustedExplanation += `\nYou're under budget in this category (currently ${((currentSpending/income)*100).toFixed(1)}% of income)`;
      }

      return {
        category,
        recommendedAmount,
        explanation: adjustedExplanation
      };
    });
  };

  const generateDefaultAdvice = (savingsRate: number): string => {
    if (savingsRate < 20) {
      return '1. Aim to save at least 20% of your monthly income\n' +
             '2. Look for areas to reduce non-essential spending\n' +
             '3. Consider creating an emergency fund\n' +
             '4. Track your daily expenses to identify potential savings';
    } else if (savingsRate >= 20 && savingsRate < 30) {
      return '1. Great job maintaining a healthy savings rate!\n' +
             '2. Consider investing your surplus savings\n' +
             '3. Review your insurance coverage\n' +
             '4. Plan for long-term financial goals';
    } else {
      return `1. Excellent savings rate! You're saving ${savingsRate.toFixed(1)}% of your income\n` +
             '2. Consider diversifying your investments\n' +
             '3. Look into tax-advantaged investment options\n' +
             '4. Set up automatic savings transfers for consistency';
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-dark-text mb-6">AI Budget Recommendations</h2>
      
      {loading ? (
        <div className="animate-pulse text-dark-text">Analyzing your spending patterns...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetRecommendations.map((rec, index) => (
              <div key={`${rec.category}-${index}`} className="bg-dark-background p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-dark-text mb-2">{rec.category}</h3>
                <p className="text-primary-blue font-bold mb-2">
                  Recommended: ₹{typeof rec.recommendedAmount === 'number' ? rec.recommendedAmount.toFixed(2) : '0.00'}
                </p>
                <p className="text-dark-text text-sm whitespace-pre-line">{rec.explanation}</p>
              </div>
            ))}
          </div>

          {generalAdvice && (
            <div className="mt-6 bg-dark-background p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-dark-text mb-2">Key Recommendations</h3>
              <p className="text-dark-text whitespace-pre-line">{generalAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIBudgetRecommendations;
