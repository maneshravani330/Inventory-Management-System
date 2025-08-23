import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';
import { User } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            apiService.logout();
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          apiService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      
      console.log('AuthContext login response:', response); // Debug log
      
      if (response.success) {
        // Use user data from login response if available
        if (response.data?.user) {
          console.log('Setting user from login response:', response.data.user);
          setUser(response.data.user);
          return true;
        }
        
        // Fallback: Get user info after successful login
        try {
          const userResponse = await apiService.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
            return true;
          } else {
            // If we can't get user info but login was successful,
            // create a basic user object (default to ADMIN for now)
            setUser({
              id: 0, // Will be updated when getCurrentUser works
              name: email.split('@')[0], // Use email prefix as name
              email: email,
              role: 'ADMIN' // Default role
            });
            return true;
          }
        } catch (userError) {
          console.warn('Failed to get user info after login:', userError);
          // Still set a basic user object to maintain authenticated state
          setUser({
            id: 0,
            name: email.split('@')[0],
            email: email,
            role: 'ADMIN' // Default role
          });
          return true;
        }
      }
      
      console.log('Login failed with response:', response);
      return false;
    } catch (error) {
      console.error('Login failed with error:', error);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (apiService.isAuthenticated()) {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: apiService.isAdmin(),
    login,
    logout,
    refreshUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
