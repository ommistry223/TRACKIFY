"use client";

import { useState, useMemo } from 'react';
import Header from '../_components/Header';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportsPage() {
  const { theme } = useTheme();
  const { transactions, balance } = useData();
  const [timeframe, setTimeframe] = useState('month');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [transactions, dateRange]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Date", "Description", "Category", "Type", "Amount"].join(",") + "\n"
      + filteredTransactions.map(t => `${new Date(t.date).toLocaleDateString()},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  const monthlyData = useMemo(() => {
    const labels = [...new Set(filteredTransactions.map(t => new Date(t.date).toLocaleString('default', { month: 'short' })))].reverse();
    const income = labels.map(label => {
      return filteredTransactions
        .filter(t => t.type === 'income' && new Date(t.date).toLocaleString('default', { month: 'short' }) === label)
        .reduce((acc, t) => acc + t.amount, 0);
    });
    const expenses = labels.map(label => {
      return filteredTransactions
        .filter(t => t.type === 'expense' && new Date(t.date).toLocaleString('default', { month: 'short' }) === label)
        .reduce((acc, t) => acc + t.amount, 0);
    });
    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: expenses,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.5)',
        },
        {
          label: 'Income',
          data: income,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
      ],
    };
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const expenseByCategory = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
    return {
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
    };
  }, [filteredTransactions]);

  const barData = useMemo(() => {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = labels.map((label, index) => {
      return filteredTransactions
        .filter(t => t.type === 'expense' && new Date(t.date).getDay() === index)
        .reduce((acc, t) => acc + t.amount, 0);
    });
    return {
      labels,
      datasets: [
        {
          label: 'Daily Expenses',
          data,
          backgroundColor: 'rgba(249, 115, 22, 0.8)',
        },
      ],
    };
  }, [filteredTransactions]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Financial Reports</h1>
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Income vs Expenses</h2>
            <Line
              data={monthlyData}
              options={chartOptions}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Spending by Category</h2>
            <Doughnut
              data={categoryData}
              options={doughnutChartOptions}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Daily Spending Pattern</h2>
            <Bar
              data={barData}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Expenses</h3>
            <p className="text-3xl font-bold text-orange-500">₹{balance.expenses.toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Income</h3>
            <p className="text-3xl font-bold text-green-500">₹{balance.income.toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Savings</h3>
            <p className="text-3xl font-bold text-blue-500">₹{balance.savings.toFixed(2)}</p>
          </div>
        </div>
      </main>
    </div>
  );
} 