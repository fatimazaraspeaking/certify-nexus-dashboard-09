
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { WalletContextState } from '@/types';

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { login, logout } = useAuth();
  const [wallet, setWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // In a real implementation, this would use Solana's wallet adapter
  const connect = async () => {
    try {
      setConnecting(true);
      
      // Demo addresses for testing
      const demoAddresses = [
        '5wLhAsYwvKcDviAFHyWZB7UZLWGqABXSSqQjJXqM5eu2',
        '2JRJ1TnhGUkb7UJ3fSho8DvLpnw7QAgwKWFDMXRkKJEP',
        'HvAx6HVeNQMgXt2hGKv8PWNMfaAnMQvDpb7VvkL9yQPY'
      ];
      
      // For demo, use a random Solana address
      const randomIndex = Math.floor(Math.random() * demoAddresses.length);
      const demoWalletAddress = demoAddresses[randomIndex];
      
      // Simulate delay for connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set wallet connected state
      setWallet(demoWalletAddress);
      setConnected(true);
      
      // Authenticate with the backend
      await login(demoWalletAddress);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${demoWalletAddress.slice(0, 6)}...${demoWalletAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setDisconnecting(true);
      
      // Simulate delay for disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset wallet state
      setWallet(null);
      setConnected(false);
      
      // Logout from app
      logout();
      
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        title: "Disconnection failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const select = (address: string) => {
    setWallet(address);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        connected,
        disconnecting,
        connect,
        disconnect,
        select,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
