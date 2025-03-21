import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { BiDollar } from 'react-icons/bi';

interface BudgetCardProps {
  category: string;
  currentSpent: number;
  budgetLimit: number;
  icon?: React.ReactNode;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  currentSpent,
  budgetLimit,
  icon,
}) => {
  const progress = (currentSpent / budgetLimit) * 100;
  const progressColor = 
    progress <= 60 ? 'bg-budget-low' :
    progress <= 85 ? 'bg-budget-medium' :
    'bg-budget-high';

  return (
    <div className="w-budget-card p-4 bg-dark-card rounded-budget border border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-dark-text">{category}</h3>
        </div>
        <span className="text-sm text-dark-text">
          ${currentSpent.toFixed(2)} / ${budgetLimit.toFixed(2)}
        </span>
      </div>
      
      <div className="relative h-2 bg-budget-bar rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute h-full ${progressColor}`}
        />
      </div>
      
      <div className="mt-2 flex justify-between text-xs">
        <motion.span
          className={`flex items-center gap-1 ${progress > 85 ? 'text-budget-high' : 'text-dark-text'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {progress > 85 ? <FiTrendingUp className="animate-bounce" /> : <FiTrendingDown />}
          {progress.toFixed(1)}% used
        </motion.span>
        <motion.span
          className="flex items-center gap-1 text-dark-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BiDollar className="animate-pulse" />
          ${(budgetLimit - currentSpent).toFixed(2)} remaining
        </motion.span>
      </div>
    </div>
  );
};

export default BudgetCard;