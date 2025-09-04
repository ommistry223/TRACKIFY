"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='p-5 flex justify-between items-center border-b bg-white dark:bg-gray-800 dark:border-gray-700'>
      {/* Logo + Title section */}
      <div className='flex items-center space-x-3'>
        <Image 
          src='/logo.svg'
          alt='logo'
          width={50}
          height={50}
        />
        <h1 className='text-orange-500 text-xl font-bold'>Trackify</h1>
      </div>

      {/* Nav links and Auth buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        {!user ? (
          <>
            <Link href="/login">
              <button className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-500">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-gray-700 dark:text-gray-300 hover:text-orange-500">
              Transactions
            </Link>
            <Link href="/budgets" className="text-gray-700 dark:text-gray-300 hover:text-orange-500">
              Budgets
            </Link>
            <Link href="/recurring" className="text-gray-700 dark:text-gray-300 hover:text-orange-500">
              Recurring
            </Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-orange-500">
              Profile
            </Link>
            <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
