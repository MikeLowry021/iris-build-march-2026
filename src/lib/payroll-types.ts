import { z } from 'zod';

// ==================== SA Tax Tables (2025/2026 Tax Year) ====================

export const SA_TAX_BRACKETS_2025 = [
  { min: 0, max: 237100, rate: 18, base: 0 },
  { min: 237101, max: 370500, rate: 26, base: 42678 },
  { min: 370501, max: 512800, rate: 31, base: 77362 },
  { min: 512801, max: 673000, rate: 36, base: 121475 },
  { min: 673001, max: 857900, rate: 39, base: 179147 },
  { min: 857901, max: 1817000, rate: 41, base: 251258 },
  { min: 1817001, max: Infinity, rate: 45, base: 644489 },
] as const;

export const TAX_REBATES_2025 = {
  primary: 17235,    // Under 65
  secondary: 9444,   // 65-74
  tertiary: 3145,    // 75+
} as const;

export const TAX_THRESHOLDS_2025 = {
  under65: 95750,
  age65to74: 148217,
  age75plus: 165689,
} as const;

export const UIF_RATE = 0.01; // 1% each for employee and employer
export const UIF_MAX_EARNINGS = 17712; // Monthly ceiling for UIF
export const SDL_RATE = 0.01; // 1% of leviable amount

// ==================== Employee Types ====================

export type EmployeeStatus = 'active' | 'terminated' | 'on-leave';
export type AccountType = 'cheque' | 'savings' | 'transmission';
export type PayFrequency = 'monthly' | 'bi-weekly' | 'weekly';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountType: AccountType;
  branchCode: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  startDate: string;
  terminationDate?: string;
  position: string;
  department: string;
  taxNumber: string;
  bankDetails: BankDetails;
  status: EmployeeStatus;
  payFrequency: PayFrequency;
  basicSalary: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Salary & Deductions Types ====================

export interface SalaryDetails {
  basicSalary: number;
  overtimePay: number;
  commission: number;
  bonus: number;
  travelAllowance: number;
  medicalAidEmployeeContribution: number;
  medicalAidEmployerContribution: number;
  pensionEmployeeContribution: number;
  pensionEmployerContribution: number;
  otherAllowances: number;
  otherDeductions: number;
}

export interface TaxCalculation {
  annualTaxableIncome: number;
  annualPAYE: number;
  monthlyPAYE: number;
  taxBracket: number;
  rebateApplied: number;
}

export interface UIFCalculation {
  grossRemuneration: number;
  uifEmployee: number;
  uifEmployer: number;
}

export interface SDLCalculation {
  leviableAmount: number;
  sdlAmount: number;
}

// ==================== Payslip Types ====================

export type PayslipStatus = 'draft' | 'approved' | 'paid';

export interface PayslipEarnings {
  basicSalary: number;
  overtime: number;
  commission: number;
  bonus: number;
  travelAllowance: number;
  otherAllowances: number;
}

export interface PayslipDeductions {
  paye: number;
  uif: number;
  pension: number;
  medicalAid: number;
  otherDeductions: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  payPeriod: {
    month: number; // 1-12
    year: number;
  };
  earnings: PayslipEarnings;
  deductions: PayslipDeductions;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  ytdGross: number;
  ytdPAYE: number;
  ytdNetPay: number;
  status: PayslipStatus;
  paymentDate?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

// ==================== EMP201 Types ====================

export type EMP201Status = 'draft' | 'submitted' | 'acknowledged';

export interface EMP201 {
  id: string;
  taxPeriod: string; // YYYY-MM format
  employerReference: string;
  tradingName: string;
  totalPAYE: number;
  totalUIF: number;
  totalSDL: number;
  totalPayment: number;
  numberOfEmployees: number;
  paymentReferenceNumber?: string;
  status: EMP201Status;
  createdAt: string;
  submittedAt?: string;
  acknowledgedAt?: string;
}

// ==================== Zod Validation Schemas ====================

const saIdNumberRegex = /^[0-9]{13}$/;
const taxNumberRegex = /^[0-9]{10}$/;
const phoneRegex = /^(\+27|0)[0-9]{9}$/;

export const bankDetailsSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Invalid account number').max(15, 'Invalid account number'),
  accountType: z.enum(['cheque', 'savings', 'transmission']),
  branchCode: z.string().length(6, 'Branch code must be 6 digits'),
});

export const employeeSchema = z.object({
  employeeNumber: z.string().min(1, 'Employee number is required'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  idNumber: z.string().regex(saIdNumberRegex, 'Invalid SA ID number (13 digits required)'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid SA phone number'),
  startDate: z.string().min(1, 'Start date is required'),
  terminationDate: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
  taxNumber: z.string().regex(taxNumberRegex, 'Tax number must be 10 digits'),
  bankDetails: bankDetailsSchema,
  status: z.enum(['active', 'terminated', 'on-leave']),
  payFrequency: z.enum(['monthly', 'bi-weekly', 'weekly']),
  basicSalary: z.number().min(0, 'Salary must be positive'),
});

export const salaryDetailsSchema = z.object({
  basicSalary: z.number().min(0),
  overtimePay: z.number().min(0),
  commission: z.number().min(0),
  bonus: z.number().min(0),
  travelAllowance: z.number().min(0),
  medicalAidEmployeeContribution: z.number().min(0),
  medicalAidEmployerContribution: z.number().min(0),
  pensionEmployeeContribution: z.number().min(0),
  pensionEmployerContribution: z.number().min(0),
  otherAllowances: z.number().min(0),
  otherDeductions: z.number().min(0),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type SalaryDetailsFormData = z.infer<typeof salaryDetailsSchema>;

// ==================== Helper Functions ====================

export const getAgeFromIdNumber = (idNumber: string): number => {
  if (idNumber.length !== 13) return 0;
  
  const yearPrefix = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));
  
  // Determine century (people born in 2000+ will have prefix < 25 currently)
  const currentYear = new Date().getFullYear();
  const century = yearPrefix > (currentYear % 100) ? 1900 : 2000;
  const birthYear = century + yearPrefix;
  
  const birthDate = new Date(birthYear, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPayPeriod = (month: number, year: number): string => {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
};

export const getEmployeeStatusLabel = (status: EmployeeStatus): string => {
  const labels: Record<EmployeeStatus, string> = {
    active: 'Active',
    terminated: 'Terminated',
    'on-leave': 'On Leave',
  };
  return labels[status];
};

export const getPayslipStatusLabel = (status: PayslipStatus): string => {
  const labels: Record<PayslipStatus, string> = {
    draft: 'Draft',
    approved: 'Approved',
    paid: 'Paid',
  };
  return labels[status];
};

export const getEMP201StatusLabel = (status: EMP201Status): string => {
  const labels: Record<EMP201Status, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
  };
  return labels[status];
};
