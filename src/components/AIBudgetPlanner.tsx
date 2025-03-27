'use client';

import React, { useState, useEffect } from 'react';
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
  notes: string;
}

interface BudgetPlans {
  weeklyBudgetPlan: {
    budgetPlans: BudgetPlan[];
  };
  monthlyBudgetPlan: {
    budgetPlans: BudgetPlan[];
  };
}

const defaultBudgetPlans: BudgetPlans = {
  weeklyBudgetPlan: {
    budgetPlans: [
      {
        category: "Savings & Investments",
        notes: "Allocate at least 20-30% of income to savings, investments, or retirement funds like 401(k) or IRAs."
      },
      {
        category: "Housing (Rent/Mortgage, Utilities)",
        notes: "Housing should be under 30% of total income; includes rent, utilities, and maintenance."
      },
      {
        category: "Groceries & Food",
        notes: "Stick to a meal plan and buy in bulk to save money."
      },
      {
        category: "Transportation",
        notes: "Includes fuel, public transport, and maintenance; use fuel-efficient routes."
      },
      {
        category: "Health & Insurance",
        notes: "Covers health insurance, checkups, and medical expenses."
      },
      {
        category: "Entertainment & Dining Out",
        notes: "Keep discretionary spending controlled; consider free entertainment options."
      },
      {
        category: "Debt Repayment",
        notes: "Allocate a portion to paying off credit cards or loans to avoid high interest."
      },
      {
        category: "Emergency Fund",
        notes: "Save for unexpected expenses to avoid financial strain."
      }
    ]
  },
  monthlyBudgetPlan: {
    budgetPlans: [
      {
        category: "Savings & Investments",
        notes: "Contribute to savings accounts, stocks, bonds, or a retirement fund."
      },
      {
        category: "Housing (Rent/Mortgage, Utilities)",
        notes: "Ensure housing costs are sustainable within income."
      },
      {
        category: "Groceries & Food",
        notes: "Meal prepping and budgeting can help reduce food costs."
      },
      {
        category: "Transportation",
        notes: "Public transportation or carpooling can help reduce costs."
      },
      {
        category: "Health & Insurance",
        notes: "Include health, dental, and vision insurance premiums."
      },
      {
        category: "Entertainment & Dining Out",
        notes: "Limit unnecessary entertainment expenses; explore affordable hobbies."
      },
      {
        category: "Debt Repayment",
        notes: "Prioritize high-interest debt for faster repayment."
      },
      {
        category: "Emergency Fund",
        notes: "Build an emergency fund with at least 3-6 months of expenses."
      }
    ]
  }
};

const AIBudgetPlanner: React.FC<AIBudgetPlannerProps> = ({ transactions, monthlyIncome, apiKey }) => {
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlans>(defaultBudgetPlans);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

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

      const prompt = `As a financial planner, create detailed weekly and monthly budget plans based on:
Monthly Income: ₹${monthlyIncome}
Current Total Spending: ₹${totalSpending}
Current Savings Rate: ${savingsRate.toFixed(1)}%

Current Category Spending:
${Object.entries(categorySpending)
  .map(([category, amount]) => `${category}: ₹${amount} (${((amount/monthlyIncome)*100).toFixed(1)}%)`)
  .join('\n')}

Create budget plans in this JSON format:
{
  "weeklyBudgetPlan": {
    "budgetPlans": [
      {
        "category": "category_name",
        "notes": "detailed_explanation_and_tips"
      }
    ]
  },
  "monthlyBudgetPlan": {
    "budgetPlans": [
      {
        "category": "category_name",
        "notes": "detailed_explanation_and_tips"
      }
    ]
  }
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
        setBudgetPlans(data);
      }
    } catch (error) {
      console.error('Error generating budget plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Removed getAIInsight call
  }, [transactions]);

  return (
    <div className="bg-dark-card rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-dark-text">AI Budget Planner</h2>
        <button
          onClick={generateBudgetPlan}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? <FaSync className="animate-spin" /> : <FaMagic />}
          {isGenerating ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'weekly' 
                ? 'bg-primary-purple text-white' 
                : 'bg-dark-background text-dark-text hover:bg-dark-hover'
            }`}
          >
            Weekly Plan
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'monthly' 
                ? 'bg-primary-purple text-white' 
                : 'bg-dark-background text-dark-text hover:bg-dark-hover'
            }`}
          >
            Monthly Plan
          </button>
        </div>

        <div className="space-y-4">
          {budgetPlans[activeTab === 'weekly' ? 'weeklyBudgetPlan' : 'monthlyBudgetPlan'].budgetPlans.map((plan, index) => (
            <div key={index} className="bg-dark-background p-4 rounded-lg hover:bg-dark-hover transition-colors">
              <h3 className="text-lg font-semibold text-dark-text mb-2">{plan.category}</h3>
              <p className="text-dark-text opacity-80">{plan.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIBudgetPlanner;
