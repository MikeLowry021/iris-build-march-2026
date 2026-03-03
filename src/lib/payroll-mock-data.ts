import { Employee, Payslip, EMP201 } from './payroll-types';

// ==================== Mock Employees ====================

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    employeeNumber: 'EMP001',
    firstName: 'Thabo',
    lastName: 'Molefe',
    idNumber: '8506155123083',
    dateOfBirth: '1985-06-15',
    email: 'thabo.molefe@company.co.za',
    phone: '0821234567',
    startDate: '2020-03-01',
    position: 'Senior Accountant',
    department: 'Finance',
    taxNumber: '1234567890',
    bankDetails: {
      bankName: 'Standard Bank',
      accountNumber: '123456789',
      accountType: 'cheque',
      branchCode: '051001',
    },
    status: 'active',
    payFrequency: 'monthly',
    basicSalary: 45000,
    createdAt: '2020-03-01T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'emp-002',
    employeeNumber: 'EMP002',
    firstName: 'Naledi',
    lastName: 'Dlamini',
    idNumber: '9203240123081',
    dateOfBirth: '1992-03-24',
    email: 'naledi.dlamini@company.co.za',
    phone: '0839876543',
    startDate: '2021-07-15',
    position: 'HR Manager',
    department: 'Human Resources',
    taxNumber: '2345678901',
    bankDetails: {
      bankName: 'FNB',
      accountNumber: '987654321',
      accountType: 'cheque',
      branchCode: '250655',
    },
    status: 'active',
    payFrequency: 'monthly',
    basicSalary: 52000,
    createdAt: '2021-07-15T08:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'emp-003',
    employeeNumber: 'EMP003',
    firstName: 'Johan',
    lastName: 'van der Merwe',
    idNumber: '7812125089082',
    dateOfBirth: '1978-12-12',
    email: 'johan.vdm@company.co.za',
    phone: '0724561234',
    startDate: '2018-01-10',
    position: 'Operations Director',
    department: 'Operations',
    taxNumber: '3456789012',
    bankDetails: {
      bankName: 'Absa',
      accountNumber: '456789123',
      accountType: 'cheque',
      branchCode: '632005',
    },
    status: 'active',
    payFrequency: 'monthly',
    basicSalary: 85000,
    createdAt: '2018-01-10T08:00:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 'emp-004',
    employeeNumber: 'EMP004',
    firstName: 'Priya',
    lastName: 'Naidoo',
    idNumber: '9507180234086',
    dateOfBirth: '1995-07-18',
    email: 'priya.naidoo@company.co.za',
    phone: '0651239876',
    startDate: '2022-09-01',
    position: 'Junior Developer',
    department: 'IT',
    taxNumber: '4567890123',
    bankDetails: {
      bankName: 'Capitec',
      accountNumber: '789123456',
      accountType: 'savings',
      branchCode: '470010',
    },
    status: 'active',
    payFrequency: 'monthly',
    basicSalary: 28000,
    createdAt: '2022-09-01T08:00:00Z',
    updatedAt: '2024-03-05T11:45:00Z',
  },
  {
    id: 'emp-005',
    employeeNumber: 'EMP005',
    firstName: 'Sipho',
    lastName: 'Ndlovu',
    idNumber: '8811230156089',
    dateOfBirth: '1988-11-23',
    email: 'sipho.ndlovu@company.co.za',
    phone: '0847654321',
    startDate: '2019-05-20',
    position: 'Sales Manager',
    department: 'Sales',
    taxNumber: '5678901234',
    bankDetails: {
      bankName: 'Nedbank',
      accountNumber: '321654987',
      accountType: 'cheque',
      branchCode: '198765',
    },
    status: 'active',
    payFrequency: 'monthly',
    basicSalary: 55000,
    createdAt: '2019-05-20T08:00:00Z',
    updatedAt: '2024-02-28T16:30:00Z',
  },
  {
    id: 'emp-006',
    employeeNumber: 'EMP006',
    firstName: 'Lerato',
    lastName: 'Mokoena',
    idNumber: '9001150289084',
    dateOfBirth: '1990-01-15',
    email: 'lerato.mokoena@company.co.za',
    phone: '0763214567',
    startDate: '2020-11-02',
    terminationDate: '2024-06-30',
    position: 'Marketing Coordinator',
    department: 'Marketing',
    taxNumber: '6789012345',
    bankDetails: {
      bankName: 'Standard Bank',
      accountNumber: '654321789',
      accountType: 'cheque',
      branchCode: '051001',
    },
    status: 'terminated',
    payFrequency: 'monthly',
    basicSalary: 35000,
    createdAt: '2020-11-02T08:00:00Z',
    updatedAt: '2024-06-30T17:00:00Z',
  },
  {
    id: 'emp-007',
    employeeNumber: 'EMP007',
    firstName: 'Fatima',
    lastName: 'Patel',
    idNumber: '8704280245085',
    dateOfBirth: '1987-04-28',
    email: 'fatima.patel@company.co.za',
    phone: '0829871234',
    startDate: '2021-02-15',
    position: 'Financial Analyst',
    department: 'Finance',
    taxNumber: '7890123456',
    bankDetails: {
      bankName: 'FNB',
      accountNumber: '147258369',
      accountType: 'cheque',
      branchCode: '250655',
    },
    status: 'on-leave',
    payFrequency: 'monthly',
    basicSalary: 48000,
    createdAt: '2021-02-15T08:00:00Z',
    updatedAt: '2024-07-01T08:00:00Z',
  },
];

