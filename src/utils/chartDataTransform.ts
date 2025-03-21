import { Transaction } from '@/types/transaction';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

const CHART_COLORS = {
  green: '#10B981',
  red: '#EF4444',
  blue: '#3B82F6',
  orange: '#F97316',
  purple: '#8B5CF6',
  yellow: '#F59E0B',
  indigo: '#6366F1',
  pink: '#EC4899'
};

export function getMonthlySpendingData(transactions: Transaction[]): ChartData {
  const monthlyData: { [key: string]: number } = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + transaction.amount;
  });

  return {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Monthly Spending',
      data: Object.values(monthlyData),
      borderColor: CHART_COLORS.blue,
      borderWidth: 2,
      fill: false
    }]
  };
}

export function getCategorySpendingData(transactions: Transaction[]): ChartData {
  const categoryData: { [key: string]: number } = {};
  
  transactions.forEach(transaction => {
    categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
  });

  const categories = Object.keys(categoryData);
  const backgroundColors = [
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.orange,
    CHART_COLORS.purple,
    CHART_COLORS.yellow,
    CHART_COLORS.indigo,
    CHART_COLORS.pink,
    CHART_COLORS.red
  ];

  return {
    labels: categories,
    datasets: [{
      label: 'Category Spending',
      data: Object.values(categoryData),
      backgroundColor: categories.map((_, index) => backgroundColors[index % backgroundColors.length])
    }]
  };
}

export function getBudgetComparisonData(transactions: Transaction[], budgets: { [category: string]: number }): ChartData {
  const actualSpending: { [key: string]: number } = {};
  
  transactions.forEach(transaction => {
    actualSpending[transaction.category] = (actualSpending[transaction.category] || 0) + transaction.amount;
  });

  const categories = Object.keys(budgets);
  const actualData = categories.map(category => actualSpending[category] || 0);
  const budgetData = categories.map(category => budgets[category]);

  return {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: budgetData,
        backgroundColor: CHART_COLORS.blue,
      },
      {
        label: 'Actual',
        data: actualData,
        backgroundColor: actualData.map(actual => actual > budgetData[actualData.indexOf(actual)] ? CHART_COLORS.red : CHART_COLORS.green),
      }
    ]
  };
}