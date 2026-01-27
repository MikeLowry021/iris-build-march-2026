import { 
  JeromeTip, 
  JeromeContextualGuidance, 
  JeromeQuickReply, 
  JeromeAutoSignLog,
  JeromeSettings 
} from './jerome-types';

export const defaultJeromeSettings: JeromeSettings = {
  notificationFrequency: 'daily-digest',
  guidanceLevel: 'intermediate',
  autoSignEnabled: true,
  emailNotifications: true,
  preferredContactTime: 'morning',
};

export const jeromeTips: JeromeTip[] = [
  // Tax Tips
  {
    id: 'tip-1',
    category: 'tax',
    title: 'Home Office Deductions',
    content: 'Did you know? You can claim home office expenses if you work from home. Section 10 of the Income Tax Act allows deductions for the portion of rent, utilities, and internet used for business purposes.',
    priority: 'high',
  },
  {
    id: 'tip-2',
    category: 'tax',
    title: 'Provisional Tax Deadlines',
    content: 'Remember: First provisional tax payment is due 6 months after your financial year-end. Second payment is due at year-end. Missing these can result in penalties up to 10%.',
    priority: 'high',
  },
  {
    id: 'tip-3',
    category: 'tax',
    title: 'Capital Gains Tax',
    content: 'Only 40% of capital gains are included in your taxable income for individuals. The first R40,000 of capital gains per year is excluded.',
    priority: 'medium',
  },
  // VAT Tips
  {
    id: 'tip-4',
    category: 'vat',
    title: 'Zero-Rated vs Exempt',
    content: 'Petrol is zero-rated, meaning you can\'t claim the VAT you paid - this is a common mistake. Zero-rated supplies are taxable at 0%, while exempt supplies are not taxable at all.',
    priority: 'high',
  },
  {
    id: 'tip-5',
    category: 'vat',
    title: 'VAT Invoice Requirements',
    content: 'A valid tax invoice must include: supplier\'s VAT number, invoice date, description of goods/services, and the VAT amount. Without these, you cannot claim input VAT.',
    priority: 'medium',
  },
  {
    id: 'tip-6',
    category: 'vat',
    title: 'VAT Registration Threshold',
    content: 'You must register for VAT if your taxable supplies exceed R1 million in any 12-month period. Voluntary registration is possible below this threshold.',
    priority: 'medium',
  },
  // PAYE Tips
  {
    id: 'tip-7',
    category: 'paye',
    title: 'PAYE Due Date',
    content: 'PAYE is due on the 7th of the month following the payroll period. Late payments attract 10% penalty plus interest at the prescribed rate.',
    priority: 'high',
  },
  {
    id: 'tip-8',
    category: 'paye',
    title: 'EMP201 Submission',
    content: 'EMP201 must be submitted monthly by the 7th, even if no employees were paid during that period. Zero returns are still required.',
    priority: 'medium',
  },
  {
    id: 'tip-9',
    category: 'paye',
    title: 'Travel Allowance',
    content: 'If you provide employees with a travel allowance, only the portion used for business travel is tax-free. They must keep a logbook to prove business use.',
    priority: 'low',
  },
  // Deduction Tips
  {
    id: 'tip-10',
    category: 'deduction',
    title: 'Vehicle Expenses',
    content: 'If you use your vehicle for business, keep a detailed logbook. You can claim either actual expenses or the fixed rate per kilometer.',
    priority: 'medium',
  },
  {
    id: 'tip-11',
    category: 'deduction',
    title: 'Retirement Fund Contributions',
    content: 'Contributions to retirement funds are tax-deductible up to 27.5% of taxable income, with an annual cap of R350,000.',
    priority: 'medium',
  },
  {
    id: 'tip-12',
    category: 'deduction',
    title: 'Wear and Tear Allowance',
    content: 'Assets used in your business qualify for wear and tear deductions. Computers and office equipment typically have a 3-year write-off period.',
    priority: 'low',
  },
  // Compliance Tips
  {
    id: 'tip-13',
    category: 'compliance',
    title: 'Record Keeping',
    content: 'SARS requires you to keep financial records for 5 years. This includes invoices, receipts, bank statements, and any supporting documents.',
    priority: 'high',
  },
  {
    id: 'tip-14',
    category: 'compliance',
    title: 'Tax Clearance Certificate',
    content: 'A valid Tax Clearance Certificate (TCC) is often required for government tenders. Apply via eFiling and ensure all returns are up to date.',
    priority: 'medium',
  },
  {
    id: 'tip-15',
    category: 'compliance',
    title: 'B-BBEE Compliance',
    content: 'If your annual turnover exceeds R10 million, you need a verified B-BBEE certificate. Below this threshold, you can use a sworn affidavit.',
    priority: 'low',
  },
];

