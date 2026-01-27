import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { JeromeProvider } from "@/contexts/JeromeContext";
import { JeromeAssistant } from "@/components/jerome";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import UploadStatements from "./pages/client/UploadStatements";
import Transactions from "./pages/client/Transactions";
import FinancialStatements from "./pages/client/FinancialStatements";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import ClientReview from "./pages/accountant/ClientReview";
import BookkeeperDashboard from "./pages/bookkeeper/BookkeeperDashboard";
import TransactionCategorization from "./pages/bookkeeper/TransactionCategorization";
import AdjustingEntries from "./pages/bookkeeper/AdjustingEntries";
import DraftReports from "./pages/bookkeeper/DraftReports";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookkeeperManagement from "./pages/admin/BookkeeperManagement";
import ClientManagement from "./pages/admin/ClientManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'client' | 'accountant' | 'bookkeeper' | 'admin' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const redirectPath = user?.role === 'admin'
      ? '/admin'
      : user?.role === 'accountant' 
        ? '/accountant' 
        : user?.role === 'bookkeeper' 
          ? '/bookkeeper' 
          : '/client';
    return <Navigate to={redirectPath} replace />;
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
      <Route
        path="/accountant/clients/:clientId"
        element={
          <ProtectedRoute allowedRole="accountant">
            <ClientReview />
          </ProtectedRoute>
        }
      />

      {/* Bookkeeper routes */}
      <Route
        path="/bookkeeper"
        element={
          <ProtectedRoute allowedRole="bookkeeper">
            <BookkeeperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/categorize"
        element={
          <ProtectedRoute allowedRole="bookkeeper">
            <TransactionCategorization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/adjusting-entries"
        element={
          <ProtectedRoute allowedRole="bookkeeper">
            <AdjustingEntries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/draft-reports"
        element={
          <ProtectedRoute allowedRole="bookkeeper">
            <DraftReports />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-bookkeepers"
        element={
          <ProtectedRoute allowedRole="admin">
            <BookkeeperManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-clients"
        element={
          <ProtectedRoute allowedRole="admin">
            <ClientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRole="admin">
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRole="admin">
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppWithJerome() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <AppRoutes />
      {/* Jerome appears on all authenticated pages */}
      {isAuthenticated && <JeromeAssistant />}
    </>
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
            <JeromeProvider>
              <AppWithJerome />
            </JeromeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
