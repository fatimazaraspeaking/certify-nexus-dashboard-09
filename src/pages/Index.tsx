import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/shared/Logo';
import {
  Award,
  BadgeCheck,
  Shield,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  LucideIcon,
  Users,
  Zap,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { connect, connecting } = useWallet();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      await connect();
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: Award,
      color: 'certify-purple',
      title: 'Tokenized Certificates',
      description: 'Convert certificates to NFTs on Solana blockchain for permanent access and ownership.'
    },
    {
      icon: BadgeCheck,
      color: 'certify-blue',
      title: 'Instant Verification',
      description: 'Verify certificates automatically with our secure blockchain-based verification system.'
    },
    {
      icon: Shield,
      color: 'certify-purple',
      title: 'Permanent Storage',
      description: 'Store certificates permanently on Arweave via Bundlr technology for lifelong access.'
    }
  ];

  const benefitsList = [
    {
      icon: CheckCircle,
      title: "Tamper-Proof",
      description: "Once stored on the blockchain, certificates cannot be altered or falsified."
    },
    {
      icon: Users,
      title: "Institution Portal",
      description: "Dedicated dashboard for educational institutions to issue and manage certificates."
    },
    {
      icon: Zap,
      title: "Instant Sharing",
      description: "Share your verified credentials with employers with a single link."
    }
  ];

  const FeatureCard = ({ icon: Icon, color, title, description, delay = 0 }) => (
    <div className="glass-card p-6 md:p-8 hover:shadow-neon-hover transition-all group transform hover:-translate-y-1 duration-300 h-full flex flex-col">
      <div className={`rounded-full w-14 h-14 bg-${color}/20 flex items-center justify-center mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`text-${color}`} size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center md:text-left">{title}</h3>
      <p className="text-muted-foreground text-center md:text-left flex-grow">{description}</p>
    </div>
  );

  const BenefitItem = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-3 mb-6">
      <div className="bg-certify-blue/10 rounded-full p-2 mt-1">
        <Icon size={20} className="text-certify-blue" />
      </div>
      <div>
        <h4 className="font-medium text-lg">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/90">
      {/* Header with glass effect when scrolled */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-background/70 shadow-sm' : ''}`}>
        <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6 mr-6">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#benefits" className="text-foreground/80 hover:text-foreground transition-colors">Benefits</a>
              <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How It Works</a>
            </nav>

            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-cert-gradient hover:shadow-neon-hover transition-all px-6 py-3 text-base">
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={connect}
                disabled={connecting}
                className="bg-cert-gradient hover:shadow-neon-hover transition-all px-6 py-3 text-base"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-lg animate-fadeIn">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4 mb-6">
                <a
                  href="#features"
                  className="text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#benefits"
                  className="text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Benefits
                </a>
                <a
                  href="#how-it-works"
                  className="text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
              </nav>

              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-cert-gradient hover:shadow-neon-hover transition-all px-6 py-3 text-base"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    connect();
                    setMobileMenuOpen(false);
                  }}
                  disabled={connecting}
                  className="w-full bg-cert-gradient hover:shadow-neon-hover transition-all px-6 py-3 text-base"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24 md:py-32 relative overflow-hidden">
        {/* Background Gradient Blobs with animation */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-6/12 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-gradient">Tokenized Certificate</span> Platform
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-8">
                Store your certificates on the blockchain, verify them instantly, and mint them as NFTs on Solana. Secure, transparent, and tamper-proof.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <Button
                  onClick={handleGetStarted}
                  className="bg-cert-gradient text-white px-6 py-3 text-base rounded-xl hover:shadow-neon-hover transition-all"
                  disabled={connecting}
                >
                  {connecting ? 'Connecting...' : 'Get Started'}
                  <ArrowRight className="ml-2" />
                </Button>
                <a href="#how-it-works">
                  <Button
                    variant="outline"
                    className="px-6 py-3 text-base rounded-xl border-2 hover:bg-background/50 transition-all"
                  >
                    Learn More
                    <ChevronDown className="ml-2" />
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="hidden md:flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 text-sm font-medium text-indigo-700 shadow-sm border border-indigo-200">
                  <span>Coming Soon</span>
                </div>

                <div className="w-px h-6 bg-border mx-3"></div>

                <div className="flex items-center">
                  <BadgeCheck className="text-sky-500 mr-1" size={16} />
                  <span>SOL Ecosystem</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="md:w-6/12 mt-8 md:mt-0">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Certificate Preview Graphic */}
                <div className="absolute inset-0 rounded-3xl border border-border bg-gradient-to-br from-background to-background/50 backdrop-blur-sm p-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="h-full rounded-xl border border-border/50 bg-card flex flex-col p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-certify-purple/20 flex items-center justify-center">
                        <Award className="text-certify-purple" size={28} />
                      </div>
                      <h3 className="text-lg font-semibold">Certificate of Achievement</h3>
                      <p className="text-sm text-muted-foreground">Blockchain Verified</p>
                    </div>
                    <div className="flex-grow border-t border-border pt-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded-full w-3/4 mx-auto"></div>
                        <div className="h-4 bg-muted rounded-full w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded-full w-5/6 mx-auto"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">SOL-CERT-1234</div>
                      <div className="bg-cert-gradient text-white text-xs py-1 px-3 rounded-full">Verified</div>
                    </div>
                  </div>
                </div>

                {/* Second Certificate for Depth */}
                <div className="absolute inset-0 rounded-3xl border border-border bg-gradient-to-br from-background to-background/50 backdrop-blur-sm p-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 -z-10">
                  <div className="h-full rounded-xl border border-border/50 bg-card">
                    {/* Just the outline for depth */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:flex justify-center mt-16">
            <a
              href="#features"
              className="animate-bounce bg-card/50 p-2 w-10 h-10 ring-1 ring-border shadow-lg rounded-full flex items-center justify-center"
            >
              <ChevronDown size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="text-gradient">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to create, verify, and manage blockchain certificates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                color={feature.color}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Image */}
      <section id="benefits" className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/95 to-background relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left: Image */}
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="relative">
                {/* Main image */}
                <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
                  <div className="aspect-[4/3] bg-certify-blue/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm px-6 py-8 bg-card rounded-xl border border-border relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <Shield className="text-certify-purple" size={20} />
                          <span className="font-medium">ChainProof</span>
                        </div>
                        <div className="bg-cert-gradient text-white text-xs py-1 px-3 rounded-full">Valid</div>
                      </div>
                      <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Certificate ID</p>
                          <div className="flex items-center gap-2">
                            <div className="bg-muted py-1 px-3 rounded text-sm font-mono">SOL-CERT-5678</div>
                            <BadgeCheck className="text-certify-blue" size={16} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Issued By</p>
                          <div className="h-4 bg-muted rounded-full w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Issued To</p>
                          <div className="h-4 bg-muted rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                        <span>Issued: April 2025</span>
                        <span>On-chain: Yes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 rounded-full bg-certify-purple/10 blur-xl"></div>
                <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 rounded-full bg-certify-blue/10 blur-xl"></div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Benefits of <span className="text-gradient">Blockchain</span> Certificates
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform leverages blockchain technology to provide secure, immutable certification that traditional methods can't match.
              </p>

              <div className="space-y-4">
                {benefitsList.map((benefit, index) => (
                  <BenefitItem
                    key={index}
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the process of creating and verifying blockchain certificates
            </p>
          </div>

          <div className="relative">
            {/* Line connecting steps */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block"></div>

            {/* Steps */}
            <div className="space-y-12 md:space-y-0">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">Link your Solana wallet to get started. Our platform supports most major wallet providers.</p>
                </div>
                <div className="flex items-center mb-4 md:mb-0 order-1 md:order-2">
                  <div className="relative md:mx-auto">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-certify-purple flex items-center justify-center text-white font-bold relative z-10">
                      1
                    </div>
                    <div className="absolute -inset-2 bg-certify-purple/20 rounded-full blur-sm -z-10"></div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 hidden md:block order-3"></div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-16 hidden md:block order-1"></div>
                <div className="flex items-center mb-4 md:mb-0 order-2">
                  <div className="relative md:mx-auto">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-certify-blue flex items-center justify-center text-white font-bold relative z-10">
                      2
                    </div>
                    <div className="absolute -inset-2 bg-certify-blue/20 rounded-full blur-sm -z-10"></div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 order-3">
                  <h3 className="text-xl font-semibold mb-2">Upload Your Certificate</h3>
                  <p className="text-muted-foreground">Upload your certificates or create new ones directly on our platform.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-semibold mb-2">Mint as NFT</h3>
                  <p className="text-muted-foreground">Convert your certificate to an NFT on the Solana blockchain with just a few clicks.</p>
                </div>
                <div className="flex items-center mb-4 md:mb-0 order-1 md:order-2">
                  <div className="relative md:mx-auto">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-certify-purple flex items-center justify-center text-white font-bold relative z-10">
                      3
                    </div>
                    <div className="absolute -inset-2 bg-certify-purple/20 rounded-full blur-sm -z-10"></div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 hidden md:block order-3"></div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-16 hidden md:block order-1"></div>
                <div className="flex items-center mb-4 md:mb-0 order-2">
                  <div className="relative md:mx-auto">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-certify-blue flex items-center justify-center text-white font-bold relative z-10">
                      4
                    </div>
                    <div className="absolute -inset-2 bg-certify-blue/20 rounded-full blur-sm -z-10"></div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 order-3">
                  <h3 className="text-xl font-semibold mb-2">Share & Verify</h3>
                  <p className="text-muted-foreground">Share your credentials with anyone, who can instantly verify their authenticity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Button
              onClick={handleGetStarted}
              className="bg-cert-gradient text-white px-6 py-3 text-base rounded-xl hover:shadow-neon-hover transition-all"
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Start Now'}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="md:w-1/3">
              <Logo />
              <p className="text-muted-foreground mt-4 max-w-sm">
                Secure, verifiable certificates on the Solana blockchain.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div>
                <h4 className="font-medium mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a></li>
                  <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                  <li><a href="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ChainProof. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.385-.39.77-.532 1.156a14.932 14.932 0 0 0-4.498 0 9.822 9.822 0 0 0-.54-1.156.077.077 0 0 0-.079-.036 16.165 16.165 0 0 0-4.885 1.49.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 16.314 16.314 0 0 0 4.92 2.475.078.078 0 0 0 .084-.028 10.78 10.78 0 0 0 .948-1.535.075.075 0 0 0-.041-.105c-.534-.203-1.045-.443-1.533-.714a.077.077 0 0 1-.008-.127c.1-.076.205-.152.302-.23a.074.074 0 0 1 .078-.01c3.927 1.783 8.18 1.783 12.063 0a.074.074 0 0 1 .079.01c.097.078.201.154.305.23a.077.077 0 0 1-.006.127c-.49.271-.999.51-1.535.714a.075.075 0 0 0-.041.105c.282.543.62 1.057.949 1.535a.077.077 0 0 0 .084.028 16.235 16.235 0 0 0 4.92-2.475.08.08 0 0 0 .033-.055c.499-5.152-.846-9.643-3.549-13.442a.062.062 0 0 0-.031-.027zM8.02 15.278c-.982 0-1.79-.887-1.79-1.973 0-1.088.794-1.976 1.79-1.976 1.005 0 1.8.888 1.79 1.976 0 1.086-.796 1.973-1.79 1.973zm6.096 0c-.982 0-1.79-.887-1.79-1.973 0-1.088.796-1.976 1.79-1.976 1.006 0 1.802.888 1.79 1.976 0 1.086-.796 1.973-1.79 1.973z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add custom styles to global CSS file */}
      <style jsx global>{`
        /* Animation for background blobs */
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Text gradient */
        .text-gradient {
          background: linear-gradient(to right, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Certificate gradient */
        .bg-cert-gradient {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
        }

        /* Glass card effect */
        .glass-card {
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }

        /* Neon hover effect */
        .hover\:shadow-neon-hover:hover {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }

        /* Helper class for centering */
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Fade-in animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Index;