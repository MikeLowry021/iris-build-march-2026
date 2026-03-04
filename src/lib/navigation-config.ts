import { LayoutDashboard, Upload, Receipt, FileText, Calculator, FileSpreadsheet, CircleHelp as HelpCircle, Users, ClipboardCheck, BookOpen, Building2, Shield, Activity, Settings, Database, Bot, PenTool, FileCheck, ChartBar as BarChart3, Send, DollarSign, Briefcase, TrendingUp, History, ShieldCheck, Stamp } from 'lucide-react';
import { UserRole } from '@/lib/types';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const clientNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { label: 'Upload Statements', href: '/client/upload', icon: Upload },
  { label: 'My Transactions', href: '/client/transactions', icon: Receipt },
  { label: 'Financials', href: '/client/financials', icon: FileText },
  { label: 'Tax Status', href: '/client/tax-status', icon: Calculator },
  { label: 'Payslips', href: '/client/payslips', icon: FileSpreadsheet },
  { label: 'Reports', href: '/client/reports', icon: BarChart3 },
  { label: 'Help', href: '/client/help', icon: HelpCircle },
];

export const ceoNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/ceo', icon: LayoutDashboard },
  { label: 'Payroll', href: '/ceo/payroll', icon: DollarSign },
  { label: 'Employees', href: '/ceo/employees', icon: Users },
  { label: 'Tax Summary', href: '/ceo/tax', icon: Calculator },
  { label: 'Reimbursements', href: '/ceo/reimbursements', icon: Receipt },
  { label: 'Business Metrics', href: '/ceo/metrics', icon: TrendingUp },
  { label: 'Audit Trail', href: '/ceo/audit', icon: History },
  { label: 'Settings', href: '/ceo/settings', icon: Settings },
];

export const bookkeeperNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/bookkeeper', icon: LayoutDashboard },
  { label: 'My Clients', href: '/bookkeeper/my-clients', icon: Users },
  { label: 'Categorization', href: '/bookkeeper/clients/1/categorize', icon: Receipt },
  { label: 'Adjusting Entries', href: '/bookkeeper/clients/1/adjusting-entries', icon: BookOpen },
  { label: 'Submissions', href: '/bookkeeper/submissions', icon: Send },
  { label: 'Draft Reports', href: '/bookkeeper/clients/1/draft-reports', icon: ClipboardCheck },
  { label: 'Settings', href: '/bookkeeper/settings', icon: Settings },
  { label: 'Help', href: '/bookkeeper/help', icon: HelpCircle },
];

export const accountantNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/accountant', icon: LayoutDashboard },
  { label: 'Review Queue', href: '/accountant/review-queue', icon: ClipboardCheck },
  { label: 'All Clients', href: '/accountant/clients', icon: Users },
  { label: 'RFI Management', href: '/accountant/rfi', icon: HelpCircle },
  { label: 'Override Entries', href: '/accountant/override', icon: PenTool },
  { label: 'IT14SD', href: '/accountant/it14sd', icon: Calculator },
  { label: 'Reports', href: '/accountant/reports', icon: BarChart3 },
  { label: 'Settings', href: '/accountant/settings', icon: Settings },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Manage Clients', href: '/admin/manage-clients', icon: Building2 },
  { label: 'Manage Bookkeepers', href: '/admin/manage-bookkeepers', icon: Users },
  { label: 'DevOps Monitoring', href: '/admin/monitoring', icon: Activity },
  { label: 'Iris AI', href: '/admin/jerome', icon: Bot },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export const independentReviewerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/independent-reviewer/dashboard', icon: LayoutDashboard },
  { label: 'Review Queue', href: '/independent-reviewer/review-queue', icon: ClipboardCheck },
  { label: 'Client Review', href: '/independent-reviewer/client-review', icon: FileText },
  { label: 'Sign-Off', href: '/independent-reviewer/sign-off', icon: ShieldCheck },
  { label: 'Reports', href: '/independent-reviewer/reports', icon: BarChart3 },
];

export const auditorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/auditor/dashboard', icon: LayoutDashboard },
  { label: 'Audit Queue', href: '/auditor/audit-queue', icon: ClipboardCheck },
  { label: 'Client Audit', href: '/auditor/client-audit', icon: FileText },
  { label: 'Audit Opinion', href: '/auditor/audit-opinion', icon: Stamp },
  { label: 'Reports', href: '/auditor/reports', icon: BarChart3 },
];

export function getNavItemsForRole(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case 'admin':
      return adminNavItems;
    case 'accountant':
      return accountantNavItems;
    case 'bookkeeper':
      return bookkeeperNavItems;
    case 'ceo':
      return ceoNavItems;
    case 'independent-reviewer':
      return independentReviewerNavItems;
    case 'auditor':
      return auditorNavItems;
    case 'client':
    default:
      return clientNavItems;
  }
}

export function getPortalLabelForRole(role: UserRole | undefined): string {
  switch (role) {
    case 'admin':
      return 'Admin Portal';
    case 'accountant':
      return 'Accountant Portal';
    case 'bookkeeper':
      return 'Bookkeeper Portal';
    case 'ceo':
      return 'CEO Portal';
    case 'independent-reviewer':
      return 'Independent Reviewer Portal';
    case 'auditor':
      return 'Auditor Portal';
    case 'client':
    default:
      return 'Client Portal';
  }
}

export function getDashboardPathForRole(role: UserRole | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'accountant':
      return '/accountant';
    case 'bookkeeper':
      return '/bookkeeper';
    case 'ceo':
      return '/ceo';
    case 'independent-reviewer':
      return '/independent-reviewer/dashboard';
    case 'auditor':
      return '/auditor/dashboard';
    case 'client':
    default:
      return '/client';
  }
}
