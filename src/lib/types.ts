export type UserRole = 'client' | 'accountant' | 'bookkeeper';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  vatStatus: StatusType;
  payeStatus: StatusType;
  financialsStatus: StatusType;
  taxStatus: StatusType;
  lastActivity: string;
  assignedAccountant?: string;
}

export type StatusType = 'complete' | 'pending' | 'action-required' | 'not-started';

export interface StatusCard {
  id: string;
  title: string;
  status: StatusType;
  description: string;
  dueDate?: string;
  progress?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  status: 'uncategorized' | 'categorized' | 'verified';
  bank: string;
}

export interface BankStatement {
  id: string;
  filename: string;
  uploadDate: string;
  bank: string;
  period: string;
  status: 'processing' | 'processed' | 'error';
  transactionCount?: number;
}
