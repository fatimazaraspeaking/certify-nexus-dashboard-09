import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import AppShell from "./components/layout/AppShell";
import { NotificationBanner } from "./components/layout/NotificationBanner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Certificates from "./pages/Certificates";
import CertificateDetail from "./pages/CertificateDetail";
import CertificateCreate from "./pages/CertificateCreate";
import CertificateView from "./pages/CertificateView";
import Verification from "./pages/Verification";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import FeedbackButton from "./components/feedback/FeedbackButton";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/view/:userId/:certificateId" element={<CertificateView />} />
      
      <Route path="/" element={<AppShell />}>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/certificates" 
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/certificates/:id" 
          element={
            <ProtectedRoute>
              <CertificateDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/certificates/create" 
          element={
            <ProtectedRoute>
              <CertificateCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verification" 
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProvider>
        <TooltipProvider>
          <NotificationBanner />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <FeedbackButton />
        </TooltipProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