export const jeromeContextualGuidance: JeromeContextualGuidance[] = [
  // Client Dashboard
  {
    id: 'guide-1',
    route: '/client',
    message: 'Your VAT for this month is R12,450. Need help calculating quarterly tax? I can help!',
    type: 'info',
  },
  {
    id: 'guide-2',
    route: '/client',
    message: 'Your financial statement is ready for review. It will be signed within 24 hours.',
    type: 'success',
  },
  {
    id: 'guide-3',
    route: '/client',
    message: 'You have 3 uncategorized transactions. Would you like me to suggest categories?',
    type: 'warning',
    actionLabel: 'View Transactions',
    actionRoute: '/client/transactions',
  },
  // Bookkeeper Categorization
  {
    id: 'guide-4',
    route: '/bookkeeper/clients/1/categorize',
    message: 'You\'ve categorized 18 of 25 transactions. Keep going!',
    type: 'info',
  },
  {
    id: 'guide-5',
    route: '/bookkeeper/clients/1/categorize',
    message: 'Pro tip: This transaction looks like Office Supplies (GL 4100, VAT-able). Need me to categorize it?',
    type: 'action',
    actionLabel: 'Apply Suggestion',
  },
  {
    id: 'guide-6',
    route: '/bookkeeper/clients/1/categorize',
    message: 'Great progress! Only 7 transactions remaining to categorize.',
    type: 'success',
  },
  // Accountant Review
  {
    id: 'guide-7',
    route: '/accountant/clients',
    message: 'All validation checks passed ✅',
    type: 'success',
  },
  {
    id: 'guide-8',
    route: '/accountant/clients',
    message: 'Trial Balance = Adjusted TB = Financials ✅',
    type: 'success',
  },
  {
    id: 'guide-9',
    route: '/accountant/clients',
    message: 'Ready to sign? The document meets all auto-sign conditions.',
    type: 'action',
    actionLabel: 'Sign Now',
  },
  // Financial Statements
  {
    id: 'guide-10',
    route: '/client/financials',
    message: 'Your profit is up 15% from last month. Well done!',
    type: 'success',
  },
  {
    id: 'guide-11',
    route: '/client/financials',
    message: 'Capital Gains opportunity: You have R50k in unused deductions. Talk to your accountant about tax planning.',
    type: 'info',
  },
  // Admin Dashboard
  {
    id: 'guide-12',
    route: '/admin',
    message: 'System health is excellent. All services operational with 99.9% uptime.',
    type: 'success',
  },
  {
    id: 'guide-13',
    route: '/admin',
    message: '3 clients have pending financial reviews. Would you like to see the list?',
    type: 'warning',
    actionLabel: 'View Clients',
    actionRoute: '/admin/manage-clients',
  },
  // Bookkeeper Dashboard
  {
    id: 'guide-14',
    route: '/bookkeeper',
    message: 'You have 5 clients with pending categorization tasks.',
    type: 'info',
  },
  {
    id: 'guide-15',
    route: '/bookkeeper',
    message: 'Tip: Complete categorization before month-end to ensure timely VAT submissions.',
    type: 'warning',
  },
];

