import { z } from 'zod';

// Balance Sheet Types
export interface BalanceSheetData {
  // Assets
  nonCurrentAssets: {
    propertyPlantEquipment: number;
    intangibleAssets: number;
    investments: number;
    otherNonCurrentAssets: number;
  };
  currentAssets: {
    inventory: number;
    tradeReceivables: number;
    cashAndEquivalents: number;
    otherCurrentAssets: number;
  };
  // Equity
  equity: {
    shareCapital: number;
    retainedEarnings: number;
    reserves: number;
  };
  // Liabilities
  nonCurrentLiabilities: {
    longTermLoans: number;
    deferredTax: number;
    otherNonCurrentLiabilities: number;
  };
  currentLiabilities: {
    tradePayables: number;
    shortTermLoans: number;
    vatPayable: number;
    otherCurrentLiabilities: number;
  };
}

// Profit & Loss Types
export interface ProfitLossData {
  revenue: {
    salesRevenue: number;
    serviceRevenue: number;
    otherIncome: number;
  };
  costOfSales: {
    directMaterials: number;
    directLabor: number;
    manufacturingOverhead: number;
  };
  operatingExpenses: {
    salariesWages: number;
    rentUtilities: number;
    depreciation: number;
    marketing: number;
    professional: number;
    insurance: number;
    other: number;
  };
  otherItems: {
    interestIncome: number;
    interestExpense: number;
    taxExpense: number;
  };
}

export interface FinancialStatement {
  id: string;
  clientId: string;
  financialYear: string;
  balanceSheet: BalanceSheetData;
  profitLoss: ProfitLossData;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  comments?: string;
  lastModified: string;
}

// Validation Schemas
const positiveNumber = z.number().min(0, 'Must be a positive number');

export const balanceSheetSchema = z.object({
  nonCurrentAssets: z.object({
    propertyPlantEquipment: positiveNumber,
    intangibleAssets: positiveNumber,
    investments: positiveNumber,
    otherNonCurrentAssets: positiveNumber,
  }),
  currentAssets: z.object({
    inventory: positiveNumber,
    tradeReceivables: positiveNumber,
    cashAndEquivalents: positiveNumber,
    otherCurrentAssets: positiveNumber,
  }),
  equity: z.object({
    shareCapital: positiveNumber,
    retainedEarnings: z.number(), // Can be negative
    reserves: positiveNumber,
  }),
  nonCurrentLiabilities: z.object({
    longTermLoans: positiveNumber,
    deferredTax: positiveNumber,
    otherNonCurrentLiabilities: positiveNumber,
  }),
  currentLiabilities: z.object({
    tradePayables: positiveNumber,
    shortTermLoans: positiveNumber,
    vatPayable: positiveNumber,
    otherCurrentLiabilities: positiveNumber,
  }),
}).refine(
  (data) => {
    const totalAssets =
      data.nonCurrentAssets.propertyPlantEquipment +
      data.nonCurrentAssets.intangibleAssets +
      data.nonCurrentAssets.investments +
      data.nonCurrentAssets.otherNonCurrentAssets +
      data.currentAssets.inventory +
      data.currentAssets.tradeReceivables +
      data.currentAssets.cashAndEquivalents +
      data.currentAssets.otherCurrentAssets;

    const totalEquityAndLiabilities =
      data.equity.shareCapital +
      data.equity.retainedEarnings +
      data.equity.reserves +
      data.nonCurrentLiabilities.longTermLoans +
      data.nonCurrentLiabilities.deferredTax +
      data.nonCurrentLiabilities.otherNonCurrentLiabilities +
      data.currentLiabilities.tradePayables +
      data.currentLiabilities.shortTermLoans +
      data.currentLiabilities.vatPayable +
      data.currentLiabilities.otherCurrentLiabilities;

    return Math.abs(totalAssets - totalEquityAndLiabilities) < 0.01;
  },
  {
    message: 'Balance Sheet does not balance: Total Assets must equal Total Equity + Liabilities',
    path: ['_balance'],
  }
);