// ==================== Mock Payslips ====================

export const mockPayslips: Payslip[] = [
  // January 2025 Payslips
  {
    id: 'pay-001-2025-01',
    employeeId: 'emp-001',
    employeeName: 'Thabo Molefe',
    employeeNumber: 'EMP001',
    payPeriod: { month: 1, year: 2025 },
    earnings: {
      basicSalary: 45000,
      overtime: 2500,
      commission: 0,
      bonus: 0,
      travelAllowance: 3000,
      otherAllowances: 0,
    },
    deductions: {
      paye: 10245.42,
      uif: 177.12,
      pension: 2250,
      medicalAid: 1800,
      otherDeductions: 0,
    },
    grossPay: 50500,
    totalDeductions: 14472.54,
    netPay: 36027.46,
    ytdGross: 50500,
    ytdPAYE: 10245.42,
    ytdNetPay: 36027.46,
    status: 'paid',
    paymentDate: '2025-01-25',
    createdAt: '2025-01-20T08:00:00Z',
    approvedAt: '2025-01-22T10:00:00Z',
    approvedBy: 'Finance Manager',
  },
  {
    id: 'pay-002-2025-01',
    employeeId: 'emp-002',
    employeeName: 'Naledi Dlamini',
    employeeNumber: 'EMP002',
    payPeriod: { month: 1, year: 2025 },
    earnings: {
      basicSalary: 52000,
      overtime: 0,
      commission: 0,
      bonus: 0,
      travelAllowance: 2500,
      otherAllowances: 500,
    },
    deductions: {
      paye: 11856.50,
      uif: 177.12,
      pension: 2600,
      medicalAid: 2200,
      otherDeductions: 0,
    },
    grossPay: 55000,
    totalDeductions: 16833.62,
    netPay: 38166.38,
    ytdGross: 55000,
    ytdPAYE: 11856.50,
    ytdNetPay: 38166.38,
    status: 'paid',
    paymentDate: '2025-01-25',
    createdAt: '2025-01-20T08:00:00Z',
    approvedAt: '2025-01-22T10:00:00Z',
    approvedBy: 'Finance Manager',
  },
  {
    id: 'pay-003-2025-01',
    employeeId: 'emp-003',
    employeeName: 'Johan van der Merwe',
    employeeNumber: 'EMP003',
    payPeriod: { month: 1, year: 2025 },
    earnings: {
      basicSalary: 85000,
      overtime: 0,
      commission: 0,
      bonus: 15000,
      travelAllowance: 5000,
      otherAllowances: 0,
    },
    deductions: {
      paye: 28745.83,
      uif: 177.12,
      pension: 4250,
      medicalAid: 3500,
      otherDeductions: 0,
    },
    grossPay: 105000,
    totalDeductions: 36672.95,
    netPay: 68327.05,
    ytdGross: 105000,
    ytdPAYE: 28745.83,
    ytdNetPay: 68327.05,
    status: 'paid',
    paymentDate: '2025-01-25',
    createdAt: '2025-01-20T08:00:00Z',
    approvedAt: '2025-01-22T10:00:00Z',
    approvedBy: 'Finance Manager',
  },
  {
    id: 'pay-004-2025-01',
    employeeId: 'emp-004',
    employeeName: 'Priya Naidoo',
    employeeNumber: 'EMP004',
    payPeriod: { month: 1, year: 2025 },
    earnings: {
      basicSalary: 28000,
      overtime: 1500,
      commission: 0,
      bonus: 0,
      travelAllowance: 1500,
      otherAllowances: 0,
    },
    deductions: {
      paye: 4523.75,
      uif: 177.12,
      pension: 1400,
      medicalAid: 1200,
      otherDeductions: 0,
    },
    grossPay: 31000,
    totalDeductions: 7300.87,
    netPay: 23699.13,
    ytdGross: 31000,
    ytdPAYE: 4523.75,
    ytdNetPay: 23699.13,
    status: 'paid',
    paymentDate: '2025-01-25',
    createdAt: '2025-01-20T08:00:00Z',
    approvedAt: '2025-01-22T10:00:00Z',
    approvedBy: 'Finance Manager',
  },
  {
    id: 'pay-005-2025-01',
    employeeId: 'emp-005',
    employeeName: 'Sipho Ndlovu',
    employeeNumber: 'EMP005',
    payPeriod: { month: 1, year: 2025 },
    earnings: {
      basicSalary: 55000,
      overtime: 0,
      commission: 8500,
      bonus: 0,
      travelAllowance: 4000,
      otherAllowances: 0,
    },
    deductions: {
      paye: 15234.17,
      uif: 177.12,
      pension: 2750,
      medicalAid: 2000,
      otherDeductions: 0,
    },
    grossPay: 67500,
    totalDeductions: 20161.29,
    netPay: 47338.71,
    ytdGross: 67500,
    ytdPAYE: 15234.17,
    ytdNetPay: 47338.71,
    status: 'paid',
    paymentDate: '2025-01-25',
    createdAt: '2025-01-20T08:00:00Z',
    approvedAt: '2025-01-22T10:00:00Z',
    approvedBy: 'Finance Manager',
  },
];

