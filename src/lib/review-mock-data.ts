// Mock data for Client Review and Sign-off (Phases 2 + 3)

import { ChecklistItem, ReviewComment, TrialBalanceLine, ClientReview, ReconciliationSummary } from './review-types';
import { mockClients, formatCurrency } from './mock-data';
import { mockBalanceSheet, mockProfitLoss } from './financial-mock-data';
import { calculateBalanceSheetTotals, calculateProfitLossTotals } from './financial-types';

// Balance Sheet verification checklist items
export const balanceSheetChecklistItems: ChecklistItem[] = [
  {
    id: 'bs-1',
    label: 'Non-current assets verified against fixed asset register',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-2',
    label: 'Intangible assets amortisation reviewed',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-3',
    label: 'Inventory count reconciled',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-4',
    label: 'Trade receivables aged analysis reviewed',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-5',
    label: 'Cash and bank balances confirmed',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-6',
    label: 'Share capital per share register',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-7',
    label: 'Retained earnings reconciled to prior year',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-8',
    label: 'Long-term loan agreements reviewed',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-9',
    label: 'Trade payables reconciled to suppliers',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-10',
    label: 'VAT payable agrees to VAT201 submission',
    category: 'balance-sheet',
    isChecked: false,
  },
  {
    id: 'bs-11',
    label: 'Balance sheet equation verified (A = E + L)',
    category: 'balance-sheet',
    isChecked: false,
  },
];

// Profit & Loss verification checklist items
export const profitLossChecklistItems: ChecklistItem[] = [
  {
    id: 'pl-1',
    label: 'Revenue agrees to invoicing system totals',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-2',
    label: 'Service revenue breakdown verified',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-3',
    label: 'Cost of sales matches inventory movements',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-4',
    label: 'Gross profit margin within industry norms (checked)',
    description: 'Industry average: 35-45%',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-5',
    label: 'Salaries agree to payroll records',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-6',
    label: 'Depreciation matches asset schedule',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-7',
    label: 'Professional fees supported by invoices',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-8',
    label: 'Interest income/expense agrees to bank statements',
    category: 'profit-loss',
    isChecked: false,
  },
  {
    id: 'pl-9',
    label: 'Tax expense calculation reviewed',
    category: 'profit-loss',
    isChecked: false,
  },
];

// IT14SD reconciliation checklist items
export const it14sdChecklistItems: ChecklistItem[] = [
  {
    id: 'it-1',
    label: 'Trial balance totals verified (debits = credits)',
    category: 'it14sd',
    isChecked: false,
  },
  {
    id: 'it-2',
    label: 'All TB accounts mapped to financial statement lines',
    category: 'it14sd',
    isChecked: false,
  },
  {
    id: 'it-3',
    label: 'Asset totals reconcile (TB vs Financial Statements)',
    category: 'it14sd',
    isChecked: false,
  },
  {
    id: 'it-4',
    label: 'Liability totals reconcile (TB vs Financial Statements)',
    category: 'it14sd',
    isChecked: false,
  },
  {
    id: 'it-5',
    label: 'Equity totals reconcile (TB vs Financial Statements)',
    category: 'it14sd',
    isChecked: false,
  },
  {
    id: 'it-6',
    label: 'Net profit agrees between TB and Income Statement',
    category: 'it14sd',
    isChecked: false,
  },
];

// General sign-off checklist items
export const generalChecklistItems: ChecklistItem[] = [
  {
    id: 'gen-1',
    label: 'All supporting documents received',
    category: 'general',
    isChecked: false,
  },
  {
    id: 'gen-2',
    label: 'Director/member confirmation obtained',
    category: 'general',
    isChecked: false,
  },
  {
    id: 'gen-3',
    label: 'Prior year adjustments reviewed',
    category: 'general',
    isChecked: false,
  },
];

// Combine all checklist items
export const mockChecklistItems: ChecklistItem[] = [
  ...balanceSheetChecklistItems,
  ...profitLossChecklistItems,
  ...it14sdChecklistItems,
  ...generalChecklistItems,
];

