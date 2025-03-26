'use client';

import React, { useState } from 'react';
import { FaMagic, FaSync } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Transaction {
  type: 'expense' | 'income';
  title: string;
  category: string;
  amount: number;
}

interface AIBudgetPlannerProps {
  transactions: Transaction[];
  monthlyIncome: number;
  apiKey: string;
}

interface BudgetPlan {
  category: string;
  plannedAmount: number;
  notes: string;
}

const AIBudgetPlanner: React.FC<AIBudgetPlannerProps> = ({ transactions, monthlyIncome, apiKey }) => {
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBudgetPlan = async () => {
    if (!apiKey || isGenerating) return;

    try {
      setIsGenerating(true);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Calculate current spending patterns
      const categorySpending = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
          const amount = typeof curr.amount === 'number' && !isNaN(curr.amount) ? curr.amount : 0;
          acc[curr.category] = (acc[curr.category] || 0) + amount;
          return acc;
        }, {} as Record<string, number>);

      const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
      const savingsRate = ((monthlyIncome - totalSpending) / monthlyIncome) * 100;

      const prompt = `As a financial planner, create a detailed monthly budget plan based on:
Monthly Income: ₹${monthlyIncome}
Current Total Spending: ₹${totalSpending}
Current Savings Rate: ${savingsRate.toFixed(1)}%

Current Category Spending:
${Object.entries(categorySpending)
  .map(([category, amount]) => `${category}: ₹${amount} (${((amount/monthlyIncome)*100).toFixed(1)}%)`)
  .join('\n')}

Create a budget plan in this JSON format:
{
  "budgetPlans": [
    {
      "category": "category_name",
      "plannedAmount": number,
      "notes": "detailed_explanation_and_tips"
    }
  ]
}

Consider:
1. Maintaining a healthy savings rate (20-30% of income)
2. Essential expenses prioritization
3. Lifestyle and discretionary spending balance
4. Long-term financial goals
5. Emergency fund allocation`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        // Ensure all plannedAmount values are numbers
        const validatedPlans = data.budgetPlans.map((plan: any) => ({
          ...plan,
          plannedAmount: Number(plan.plannedAmount) || 0
        }));
        setBudgetPlans(validatedPlans);
      }
    } catch (error) {
      console.error('Error generating budget plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-text">AI Budget Planner</h2>
        <button
          onClick={generateBudgetPlan}
          className={`bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 ${
            isGenerating ? 'opacity-75 cursor-wait' : ''
          }`}
          disabled={isGenerating}
        >
          {isGenerating ? <FaSync className="animate-spin" /> : <FaMagic />}
          {isGenerating ? 'Generating...' : 'Generate Budget Plan'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetPlans.map((plan, index) => (
          <div
            key={`${plan.category}-${index}`}
            className="bg-dark-background p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-dark-text mb-2">{plan.category}</h3>
            <p className="text-primary-blue font-bold mb-2">
              Planned: ₹{typeof plan.plannedAmount === 'number' ? plan.plannedAmount.toFixed(2) : '0.00'}
            </p>
            <p className="text-dark-text text-sm whitespace-pre-line">{plan.notes}</p>
          </div>
        ))}
      </div>

      {budgetPlans.length === 0 && !isGenerating && (
        <div className="text-center text-dark-text py-8">
          Click &quot;Generate Budget Plan&quot; to get AI-powered budget recommendations
        </div>
      )}
    </div>
  );
};

export default AIBudgetPlanner;
