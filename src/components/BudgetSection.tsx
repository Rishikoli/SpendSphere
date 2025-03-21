import React from 'react';
import BudgetCard from './BudgetCard';
import { FaShoppingCart, FaHome, FaCar, FaUtensils, FaPlane } from 'react-icons/fa';

const BudgetSection: React.FC = () => {
  // Sample budget data - in a real app, this would come from your state management solution
  const budgets = [
    {
      category: 'Shopping',
      currentSpent: 450,
      budgetLimit: 1000,
      icon: <FaShoppingCart />
    },
    {
      category: 'Housing',
      currentSpent: 1200,
      budgetLimit: 1500,
      icon: <FaHome />
    },
    {
      category: 'Transportation',
      currentSpent: 200,
      budgetLimit: 300,
      icon: <FaCar />
    },
    {
      category: 'Food',
      currentSpent: 400,
      budgetLimit: 600,
      icon: <FaUtensils />
    },
    {
      category: 'Travel',
      currentSpent: 1200,
      budgetLimit: 1000,
      icon: <FaPlane />
    }
  ];

  return (
    <section className="p-6 bg-dark-background">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Budget Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => (
          <BudgetCard
            key={index}
            category={budget.category}
            currentSpent={budget.currentSpent}
            budgetLimit={budget.budgetLimit}
            icon={budget.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default BudgetSection;