// Sample review comments
export const mockComments: ReviewComment[] = [
  {
    id: 'comment-1',
    author: 'Sarah van der Berg',
    content: 'Please confirm the trade receivables balance includes the December invoice #2456.',
    createdAt: '2026-01-18T10:30:00Z',
    section: 'Balance Sheet - Current Assets',
    isResolved: false,
  },
  {
    id: 'comment-2',
    author: 'Sarah van der Berg',
    content: 'Depreciation calculation verified against fixed asset register.',
    createdAt: '2026-01-17T14:15:00Z',
    section: 'Profit & Loss - Operating Expenses',
    isResolved: true,
    resolvedAt: '2026-01-18T09:00:00Z',
    resolvedBy: 'Sarah van der Berg',
  },
  {
    id: 'comment-3',
    author: 'Sarah van der Berg',
    content: 'VAT payable includes January 2026 output VAT - needs to be excluded for year-end.',
    createdAt: '2026-01-18T11:45:00Z',
    section: 'Balance Sheet - Current Liabilities',
    isResolved: false,
  },
];

// Mock Trial Balance data
export const mockTrialBalance: TrialBalanceLine[] = [
  // Non-Current Assets
  { accountCode: '1000', accountName: 'Land and Buildings', debit: 300000, credit: 0, category: 'non-current-assets', mappedTo: 'propertyPlantEquipment' },
  { accountCode: '1100', accountName: 'Plant and Machinery', debit: 150000, credit: 0, category: 'non-current-assets', mappedTo: 'propertyPlantEquipment' },
  { accountCode: '1200', accountName: 'Accumulated Depreciation', debit: 0, credit: 0, category: 'non-current-assets', mappedTo: 'propertyPlantEquipment' },
  { accountCode: '1300', accountName: 'Goodwill', debit: 25000, credit: 0, category: 'non-current-assets', mappedTo: 'intangibleAssets' },
  { accountCode: '1400', accountName: 'Investments', debit: 50000, credit: 0, category: 'non-current-assets', mappedTo: 'investments' },
  { accountCode: '1500', accountName: 'Other Non-Current Assets', debit: 10000, credit: 0, category: 'non-current-assets', mappedTo: 'otherNonCurrentAssets' },
  
  // Current Assets
  { accountCode: '2000', accountName: 'Inventory', debit: 125000, credit: 0, category: 'current-assets', mappedTo: 'inventory' },
  { accountCode: '2100', accountName: 'Trade Receivables', debit: 185000, credit: 0, category: 'current-assets', mappedTo: 'tradeReceivables' },
  { accountCode: '2200', accountName: 'Bank Account - FNB', debit: 75000, credit: 0, category: 'current-assets', mappedTo: 'cashAndEquivalents' },
  { accountCode: '2210', accountName: 'Petty Cash', debit: 5000, credit: 0, category: 'current-assets', mappedTo: 'cashAndEquivalents' },
  { accountCode: '2220', accountName: 'Cash on Hand', debit: 15000, credit: 0, category: 'current-assets', mappedTo: 'cashAndEquivalents' },
  { accountCode: '2300', accountName: 'Prepaid Expenses', debit: 15000, credit: 0, category: 'current-assets', mappedTo: 'otherCurrentAssets' },
  
  // Equity
  { accountCode: '3000', accountName: 'Share Capital', debit: 0, credit: 100000, category: 'equity', mappedTo: 'shareCapital' },
  { accountCode: '3100', accountName: 'Retained Earnings', debit: 0, credit: 420000, category: 'equity', mappedTo: 'retainedEarnings' },
  { accountCode: '3200', accountName: 'Reserves', debit: 0, credit: 50000, category: 'equity', mappedTo: 'reserves' },
  
  // Non-Current Liabilities
  { accountCode: '4000', accountName: 'Long-Term Loan - ABSA', debit: 0, credit: 200000, category: 'non-current-liabilities', mappedTo: 'longTermLoans' },
  { accountCode: '4100', accountName: 'Deferred Tax Liability', debit: 0, credit: 35000, category: 'non-current-liabilities', mappedTo: 'deferredTax' },
  { accountCode: '4200', accountName: 'Other Long-Term Liabilities', debit: 0, credit: 10000, category: 'non-current-liabilities', mappedTo: 'otherNonCurrentLiabilities' },
  
  // Current Liabilities
  { accountCode: '5000', accountName: 'Trade Payables', debit: 0, credit: 95000, category: 'current-liabilities', mappedTo: 'tradePayables' },
  { accountCode: '5100', accountName: 'Short-Term Loan', debit: 0, credit: 25000, category: 'current-liabilities', mappedTo: 'shortTermLoans' },
  { accountCode: '5200', accountName: 'VAT Control Account', debit: 0, credit: 12000, category: 'current-liabilities', mappedTo: 'vatPayable' },
  { accountCode: '5300', accountName: 'Accrued Expenses', debit: 0, credit: 8000, category: 'current-liabilities', mappedTo: 'otherCurrentLiabilities' },
  
  // Revenue
  { accountCode: '6000', accountName: 'Sales Revenue', debit: 0, credit: 1850000, category: 'revenue', mappedTo: 'salesRevenue' },
  { accountCode: '6100', accountName: 'Service Revenue', debit: 0, credit: 350000, category: 'revenue', mappedTo: 'serviceRevenue' },
  { accountCode: '6200', accountName: 'Other Income', debit: 0, credit: 25000, category: 'revenue', mappedTo: 'otherIncome' },
  
  // Cost of Sales
  { accountCode: '7000', accountName: 'Direct Materials', debit: 650000, credit: 0, category: 'cost-of-sales', mappedTo: 'directMaterials' },
  { accountCode: '7100', accountName: 'Direct Labour', debit: 280000, credit: 0, category: 'cost-of-sales', mappedTo: 'directLabor' },
  { accountCode: '7200', accountName: 'Manufacturing Overhead', debit: 120000, credit: 0, category: 'cost-of-sales', mappedTo: 'manufacturingOverhead' },
  
  // Operating Expenses
  { accountCode: '8000', accountName: 'Salaries and Wages', debit: 450000, credit: 0, category: 'expenses', mappedTo: 'salariesWages' },
  { accountCode: '8100', accountName: 'Rent and Utilities', debit: 85000, credit: 0, category: 'expenses', mappedTo: 'rentUtilities' },
  { accountCode: '8200', accountName: 'Depreciation', debit: 45000, credit: 0, category: 'expenses', mappedTo: 'depreciation' },
  { accountCode: '8300', accountName: 'Marketing and Advertising', debit: 65000, credit: 0, category: 'expenses', mappedTo: 'marketing' },
  { accountCode: '8400', accountName: 'Professional Fees', debit: 35000, credit: 0, category: 'expenses', mappedTo: 'professional' },
  { accountCode: '8500', accountName: 'Insurance', debit: 28000, credit: 0, category: 'expenses', mappedTo: 'insurance' },
  { accountCode: '8600', accountName: 'Other Operating Expenses', debit: 42000, credit: 0, category: 'expenses', mappedTo: 'other' },
  
  // Other Items
  { accountCode: '9000', accountName: 'Interest Income', debit: 0, credit: 5000, category: 'other', mappedTo: 'interestIncome' },
  { accountCode: '9100', accountName: 'Interest Expense', debit: 18000, credit: 0, category: 'other', mappedTo: 'interestExpense' },
  { accountCode: '9200', accountName: 'Income Tax Expense', debit: 112000, credit: 0, category: 'other', mappedTo: 'taxExpense' },
];

