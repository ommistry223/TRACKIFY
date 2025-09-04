"use client";

import { useState, useEffect } from 'react';
import Header from '../_components/Header';
import { useData } from '../context/DataContext';

export default function BudgetsPage() {
  const { transactions } = useData();
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: 'food', amount: '' });

  useEffect(() => {
    // Fetch budgets from API
    fetch('/api/budgets')
      .then(res => res.json())
      .then(data => setBudgets(data));
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBudget),
    });
    const data = await res.json();
    setBudgets([...budgets, data]);
    setNewBudget({ category: 'food', amount: '' });
  };

  const handleDeleteBudget = async (id) => {
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const getCategorySpending = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Budgets</h1>

        {/* Add Budget Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Budget</h2>
          <form onSubmit={handleAddBudget} className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
            >
              Add Budget
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const spending = getCategorySpending(budget.category);
            const progress = Math.min((spending / budget.amount) * 100, 100);
            return (
              <div key={budget.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold capitalize dark:text-white">{budget.category}</h3>
                  <button onClick={() => handleDeleteBudget(budget.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  ₹{spending.toFixed(2)} spent of ₹{budget.amount.toFixed(2)}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-orange-500 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
