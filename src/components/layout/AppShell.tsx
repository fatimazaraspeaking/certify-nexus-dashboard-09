
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Award, 
  Home, 
  LogOut, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  FileCheck, 
  BadgeCheck 
} from 'lucide-react';
import { useState } from 'react';
import Logo from '../shared/Logo';

const AppShell = () => {
  const { isAuthenticated, user } = useAuth();
  const { disconnect } = useWallet();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = async () => {
    await disconnect();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <div className="p-6">
              <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col gap-6 py-4">
            <nav className="space-y-2 px-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2 text-left"
                onClick={() => handleNavigate('/dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2 text-left"
                onClick={() => handleNavigate('/certificates')}
              >
                <Award size={20} />
                <span>Certificates</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2 text-left"
                onClick={() => handleNavigate('/verification')}
              >
                <FileCheck size={20} />
                <span>Verification</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2 text-left"
                onClick={() => handleNavigate('/profile')}
              >
                <User size={20} />
                <span>Profile</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background border-b">
          <Logo />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex flex-col bg-background pt-16">
            <nav className="flex flex-col gap-2 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-4 text-left"
                onClick={() => handleNavigate('/dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-4 text-left"
                onClick={() => handleNavigate('/certificates')}
              >
                <Award size={20} />
                <span>Certificates</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-4 text-left"
                onClick={() => handleNavigate('/verification')}
              >
                <FileCheck size={20} />
                <span>Verification</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-4 text-left"
                onClick={() => handleNavigate('/profile')}
              >
                <User size={20} />
                <span>Profile</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 p-4 text-left mt-8"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </Button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 pt-0 md:pt-0 mt-16 md:mt-0 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
