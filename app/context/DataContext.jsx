"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState({
    income: 0,
    expenses: 0,
    savings: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const processRecurring = async () => {
        await fetch('/api/recurring/process', { method: 'POST' });
        const res = await fetch('/api/transactions');
        const data = await res.json();
        setTransactions(data);
        const income = data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        setBalance({
          income,
          expenses,
          savings: income - expenses
        });
        setLoading(false);
      };
      processRecurring();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const addTransaction = async (transaction) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...transaction, date: new Date().toISOString() })
    });
    const newTransaction = await res.json();
    setTransactions(prev => {
      const newTransactions = [newTransaction, ...prev];
      const income = newTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expenses = newTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      setBalance({
          income,
          expenses,
          savings: income - expenses
      });
      return newTransactions;
    });
  };

  return (
    <DataContext.Provider value={{
      balance,
      transactions,
      loading,
      addTransaction
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
