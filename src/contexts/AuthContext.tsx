
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  walletAddress: string | null;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for wallet address
        const storedWalletAddress = localStorage.getItem('walletAddress');
        
        if (storedWalletAddress) {
          // Simulate fetching user data
          // In production, you'd make an API call to your backend
          await login(storedWalletAddress);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('walletAddress');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (address: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call to fetch user data
      // For demo purposes, we'll create a mock user
      // In production, you would make an API call to your backend
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        full_name: "Solana User",
        wallet_address: address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUser(mockUser);
      setWalletAddress(address);
      setIsAuthenticated(true);
      
      // Store wallet address in localStorage
      localStorage.setItem('walletAddress', address);
      
      toast({
        title: "Successfully connected",
        description: "You've successfully connected your wallet",
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Authentication failed",
        description: "Failed to authenticate with wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWalletAddress(null);
    setIsAuthenticated(false);
    localStorage.removeItem('walletAddress');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        walletAddress,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