// Calculate reconciliation summary
export const calculateReconciliationSummary = (
  trialBalance: TrialBalanceLine[],
  bsTotals: ReturnType<typeof calculateBalanceSheetTotals>,
  plTotals: ReturnType<typeof calculateProfitLossTotals>
): ReconciliationSummary => {
  const totalDebits = trialBalance.reduce((sum, line) => sum + line.debit, 0);
  const totalCredits = trialBalance.reduce((sum, line) => sum + line.credit, 0);
  
  // Calculate TB totals by category for BS
  const tbAssets = trialBalance
    .filter(l => l.category === 'non-current-assets' || l.category === 'current-assets')
    .reduce((sum, l) => sum + l.debit - l.credit, 0);
  
  const tbLiabilities = trialBalance
    .filter(l => l.category === 'non-current-liabilities' || l.category === 'current-liabilities')
    .reduce((sum, l) => sum + l.credit - l.debit, 0);
  
  const tbEquity = trialBalance
    .filter(l => l.category === 'equity')
    .reduce((sum, l) => sum + l.credit - l.debit, 0);
  
  // Calculate TB net profit
  const tbRevenue = trialBalance
    .filter(l => l.category === 'revenue')
    .reduce((sum, l) => sum + l.credit - l.debit, 0);
  
  const tbExpenses = trialBalance
    .filter(l => l.category === 'cost-of-sales' || l.category === 'expenses' || l.category === 'other')
    .reduce((sum, l) => sum + l.debit - l.credit, 0);
  
  const tbNetProfit = tbRevenue - tbExpenses;
  
  const assetVariance = Math.abs(tbAssets - bsTotals.totalAssets);
  const liabilityVariance = Math.abs(tbLiabilities - bsTotals.totalLiabilities);
  const equityVariance = Math.abs(tbEquity - bsTotals.totalEquity);
  const profitVariance = Math.abs(tbNetProfit - plTotals.netProfit);
  
  // Material variance threshold (R100)
  const materialityThreshold = 100;
  
  return {
    totalDebits,
    totalCredits,
    isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
    assetVariance,
    liabilityVariance,
    equityVariance,
    profitVariance,
    hasMaterialVariances: 
      assetVariance > materialityThreshold || 
      liabilityVariance > materialityThreshold || 
      equityVariance > materialityThreshold ||
      profitVariance > materialityThreshold,
  };
};

