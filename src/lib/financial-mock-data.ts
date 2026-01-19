import { FinancialStatement, BalanceSheetData, ProfitLossData } from './financial-types';

export const defaultBalanceSheet: BalanceSheetData = {
  nonCurrentAssets: {
    propertyPlantEquipment: 0,
    intangibleAssets: 0,
    investments: 0,
    otherNonCurrentAssets: 0,
  },
  currentAssets: {
    inventory: 0,
    tradeReceivables: 0,
    cashAndEquivalents: 0,
    otherCurrentAssets: 0,
  },
  equity: {
    shareCapital: 0,
    retainedEarnings: 0,
    reserves: 0,
  },
  nonCurrentLiabilities: {
    longTermLoans: 0,
    deferredTax: 0,
    otherNonCurrentLiabilities: 0,
  },
  currentLiabilities: {
    tradePayables: 0,
    shortTermLoans: 0,
    vatPayable: 0,
    otherCurrentLiabilities: 0,
  },
};

export const defaultProfitLoss: ProfitLossData = {
  revenue: {
    salesRevenue: 0,
    serviceRevenue: 0,
    otherIncome: 0,
  },
  costOfSales: {
    directMaterials: 0,
    directLabor: 0,
    manufacturingOverhead: 0,
  },
  operatingExpenses: {
    salariesWages: 0,
    rentUtilities: 0,
    depreciation: 0,
    marketing: 0,
    professional: 0,
    insurance: 0,
    other: 0,
  },
  otherItems: {
    interestIncome: 0,
    interestExpense: 0,
    taxExpense: 0,
  },
};

export const mockBalanceSheet: BalanceSheetData = {
  nonCurrentAssets: {
    propertyPlantEquipment: 450000,
    intangibleAssets: 25000,
    investments: 50000,
    otherNonCurrentAssets: 10000,
  },
  currentAssets: {
    inventory: 125000,
    tradeReceivables: 185000,
    cashAndEquivalents: 95000,
    otherCurrentAssets: 15000,
  },
  equity: {
    shareCapital: 100000,
    retainedEarnings: 420000,
    reserves: 50000,
  },
  nonCurrentLiabilities: {
    longTermLoans: 200000,
    deferredTax: 35000,
    otherNonCurrentLiabilities: 10000,
  },
  currentLiabilities: {
    tradePayables: 95000,
    shortTermLoans: 25000,
    vatPayable: 12000,
    otherCurrentLiabilities: 8000,
  },
};

export const mockProfitLoss: ProfitLossData = {
  revenue: {
    salesRevenue: 1850000,
    serviceRevenue: 350000,
    otherIncome: 25000,
  },
  costOfSales: {
    directMaterials: 650000,
    directLabor: 280000,
    manufacturingOverhead: 120000,
  },
  operatingExpenses: {
    salariesWages: 450000,
    rentUtilities: 85000,
    depreciation: 45000,
    marketing: 65000,
    professional: 35000,
    insurance: 28000,
    other: 42000,
  },
  otherItems: {
    interestIncome: 5000,
    interestExpense: 18000,
    taxExpense: 112000,
  },
};

export const mockFinancialStatement: FinancialStatement = {
  id: 'fs-001',
  clientId: '1',
  financialYear: '2025',
  balanceSheet: mockBalanceSheet,
  profitLoss: mockProfitLoss,
  status: 'draft',
  lastModified: '2026-01-15T10:30:00Z',
};

export const getStatementStatusLabel = (status: FinancialStatement['status']): string => {
  const labels: Record<FinancialStatement['status'], string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    'under-review': 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status];
};

export const getStatementStatusColor = (status: FinancialStatement['status']): string => {
  const colors: Record<FinancialStatement['status'], string> = {
    draft: 'neutral',
    submitted: 'warning',
    'under-review': 'warning',
    approved: 'success',
    rejected: 'error',
  };
  return colors[status];
};
