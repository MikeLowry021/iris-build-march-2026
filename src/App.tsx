import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { JeromeProvider } from "@/contexts/JeromeContext";
import { JeromeAssistant } from "@/components/jerome";
import { getDashboardPathForRole } from "@/lib/navigation-config";
import { UserRole } from "@/lib/types";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";
import UploadStatements from "./pages/client/UploadStatements";
import Transactions from "./pages/client/Transactions";
import FinancialStatements from "./pages/client/FinancialStatements";

// Accountant pages
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import ClientReview from "./pages/accountant/ClientReview";

// Bookkeeper pages
import BookkeeperDashboard from "./pages/bookkeeper/BookkeeperDashboard";
import TransactionCategorization from "./pages/bookkeeper/TransactionCategorization";
import AdjustingEntries from "./pages/bookkeeper/AdjustingEntries";
import DraftReports from "./pages/bookkeeper/DraftReports";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookkeeperManagement from "./pages/admin/BookkeeperManagement";
import ClientManagement from "./pages/admin/ClientManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import JeromeAdmin from "./pages/admin/JeromeAdmin";

const queryClient = new QueryClient();

// Protected route wrapper with role-based access control
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check access
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to user's own dashboard
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
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
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/upload"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <UploadStatements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/transactions"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/financials"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <FinancialStatements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/tax-status"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payslips"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/reports"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/help"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Accountant routes */}
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/clients"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/clients/:clientId"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <ClientReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/review"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/it14sd"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/sign-off"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/audit-trail"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/reports"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/settings"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/help"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Bookkeeper routes */}
      <Route
        path="/bookkeeper"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <BookkeeperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <BookkeeperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/categorize"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <TransactionCategorization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/adjusting-entries"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <AdjustingEntries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/clients/:clientId/draft-reports"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <DraftReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookkeeper/help"
        element={
          <ProtectedRoute allowedRoles={['bookkeeper']}>
            <BookkeeperDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-clients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ClientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-bookkeepers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BookkeeperManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/backup-security"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jerome"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <JeromeAdmin />
          </ProtectedRoute>
        }
      />

      {/* Global settings route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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
