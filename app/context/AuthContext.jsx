"use client";

import { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { DataProvider } from './DataContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider value={{
      user: session?.user,
      loading: status === 'loading',
      signIn,
      signOut,
    }}>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 