"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import BillScanner from "@/components/BillScanner";
import ExpenseAnalytics from "@/components/ExpenseAnalytics";
import AIBudgetRecommendations from "@/components/AIBudgetRecommendations";
import AIBudgetPlanner from "@/components/AIBudgetPlanner";
import FinanceBot from '@/components/FinanceBot';
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaPlus,
  FaTrash,
  FaTrophy,
  FaMedal,
} from "react-icons/fa";

interface Transaction {
  id: number;
  type: "expense" | "income";
  title: string;
  category: string;
  amount: number;
  date: Date;
}

interface NewExpense {
  title: string;
  amount: string;
  category: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "expense",
      title: "Netflix Subscription",
      category: "Entertainment",
      amount: 14.99,
      date: new Date(),
    },
    {
      id: 2,
      type: "income",
      title: "Salary Deposit",
      category: "Salary",
      amount: 2500.0,
      date: new Date(),
    },
    {
      id: 3,
      type: "expense",
      title: "Grocery Shopping",
      category: "Food",
      amount: 89.97,
      date: new Date(),
    },
  ]);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    title: "",
    amount: "",
    category: "Other",
  });

  const [geminiApiKey] = useState<string>(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
  );

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Transaction = {
      id: Date.now(),
      type: "expense",
      title: newExpense.title,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: new Date(),
    };
    setTransactions([expense, ...transactions]);
    setNewExpense({ title: "", amount: "", category: "Other" });
    
    // Trigger FinanceBot analysis for the new expense
    const financeBot = document.getElementById('finance-bot-input') as HTMLInputElement;
    if (financeBot) {
      financeBot.value = `Analyze my recent ${expense.category} expense of ₹${expense.amount} for ${expense.title} and provide budgeting advice.`;
      const submitButton = financeBot.nextElementSibling as HTMLButtonElement;
      if (submitButton) {
        submitButton.click();
      }
    }
  };

  const handleRemoveTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalBalance = transactions.reduce(
    (acc: number, curr: Transaction) =>
      curr.type === "income" ? acc + curr.amount : acc - curr.amount,
    0
  );

  const monthlyIncome = transactions
    .filter((t: Transaction) => t.type === "income")
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter((t: Transaction) => t.type === "expense")
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div> */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <h1 className="text-3xl font-bold text-white mb-8">
          Financial Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaWallet className="text-primary-blue text-xl" />
              <h2 className="text-dark-text text-lg font-semibold">
                Total Balance
              </h2>
            </div>
            <p className="text-primary-blue text-2xl font-bold">
              ₹{totalBalance.toFixed(2)}
            </p>
            <p className="text-dark-text text-sm mt-2">Updated just now</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaArrowUp className="text-primary-green text-xl" />
              <h2 className="text-dark-text text-lg font-semibold">
                Monthly Income
              </h2>
            </div>
            <p className="text-primary-green text-2xl font-bold">
              ₹{monthlyIncome.toFixed(2)}
            </p>
            <p className="text-dark-text text-sm mt-2">+12% from last month</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaArrowDown className="text-primary-red text-xl" />
              <h2 className="text-dark-text text-lg font-semibold">
                Monthly Expenses
              </h2>
            </div>
            <p className="text-primary-red text-2xl font-bold">
              ₹{monthlyExpenses.toFixed(2)}
            </p>
            <p className="text-dark-text text-sm mt-2">-3% from last month</p>
          </div>

          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaChartPie className="text-primary-orange text-xl" />
              <h2 className="text-dark-text text-lg font-semibold">
                Budget Status
              </h2>
            </div>
            <p className="text-primary-orange text-2xl font-bold">75% Used</p>
            <p className="text-dark-text text-sm mt-2">₹1,350.00 remaining</p>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">
            Add New Expense
          </h2>
          <div className="bg-dark-card rounded-lg shadow-lg p-6">
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-dark-text mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newExpense.title}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, title: e.target.value })
                  }
                  className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-dark-text mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-dark-text mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full bg-dark-background text-dark-text rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue appearance-none"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="Other" className="bg-dark-background text-dark-text">Other</option>
                    <option value="Housing" className="bg-dark-background text-dark-text">Housing</option>
                    <option value="Food" className="bg-dark-background text-dark-text">Food</option>
                    <option value="Entertainment" className="bg-dark-background text-dark-text">Entertainment</option>
                    <option value="Transportation" className="bg-dark-background text-dark-text">Transportation</option>
                    <option value="Utilities" className="bg-dark-background text-dark-text">Utilities</option>
                    <option value="Savings" className="bg-dark-background text-dark-text">Savings</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-text">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-blue text-white rounded-lg py-2 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus />
                Add Expense
              </button>
            </form>
          </div>
        </div>

        {/* Bill Scanner Section */}
        <div className="mb-6">
          <BillScanner />
        </div>

        {/* AI Budget Planner */}
        <div className="mb-6">
          <AIBudgetPlanner 
            transactions={transactions}
            monthlyIncome={monthlyIncome}
            apiKey={geminiApiKey}
          />
        </div>

        {/* AI Budget Recommendations */}
        <div className="mb-6">
          <AIBudgetRecommendations 
            transactions={transactions} 
            monthlyIncome={monthlyIncome} 
            apiKey={geminiApiKey}
          />
        </div>

        {/* Expense Analytics Section */}
        <div className="mt-8">
          <ExpenseAnalytics transactions={transactions} />
        </div>

        {/* Finance Bot */}
        <div>
          <FinanceBot 
            transactions={transactions}
            monthlyIncome={monthlyIncome}
            apiKey={geminiApiKey}
          />
        </div>

        {!geminiApiKey && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-500">
              Please set your Gemini API key in the environment variables to enable the AI Finance Assistant.
              You can get one from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        {/* Recent Transactions Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">
            Recent Transactions
          </h2>
          <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {transactions.map((transaction: Transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-700"
                >
                  <div className="flex items-center">
                    <div
                      className={`rounded-full ${
                        transaction.type === "income"
                          ? "bg-primary-green"
                          : "bg-primary-red"
                      } bg-opacity-20 p-2 mr-4`}
                    >
                      <svg
                        className={`h-6 w-6 ${
                          transaction.type === "income"
                            ? "text-primary-green"
                            : "text-primary-red"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v12m-8-6h16"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">
                        {transaction.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p
                      className={`font-medium ${
                        transaction.type === "income"
                          ? "text-primary-green"
                          : "text-primary-red"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveTransaction(transaction.id)}
                      className="text-gray-400 hover:text-primary-red transition-colors"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">
            Top Savers Leaderboard
          </h2>
          <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Leaderboard Items */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-blue bg-opacity-20 p-2 mr-4">
                    <FaTrophy className="text-primary-blue" />
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">Sarah Johnson</p>
                    <div className="flex items-center">
                      <span className="text-sm text-primary-green">
                        +32% Savings Rate
                      </span>
                      <span className="ml-2 px-2 py-1 bg-primary-blue bg-opacity-20 rounded-full text-xs text-primary-blue">
                        Budget Master
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-primary-blue font-medium">2,450 pts</p>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-blue bg-opacity-20 p-2 mr-4">
                    <FaMedal className="text-primary-blue" />
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">Mike Chen</p>
                    <div className="flex items-center">
                      <span className="text-sm text-primary-green">
                        +28% Savings Rate
                      </span>
                      <span className="ml-2 px-2 py-1 bg-primary-orange bg-opacity-20 rounded-full text-xs text-primary-orange">
                        Smart Investor
                      </span>
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
                      <span className="text-sm text-primary-green">
                        +25% Savings Rate
                      </span>
                      <span className="ml-2 px-2 py-1 bg-primary-green bg-opacity-20 rounded-full text-xs text-primary-green">
                        Goal Crusher
                      </span>
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
