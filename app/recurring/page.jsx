"use client";

import { useState, useEffect } from 'react';
import Header from '../_components/Header';
import { useData } from '../context/DataContext';

export default function RecurringPage() {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [newRecurring, setNewRecurring] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    // Fetch recurring transactions from API
    fetch('/api/recurring')
      .then(res => res.json())
      .then(data => setRecurringTransactions(data));
  }, []);

  const handleAddRecurring = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecurring),
    });
    const data = await res.json();
    setRecurringTransactions([...recurringTransactions, data]);
    setNewRecurring({
      description: '',
      amount: '',
      type: 'expense',
      category: 'other',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteRecurring = async (id) => {
    await fetch(`/api/recurring/${id}`, { method: 'DELETE' });
    setRecurringTransactions(recurringTransactions.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Recurring Transactions</h1>

        {/* Add Recurring Transaction Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Recurring Transaction</h2>
          <form onSubmit={handleAddRecurring} className="grid md:grid-cols-2 gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={newRecurring.description}
                onChange={(e) => setNewRecurring({ ...newRecurring, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Netflix Subscription"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={newRecurring.amount}
                onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter amount"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select
                value={newRecurring.type}
                onChange={(e) => setNewRecurring({ ...newRecurring, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={newRecurring.category}
                onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="other">Other</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Entertainment</option>
                <option value="salary">Salary</option>
                <option value="investment">Investment</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
              <select
                value={newRecurring.frequency}
                onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={newRecurring.startDate}
                onChange={(e) => setNewRecurring({ ...newRecurring, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                Add Recurring Transaction
              </button>
            </div>
          </form>
        </div>

        {/* Recurring Transactions List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Frequency</th>
                <th scope="col" className="px-6 py-3">Next Due Date</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recurringTransactions.map((r) => (
                <tr key={r.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{r.description}</td>
                  <td className={`px-6 py-4 font-medium ${r.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {r.type === 'income' ? '+' : '-'}₹{r.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 capitalize">{r.category}</td>
                  <td className="px-6 py-4 capitalize">{r.frequency}</td>
                  <td className="px-6 py-4">{new Date(r.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteRecurring(r.id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
