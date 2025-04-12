"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({
    income: 0,
    expenses: 0,
    savings: 0
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedBalance = localStorage.getItem('balance');
    const storedTransactions = localStorage.getItem('transactions');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedBalance) {
        setBalance(JSON.parse(storedBalance));
      }
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In a real app, you would validate credentials here
    const userData = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    setUser(userData);
    // Reset balance and transactions on login
    const initialBalance = {
      income: 0,
      expenses: 0,
      savings: 0
    };
    setBalance(initialBalance);
    setTransactions([]);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('balance', JSON.stringify(initialBalance));
    localStorage.setItem('transactions', JSON.stringify([]));
  };

  const logout = () => {
    setUser(null);
    // Reset balance and transactions on logout
    setBalance({
      income: 0,
      expenses: 0,
      savings: 0
    });
    setTransactions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('balance');
    localStorage.removeItem('transactions');
  };

  const updateBalance = (type, amount, description, category) => {
    const newBalance = { ...balance };
    switch (type) {
      case 'income':
        newBalance.income += amount;
        newBalance.savings = newBalance.income - newBalance.expenses;
        break;
      case 'expense':
        newBalance.expenses += amount;
        newBalance.savings = newBalance.income - newBalance.expenses;
        break;
      default:
        break;
    }
    setBalance(newBalance);
    
    // Add to transaction history
    const newTransaction = {
      id: Date.now(),
      type,
      amount,
      description,
      category,
      date: new Date().toISOString(),
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    localStorage.setItem('balance', JSON.stringify(newBalance));
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      balance,
      updateBalance,
      transactions
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 