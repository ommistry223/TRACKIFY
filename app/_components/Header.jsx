"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div className='p-5 flex justify-between items-center border-b bg-white'>
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

      {/* Auth buttons */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login">
              <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
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
            <span className="text-gray-700">{user.name}</span>
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
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