export const profitLossSchema = z.object({
  revenue: z.object({
    salesRevenue: positiveNumber,
    serviceRevenue: positiveNumber,
    otherIncome: positiveNumber,
  }),
  costOfSales: z.object({
    directMaterials: positiveNumber,
    directLabor: positiveNumber,
    manufacturingOverhead: positiveNumber,
  }),
  operatingExpenses: z.object({
    salariesWages: positiveNumber,
    rentUtilities: positiveNumber,
    depreciation: positiveNumber,
    marketing: positiveNumber,
    professional: positiveNumber,
    insurance: positiveNumber,
    other: positiveNumber,
  }),
  otherItems: z.object({
    interestIncome: positiveNumber,
    interestExpense: positiveNumber,
    taxExpense: positiveNumber,
  }),
});

// Calculation Helpers
export const calculateBalanceSheetTotals = (data: BalanceSheetData) => {
  const totalNonCurrentAssets =
    data.nonCurrentAssets.propertyPlantEquipment +
    data.nonCurrentAssets.intangibleAssets +
    data.nonCurrentAssets.investments +
    data.nonCurrentAssets.otherNonCurrentAssets;

  const totalCurrentAssets =
    data.currentAssets.inventory +
    data.currentAssets.tradeReceivables +
    data.currentAssets.cashAndEquivalents +
    data.currentAssets.otherCurrentAssets;

  const totalAssets = totalNonCurrentAssets + totalCurrentAssets;

  const totalEquity =
    data.equity.shareCapital +
    data.equity.retainedEarnings +
    data.equity.reserves;

  const totalNonCurrentLiabilities =
    data.nonCurrentLiabilities.longTermLoans +
    data.nonCurrentLiabilities.deferredTax +
    data.nonCurrentLiabilities.otherNonCurrentLiabilities;

  const totalCurrentLiabilities =
    data.currentLiabilities.tradePayables +
    data.currentLiabilities.shortTermLoans +
    data.currentLiabilities.vatPayable +
    data.currentLiabilities.otherCurrentLiabilities;

  const totalLiabilities = totalNonCurrentLiabilities + totalCurrentLiabilities;
  const totalEquityAndLiabilities = totalEquity + totalLiabilities;

  return {
    totalNonCurrentAssets,
    totalCurrentAssets,
    totalAssets,
    totalEquity,
    totalNonCurrentLiabilities,
    totalCurrentLiabilities,
    totalLiabilities,
    totalEquityAndLiabilities,
    isBalanced: Math.abs(totalAssets - totalEquityAndLiabilities) < 0.01,
  };
};

export const calculateProfitLossTotals = (data: ProfitLossData) => {
  const totalRevenue =
    data.revenue.salesRevenue +
    data.revenue.serviceRevenue +
    data.revenue.otherIncome;

  const totalCostOfSales =
    data.costOfSales.directMaterials +
    data.costOfSales.directLabor +
    data.costOfSales.manufacturingOverhead;

  const grossProfit = totalRevenue - totalCostOfSales;

  const totalOperatingExpenses =
    data.operatingExpenses.salariesWages +
    data.operatingExpenses.rentUtilities +
    data.operatingExpenses.depreciation +
    data.operatingExpenses.marketing +
    data.operatingExpenses.professional +
    data.operatingExpenses.insurance +
    data.operatingExpenses.other;

  const operatingProfit = grossProfit - totalOperatingExpenses;

  const netInterest = data.otherItems.interestIncome - data.otherItems.interestExpense;
  const profitBeforeTax = operatingProfit + netInterest;
  const netProfit = profitBeforeTax - data.otherItems.taxExpense;

  return {
    totalRevenue,
    totalCostOfSales,
    grossProfit,
    grossProfitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
    totalOperatingExpenses,
    operatingProfit,
    operatingMargin: totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0,
    netInterest,
    profitBeforeTax,
    netProfit,
    netProfitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
  };
};
