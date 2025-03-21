'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface Transaction {
  id: number;
  type: 'expense' | 'income';
  title: string;
  category: string;
  amount: number;
  date: Date;
}

interface RecentTransactionsChartProps {
  transactions: Transaction[];
}

export default function RecentTransactionsChart({ transactions }: RecentTransactionsChartProps) {
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Process transactions data
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    const dailyTotals = last7Days.map(date => {
      return transactions
        .filter(t => new Date(t.date).toLocaleDateString() === date)
        .reduce((acc, curr) => curr.type === 'expense' ? acc + curr.amount : acc, 0);
    });

    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    // Render Spending Trend Chart
    if (trendChartRef.current) {
      const ctx = trendChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: last7Days,
            datasets: [{
              label: 'Daily Spending',
              data: dailyTotals,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Recent Spending Trend',
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

    // Render Category Distribution Chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
              data: Object.values(categoryTotals),
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
                '#EC4899'
              ]
            }]
          },
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
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-dark-card rounded-lg shadow-lg p-6 col-span-2">
        <canvas ref={trendChartRef} />
      </div>
      <div className="bg-dark-card rounded-lg shadow-lg p-6 col-span-2 md:col-span-1">
        <canvas ref={categoryChartRef} />
      </div>
    </div>
  );
}