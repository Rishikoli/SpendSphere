'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaEdit, FaTrash, FaMagic, FaSync } from 'react-icons/fa';
import NeuralBackground from './NeuralBackground';

interface BudgetPlan {
  id: number;
  category: string;
  plannedAmount: number;
  startDate: string;
  endDate: string;
  notes: string;
}

interface Transaction {
  type: 'expense' | 'income';
  title: string;
  category: string;
  amount: number;
  date: Date | string;
}

interface BudgetPlanningProps {
  transactions: Transaction[];
  monthlyIncome: number;
}

const BudgetPlanning: React.FC<BudgetPlanningProps> = ({ transactions, monthlyIncome }) => {
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<BudgetPlan | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<BudgetPlan, 'id'>>({
    category: '',
    plannedAmount: 0,
    startDate: '',
    endDate: '',
    notes: ''
  });

  // Update recommendations when transactions or income changes
  useEffect(() => {
    if (transactions.length > 0 && monthlyIncome > 0) {
      setIsUpdating(true);
      generateAIBudget();
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [transactions, monthlyIncome]);

  const generateAIBudget = () => {
    // Calculate category-wise spending
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    // Calculate total spending and spending rate
    const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
    const spendingRate = totalSpending / monthlyIncome;

    // Get current date for budget period
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const endDate = nextMonth.toISOString().split('T')[0];

    // Base percentages for each category
    const basePercentages = {
      Housing: 0.3,
      Food: 0.15,
      Transportation: 0.1,
      Entertainment: 0.05,
      Savings: 0.2,
      Utilities: 0.1,
      Healthcare: 0.05,
    };

    // Function to get dynamic adjustment factor based on spending patterns
    const getAdjustmentFactor = (category: string) => {
      const currentSpending = categorySpending[category] || 0;
      const recommendedSpending = monthlyIncome * basePercentages[category as keyof typeof basePercentages];
      
      if (currentSpending > recommendedSpending * 1.2) {
        // Overspending - suggest reduction
        return 0.9;
      } else if (currentSpending < recommendedSpending * 0.8) {
        // Underspending - suggest slight increase
        return 1.1;
      }
      // Add small random variation for dynamic recommendations
      return 1 + (Math.sin(Date.now() / 1000) * 0.05);
    };

    // Generate recommendations with dynamic adjustments
    const categories = Object.keys(basePercentages) as (keyof typeof basePercentages)[];
    const recommendedBudgets = categories.map(category => {
      const basePercentage = basePercentages[category];
      const adjustmentFactor = getAdjustmentFactor(category);
      const adjustedPercentage = basePercentage * adjustmentFactor;
      const plannedAmount = monthlyIncome * adjustedPercentage;

      let recommendation = '';
      if (adjustmentFactor < 1) {
        recommendation = '(Suggested reduction based on high spending)';
      } else if (adjustmentFactor > 1) {
        recommendation = '(Suggested increase based on low spending)';
      }

      return {
        id: Date.now() + Math.sin(Date.now() / 1000 + categories.indexOf(category)),
        category,
        plannedAmount,
        startDate,
        endDate,
        notes: `AI Recommended: ${(adjustedPercentage * 100).toFixed(1)}% for ${category} ${recommendation}`,
      };
    });

    // Update budget plans with new recommendations
    setBudgetPlans(recommendedBudgets);
  };

  const handleAddPlan = () => {
    if (!newPlan.category || !newPlan.plannedAmount) return;

    const plan: BudgetPlan = {
      id: Date.now(),
      ...newPlan
    };

    setBudgetPlans([...budgetPlans, plan]);
    setNewPlan({
      category: '',
      plannedAmount: 0,
      startDate: '',
      endDate: '',
      notes: ''
    });
  };

  const handleEditPlan = (plan: BudgetPlan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;

    setBudgetPlans(budgetPlans.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    ));
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: number) => {
    setBudgetPlans(budgetPlans.filter(plan => plan.id !== id));
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-text">Budget Planning</h2>
        <button
          onClick={generateAIBudget}
          className={`bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 ${
            isUpdating ? 'opacity-75 cursor-wait' : ''
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? <FaSync className="animate-spin" /> : <FaMagic />}
          {isUpdating ? 'Updating...' : 'Generate AI Budget'}
        </button>
      </div>

      {/* Add New Budget Plan Form */}
      <div className="bg-dark-background/90 backdrop-blur-sm p-4 rounded-lg mb-6 relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-primary-purple rounded-full">
              <FaMagic className="text-white text-sm animate-bounce" />
            </span>
            Create New Budget Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-dark-text mb-2">Category</label>
              <select
                value={newPlan.category}
                onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Savings">Savings</option>
              </select>
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-float opacity-10"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-dark-text mb-2">Planned Amount</label>
              <input
                type="number"
                value={newPlan.plannedAmount}
                onChange={(e) => setNewPlan({ ...newPlan, plannedAmount: parseFloat(e.target.value) })}
                className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
              />
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-float opacity-10"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-dark-text mb-2">Start Date</label>
              <input
                type="date"
                value={newPlan.startDate}
                onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
              />
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-float opacity-10"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-dark-text mb-2">End Date</label>
              <input
                type="date"
                value={newPlan.endDate}
                onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
              />
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-float opacity-10"
                  />
                </svg>
              </div>
            </div>
            <div className="md:col-span-2 relative">
              <label className="block text-dark-text mb-2">Notes</label>
              <textarea
                value={newPlan.notes}
                onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
                rows={2}
              />
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-float opacity-10"
                  />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddPlan}
            className="mt-4 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaSave /> Save Budget Plan
          </button>
        </div>
      </div>

      {/* Budget Plans List */}
      <div className="space-y-4">
        {budgetPlans.map(plan => (
          <div key={plan.id} className="bg-dark-background p-4 rounded-lg">
            {editingPlan?.id === plan.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-dark-text mb-2">Category</label>
                  <select
                    value={editingPlan.category}
                    onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value })}
                    className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
                  >
                    <option value="Housing">Housing</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Savings">Savings</option>
                  </select>
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect
                        width="100%"
                        height="100%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="animate-float opacity-10"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-dark-text mb-2">Planned Amount</label>
                  <input
                    type="number"
                    value={editingPlan.plannedAmount}
                    onChange={(e) => setEditingPlan({ ...editingPlan, plannedAmount: parseFloat(e.target.value) })}
                    className="w-full bg-dark-card text-dark-text rounded-lg p-2 border border-gray-700 transition-all duration-300 hover:border-primary-purple focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect
                        width="100%"
                        height="100%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="animate-float opacity-10"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleUpdatePlan}
                    className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-dark-text">{plan.category}</h4>
                  <p className="text-primary-blue font-bold">₹{plan.plannedAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">
                    {plan.startDate} to {plan.endDate}
                  </p>
                  {plan.notes && (
                    <p className="text-dark-text mt-2">{plan.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="text-primary-blue hover:text-blue-600 transition-colors"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-primary-red hover:text-red-600 transition-colors"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPlanning;
