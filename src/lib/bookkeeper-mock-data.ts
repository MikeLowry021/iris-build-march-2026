import {
  BookkeeperClient,
  GLAccount,
  TransactionCategory,
  BookkeeperTransaction,
  AdjustingEntry,
  DraftReport,
  ActivityItem,
} from './bookkeeper-types';

// 5 Assigned clients (subset of all clients)
export const mockBookkeeperClients: BookkeeperClient[] = [
  {
    id: '1',
    name: 'John Mokwena',
    company: 'Mokwena Trading (Pty) Ltd',
    status: 'in-progress',
    lastActivity: '2 hours ago',
    pendingTransactions: 12,
    draftReports: 1,
  },
  {
    id: '2',
    name: 'Thabo Nkosi',
    company: 'Nkosi Technologies CC',
    status: 'pending',
    lastActivity: '1 day ago',
    pendingTransactions: 8,
    draftReports: 0,
  },
  {
    id: '3',
    name: 'Priya Naidoo',
    company: 'Coastal Imports (Pty) Ltd',
    status: 'submitted',
    lastActivity: '3 days ago',
    pendingTransactions: 0,
    draftReports: 1,
  },
  {
    id: '5',
    name: 'Fatima Mahomed',
    company: 'SparkClean Services',
    status: 'pending',
    lastActivity: '5 hours ago',
    pendingTransactions: 5,
    draftReports: 0,
  },
  {
    id: '6',
    name: 'David van Wyk',
    company: 'Van Wyk Engineering',
    status: 'in-progress',
    lastActivity: '1 hour ago',
    pendingTransactions: 0,
    draftReports: 0,
  },
];

// Chart of Accounts (GL Accounts)
export const mockGLAccounts: GLAccount[] = [
  // Assets
  { code: '1000', name: 'Bank - FNB Business', category: 'asset' },
  { code: '1010', name: 'Bank - ABSA', category: 'asset' },
  { code: '1100', name: 'Accounts Receivable', category: 'asset' },
  { code: '1200', name: 'Inventory', category: 'asset' },
  { code: '1300', name: 'Prepaid Expenses', category: 'asset' },
  { code: '1500', name: 'Equipment', category: 'asset' },
  { code: '1510', name: 'Accumulated Depreciation', category: 'asset' },
  // Liabilities
  { code: '2000', name: 'Accounts Payable', category: 'liability' },
  { code: '2100', name: 'VAT Payable', category: 'liability' },
  { code: '2200', name: 'PAYE Payable', category: 'liability' },
  { code: '2300', name: 'Accrued Expenses', category: 'liability' },
  { code: '2400', name: 'Short-term Loan', category: 'liability' },
  // Equity
  { code: '3000', name: 'Share Capital', category: 'equity' },
  { code: '3100', name: 'Retained Earnings', category: 'equity' },
  // Revenue
  { code: '4000', name: 'Sales Revenue', category: 'revenue' },
  { code: '4100', name: 'Service Revenue', category: 'revenue' },
  { code: '4200', name: 'Interest Income', category: 'revenue' },
  // Expenses
  { code: '5000', name: 'Cost of Sales', category: 'expense' },
  { code: '5100', name: 'Salaries & Wages', category: 'expense' },
  { code: '5200', name: 'Rent Expense', category: 'expense' },
  { code: '5300', name: 'Utilities', category: 'expense' },
  { code: '5400', name: 'Office Supplies', category: 'expense' },
  { code: '5500', name: 'Insurance', category: 'expense' },
  { code: '5600', name: 'Depreciation Expense', category: 'expense' },
  { code: '5700', name: 'Professional Fees', category: 'expense' },
  { code: '5800', name: 'Bank Charges', category: 'expense' },
  { code: '5900', name: 'Marketing & Advertising', category: 'expense' },
];

// Transaction categories
export const mockCategories: TransactionCategory[] = [
  { id: '1', name: 'Sales', glAccountCode: '4000', defaultVAT: 'standard-15' },
  { id: '2', name: 'Service Income', glAccountCode: '4100', defaultVAT: 'standard-15' },
  { id: '3', name: 'Cost of Sales', glAccountCode: '5000', defaultVAT: 'standard-15' },
  { id: '4', name: 'Salaries', glAccountCode: '5100', defaultVAT: 'exempt' },
  { id: '5', name: 'Rent', glAccountCode: '5200', defaultVAT: 'exempt' },
  { id: '6', name: 'Utilities', glAccountCode: '5300', defaultVAT: 'standard-15' },
  { id: '7', name: 'Office Supplies', glAccountCode: '5400', defaultVAT: 'standard-15' },
  { id: '8', name: 'Insurance', glAccountCode: '5500', defaultVAT: 'exempt' },
  { id: '9', name: 'Professional Fees', glAccountCode: '5700', defaultVAT: 'standard-15' },
  { id: '10', name: 'Bank Charges', glAccountCode: '5800', defaultVAT: 'exempt' },
  { id: '11', name: 'Marketing', glAccountCode: '5900', defaultVAT: 'standard-15' },
];

