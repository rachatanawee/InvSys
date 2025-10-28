import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in storage on initial load
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const azureUser = localStorage.getItem('azure_user');
      
      if (azureUser) {
        const parsed = JSON.parse(azureUser);
        setUser({ id: parsed.email, email: parsed.email });
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password?: string, rememberMe: boolean = false) => {
    const { data, error } = await supabase.auth.signInWithEmail({ email, password });
    if (error) {
        throw error;
    }
    if (data.user) {
        const authenticatedUser = { id: data.user.id, email: data.user.email };
        // Clear any previous sessions before setting the new one
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(authenticatedUser));
        } else {
            sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
        }
        setUser(authenticatedUser);
    } else {
        throw new Error("Authentication failed: No user data returned.");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('azure_user');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, signIn, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};