export const jeromeQuickReplies: JeromeQuickReply[] = [
  {
    id: 'qr-1',
    question: 'How do I categorize this transaction?',
    answer: 'To categorize a transaction, go to the Transactions page and click on the uncategorized item. Select the appropriate GL account from the dropdown. If you\'re unsure, I can suggest a category based on the transaction description.',
    category: 'transactions',
  },
  {
    id: 'qr-2',
    question: 'What\'s the VAT treatment for petrol?',
    answer: 'Petrol is zero-rated in South Africa, which means VAT is charged at 0%. However, you cannot claim input VAT on petrol purchases. This is different from VAT-exempt supplies.',
    category: 'vat',
  },
  {
    id: 'qr-3',
    question: 'When is my tax due?',
    answer: 'Your tax due dates depend on your entity type:\n• Provisional Tax: 6 months after year-end and at year-end\n• PAYE: 7th of each month\n• VAT: 25th of the month following the tax period\n• Annual IT14: 12 months after financial year-end',
    category: 'tax',
  },
  {
    id: 'qr-4',
    question: 'How do I download my payslip?',
    answer: 'Go to the Payroll section and click on your name. You\'ll see a list of all your payslips. Click on the month you need and select "Download PDF". You can also request all payslips for the tax year.',
    category: 'payroll',
  },
  {
    id: 'qr-5',
    question: 'What documents do I need for a tax submission?',
    answer: 'For a complete tax submission, you\'ll need:\n• Bank statements for the full year\n• All invoices and receipts\n• IRP5 certificates from employers\n• Proof of medical aid and retirement contributions\n• Logbook for travel claims',
    category: 'tax',
  },
  {
    id: 'qr-6',
    question: 'How does auto-sign work?',
    answer: 'Auto-sign is a feature where I can digitally sign documents on your behalf when all conditions are met:\n• Trial Balance matches Financials\n• All transactions are categorized\n• No critical discrepancies\n• All adjusting entries reviewed\n\nYou can enable/disable this in Jerome Settings.',
    category: 'general',
  },
  {
    id: 'qr-7',
    question: 'Why is my VAT return flagged?',
    answer: 'Your VAT return might be flagged for several reasons:\n• Input VAT exceeds output VAT significantly\n• Missing supporting invoices\n• Incorrect VAT percentages applied\n• Late submission history\n\nCheck the specific flags in your VAT section.',
    category: 'vat',
  },
  {
    id: 'qr-8',
    question: 'What\'s the difference between expense and asset?',
    answer: 'An expense is a cost that benefits the current period (like office supplies, rent). An asset is something with future value that will benefit multiple periods (like equipment, vehicles). Assets are capitalized and depreciated over their useful life.',
    category: 'accounting',
  },
  {
    id: 'qr-9',
    question: 'How do I add a new employee to payroll?',
    answer: 'To add a new employee:\n1. Go to Payroll > Employees\n2. Click "Add Employee"\n3. Enter their details, tax number, and banking info\n4. Set their salary/wage structure\n5. Save and they\'ll appear in next payroll run',
    category: 'payroll',
  },
  {
    id: 'qr-10',
    question: 'What is CIPC and why do I need it?',
    answer: 'CIPC (Companies and Intellectual Property Commission) is the government body that registers companies in South Africa. You need CIPC registration to operate as a company, open a business bank account, and meet compliance requirements. Annual returns must be filed.',
    category: 'compliance',
  },
  {
    id: 'qr-11',
    question: 'How do I request a tax clearance certificate?',
    answer: 'To request a Tax Clearance Certificate:\n1. Log into SARS eFiling\n2. Go to Tax Status > Tax Compliance Status\n3. Select "Apply for TCC"\n4. Ensure all returns are filed and payments up to date\n5. Certificate is usually issued within 24-48 hours if compliant',
    category: 'tax',
  },
  {
    id: 'qr-12',
    question: 'What are adjusting entries?',
    answer: 'Adjusting entries are journal entries made at the end of an accounting period to update account balances before preparing financial statements. Examples include:\n• Accrued expenses\n• Prepaid expenses\n• Depreciation\n• Unearned revenue',
    category: 'accounting',
  },
  {
    id: 'qr-13',
    question: 'How do I upload bank statements?',
    answer: 'To upload bank statements:\n1. Go to Upload Statements page\n2. Click "Upload" or drag and drop your file\n3. Supported formats: PDF, CSV, OFX\n4. I\'ll automatically parse and categorize transactions\n5. Review and approve the categorizations',
    category: 'transactions',
  },
  {
    id: 'qr-14',
    question: 'What is the current VAT rate?',
    answer: 'The standard VAT rate in South Africa is 15% (increased from 14% in April 2018). Some items are zero-rated (0%) like basic food items, and some are exempt (like financial services).',
    category: 'vat',
  },
  {
    id: 'qr-15',
    question: 'How do I calculate provisional tax?',
    answer: 'Provisional tax is calculated as follows:\n• First payment (6 months after year-end): 50% of estimated annual tax\n• Second payment (at year-end): Remaining balance\n• If you underpay by more than 10%, penalties apply\n\nI can help estimate your provisional tax based on your current income.',
    category: 'tax',
  },
  {
    id: 'qr-16',
    question: 'What is UIF and how much should I pay?',
    answer: 'UIF (Unemployment Insurance Fund) contributions are:\n• 1% from employee\'s salary\n• 1% from employer (matching)\n• Total: 2% of gross salary\n• Maximum contribution based on salary ceiling\n\nThis is submitted monthly with your EMP201.',
    category: 'payroll',
  },
  {
    id: 'qr-17',
    question: 'How do I reconcile my bank account?',
    answer: 'To reconcile your bank account:\n1. Compare your bank statement to your accounting records\n2. Mark off matching transactions\n3. Identify outstanding deposits and payments\n4. Adjust for bank charges and interest\n5. The adjusted balances should match',
    category: 'accounting',
  },
  {
    id: 'qr-18',
    question: 'What is the IT14 return?',
    answer: 'The IT14 is the annual income tax return for companies in South Africa. It includes:\n• Income and expenses for the tax year\n• Financial statements\n• Supporting schedules\n• Due 12 months after financial year-end',
    category: 'tax',
  },
  {
    id: 'qr-19',
    question: 'How do I export reports?',
    answer: 'To export reports:\n1. Navigate to the report you want to export\n2. Click the "Export" or "Download" button\n3. Choose your format: PDF, Excel, or CSV\n4. The file will download to your device\n\nMost reports support multiple export formats.',
    category: 'general',
  },
  {
    id: 'qr-20',
    question: 'What happens if I miss a tax deadline?',
    answer: 'Missing tax deadlines has consequences:\n• SARS penalty: Up to 10% of tax due\n• Interest: Prescribed rate (currently ~10.75% per annum)\n• Potential audit flag\n• Loss of good standing status\n\nAlways file on time, even if you can\'t pay the full amount.',
    category: 'tax',
  },
];

