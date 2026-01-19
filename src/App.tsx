import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import UploadStatements from "./pages/client/UploadStatements";
import Transactions from "./pages/client/Transactions";
import FinancialStatements from "./pages/client/FinancialStatements";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'client' | 'accountant' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'accountant' ? '/accountant' : '/client'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Client routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/upload"
        element={
          <ProtectedRoute allowedRole="client">
            <UploadStatements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/transactions"
        element={
          <ProtectedRoute allowedRole="client">
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/financials"
        element={
          <ProtectedRoute allowedRole="client">
            <FinancialStatements />
          </ProtectedRoute>
        }
      />

      {/* Accountant routes */}
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowedRole="accountant">
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