// ==================== Mock EMP201 Records ====================

export const mockEMP201Records: EMP201[] = [
  {
    id: 'emp201-2024-12',
    taxPeriod: '2024-12',
    employerReference: 'PAYE/1234567890',
    tradingName: 'Iris Accounting Services',
    totalPAYE: 68425.50,
    totalUIF: 1770.12,
    totalSDL: 3090.00,
    totalPayment: 73285.62,
    numberOfEmployees: 6,
    paymentReferenceNumber: 'EMP201-2024-12-001',
    status: 'acknowledged',
    createdAt: '2024-12-20T08:00:00Z',
    submittedAt: '2024-12-27T10:00:00Z',
    acknowledgedAt: '2024-12-28T14:30:00Z',
  },
  {
    id: 'emp201-2025-01',
    taxPeriod: '2025-01',
    employerReference: 'PAYE/1234567890',
    tradingName: 'Iris Accounting Services',
    totalPAYE: 70605.67,
    totalUIF: 1770.12,
    totalSDL: 3090.00,
    totalPayment: 75465.79,
    numberOfEmployees: 5,
    paymentReferenceNumber: 'EMP201-2025-01-001',
    status: 'submitted',
    createdAt: '2025-01-20T08:00:00Z',
    submittedAt: '2025-01-28T09:00:00Z',
  },
];

// ==================== Helper Functions ====================

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find(emp => emp.id === id);
};

export const getActiveEmployees = (): Employee[] => {
  return mockEmployees.filter(emp => emp.status === 'active');
};

export const getPayslipsByEmployee = (employeeId: string): Payslip[] => {
  return mockPayslips.filter(payslip => payslip.employeeId === employeeId);
};

export const getPayslipsByPeriod = (month: number, year: number): Payslip[] => {
  return mockPayslips.filter(
    payslip => payslip.payPeriod.month === month && payslip.payPeriod.year === year
  );
};

export const getCurrentPeriodPayslips = (): Payslip[] => {
  const now = new Date();
  return getPayslipsByPeriod(now.getMonth() + 1, now.getFullYear());
};

export const getEMP201ByPeriod = (taxPeriod: string): EMP201 | undefined => {
  return mockEMP201Records.find(record => record.taxPeriod === taxPeriod);
};

export const getDepartments = (): string[] => {
  const departments = new Set(mockEmployees.map(emp => emp.department));
  return Array.from(departments).sort();
};

export const getTotalMonthlyPayroll = (): number => {
  return mockEmployees
    .filter(emp => emp.status === 'active')
    .reduce((sum, emp) => sum + emp.basicSalary, 0);
};