// 25 Transactions pending categorization (across multiple clients)
export const mockBookkeeperTransactions: BookkeeperTransaction[] = [
  // Client 1 - Mokwena Trading (12 transactions)
  { id: 't1', clientId: '1', date: '2026-01-20', description: 'EFT RECEIVED - Invoice #3001', amount: 45000.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't2', clientId: '1', date: '2026-01-19', description: 'CAPITEC TRANSFER - Supplier ABC', amount: -15420.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't3', clientId: '1', date: '2026-01-18', description: 'DEBIT ORDER - Telkom', amount: -1250.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't4', clientId: '1', date: '2026-01-17', description: 'POS PURCHASE - Makro', amount: -3420.50, status: 'uncategorized', bank: 'FNB' },
  { id: 't5', clientId: '1', date: '2026-01-16', description: 'EFT RECEIVED - Client XYZ', amount: 28750.00, category: 'Sales', glAccount: '4000', vatTreatment: 'standard-15', status: 'categorized', bank: 'FNB' },
  { id: 't6', clientId: '1', date: '2026-01-15', description: 'DEBIT ORDER - SARS VAT', amount: -12500.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't7', clientId: '1', date: '2026-01-14', description: 'CASH DEPOSIT', amount: 5000.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't8', clientId: '1', date: '2026-01-13', description: 'EFT PAYMENT - Office Rent', amount: -18000.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't9', clientId: '1', date: '2026-01-12', description: 'BANK CHARGES', amount: -145.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't10', clientId: '1', date: '2026-01-11', description: 'EFT RECEIVED - Invoice #2998', amount: 32100.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't11', clientId: '1', date: '2026-01-10', description: 'DEBIT ORDER - Insurance', amount: -2450.00, status: 'uncategorized', bank: 'FNB' },
  { id: 't12', clientId: '1', date: '2026-01-09', description: 'POS PURCHASE - Builders Warehouse', amount: -890.00, status: 'uncategorized', bank: 'FNB' },
  
  // Client 2 - Nkosi Technologies (8 transactions)
  { id: 't13', clientId: '2', date: '2026-01-20', description: 'EFT RECEIVED - Consulting Fee', amount: 75000.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't14', clientId: '2', date: '2026-01-19', description: 'DEBIT ORDER - Microsoft 365', amount: -2500.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't15', clientId: '2', date: '2026-01-18', description: 'EFT PAYMENT - Contractor', amount: -25000.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't16', clientId: '2', date: '2026-01-17', description: 'BANK CHARGES', amount: -89.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't17', clientId: '2', date: '2026-01-16', description: 'EFT RECEIVED - Project Alpha', amount: 120000.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't18', clientId: '2', date: '2026-01-15', description: 'POS PURCHASE - Incredible Connection', amount: -15999.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't19', clientId: '2', date: '2026-01-14', description: 'DEBIT ORDER - Fibre Internet', amount: -1499.00, status: 'uncategorized', bank: 'ABSA' },
  { id: 't20', clientId: '2', date: '2026-01-13', description: 'EFT PAYMENT - Salaries', amount: -85000.00, status: 'uncategorized', bank: 'ABSA' },
  
  // Client 5 - SparkClean (5 transactions)
  { id: 't21', clientId: '5', date: '2026-01-20', description: 'EFT RECEIVED - Monthly Retainer', amount: 35000.00, status: 'uncategorized', bank: 'Capitec' },
  { id: 't22', clientId: '5', date: '2026-01-19', description: 'EFT PAYMENT - Cleaning Supplies', amount: -4500.00, status: 'uncategorized', bank: 'Capitec' },
  { id: 't23', clientId: '5', date: '2026-01-18', description: 'DEBIT ORDER - Vehicle Finance', amount: -5800.00, status: 'uncategorized', bank: 'Capitec' },
  { id: 't24', clientId: '5', date: '2026-01-17', description: 'BANK CHARGES', amount: -65.00, status: 'uncategorized', bank: 'Capitec' },
  { id: 't25', clientId: '5', date: '2026-01-16', description: 'EFT RECEIVED - Once-off Cleaning', amount: 8500.00, status: 'uncategorized', bank: 'Capitec' },
];

