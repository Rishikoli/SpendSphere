'use client';
import { useState } from 'react';
import Image from "next/image";
import Navbar from '@/components/Navbar';
import BillScanner from '@/components/BillScanner';

export default function Home() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', title: 'Netflix Subscription', category: 'Entertainment', amount: 14.99, date: new Date() },
    { id: 2, type: 'income', title: 'Salary Deposit', category: 'Salary', amount: 2500.00, date: new Date() },
    { id: 3, type: 'expense', title: 'Grocery Shopping', category: 'Food', amount: 89.97, date: new Date() }
  ]);

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Other'
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const expense = {
      id: Date.now(),
      type: 'expense',
      title: newExpense.title,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: new Date()
    };
    setTransactions([expense, ...transactions]);
    setNewExpense({ title: '', amount: '', category: 'Other' });
  };

  const handleRemoveTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalBalance = transactions.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <main className="min-h-screen bg-dark-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-dark-text mb-8">Financial Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <h2 className="text-dark-text text-lg font-semibold mb-2">Total Balance</h2>
            <p className="text-primary-blue text-2xl font-bold">₹{totalBalance.toFixed(2)}</p>
            <p className="text-dark-text text-sm mt-2">Updated just now</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <h2 className="text-dark-text text-lg font-semibold mb-2">Monthly Income</h2>
            <p className="text-primary-green text-2xl font-bold">₹{monthlyIncome.toFixed(2)}</p>
            <p className="text-dark-text text-sm mt-2">+12% from last month</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <h2 className="text-dark-text text-lg font-semibold mb-2">Monthly Expenses</h2>
            <p className="text-primary-red text-2xl font-bold">₹{monthlyExpenses.toFixed(2)}</p>
            <p className="text-dark-text text-sm mt-2">-3% from last month</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <h2 className="text-dark-text text-lg font-semibold mb-2">Budget Status</h2>
            <p className="text-primary-orange text-2xl font-bold">75% Used</p>
            <p className="text-dark-text text-sm mt-2">₹1,350.00 remaining</p>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">Add New Expense</h2>
          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-dark-text mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-dark-text mb-2">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-dark-text mb-2">Category</label>
                <select
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue"
                >
                  <option value="Other">Other</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Transportation">Transportation</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-blue text-white rounded-lg py-2 hover:bg-blue-600 transition-colors"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">Recent Transactions</h2>
          <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className={`rounded-full ${transaction.type === 'income' ? 'bg-primary-green' : 'bg-primary-red'} bg-opacity-20 p-2 mr-4`}>
                      <svg className={`h-6 w-6 ${transaction.type === 'income' ? 'text-primary-green' : 'text-primary-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-8-6h16" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">{transaction.title}</p>
                      <p className="text-sm text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-primary-green' : 'text-primary-red'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveTransaction(transaction.id)}
                      className="text-gray-400 hover:text-primary-red transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Scanner Section */}
        <BillScanner />

        {/* Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">Top Savers Leaderboard</h2>
          <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Leaderboard Items */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-blue bg-opacity-20 p-2 mr-4">
                    <span className="text-primary-blue font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">Sarah Johnson</p>
                    <div className="flex items-center">
                      <span className="text-sm text-primary-green">+32% Savings Rate</span>
                      <span className="ml-2 px-2 py-1 bg-primary-blue bg-opacity-20 rounded-full text-xs text-primary-blue">Budget Master</span>
                    </div>
                  </div>
                </div>
                <p className="text-primary-blue font-medium">2,450 pts</p>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-blue bg-opacity-20 p-2 mr-4">
                    <span className="text-primary-blue font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">Mike Chen</p>
                    <div className="flex items-center">
                      <span className="text-sm text-primary-green">+28% Savings Rate</span>
                      <span className="ml-2 px-2 py-1 bg-primary-orange bg-opacity-20 rounded-full text-xs text-primary-orange">Smart Investor</span>
                    </div>
                  </div>
                </div>
                <p className="text-primary-blue font-medium">2,180 pts</p>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-blue bg-opacity-20 p-2 mr-4">
                    <span className="text-primary-blue font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">Alex Rivera</p>
                    <div className="flex items-center">
                      <span className="text-sm text-primary-green">+25% Savings Rate</span>
                      <span className="ml-2 px-2 py-1 bg-primary-green bg-opacity-20 rounded-full text-xs text-primary-green">Goal Crusher</span>
                    </div>
                  </div>
                </div>
                <p className="text-primary-blue font-medium">1,950 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
