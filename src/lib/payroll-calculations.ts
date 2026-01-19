import {
  SA_TAX_BRACKETS_2025,
  TAX_REBATES_2025,
  UIF_RATE,
  UIF_MAX_EARNINGS,
  SDL_RATE,
  TaxCalculation,
  UIFCalculation,
  SDLCalculation,
  SalaryDetails,
  PayslipEarnings,
  PayslipDeductions,
  Payslip,
  getAgeFromIdNumber,
} from './payroll-types';

// ==================== PAYE Calculations ====================

/**
 * Calculate the tax rebate based on age
 */
export const calculateRebate = (age: number): number => {
  if (age >= 75) {
    return TAX_REBATES_2025.primary + TAX_REBATES_2025.secondary + TAX_REBATES_2025.tertiary;
  } else if (age >= 65) {
    return TAX_REBATES_2025.primary + TAX_REBATES_2025.secondary;
  }
  return TAX_REBATES_2025.primary;
};

/**
 * Get the tax bracket for an annual income
 */
export const getTaxBracket = (annualTaxableIncome: number): typeof SA_TAX_BRACKETS_2025[number] | null => {
  for (const bracket of SA_TAX_BRACKETS_2025) {
    if (annualTaxableIncome >= bracket.min && annualTaxableIncome <= bracket.max) {
      return bracket;
    }
  }
  return null;
};

/**
 * Calculate annual PAYE based on annual taxable income
 */
export const calculateAnnualPAYE = (annualTaxableIncome: number, age: number): TaxCalculation => {
  if (annualTaxableIncome <= 0) {
    return {
      annualTaxableIncome: 0,
      annualPAYE: 0,
      monthlyPAYE: 0,
      taxBracket: 0,
      rebateApplied: 0,
    };
  }

  const bracket = getTaxBracket(annualTaxableIncome);
  if (!bracket) {
    return {
      annualTaxableIncome,
      annualPAYE: 0,
      monthlyPAYE: 0,
      taxBracket: 0,
      rebateApplied: 0,
    };
  }

  // Calculate tax before rebates
  const excessOverMin = annualTaxableIncome - bracket.min;
  const marginalTax = excessOverMin * (bracket.rate / 100);
  const taxBeforeRebate = bracket.base + marginalTax;

  // Apply age-based rebates
  const rebate = calculateRebate(age);
  const annualPAYE = Math.max(0, taxBeforeRebate - rebate);
  const monthlyPAYE = annualPAYE / 12;

  return {
    annualTaxableIncome,
    annualPAYE: Math.round(annualPAYE * 100) / 100,
    monthlyPAYE: Math.round(monthlyPAYE * 100) / 100,
    taxBracket: bracket.rate,
    rebateApplied: rebate,
  };
};

/**
 * Calculate monthly PAYE from monthly income
 */
export const calculateMonthlyPAYE = (
  monthlyGross: number,
  monthlyDeductions: number,
  age: number
): TaxCalculation => {
  const monthlyTaxableIncome = monthlyGross - monthlyDeductions;
  const annualTaxableIncome = monthlyTaxableIncome * 12;
  return calculateAnnualPAYE(annualTaxableIncome, age);
};

// ==================== UIF Calculations ====================

/**
 * Calculate UIF contributions (1% each for employee and employer)
 * Capped at monthly earnings of R17,712
 */
export const calculateUIF = (grossRemuneration: number): UIFCalculation => {
  const cappedEarnings = Math.min(grossRemuneration, UIF_MAX_EARNINGS);
  const uifAmount = cappedEarnings * UIF_RATE;
  
  return {
    grossRemuneration,
    uifEmployee: Math.round(uifAmount * 100) / 100,
    uifEmployer: Math.round(uifAmount * 100) / 100,
  };
};

// ==================== SDL Calculations ====================

/**
 * Calculate Skills Development Levy (1% of leviable amount)
 * Only applicable to employers with annual payroll > R500,000
 */
export const calculateSDL = (leviableAmount: number): SDLCalculation => {
  const sdlAmount = leviableAmount * SDL_RATE;
  
  return {
    leviableAmount,
    sdlAmount: Math.round(sdlAmount * 100) / 100,
  };
};

// ==================== Full Payslip Calculation ====================

interface PayslipCalculationInput {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  idNumber: string;
  salaryDetails: SalaryDetails;
  payPeriod: { month: number; year: number };
  ytdGross?: number;
  ytdPAYE?: number;
  ytdNetPay?: number;
}

/**
 * Calculate a complete payslip with all earnings and deductions
 */
