
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/shared/Logo';
import { Award, BadgeCheck, FileCheck, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { connect, connecting } = useWallet();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      await connect();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo />
        <div className="space-x-4">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              onClick={connect} 
              disabled={connecting}
              className="bg-cert-gradient hover:shadow-neon-hover transition-all"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-32 relative overflow-hidden">
        {/* Background Gradient Blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl mix-blend-multiply"></div>
        
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Tokenized Certificate</span> Platform
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Store your certificates on the blockchain, verify them instantly, and mint them as NFTs on Solana.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={handleGetStarted} 
              className="bg-cert-gradient text-white px-8 py-6 text-lg rounded-xl hover:shadow-neon-hover transition-all"
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Get Started'}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="glass-card p-6 hover:shadow-neon-hover transition-all">
              <div className="rounded-full w-12 h-12 bg-certify-purple/20 flex-center mb-4 mx-auto">
                <Award className="text-certify-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tokenized Certificates</h3>
              <p className="text-muted-foreground">Convert certificates to NFTs on Solana blockchain for permanent access.</p>
            </div>
            
            <div className="glass-card p-6 hover:shadow-neon-hover transition-all">
              <div className="rounded-full w-12 h-12 bg-certify-blue/20 flex-center mb-4 mx-auto">
                <BadgeCheck className="text-certify-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-muted-foreground">Verify certificates automatically with our built-in verification system.</p>
            </div>
            
            <div className="glass-card p-6 hover:shadow-neon-hover transition-all">
              <div className="rounded-full w-12 h-12 bg-certify-purple/20 flex-center mb-4 mx-auto">
                <Shield className="text-certify-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Permanent Storage</h3>
              <p className="text-muted-foreground">Store certificates permanently on Arweave via Bundlr technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
