import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import type { ChartData, ChartOptions } from 'chart.js';

interface SpendingChartsProps {
  transactions: {
    type: 'expense' | 'income';
    title: string;
    category: string;
    amount: number;
    date: Date | string;
  }[];
  monthlyIncome: number;
  monthlyBudget: number;
}

type CategoryColors = {
  [key: string]: {
    light: string;
    dark: string;
  };
};

type CategoryBorders = {
  [key: string]: string;
};

const categoryColors: CategoryColors = {
  Housing: { light: 'rgba(255, 99, 132, 0.8)', dark: 'rgba(255, 99, 132, 0.5)' },
  Food: { light: 'rgba(54, 162, 235, 0.8)', dark: 'rgba(54, 162, 235, 0.5)' },
  Transportation: { light: 'rgba(255, 206, 86, 0.8)', dark: 'rgba(255, 206, 86, 0.5)' },
  Entertainment: { light: 'rgba(75, 192, 192, 0.8)', dark: 'rgba(75, 192, 192, 0.5)' },
  Savings: { light: 'rgba(153, 102, 255, 0.8)', dark: 'rgba(153, 102, 255, 0.5)' },
  Utilities: { light: 'rgba(255, 159, 64, 0.8)', dark: 'rgba(255, 159, 64, 0.5)' },
  Other: { light: 'rgba(128, 128, 128, 0.8)', dark: 'rgba(128, 128, 128, 0.5)' }
};

const categoryBorders: CategoryBorders = {
  Housing: 'rgba(255, 99, 132, 1)',
  Food: 'rgba(54, 162, 235, 1)',
  Transportation: 'rgba(255, 206, 86, 1)',
  Entertainment: 'rgba(75, 192, 192, 1)',
  Savings: 'rgba(153, 102, 255, 1)',
  Utilities: 'rgba(255, 159, 64, 1)',
  Other: 'rgba(128, 128, 128, 1)'
};

export default function SpendingCharts({
  transactions
}: SpendingChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as { [key: string]: number });

  // Prepare data for the chart
  const chartData: ChartData<'bar'> = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(spendingByCategory),
        backgroundColor: Object.keys(spendingByCategory).map(category => 
          isDark ? categoryColors[category]?.dark || categoryColors.Other.dark 
                : categoryColors[category]?.light || categoryColors.Other.light
        ),
        borderColor: Object.keys(spendingByCategory).map(category => 
          categoryBorders[category] || categoryBorders.Other
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: 'Spending by Category',
        color: isDark ? '#fff' : '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
}