export const calculatePayslip = (input: PayslipCalculationInput): Omit<Payslip, 'id' | 'createdAt' | 'status'> => {
  const { salaryDetails, payPeriod, ytdGross = 0, ytdPAYE = 0, ytdNetPay = 0 } = input;
  const age = getAgeFromIdNumber(input.idNumber);

  // Calculate earnings
  const earnings: PayslipEarnings = {
    basicSalary: salaryDetails.basicSalary,
    overtime: salaryDetails.overtimePay,
    commission: salaryDetails.commission,
    bonus: salaryDetails.bonus,
    travelAllowance: salaryDetails.travelAllowance,
    otherAllowances: salaryDetails.otherAllowances,
  };

  const grossPay = 
    earnings.basicSalary +
    earnings.overtime +
    earnings.commission +
    earnings.bonus +
    earnings.travelAllowance +
    earnings.otherAllowances;

  // Calculate tax-deductible amounts (pension and medical aid reduce taxable income)
  const taxDeductibleContributions = 
    salaryDetails.pensionEmployeeContribution +
    salaryDetails.medicalAidEmployeeContribution;

  // Calculate PAYE
  const payeCalc = calculateMonthlyPAYE(grossPay, taxDeductibleContributions, age);

  // Calculate UIF
  const uifCalc = calculateUIF(grossPay);

  // Build deductions
  const deductions: PayslipDeductions = {
    paye: payeCalc.monthlyPAYE,
    uif: uifCalc.uifEmployee,
    pension: salaryDetails.pensionEmployeeContribution,
    medicalAid: salaryDetails.medicalAidEmployeeContribution,
    otherDeductions: salaryDetails.otherDeductions,
  };

  const totalDeductions = 
    deductions.paye +
    deductions.uif +
    deductions.pension +
    deductions.medicalAid +
    deductions.otherDeductions;

  const netPay = grossPay - totalDeductions;

  return {
    employeeId: input.employeeId,
    employeeName: input.employeeName,
    employeeNumber: input.employeeNumber,
    payPeriod,
    earnings,
    deductions,
    grossPay: Math.round(grossPay * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    ytdGross: Math.round((ytdGross + grossPay) * 100) / 100,
    ytdPAYE: Math.round((ytdPAYE + payeCalc.monthlyPAYE) * 100) / 100,
    ytdNetPay: Math.round((ytdNetPay + netPay) * 100) / 100,
  };
};

// ==================== EMP201 Aggregation ====================

interface EMP201Calculation {
  totalPAYE: number;
  totalUIF: number; // Both employee and employer portions
  totalSDL: number;
  totalPayment: number;
  numberOfEmployees: number;
}

/**
 * Calculate EMP201 totals from a list of payslips
 */
export const calculateEMP201 = (payslips: Payslip[], annualPayroll: number): EMP201Calculation => {
  const numberOfEmployees = new Set(payslips.map(p => p.employeeId)).size;
  
  let totalPAYE = 0;
  let totalUIFEmployee = 0;
  let totalGrossPay = 0;

  for (const payslip of payslips) {
    totalPAYE += payslip.deductions.paye;
    totalUIFEmployee += payslip.deductions.uif;
    totalGrossPay += payslip.grossPay;
  }

  // UIF includes both employee and employer contributions
  const totalUIFEmployer = totalUIFEmployee; // Employer matches employee contribution
  const totalUIF = totalUIFEmployee + totalUIFEmployer;

  // SDL only applies if annual payroll exceeds R500,000
  const sdlCalc = annualPayroll >= 500000 ? calculateSDL(totalGrossPay) : { sdlAmount: 0 };
  const totalSDL = sdlCalc.sdlAmount;

  const totalPayment = totalPAYE + totalUIF + totalSDL;

  return {
    totalPAYE: Math.round(totalPAYE * 100) / 100,
    totalUIF: Math.round(totalUIF * 100) / 100,
    totalSDL: Math.round(totalSDL * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    numberOfEmployees,
  };
};

// ==================== Utility Functions ====================

/**
 * Calculate annual equivalent from monthly amount
 */
export const monthlyToAnnual = (monthly: number): number => monthly * 12;

/**
 * Calculate monthly equivalent from annual amount
 */
export const annualToMonthly = (annual: number): number => annual / 12;

/**
 * Format tax bracket info for display
 */
export const formatTaxBracketInfo = (annualIncome: number): string => {
  const bracket = getTaxBracket(annualIncome);
  if (!bracket) return 'No tax applicable';
  
  return `${bracket.rate}% marginal rate`;
};