// Create mock client reviews
export const mockClientReviews: Record<string, ClientReview> = {
  '1': {
    clientId: '1',
    clientName: mockClients[0].name,
    clientCompany: mockClients[0].company,
    clientEmail: mockClients[0].email,
    financialYear: '2025',
    financialStatement: {
      id: 'fs-001',
      clientId: '1',
      financialYear: '2025',
      balanceSheet: mockBalanceSheet,
      profitLoss: mockProfitLoss,
      status: 'under-review',
      submittedAt: '2026-01-15T08:00:00Z',
      lastModified: '2026-01-15T08:00:00Z',
    },
    checklist: mockChecklistItems.map(item => ({ ...item })),
    comments: mockComments,
    trialBalance: mockTrialBalance,
    reviewStatus: 'in-progress',
    reviewStartedAt: '2026-01-16T09:00:00Z',
    lastUpdatedAt: '2026-01-18T11:45:00Z',
  },
  '2': {
    clientId: '2',
    clientName: mockClients[1].name,
    clientCompany: mockClients[1].company,
    clientEmail: mockClients[1].email,
    financialYear: '2025',
    financialStatement: {
      id: 'fs-002',
      clientId: '2',
      financialYear: '2025',
      balanceSheet: mockBalanceSheet,
      profitLoss: mockProfitLoss,
      status: 'approved',
      submittedAt: '2026-01-10T08:00:00Z',
      reviewedAt: '2026-01-14T16:30:00Z',
      lastModified: '2026-01-14T16:30:00Z',
    },
    checklist: mockChecklistItems.map(item => ({ ...item, isChecked: true, checkedBy: 'Sarah van der Berg', checkedAt: '2026-01-14T16:00:00Z' })),
    comments: [],
    trialBalance: mockTrialBalance,
    signature: {
      dataUrl: '',
      signedBy: 'Sarah van der Berg',
      signedAt: '2026-01-14T16:30:00Z',
    },
    reviewStatus: 'completed',
    reviewStartedAt: '2026-01-11T09:00:00Z',
    lastUpdatedAt: '2026-01-14T16:30:00Z',
  },
};

// Get client review by ID
export const getClientReview = (clientId: string): ClientReview | undefined => {
  return mockClientReviews[clientId];
};

// Get review status label
export const getReviewStatusLabel = (status: ClientReview['reviewStatus']): string => {
  const labels: Record<ClientReview['reviewStatus'], string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'pending-signoff': 'Pending Sign-off',
    'completed': 'Completed',
    'revision-requested': 'Revision Requested',
  };
  return labels[status];
};

// Get review status color
export const getReviewStatusColor = (status: ClientReview['reviewStatus']): string => {
  const colors: Record<ClientReview['reviewStatus'], string> = {
    'not-started': 'neutral',
    'in-progress': 'warning',
    'pending-signoff': 'warning',
    'completed': 'success',
    'revision-requested': 'error',
  };
  return colors[status];
};
