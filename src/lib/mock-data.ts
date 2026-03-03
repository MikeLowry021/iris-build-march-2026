import { Client, User, StatusCard, Transaction, BankStatement } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'client@iris.demo',
    name: 'John Mokwena',
    role: 'client',
    company: 'Mokwena Trading (Pty) Ltd',
  },
  {
    id: '2',
    email: 'accountant@iris.demo',
    name: 'Sarah van der Berg',
    role: 'accountant',
    company: 'Iris Partners',
  },
  {
    id: '3',
    email: 'bookkeeper@iris.demo',
    name: 'Linda Dlamini',
    role: 'bookkeeper',
    company: 'Iris Partners',
  },
  {
    id: '4',
    email: 'admin@iris.demo',
    name: 'Dr. Pieter van Niekerk',
    role: 'admin',
    company: 'Iris Partners',
  },
];

export const mockClientStatusCards: StatusCard[] = [
  {
    id: 'vat',
    title: 'VAT Returns',
    status: 'pending',
    description: 'VAT201 submission for January 2026',
    dueDate: '2026-02-25',
    progress: 65,
  },
  {
    id: 'paye',
    title: 'PAYE',
    status: 'complete',
    description: 'EMP201 submitted for December 2025',
    progress: 100,
  },
  {
    id: 'financials',
    title: 'Financial Statements',
    status: 'action-required',
    description: 'Balance sheet review required',
    dueDate: '2026-01-31',
    progress: 40,
  },
  {
    id: 'tax',
    title: 'Income Tax',
    status: 'not-started',
    description: 'IT14 preparation for 2025 tax year',
    dueDate: '2026-06-30',
    progress: 0,
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Mokwena',
    email: 'john@mokwena.co.za',
    company: 'Mokwena Trading (Pty) Ltd',
    vatStatus: 'pending',
    payeStatus: 'complete',
    financialsStatus: 'action-required',
    taxStatus: 'not-started',
    lastActivity: '2 hours ago',
    assignedAccountant: 'Sarah van der Berg',
  },
  {
    id: '2',
    name: 'Thabo Nkosi',
    email: 'thabo@nkosi-tech.co.za',
    company: 'Nkosi Technologies CC',
    vatStatus: 'complete',
    payeStatus: 'pending',
    financialsStatus: 'complete',
    taxStatus: 'pending',
    lastActivity: '1 day ago',
    assignedAccountant: 'Sarah van der Berg',
  },
  {
    id: '3',
    name: 'Priya Naidoo',
    email: 'priya@coastalimports.co.za',
    company: 'Coastal Imports (Pty) Ltd',
    vatStatus: 'action-required',
    payeStatus: 'action-required',
    financialsStatus: 'pending',
    taxStatus: 'not-started',
    lastActivity: '3 days ago',
    assignedAccountant: 'Sarah van der Berg',
  },
  {
    id: '4',
    name: 'Willem Botha',
    email: 'willem@botha-farms.co.za',
    company: 'Botha Agricultural Holdings',
    vatStatus: 'complete',
    payeStatus: 'complete',
    financialsStatus: 'complete',
    taxStatus: 'complete',
    lastActivity: '1 week ago',
    assignedAccountant: 'Sarah van der Berg',
  },
  {
    id: '5',
    name: 'Fatima Mahomed',
    email: 'fatima@sparkclean.co.za',
    company: 'SparkClean Services',
    vatStatus: 'pending',
    payeStatus: 'complete',
    financialsStatus: 'pending',
    taxStatus: 'pending',
    lastActivity: '5 hours ago',
    assignedAccountant: 'Sarah van der Berg',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2026-01-15',
    description: 'CAPITEC TRANSFER - Supplier Payment',
    amount: -15420.00,
    category: 'Cost of Sales',
    status: 'categorized',
    bank: 'FNB',
  },
  {
    id: '2',
    date: '2026-01-14',
    description: 'EFT RECEIVED - Invoice #2456',
    amount: 45000.00,
    category: 'Revenue',
    status: 'verified',
    bank: 'FNB',
  },
  {
    id: '3',
    date: '2026-01-13',
    description: 'DEBIT ORDER - SARS VAT',
    amount: -12500.00,
    category: 'VAT Payable',
    status: 'categorized',
    bank: 'FNB',
  },
  {
    id: '4',
    date: '2026-01-12',
    description: 'POS PURCHASE - Office Depot',
    amount: -2340.50,
    status: 'uncategorized',
    bank: 'FNB',
  },
  {
    id: '5',
    date: '2026-01-11',
    description: 'EFT RECEIVED - Client ABC',
    amount: 28750.00,
    status: 'uncategorized',
    bank: 'FNB',
  },
];

export const mockBankStatements: BankStatement[] = [
  {
    id: '1',
    filename: 'FNB_Statement_Jan2026.pdf',
    uploadDate: '2026-01-10',
    bank: 'First National Bank',
    period: 'January 2026',
    status: 'processed',
    transactionCount: 45,
  },
  {
    id: '2',
    filename: 'ABSA_Statement_Dec2025.csv',
    uploadDate: '2026-01-05',
    bank: 'ABSA',
    period: 'December 2025',
    status: 'processed',
    transactionCount: 38,
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'complete':
    case 'verified':
      return 'success';
    case 'pending':
    case 'categorized':
      return 'warning';
    case 'action-required':
    case 'error':
      return 'error';
    default:
      return 'neutral';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'pending':
      return 'Pending';
    case 'action-required':
      return 'Action Required';
    case 'not-started':
      return 'Not Started';
    case 'verified':
      return 'Verified';
    case 'categorized':
      return 'Categorized';
    case 'uncategorized':
      return 'Uncategorized';
    default:
      return status;
  }
};
