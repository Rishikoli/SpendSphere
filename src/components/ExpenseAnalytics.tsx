'use client';

import React, { useRef, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Transaction {
  type: 'expense' | 'income';
  title: string;
  category: string;
  amount: number;
  date: Date | string;
}

interface ExpenseAnalyticsProps {
  transactions: Transaction[];
}

interface ChartDataPoint {
  month: string;
  amount: number;
}

interface PieChartDataPoint {
  category: string;
  amount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ transactions }) => {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  // Process transactions for charts
  const { monthlyData, categoryData } = useMemo(() => {
    const monthlyExpenses = new Map<string, number>();
    const categoryExpenses = new Map<string, number>();

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        // Monthly data
        const date = typeof transaction.date === 'string' ? new Date(transaction.date) : transaction.date;
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyExpenses.set(month, (monthlyExpenses.get(month) || 0) + transaction.amount);

        // Category data
        categoryExpenses.set(
          transaction.category,
          (categoryExpenses.get(transaction.category) || 0) + transaction.amount
        );
      });

    return {
      monthlyData: Array.from(monthlyExpenses.entries()).map(([month, amount]) => ({
        month,
        amount,
      })) as ChartDataPoint[],
      categoryData: Array.from(categoryExpenses.entries()).map(([category, amount]) => ({
        category,
        amount,
      })) as PieChartDataPoint[],
    };
  }, [transactions]);

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Expense Analytics</h2>

      <div className="space-y-8">
        {/* Monthly Expenses Line Chart */}
        <div className="bg-dark-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Monthly Expenses</h3>
          <div ref={lineChartRef} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-wise Expenses Pie Chart */}
        <div className="bg-dark-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Expense Distribution</h3>
          <div ref={pieChartRef} className="h-[300px] max-w-[500px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, percent }: { category: string; percent: number }) => 
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
