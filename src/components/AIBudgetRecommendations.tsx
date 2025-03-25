'use client';

import React, { useEffect, useState } from 'react';

interface Transaction {
  type: "expense" | "income";
  title: string;
  category: string;
  amount: number;
}

interface AIBudgetRecommendationsProps {
  transactions: Transaction[];
  monthlyIncome: number;
}

interface BudgetRecommendation {
  category: string;
  recommendedAmount: number;
  explanation: string;
}

const AIBudgetRecommendations: React.FC<AIBudgetRecommendationsProps> = ({ transactions, monthlyIncome }) => {
  const [budgetRecommendations, setBudgetRecommendations] = useState<BudgetRecommendation[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setLoading(true);

        // Calculate category-wise spending
        const categorySpending = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
          }, {} as Record<string, number>);

        // Generate recommendations based on spending patterns
        const recommendations: BudgetRecommendation[] = [];
        const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);

        // Calculate recommended budgets based on common financial rules
        if (categorySpending['Housing']) {
          recommendations.push({
            category: 'Housing',
            recommendedAmount: monthlyIncome * 0.3,
            explanation: 'Keep housing costs within 30% of income'
          });
        }

        if (categorySpending['Food']) {
          recommendations.push({
            category: 'Food',
            recommendedAmount: monthlyIncome * 0.15,
            explanation: 'Allocate 15% for food and groceries'
          });
        }

        if (categorySpending['Transportation']) {
          recommendations.push({
            category: 'Transportation',
            recommendedAmount: monthlyIncome * 0.10,
            explanation: 'Limit transportation to 10% of income'
          });
        }

        if (categorySpending['Entertainment']) {
          recommendations.push({
            category: 'Entertainment',
            recommendedAmount: monthlyIncome * 0.05,
            explanation: 'Keep entertainment within 5% of income'
          });
        }

        setBudgetRecommendations(recommendations);

        // Generate general advice based on spending patterns
        const savingsRate = (monthlyIncome - totalSpending) / monthlyIncome * 100;
        let advice = '';

        if (savingsRate < 20) {
          advice = '1. Aim to save at least 20% of your monthly income\n' +
                  '2. Look for areas to reduce non-essential spending\n' +
                  '3. Consider creating an emergency fund\n' +
                  '4. Track your daily expenses to identify potential savings';
        } else {
          advice = '1. Great job maintaining a healthy savings rate!\n' +
                  '2. Consider investing your surplus savings\n' +
                  '3. Review your insurance coverage\n' +
                  '4. Plan for long-term financial goals';
        }

        setGeneralAdvice(advice);
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
  }, [transactions, monthlyIncome]);

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-dark-text mb-6">AI Budget Recommendations</h2>
      
      {loading ? (
        <div className="animate-pulse text-dark-text">Analyzing your spending patterns...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetRecommendations.map((rec, index) => (
              <div key={index} className="bg-dark-background p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-dark-text mb-2">{rec.category}</h3>
                <p className="text-primary-blue font-bold mb-2">
                  Recommended: ₹{rec.recommendedAmount.toFixed(2)}
                </p>
                <p className="text-dark-text text-sm">{rec.explanation}</p>
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
