// Mock data for Accountant profile
import { ReviewStatus } from './review-types';

// Types for Accountant workflow
export type RFIStatus = 'pending' | 'resolved' | 'escalated';
export type RFIType = 'error' | 'warning' | 'clarification';
export type OverrideReason = 'incorrect-categorization' | 'system-error' | 'tax-adjustment' | 'bookkeeper-typo' | 'other';

export interface AccountantProfile {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  officeLocation: string;
  role: 'senior' | 'associate';
  signatureStyle: 'typed' | 'electronic';
  canOverride: boolean;
}

export interface PendingSubmission {
  id: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  period: string;
  periodLabel: string;
  bookkeeperName: string;
  transactionCount: number;
  adjustingEntries: number;
  glVariance: number | null;
  isBalanced: boolean;
  dueDate: string;
  status: 'pending_review' | 'in_review' | 'rfi_pending' | 'ready_to_sign' | 'approved';
  submittedAt: string;
  urgency: 'normal' | 'urgent' | 'overdue';
}

export interface RFI {
  id: string;
  submissionId: string;
  clientId: string;
  clientName: string;
  bookkeeperName: string;
  bookkeeperEmail: string;
  type: RFIType;
  issue: string;
  message: string;
  attachedAccount?: string;
  attachedTransaction?: string;
  attachedDate?: string;
  status: RFIStatus;
  createdAt: string;
  createdBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
  response?: string;
}

export interface OverrideEntry {
  id: string;
  submissionId: string;
  clientId: string;
  clientName: string;
  transactionId: string;
  originalAccount: string;
  originalAmount: number;
  newAccount: string;
  newAmount: number;
  reason: OverrideReason;
  notes: string;
  overriddenBy: string;
  overriddenAt: string;
}

export interface DigitalSignature {
  accountantName: string;
  registrationNumber: string;
  timestamp: string;
  timezone: string;
  signatureHash: string;
  confirmation: string;
}

// Mock Accountant Profile
export const mockAccountantProfile: AccountantProfile = {
  id: 'acc_001',
  name: 'Sarah van der Berg',
  email: 'sarah@iris.local',
  registrationNumber: 'CA(SA) 123456',
  officeLocation: 'Johannesburg Office',
  role: 'senior',
  signatureStyle: 'typed',
  canOverride: true,
};

// Mock Pending Submissions
export const mockPendingSubmissions: PendingSubmission[] = [
  {
    id: 'sub_001',
    clientId: '1',
    clientName: 'John Mokwena',
    clientCompany: 'Mokwena Trading (Pty) Ltd',
    period: '2026-01',
    periodLabel: 'January 2026',
    bookkeeperName: 'Linda Dlamini',
    transactionCount: 45,
    adjustingEntries: 2,
    glVariance: null,
    isBalanced: true,
    dueDate: '2026-02-05',
    status: 'ready_to_sign',
    submittedAt: '2026-01-28T09:30:00Z',
    urgency: 'normal',
  },
  {
    id: 'sub_002',
    clientId: '2',
    clientName: 'Thabo Nkosi',
    clientCompany: 'Nkosi Technologies CC',
    period: '2026-01',
    periodLabel: 'January 2026',
    bookkeeperName: 'Linda Dlamini',
    transactionCount: 32,
    adjustingEntries: 1,
    glVariance: 2500,
    isBalanced: false,
    dueDate: '2026-02-03',
    status: 'in_review',
    submittedAt: '2026-01-27T14:15:00Z',
    urgency: 'urgent',
  },
  {
    id: 'sub_003',
    clientId: '3',
    clientName: 'Priya Naidoo',
    clientCompany: 'Coastal Imports (Pty) Ltd',
    period: '2026-01',
    periodLabel: 'January 2026',
    bookkeeperName: 'Jane Smith',
    transactionCount: 58,
    adjustingEntries: 3,
    glVariance: null,
    isBalanced: true,
    dueDate: '2026-02-10',
    status: 'rfi_pending',
    submittedAt: '2026-01-25T11:00:00Z',
    urgency: 'normal',
  },
  {
    id: 'sub_004',
    clientId: '5',
    clientName: 'Fatima Mahomed',
    clientCompany: 'SparkClean Services',
    period: '2025-12',
    periodLabel: 'December 2025',
    bookkeeperName: 'Linda Dlamini',
    transactionCount: 28,
    adjustingEntries: 1,
    glVariance: null,
    isBalanced: true,
    dueDate: '2026-01-30',
    status: 'approved',
    submittedAt: '2026-01-20T08:45:00Z',
    urgency: 'normal',
  },
  {
    id: 'sub_005',
    clientId: '6',
    clientName: 'David van Wyk',
    clientCompany: 'Van Wyk Engineering',
    period: '2026-01',
    periodLabel: 'January 2026',
    bookkeeperName: 'Jane Smith',
    transactionCount: 42,
    adjustingEntries: 0,
    glVariance: null,
    isBalanced: true,
    dueDate: '2026-02-01',
    status: 'pending_review',
    submittedAt: '2026-01-28T10:00:00Z',
    urgency: 'overdue',
  },
];

