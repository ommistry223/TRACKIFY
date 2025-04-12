import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex items-center flex-col">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            Manage your Expense
            <strong className="text-orange-500"> & </strong>
            Control your Money
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
            Start preparing your budgets and save tons of money
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <a
              className="inline-block rounded border border-orange-500 bg-orange-500 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
              href="#"
            >
              Get Started
            </a>

          </div>
        </div>
      </div>
      <Image
        src="/dashboard.png"
        alt="dashboard"
        width={1000}
        height={700}
        className="mb-4 -mt-15 rounded-xl border-2"
      />
    </section>
  );
}

export default Hero;
