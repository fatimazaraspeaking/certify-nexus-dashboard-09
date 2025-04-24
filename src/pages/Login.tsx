
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/shared/Logo';
import { Wallet } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { connect, connecting } = useWallet();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await connect();
      // Redirect happens automatically via the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl mix-blend-multiply"></div>
      
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-slide-in-bottom">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign in to ChainProof</h1>
          <p className="text-muted-foreground">Connect your Solana wallet to continue</p>
        </div>
        
        <Button
          className="w-full py-6 bg-cert-gradient hover:shadow-neon-hover transition-all"
          onClick={handleLogin}
          disabled={connecting}
        >
          <Wallet className="mr-2" size={20} />
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By connecting your wallet, you agree to our</p>
          <p>
            <a href="#" className="text-certify-purple hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-certify-purple hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
