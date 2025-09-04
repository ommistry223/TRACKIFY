"use client";

import { useState, useEffect } from 'react';
import Header from '../_components/Header';
import AddTransactionModal from '../_components/AddTransactionModal';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { balance, transactions } = useData();
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthOptions, setMonthOptions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [categoryChartData, setCategoryChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate month options for the last 5 years
  useEffect(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const option = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      options.push(option);
    }
    setMonthOptions(options);
    setSelectedMonth(options[0]); // Set current month as default
  }, []);

  // Prepare chart data
  useEffect(() => {
    if (transactions.length > 0) {
      const last30Days = [...Array(30)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const incomeData = new Array(30).fill(0);
      const expenseData = new Array(30).fill(0);
      const expenseByCategory = {};

      transactions.forEach(transaction => {
        const transactionDate = transaction.date.split('T')[0];
        const dayIndex = last30Days.indexOf(transactionDate);
        if (dayIndex !== -1) {
          if (transaction.type === 'income') {
            incomeData[dayIndex] += transaction.amount;
          } else {
            expenseData[dayIndex] += transaction.amount;
            expenseByCategory[transaction.category] = (expenseByCategory[transaction.category] || 0) + transaction.amount;
          }
        }
      });

      setChartData({
        labels: last30Days.map(date => {
          const [year, month, day] = date.split('-');
          return `${day}/${month}`;
        }),
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.4
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.4
          }
        ]
      });

      setCategoryChartData({
        labels: Object.keys(expenseByCategory),
        datasets: [
          {
            data: Object.values(expenseByCategory),
            backgroundColor: [
              'rgba(249, 115, 22, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(107, 114, 128, 0.8)',
            ],
          },
        ],
      });
    }
  }, [transactions]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get transaction type style
  const getTransactionStyle = (type) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.formattedValue}`
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Financial Overview</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {monthOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Total Income</h2>
              <span className="text-green-500 text-sm">Current Balance</span>
            </div>
            <div className="text-3xl font-bold text-green-500">₹{balance.income.toFixed(2)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Total Expenses</h2>
              <span className="text-red-500 text-sm">Current Balance</span>
            </div>
            <div className="text-3xl font-bold text-red-500">₹{balance.expenses.toFixed(2)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Net Savings</h2>
              <span className="text-blue-500 text-sm">Current Balance</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">₹{balance.savings.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Income vs Expenses (Last 30 Days)</h2>
            <div className="h-[300px]">
              <Line 
                data={chartData}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Expenses by Category</h2>
            <div className="h-[300px]">
              <Doughnut
                data={categoryChartData}
                options={doughnutChartOptions}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Transactions</h2>
            <div className="overflow-y-auto max-h-[400px]">
              {transactions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-sm ${getTransactionStyle(transaction.type)}`}>
                            {transaction.type}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                        <p className="font-medium mt-1 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{transaction.category}</p>
                      </div>
                      <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <AddTransactionModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 