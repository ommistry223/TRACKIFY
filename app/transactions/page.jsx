"use client";

import { useState, useMemo } from 'react';
import Header from '../_components/Header';
import { useAuth } from '../context/AuthContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions } = useAuth();
  const [filter, setFilter] = useState({ type: 'all', category: 'all' });
  const [sort, setSort] = useState({ key: 'date', order: 'desc' });

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => filter.type === 'all' || t.type === filter.type)
      .filter(t => filter.category === 'all' || t.category === filter.category);
  }, [transactions, filter]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (a[sort.key] < b[sort.key]) return sort.order === 'asc' ? -1 : 1;
      if (a[sort.key] > b[sort.key]) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sort]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h1>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="entertainment">Entertainment</option>
            <option value="salary">Salary</option>
            <option value="investment">Investment</option>
            <option value="freelance">Freelance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Transaction Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    Date {sort.key === 'date' && (sort.order === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center">
                    Category {sort.key === 'category' && (sort.order === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('type')}>
                  <div className="flex items-center">
                    Type {sort.key === 'type' && (sort.order === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end">
                    Amount {sort.key === 'amount' && (sort.order === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t) => (
                <tr key={t.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4">{t.description}</td>
                  <td className="px-6 py-4 capitalize">{t.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === 'income'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
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