// Mock RFIs
export const mockRFIs: RFI[] = [
  {
    id: 'rfi_001',
    submissionId: 'sub_003',
    clientId: '3',
    clientName: 'Coastal Imports (Pty) Ltd',
    bookkeeperName: 'Jane Smith',
    bookkeeperEmail: 'jane@iris.local',
    type: 'error',
    issue: 'Salary entry R50,000 in January - not explained',
    message: 'Please provide supporting documentation for the R50,000 salary payment made on 15 January. This amount exceeds normal payroll by R25,000.',
    attachedAccount: '5100 - Salaries & Wages',
    attachedDate: '2026-01-15',
    status: 'pending',
    createdAt: '2026-01-26T10:30:00Z',
    createdBy: 'Sarah van der Berg',
  },
  {
    id: 'rfi_002',
    submissionId: 'sub_002',
    clientId: '2',
    clientName: 'Nkosi Technologies CC',
    bookkeeperName: 'Linda Dlamini',
    bookkeeperEmail: 'linda@iris.local',
    type: 'clarification',
    issue: 'Equipment purchase categorization',
    message: 'The R85,000 equipment purchase on 20 January appears to be categorized as an expense. Please confirm if this should be capitalized as a fixed asset.',
    attachedAccount: '5400 - Office Supplies',
    attachedTransaction: 't_equipment_001',
    attachedDate: '2026-01-20',
    status: 'pending',
    createdAt: '2026-01-27T15:00:00Z',
    createdBy: 'Sarah van der Berg',
  },
  {
    id: 'rfi_003',
    submissionId: 'sub_001',
    clientId: '1',
    clientName: 'Mokwena Trading (Pty) Ltd',
    bookkeeperName: 'Linda Dlamini',
    bookkeeperEmail: 'linda@iris.local',
    type: 'warning',
    issue: 'VAT calculation discrepancy',
    message: 'The VAT on invoice #3045 appears to be calculated at 14% instead of 15%. Please verify and correct if needed.',
    attachedAccount: '2100 - VAT Payable',
    attachedDate: '2026-01-10',
    status: 'resolved',
    createdAt: '2026-01-25T09:00:00Z',
    createdBy: 'Sarah van der Berg',
    resolvedAt: '2026-01-26T11:30:00Z',
    resolvedBy: 'Linda Dlamini',
    response: 'Corrected. The invoice was from 2024 when the rate was still 14%. I have updated the categorization to reflect the correct VAT treatment.',
  },
];

// Mock Override Entries
export const mockOverrideEntries: OverrideEntry[] = [
  {
    id: 'override_001',
    submissionId: 'sub_004',
    clientId: '5',
    clientName: 'SparkClean Services',
    transactionId: 't_spark_001',
    originalAccount: '5400 - Office Supplies',
    originalAmount: 12500,
    newAccount: '1500 - Equipment',
    newAmount: 12500,
    reason: 'incorrect-categorization',
    notes: 'This is a vacuum cleaner purchase which should be capitalized as equipment, not expensed as office supplies. Useful life > 1 year.',
    overriddenBy: 'Sarah van der Berg',
    overriddenAt: '2026-01-22T14:30:00Z',
  },
];

// Stats calculation helpers
export const getAccountantStats = () => {
  const pendingReview = mockPendingSubmissions.filter(s => 
    s.status === 'pending_review' || s.status === 'in_review'
  ).length;
  
  const awaitingRFI = mockRFIs.filter(r => r.status === 'pending').length;
  
  const approvedThisMonth = mockPendingSubmissions.filter(s => 
    s.status === 'approved' && s.submittedAt.startsWith('2026-01')
  ).length;
  
  const readyToSign = mockPendingSubmissions.filter(s => 
    s.status === 'ready_to_sign'
  ).length;

  return {
    pendingReview,
    awaitingRFI,
    approvedThisMonth,
    readyToSign,
  };
};

export const getSubmissionsByStatus = (status: PendingSubmission['status']) => {
  return mockPendingSubmissions.filter(s => s.status === status);
};

export const getSubmissionById = (id: string) => {
  return mockPendingSubmissions.find(s => s.id === id);
};

export const getRFIsBySubmission = (submissionId: string) => {
  return mockRFIs.filter(r => r.submissionId === submissionId);
};

export const getOverridesBySubmission = (submissionId: string) => {
  return mockOverrideEntries.filter(o => o.submissionId === submissionId);
};

export const getUrgencyConfig = (urgency: PendingSubmission['urgency']) => {
  switch (urgency) {
    case 'overdue':
      return { label: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-500/10' };
    case 'urgent':
      return { label: 'Urgent', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    default:
      return { label: 'Normal', color: 'text-green-600', bgColor: 'bg-green-500/10' };
  }
};

export const getStatusConfig = (status: PendingSubmission['status']) => {
  switch (status) {
    case 'pending_review':
      return { label: 'Pending Review', color: 'text-blue-600', bgColor: 'bg-blue-500/10' };
    case 'in_review':
      return { label: 'In Review', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    case 'rfi_pending':
      return { label: 'RFI Pending', color: 'text-orange-600', bgColor: 'bg-orange-500/10' };
    case 'ready_to_sign':
      return { label: 'Ready to Sign', color: 'text-purple-600', bgColor: 'bg-purple-500/10' };
    case 'approved':
      return { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-500/10' };
    default:
      return { label: status, color: 'text-muted-foreground', bgColor: 'bg-muted' };
  }
};
