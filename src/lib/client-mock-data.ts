// Client-specific mock data for Jane's Salon (c_001)

export interface ClientInfo {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  registrationNumber: string;
  industry: string;
  assignedAccountant: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending-review' | 'approved' | 'rejected' | 'in-progress';
  lastSubmissionDate: string;
  createdAt: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'bank-statement' | 'invoice' | 'receipt' | 'other';
  uploadDate: string;
  period: string; // e.g., "January 2026"
  status: 'processing' | 'processed' | 'error' | 'pending-review';
  size: number;
  uploadedBy: string;
}

export interface MonthlyFinancials {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashOnHand: number;
  incomeBreakdown: {
    category: string;
    amount: number;
  }[];
  expenseBreakdown: {
    category: string;
    amount: number;
  }[];
  bankReconciliation: {
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  grossPay: number;
  netPay: number;
  deductions: {
    type: string;
    amount: number;
  }[];
  status: 'generated' | 'pending' | 'error';
  downloadUrl?: string;
}

// Jane's Salon Client Info
export const mockClientInfo: ClientInfo = {
  id: 'c_001',
  name: 'Jane Mthembu',
  company: "Jane's Salon",
  email: 'jane@janessalon.co.za',
  phone: '+27 82 555 1234',
  registrationNumber: '2020/123456/07',
  industry: 'Beauty & Personal Care',
  assignedAccountant: {
    name: 'Sarah van der Berg',
    email: 'sarah@auditnex.co.za',
    phone: '+27 83 444 5678',
  },
  status: 'pending-review',
  lastSubmissionDate: '2026-01-15',
  createdAt: '2023-06-01',
};

// Uploaded Documents
export const mockClientDocuments: UploadedDocument[] = [
  {
    id: 'doc_001',
    name: 'FNB_Statement_Jan2026.pdf',
    type: 'bank-statement',
    uploadDate: '2026-01-15',
    period: 'January 2026',
    status: 'processed',
    size: 245678,
    uploadedBy: 'Jane Mthembu',
  },
  {
    id: 'doc_002',
    name: 'FNB_Statement_Feb2026.pdf',
    type: 'bank-statement',
    uploadDate: '2026-02-12',
    period: 'February 2026',
    status: 'processed',
    size: 198432,
    uploadedBy: 'Jane Mthembu',
  },
  {
    id: 'doc_003',
    name: 'FNB_Statement_Mar2026.pdf',
    type: 'bank-statement',
    uploadDate: '2026-03-10',
    period: 'March 2026',
    status: 'pending-review',
    size: 267890,
    uploadedBy: 'Jane Mthembu',
  },
  {
    id: 'doc_004',
    name: 'Equipment_Invoice_Feb2026.pdf',
    type: 'invoice',
    uploadDate: '2026-02-20',
    period: 'February 2026',
    status: 'processed',
    size: 156789,
    uploadedBy: 'Jane Mthembu',
  },
  {
    id: 'doc_005',
    name: 'Supply_Receipts_Jan2026.pdf',
    type: 'receipt',
    uploadDate: '2026-01-28',
    period: 'January 2026',
    status: 'processed',
    size: 89432,
    uploadedBy: 'Jane Mthembu',
  },
];

// Monthly Financials (January 2026)
export const mockMonthlyFinancials: Record<string, MonthlyFinancials> = {
  'January 2026': {
    month: 'January',
    year: 2026,
    totalIncome: 45000,
    totalExpenses: 30000,
    netProfit: 15000,
    cashOnHand: 28500,
    incomeBreakdown: [
      { category: 'Haircuts & Styling', amount: 22000 },
      { category: 'Colouring Services', amount: 12000 },
      { category: 'Nail Services', amount: 6500 },
      { category: 'Product Sales', amount: 4500 },
    ],
    expenseBreakdown: [
      { category: 'Salaries & Wages', amount: 12000 },
      { category: 'Rent', amount: 8000 },
      { category: 'Supplies & Products', amount: 5500 },
      { category: 'Utilities', amount: 2000 },
      { category: 'Marketing', amount: 1500 },
      { category: 'Insurance', amount: 1000 },
    ],
    bankReconciliation: [
      { date: '2026-01-02', description: 'Opening Balance', debit: 0, credit: 0, balance: 25000 },
      { date: '2026-01-05', description: 'Client Payments - Cash', debit: 0, credit: 8500, balance: 33500 },
      { date: '2026-01-08', description: 'Rent Payment', debit: 8000, credit: 0, balance: 25500 },
      { date: '2026-01-12', description: 'Card Machine Sales', debit: 0, credit: 12500, balance: 38000 },
      { date: '2026-01-15', description: 'Salaries - Sarah', debit: 6000, credit: 0, balance: 32000 },
      { date: '2026-01-15', description: 'Salaries - John', debit: 6000, credit: 0, balance: 26000 },
      { date: '2026-01-18', description: 'Supplier - Beauty Wholesale', debit: 5500, credit: 0, balance: 20500 },
      { date: '2026-01-22', description: 'Client Payments', debit: 0, credit: 10000, balance: 30500 },
      { date: '2026-01-25', description: 'Utilities - Electricity', debit: 1200, credit: 0, balance: 29300 },
      { date: '2026-01-28', description: 'Marketing - Facebook Ads', debit: 800, credit: 0, balance: 28500 },
    ],
  },
  'February 2026': {
    month: 'February',
    year: 2026,
    totalIncome: 52000,
    totalExpenses: 33500,
    netProfit: 18500,
    cashOnHand: 35200,
    incomeBreakdown: [
      { category: 'Haircuts & Styling', amount: 25000 },
      { category: 'Colouring Services', amount: 14500 },
      { category: 'Nail Services', amount: 7500 },
      { category: 'Product Sales', amount: 5000 },
    ],
    expenseBreakdown: [
      { category: 'Salaries & Wages', amount: 12000 },
      { category: 'Rent', amount: 8000 },
      { category: 'Supplies & Products', amount: 7500 },
      { category: 'Equipment Purchase', amount: 3500 },
      { category: 'Utilities', amount: 1800 },
      { category: 'Insurance', amount: 700 },
    ],
    bankReconciliation: [
      { date: '2026-02-01', description: 'Opening Balance', debit: 0, credit: 0, balance: 28500 },
      { date: '2026-02-05', description: 'Client Payments', debit: 0, credit: 15000, balance: 43500 },
      { date: '2026-02-08', description: 'Rent Payment', debit: 8000, credit: 0, balance: 35500 },
      { date: '2026-02-15', description: 'Salaries', debit: 12000, credit: 0, balance: 23500 },
      { date: '2026-02-18', description: 'Client Payments', debit: 0, credit: 20000, balance: 43500 },
      { date: '2026-02-20', description: 'Equipment Purchase', debit: 3500, credit: 0, balance: 40000 },
      { date: '2026-02-25', description: 'Supplies', debit: 4800, credit: 0, balance: 35200 },
    ],
  },
  'March 2026': {
    month: 'March',
    year: 2026,
    totalIncome: 48000,
    totalExpenses: 31000,
    netProfit: 17000,
    cashOnHand: 42500,
    incomeBreakdown: [
      { category: 'Haircuts & Styling', amount: 23500 },
      { category: 'Colouring Services', amount: 13000 },
      { category: 'Nail Services', amount: 7000 },
      { category: 'Product Sales', amount: 4500 },
    ],
    expenseBreakdown: [
      { category: 'Salaries & Wages', amount: 12500 },
      { category: 'Rent', amount: 8000 },
      { category: 'Supplies & Products', amount: 6000 },
      { category: 'Utilities', amount: 2200 },
      { category: 'Marketing', amount: 1300 },
      { category: 'Insurance', amount: 1000 },
    ],
    bankReconciliation: [
      { date: '2026-03-01', description: 'Opening Balance', debit: 0, credit: 0, balance: 35200 },
      { date: '2026-03-05', description: 'Client Payments', debit: 0, credit: 18000, balance: 53200 },
      { date: '2026-03-08', description: 'Rent Payment', debit: 8000, credit: 0, balance: 45200 },
      { date: '2026-03-10', description: 'Closing Balance (Current)', debit: 2700, credit: 0, balance: 42500 },
    ],
  },
};

// Payslips for employees
export const mockPayslips: Payslip[] = [
  {
    id: 'ps_001',
    employeeId: 'emp_001',
    employeeName: 'Sarah Ndlovu',
    month: 'February',
    year: 2026,
    grossPay: 8500,
    netPay: 7225,
    deductions: [
      { type: 'PAYE', amount: 850 },
      { type: 'UIF', amount: 85 },
      { type: 'Medical Aid', amount: 340 },
    ],
    status: 'generated',
  },
  {
    id: 'ps_002',
    employeeId: 'emp_002',
    employeeName: 'John Mokoena',
    month: 'February',
    year: 2026,
    grossPay: 7500,
    netPay: 6450,
    deductions: [
      { type: 'PAYE', amount: 750 },
      { type: 'UIF', amount: 75 },
      { type: 'Pension Fund', amount: 225 },
    ],
    status: 'generated',
  },
  {
    id: 'ps_003',
    employeeId: 'emp_001',
    employeeName: 'Sarah Ndlovu',
    month: 'January',
    year: 2026,
    grossPay: 8500,
    netPay: 7225,
    deductions: [
      { type: 'PAYE', amount: 850 },
      { type: 'UIF', amount: 85 },
      { type: 'Medical Aid', amount: 340 },
    ],
    status: 'generated',
  },
  {
    id: 'ps_004',
    employeeId: 'emp_002',
    employeeName: 'John Mokoena',
    month: 'January',
    year: 2026,
    grossPay: 7500,
    netPay: 6450,
    deductions: [
      { type: 'PAYE', amount: 750 },
      { type: 'UIF', amount: 75 },
      { type: 'Pension Fund', amount: 225 },
    ],
    status: 'generated',
  },
];

// Available months for selection
export const availableMonths = [
  'March 2026',
  'February 2026',
  'January 2026',
  'December 2025',
  'November 2025',
];

// Format currency for South African Rand
export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status color class
export const getDocumentStatusColor = (status: UploadedDocument['status']): string => {
  switch (status) {
    case 'processed':
      return 'success';
    case 'processing':
    case 'pending-review':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'neutral';
  }
};

export const getClientStatusLabel = (status: ClientInfo['status']): string => {
  switch (status) {
    case 'pending-review':
      return 'Pending Review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'in-progress':
      return 'In Progress';
    default:
      return status;
  }
};
