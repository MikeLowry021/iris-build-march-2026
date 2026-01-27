// Bookkeeper-specific types

export type BookkeeperClientStatus = 'pending' | 'in-progress' | 'submitted';
export type AdjustingEntryStatus = 'draft' | 'approved' | 'rejected';
export type DraftReportStatus = 'draft' | 'submitted' | 'approved';
export type VATTreatment = 'standard-15' | 'zero-rated' | 'exempt' | 'out-of-scope';

export interface BookkeeperClient {
  id: string;
  name: string;
  company: string;
  status: BookkeeperClientStatus;
  lastActivity: string;
  pendingTransactions: number;
  draftReports: number;
}

export interface GLAccount {
  code: string;
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

export interface TransactionCategory {
  id: string;
  name: string;
  glAccountCode: string;
  defaultVAT: VATTreatment;
}

export interface BookkeeperTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  glAccount?: string;
  vatTreatment?: VATTreatment;
  status: 'uncategorized' | 'categorized' | 'reviewed';
  bank: string;
  clientId: string;
}

export interface AdjustingEntry {
  id: string;
  clientId: string;
  date: string;
  description: string;
  entries: JournalLine[];
  status: AdjustingEntryStatus;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface DraftReport {
  id: string;
  clientId: string;
  type: 'trial-balance' | 'income-statement' | 'vat-summary';
  title: string;
  status: DraftReportStatus;
  createdAt: string;
  submittedAt?: string;
  notes?: string;
}

export interface ActivityItem {
  id: string;
  type: 'categorization' | 'entry' | 'report' | 'submission';
  description: string;
  clientName: string;
  timestamp: string;
}