export const jeromeAutoSignLogs: JeromeAutoSignLog[] = [
  {
    id: 'sign-1',
    documentId: 'doc-1',
    documentName: 'Financial Statements - January 2026',
    clientName: 'Mokwena Trading (Pty) Ltd',
    signedAt: new Date('2026-01-26T14:30:00'),
    conditions: [
      { id: 'c1', label: 'TB = Adjusted TB = Financials', description: 'Trial balance matches financial statements', met: true },
      { id: 'c2', label: 'All transactions categorized', description: 'No uncategorized transactions remain', met: true },
      { id: 'c3', label: 'Adjusting entries reviewed', description: 'All adjusting entries have been reviewed', met: true },
      { id: 'c4', label: 'No critical discrepancies', description: 'No material discrepancies detected', met: true },
    ],
    status: 'signed',
  },
  {
    id: 'sign-2',
    documentId: 'doc-2',
    documentName: 'IT14SD Reconciliation - December 2025',
    clientName: 'Nkosi Technologies CC',
    signedAt: new Date('2026-01-25T09:15:00'),
    conditions: [
      { id: 'c1', label: 'TB = Adjusted TB = Financials', description: 'Trial balance matches financial statements', met: true },
      { id: 'c2', label: 'All transactions categorized', description: 'No uncategorized transactions remain', met: true },
      { id: 'c3', label: 'Adjusting entries reviewed', description: 'All adjusting entries have been reviewed', met: true },
      { id: 'c4', label: 'No critical discrepancies', description: 'No material discrepancies detected', met: true },
    ],
    status: 'signed',
  },
  {
    id: 'sign-3',
    documentId: 'doc-3',
    documentName: 'VAT201 Return - January 2026',
    clientName: 'Coastal Imports (Pty) Ltd',
    signedAt: new Date('2026-01-24T16:45:00'),
    conditions: [
      { id: 'c1', label: 'TB = Adjusted TB = Financials', description: 'Trial balance matches financial statements', met: true },
      { id: 'c2', label: 'All transactions categorized', description: 'No uncategorized transactions remain', met: false },
      { id: 'c3', label: 'Adjusting entries reviewed', description: 'All adjusting entries have been reviewed', met: true },
      { id: 'c4', label: 'No critical discrepancies', description: 'No material discrepancies detected', met: false },
    ],
    status: 'failed',
    failureReason: '2 uncategorized transactions and R5,000 discrepancy in VAT calculation',
  },
  {
    id: 'sign-4',
    documentId: 'doc-4',
    documentName: 'Financial Statements - January 2026',
    clientName: 'Botha Agricultural Holdings',
    signedAt: new Date('2026-01-23T11:20:00'),
    conditions: [
      { id: 'c1', label: 'TB = Adjusted TB = Financials', description: 'Trial balance matches financial statements', met: true },
      { id: 'c2', label: 'All transactions categorized', description: 'No uncategorized transactions remain', met: true },
      { id: 'c3', label: 'Adjusting entries reviewed', description: 'All adjusting entries have been reviewed', met: true },
      { id: 'c4', label: 'No critical discrepancies', description: 'No material discrepancies detected', met: true },
    ],
    status: 'signed',
  },
];

// Helper function to get guidance for current route
export function getGuidanceForRoute(route: string): JeromeContextualGuidance[] {
  return jeromeContextualGuidance.filter(g => route.startsWith(g.route));
}

// Helper function to get random tips
export function getRandomTips(count: number = 3): JeromeTip[] {
  const shuffled = [...jeromeTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to find answer for a question
export function findAnswerForQuestion(question: string): JeromeQuickReply | undefined {
  return jeromeQuickReplies.find(qr => 
    qr.question.toLowerCase().includes(question.toLowerCase()) ||
    question.toLowerCase().includes(qr.question.toLowerCase())
  );
}
