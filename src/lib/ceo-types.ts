// CEO/Business Owner Types

export type ReimbursementStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type PayrollStatus = 'draft' | 'pending_approval' | 'approved' | 'processed' | 'paid';
export type EmployeeStatus = 'active' | 'on_leave' | 'inactive';
export type EmploymentType = 'full_time' | 'part_time' | 'contract';
export type LeaveType = 'annual' | 'sick' | 'unpaid' | 'maternity' | 'paternity';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface CEOBusiness {
  id: string;
  name: string;
  registrationNumber: string;
  taxNumber: string;
  industry: string;
  franchiseNumber?: string;
  franchisor?: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  assignedAccountant: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CEOEmployee {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  startDate: string;
  terminationDate?: string;
  salary: number;
  hourlyRate?: number;
  reportsTo?: string;
  taxNumber?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  leaveBalance: {
    annualTotal: number;
    annualUsed: number;
    sickTotal: number;
    sickUsed: number;
    unpaidUsed: number;
  };
  ytdEarnings: {
    gross: number;
    paye: number;
    uif: number;
    sdl: number;
    net: number;
  };
  performanceNotes?: string;
}

export interface CEOPayrollEmployee {
  employeeId: string;
  employeeName: string;
  position: string;
  employmentType: EmploymentType;
  baseSalary: number;
  hoursWorked: number;
  bonus: number;
  deductionAmount: number;
  deductionDescription?: string;
  gross: number;
  paye: number;
  uif: number;
  sdl: number;
  net: number;
  notes?: string;
}

export interface CEOPayrollPeriod {
  id: string;
  businessId: string;
  month: number;
  year: number;
  status: PayrollStatus;
  employees: CEOPayrollEmployee[];
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
}

export interface CEOExpenseReimbursement {
  id: string;
  businessId: string;
  employeeId: string;
  employeeName: string;
  submissionDate: string;
  description: string;
  category: string;
  amount: number;
  receiptUrl?: string;
  notes?: string;
  status: ReimbursementStatus;
  isDeductible: boolean;
  taxCategory?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  rejectionReason?: string;
}

export interface CEOLeaveRequest {
  id: string;
  businessId: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: LeaveRequestStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface CEOTaxSummary {
  year: number;
  ytdIncome: number;
  ytdDeductibleExpenses: number;
  estimatedTaxableIncome: number;
  estimatedTaxRate: number;
  estimatedTaxDue: number;
  provisionalTaxPaid: number;
  balanceDue: number;
  dueDate: string;
  expenseBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    isDeductible: boolean;
  }[];
  complianceChecklist: {
    item: string;
    status: 'passed' | 'warning' | 'failed';
    details?: string;
  }[];
  taxSavingSuggestions: {
    title: string;
    description: string;
    potentialSaving: number;
  }[];
}

export interface CEOBusinessMetrics {
  currentMonthProfit: number;
  profitTrend: number;
  revenue: number;
  expenses: number;
  cashPosition: number;
  employeeCount: number;
  monthlyPayrollCost: number;
  pendingApprovals: number;
  grossProfitMargin: number;
  grossProfitMarginTarget: number;
  revenueYTD: number;
  revenueBudget: number;
  employeeCostPercentage: number;
  cashRunwayMonths: number;
  outstandingInvoices: number;
  avgDaysOverdue: number;
  revenueHistory: { month: string; revenue: number; expenses: number; profit: number }[];
  cashFlowForecast: { days: number; amount: number }[];
  varianceAnalysis: {
    category: string;
    budget: number;
    actual: number;
    varianceAmount: number;
    variancePercentage: number;
    status: 'on_track' | 'over' | 'under';
  }[];
}

export interface CEOAuditEntry {
  id: string;
  businessId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
}

export interface CEOAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

// Helper functions
export const getEmployeeStatusLabel = (status: EmployeeStatus): string => {
  const labels: Record<EmployeeStatus, string> = {
    active: 'Active',
    on_leave: 'On Leave',
    inactive: 'Inactive',
  };
  return labels[status];
};

export const getEmploymentTypeLabel = (type: EmploymentType): string => {
  const labels: Record<EmploymentType, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
  };
  return labels[type];
};

export const getPayrollStatusLabel = (status: PayrollStatus): string => {
  const labels: Record<PayrollStatus, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    processed: 'Processed',
    paid: 'Paid',
  };
  return labels[status];
};

export const getReimbursementStatusLabel = (status: ReimbursementStatus): string => {
  const labels: Record<ReimbursementStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    paid: 'Paid',
  };
  return labels[status];
};

export const getLeaveTypeLabel = (type: LeaveType): string => {
  const labels: Record<LeaveType, string> = {
    annual: 'Annual Leave',
    sick: 'Sick Leave',
    unpaid: 'Unpaid Leave',
    maternity: 'Maternity Leave',
    paternity: 'Paternity Leave',
  };
  return labels[type];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
