"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TransactionList() {
  const { transactions } = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const formatAmount = (amount, type) => {
    return `${type === 'expense' ? '-' : '+'}₹${amount.toFixed(2)}`;
  };

  const getTransactionColor = (type) => {
    return type === 'expense' ? 'text-red-600' : 'text-green-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      shopping: '🛍️',
      bills: '📄',
      entertainment: '🎮',
      salary: '💰',
      investment: '📈',
      freelance: '💻',
      other: '📌'
    };
    return icons[category] || '📌';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl" role="img" aria-label={transaction.category}>
                  {getCategoryIcon(transaction.category)}
                </span>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
                </div>
              </div>
              <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 