// 3 Draft adjusting entries
export const mockAdjustingEntries: AdjustingEntry[] = [
  {
    id: 'ae1',
    clientId: '1',
    date: '2026-01-31',
    description: 'Depreciation for January 2026',
    entries: [
      { id: 'jl1', accountCode: '5600', accountName: 'Depreciation Expense', debit: 2500.00, credit: 0 },
      { id: 'jl2', accountCode: '1510', accountName: 'Accumulated Depreciation', debit: 0, credit: 2500.00 },
    ],
    status: 'draft',
    createdBy: 'Linda Dlamini',
    createdAt: '2026-01-25T10:30:00Z',
  },
  {
    id: 'ae2',
    clientId: '1',
    date: '2026-01-31',
    description: 'Accrued salaries adjustment',
    entries: [
      { id: 'jl3', accountCode: '5100', accountName: 'Salaries & Wages', debit: 15000.00, credit: 0 },
      { id: 'jl4', accountCode: '2300', accountName: 'Accrued Expenses', debit: 0, credit: 15000.00 },
    ],
    status: 'draft',
    createdBy: 'Linda Dlamini',
    createdAt: '2026-01-26T14:15:00Z',
  },
  {
    id: 'ae3',
    clientId: '2',
    date: '2026-01-31',
    description: 'Prepaid insurance allocation',
    entries: [
      { id: 'jl5', accountCode: '5500', accountName: 'Insurance', debit: 1200.00, credit: 0 },
      { id: 'jl6', accountCode: '1300', accountName: 'Prepaid Expenses', debit: 0, credit: 1200.00 },
    ],
    status: 'approved',
    createdBy: 'Linda Dlamini',
    createdAt: '2026-01-20T09:00:00Z',
    approvedBy: 'Sarah van der Berg',
    approvedAt: '2026-01-21T11:30:00Z',
  },
];

// 2 Draft reports
export const mockDraftReports: DraftReport[] = [
  {
    id: 'dr1',
    clientId: '1',
    type: 'trial-balance',
    title: 'Trial Balance - January 2026',
    status: 'draft',
    createdAt: '2026-01-25T16:00:00Z',
    notes: 'Pending final adjusting entries for depreciation.',
  },
  {
    id: 'dr2',
    clientId: '3',
    type: 'vat-summary',
    title: 'VAT Summary - January 2026',
    status: 'submitted',
    createdAt: '2026-01-24T10:00:00Z',
    submittedAt: '2026-01-26T09:30:00Z',
    notes: 'All transactions categorized. Ready for accountant review.',
  },
];

// Recent activity feed
export const mockActivityFeed: ActivityItem[] = [
  { id: 'a1', type: 'categorization', description: 'Categorized 5 transactions', clientName: 'Mokwena Trading', timestamp: '2 hours ago' },
  { id: 'a2', type: 'entry', description: 'Created adjusting entry for depreciation', clientName: 'Mokwena Trading', timestamp: '5 hours ago' },
  { id: 'a3', type: 'report', description: 'Generated draft Trial Balance', clientName: 'Mokwena Trading', timestamp: '1 day ago' },
  { id: 'a4', type: 'submission', description: 'Submitted VAT Summary for review', clientName: 'Coastal Imports', timestamp: '2 days ago' },
  { id: 'a5', type: 'categorization', description: 'Categorized 12 transactions', clientName: 'Nkosi Technologies', timestamp: '3 days ago' },
];

// VAT treatment options for reference panel
export const vatTreatmentOptions = [
  { value: 'standard-15', label: 'Standard Rate (15%)', description: 'Most goods and services' },
  { value: 'zero-rated', label: 'Zero Rated (0%)', description: 'Exports, basic foodstuffs' },
  { value: 'exempt', label: 'Exempt', description: 'Financial services, residential rent' },
  { value: 'out-of-scope', label: 'Out of Scope', description: 'Not subject to VAT' },
];

// Helper functions
export const getClientById = (id: string): BookkeeperClient | undefined => {
  return mockBookkeeperClients.find(c => c.id === id);
};

export const getTransactionsByClientId = (clientId: string): BookkeeperTransaction[] => {
  return mockBookkeeperTransactions.filter(t => t.clientId === clientId);
};

export const getEntriesByClientId = (clientId: string): AdjustingEntry[] => {
  return mockAdjustingEntries.filter(e => e.clientId === clientId);
};

export const getReportsByClientId = (clientId: string): DraftReport[] => {
  return mockDraftReports.filter(r => r.clientId === clientId);
};

export const getGLAccountByCode = (code: string): GLAccount | undefined => {
  return mockGLAccounts.find(a => a.code === code);
};

export const getTotalPendingTransactions = (): number => {
  return mockBookkeeperTransactions.filter(t => t.status === 'uncategorized').length;
};

export const getTotalDraftReports = (): number => {
  return mockDraftReports.filter(r => r.status === 'draft').length;
};

export const getOverdueItems = (): number => {
  // Mock: count clients with pending status older than 3 days
  return mockBookkeeperClients.filter(c => c.status === 'pending' && c.lastActivity.includes('day')).length;
};
