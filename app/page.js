"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./_components/Header";

export default function Home() {
  const handleGetStarted = () => {
    window.open('/dashboard', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your Expenses with{" "}
            <span className="text-orange-500">SpendWise</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
            Take control of your finances with our intuitive expense tracking
            solution. Monitor spending, set budgets, and achieve your financial
            goals.
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold text-lg hover:bg-orange-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <Link href="/login">
              <button className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-full font-semibold text-lg hover:bg-orange-50 dark:hover:bg-orange-900 transform hover:scale-105 transition-all">
                Learn More
              </button>
            </Link>
          </div>
          
          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Easy Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your expenses with just a few clicks</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">Get insights into your spending habits</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Data</h3>
              <p className="text-gray-600 dark:text-gray-300">Your financial data is always protected</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
