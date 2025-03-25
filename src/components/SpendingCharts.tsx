'use client';

import { useEffect, useRef } from 'react';
import OrbBackground from './Orb';
import Chart from 'chart.js/auto';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartPie, FaPlus, FaTrash, FaTrophy, FaMedal } from 'react-icons/fa';

interface SpendingData {
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

interface SpendingChartsProps {
  monthlyData: SpendingData;
  categoryData: SpendingData;
  budgetData: SpendingData;
  revenueData: SpendingData;
}

// Sample data for demonstration
const sampleMonthlyData: SpendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Monthly Spending',
    data: [1200, 1350, 980, 1450, 1100, 1300],
    borderColor: '#3B82F6',
    borderWidth: 2,
    fill: false
  }]
};

const sampleCategoryData: SpendingData = {
  labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Others'],
  datasets: [{
    label: 'Spending by Category',
    data: [800, 400, 200, 150, 250, 100],
    backgroundColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899'
    ]
  }]
};

const sampleBudgetData: SpendingData = {
  labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Others'],
  datasets: [
    {
      label: 'Budget',
      data: [1000, 500, 300, 200, 300, 200],
      backgroundColor: '#3B82F6'
    },
    {
      label: 'Actual',
      data: [800, 400, 200, 150, 250, 100],
      backgroundColor: '#10B981'
    }
  ]
};

const sampleRevenueData: SpendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Salary',
      data: [4500, 4500, 4500, 4800, 4800, 4800],
      backgroundColor: '#22C55E',
      borderColor: '#22C55E',
      borderWidth: 2
    },
    {
      label: 'Freelance',
      data: [800, 1200, 600, 900, 1500, 1000],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 2
    },
    {
      label: 'Investments',
      data: [200, 250, 180, 300, 280, 350],
      backgroundColor: '#34D399',
      borderColor: '#34D399',
      borderWidth: 2
    }
  ]
};

export default function SpendingCharts({
  monthlyData = sampleMonthlyData,
  categoryData = sampleCategoryData,
  budgetData = sampleBudgetData,
  revenueData = sampleRevenueData
}: SpendingChartsProps) {
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const budgetChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Monthly Spending Trend Line Chart
    if (monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: monthlyData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Spending Trends',
                color: '#E5E7EB'
              },
              legend: {
                labels: {
                  color: '#E5E7EB'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              },
              x: {
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              }
            }
          }
        });
      }
    }

    // Category-wise Spending Pie Chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: categoryData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Spending by Category',
                color: '#E5E7EB'
              },
              legend: {
                position: 'right',
                labels: {
                  color: '#E5E7EB'
                }
              }
            }
          }
        });
      }
    }

    // Budget vs Actual Bar Chart
    if (budgetChartRef.current) {
      const ctx = budgetChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: budgetData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Budget vs Actual Spending',
                color: '#E5E7EB'
              },
              legend: {
                labels: {
                  color: '#E5E7EB'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              },
              x: {
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              }
            }
          }
        });
      }
    }

    // Revenue Stacked Bar Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: revenueData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Revenue Breakdown',
                color: '#E5E7EB'
              },
              legend: {
                labels: {
                  color: '#E5E7EB'
                }
              }
            },
            scales: {
              y: {
                stacked: true,
                beginAtZero: true,
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              },
              x: {
                stacked: true,
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#E5E7EB'
                }
              }
            }
          }
        });
      }
    }
  }, [monthlyData, categoryData, budgetData, revenueData]);

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card p-4 rounded-lg flex items-center space-x-3">
          <FaWallet className="text-2xl text-primary-blue" />
          <div>
            <p className="text-dark-text text-sm">Total Balance</p>
            <p className="text-lg font-semibold text-dark-text">$5,240.00</p>
          </div>
        </div>
        <div className="bg-dark-card p-4 rounded-lg flex items-center space-x-3">
          <FaArrowUp className="text-2xl text-green-500" />
          <div>
            <p className="text-dark-text text-sm">Income</p>
            <p className="text-lg font-semibold text-dark-text">$3,240.00</p>
          </div>
        </div>
        <div className="bg-dark-card p-4 rounded-lg flex items-center space-x-3">
          <FaArrowDown className="text-2xl text-red-500" />
          <div>
            <p className="text-dark-text text-sm">Expenses</p>
            <p className="text-lg font-semibold text-dark-text">$2,140.00</p>
          </div>
        </div>
        <div className="bg-dark-card p-4 rounded-lg flex items-center space-x-3 cursor-pointer hover:bg-dark-cardHover transition-colors">
          <FaPlus className="text-2xl text-primary-purple" />
          <div>
            <p className="text-dark-text text-sm">Add Transaction</p>
            <p className="text-xs text-dark-text opacity-75">Quick Entry</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-card p-4 rounded-lg">
          <canvas ref={monthlyChartRef} />
        </div>
        <div className="bg-dark-card p-4 rounded-lg">
          <canvas ref={categoryChartRef} />
        </div>
        <div className="bg-dark-card p-4 rounded-lg">
          <canvas ref={budgetChartRef} />
        </div>
        <div className="bg-dark-card p-4 rounded-lg">
          <canvas ref={revenueChartRef} />
        </div>
      </div>
    </div>
  );
}