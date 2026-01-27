import { AdminClient, Bookkeeper, AuditLogEntry, SystemSettings, SystemHealth } from './admin-types';

export const mockBookkeepers: Bookkeeper[] = [
  {
    id: 'bk1',
    name: 'Linda Dlamini',
    email: 'linda@auditnex.co.za',
    clientsAssigned: ['1', '2', '5'],
    isActive: true,
    lastLogin: '2026-01-27 08:30',
    createdAt: '2024-06-15',
  },
  {
    id: 'bk2',
    name: 'James Sithole',
    email: 'james@auditnex.co.za',
    clientsAssigned: ['3', '6', '8', '11'],
    isActive: true,
    lastLogin: '2026-01-27 09:15',
    createdAt: '2024-08-20',
  },
  {
    id: 'bk3',
    name: 'Maria van Wyk',
    email: 'maria@auditnex.co.za',
    clientsAssigned: ['4', '7', '10'],
    isActive: true,
    lastLogin: '2026-01-26 16:45',
    createdAt: '2024-09-10',
  },
  {
    id: 'bk4',
    name: 'Peter Mokoena',
    email: 'peter@auditnex.co.za',
    clientsAssigned: ['9', '12'],
    isActive: false,
    lastLogin: '2026-01-15 11:00',
    createdAt: '2024-03-05',
  },
  {
    id: 'bk5',
    name: 'Susan Pretorius',
    email: 'susan@auditnex.co.za',
    clientsAssigned: ['13', '14', '15'],
    isActive: true,
    lastLogin: '2026-01-27 07:00',
    createdAt: '2025-01-10',
  },
];

export const mockAdminClients: AdminClient[] = [
  {
    id: '1',
    name: 'Mokwena Trading (Pty) Ltd',
    contactPerson: 'John Mokwena',
    email: 'john@mokwena.co.za',
    phone: '+27 11 123 4567',
    bookkeeperId: 'bk1',
    bookkeeperName: 'Linda Dlamini',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2023-05-10',
    lastActivity: '2 hours ago',
    vatTotalThisMonth: 45600,
    payeTotalThisMonth: 28500,
  },
  {
    id: '2',
    name: 'Nkosi Technologies CC',
    contactPerson: 'Thabo Nkosi',
    email: 'thabo@nkosi-tech.co.za',
    phone: '+27 12 234 5678',
    bookkeeperId: 'bk1',
    bookkeeperName: 'Linda Dlamini',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2023-08-22',
    lastActivity: '1 day ago',
    vatTotalThisMonth: 67200,
    payeTotalThisMonth: 42000,
  },
  {
    id: '3',
    name: 'Coastal Imports (Pty) Ltd',
    contactPerson: 'Priya Naidoo',
    email: 'priya@coastalimports.co.za',
    phone: '+27 31 345 6789',
    bookkeeperId: 'bk2',
    bookkeeperName: 'James Sithole',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2022-11-05',
    lastActivity: '3 days ago',
    vatTotalThisMonth: 128500,
    payeTotalThisMonth: 85000,
  },
  {
    id: '4',
    name: 'Botha Agricultural Holdings',
    contactPerson: 'Willem Botha',
    email: 'willem@botha-farms.co.za',
    phone: '+27 18 456 7890',
    bookkeeperId: 'bk3',
    bookkeeperName: 'Maria van Wyk',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2021-03-15',
    lastActivity: '1 week ago',
    vatTotalThisMonth: 89000,
    payeTotalThisMonth: 156000,
  },
  {
    id: '5',
    name: 'SparkClean Services',
    contactPerson: 'Fatima Mahomed',
    email: 'fatima@sparkclean.co.za',
    phone: '+27 11 567 8901',
    bookkeeperId: 'bk1',
    bookkeeperName: 'Linda Dlamini',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2024-02-28',
    lastActivity: '5 hours ago',
    vatTotalThisMonth: 23400,
    payeTotalThisMonth: 67500,
  },
  {
    id: '6',
    name: 'Johannesburg Auto Parts',
    contactPerson: 'Ahmed Patel',
    email: 'ahmed@jhbautoparts.co.za',
    phone: '+27 11 678 9012',
    bookkeeperId: 'bk2',
    bookkeeperName: 'James Sithole',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2023-07-18',
    lastActivity: '12 hours ago',
    vatTotalThisMonth: 156000,
    payeTotalThisMonth: 94000,
  },
  {
    id: '7',
    name: 'Cape Town Consulting Group',
    contactPerson: 'David Williams',
    email: 'david@ctconsulting.co.za',
    phone: '+27 21 789 0123',
    bookkeeperId: 'bk3',
    bookkeeperName: 'Maria van Wyk',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2022-05-30',
    lastActivity: '4 hours ago',
    vatTotalThisMonth: 78000,
    payeTotalThisMonth: 112000,
  },
  {
    id: '8',
    name: 'Durban Freight Logistics',
    contactPerson: 'Sipho Mthembu',
    email: 'sipho@durbanfreight.co.za',
    phone: '+27 31 890 1234',
    bookkeeperId: 'bk2',
    bookkeeperName: 'James Sithole',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2023-01-12',
    lastActivity: '6 hours ago',
    vatTotalThisMonth: 234000,
    payeTotalThisMonth: 178000,
  },
  {
    id: '9',
    name: 'Pretoria Legal Associates',
    contactPerson: 'Michelle de Klerk',
    email: 'michelle@pretorialegal.co.za',
    phone: '+27 12 901 2345',
    bookkeeperId: 'bk4',
    bookkeeperName: 'Peter Mokoena',
    accountantName: 'Sarah van der Berg',
    status: 'inactive',
    createdAt: '2021-09-25',
    lastActivity: '2 weeks ago',
    vatTotalThisMonth: 0,
    payeTotalThisMonth: 0,
  },
  {
    id: '10',
    name: 'Sunrise Bakery',
    contactPerson: 'Grace Zulu',
    email: 'grace@sunrisebakery.co.za',
    phone: '+27 11 012 3456',
    bookkeeperId: 'bk3',
    bookkeeperName: 'Maria van Wyk',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2024-04-10',
    lastActivity: '1 day ago',
    vatTotalThisMonth: 34500,
    payeTotalThisMonth: 45000,
  },
  {
    id: '11',
    name: 'Eastern Cape Mining Supplies',
    contactPerson: 'Robert Njobe',
    email: 'robert@ecmining.co.za',
    phone: '+27 41 123 4567',
    bookkeeperId: 'bk2',
    bookkeeperName: 'James Sithole',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2022-08-14',
    lastActivity: '8 hours ago',
    vatTotalThisMonth: 456000,
    payeTotalThisMonth: 234000,
  },
  {
    id: '12',
    name: 'Limpopo Safari Tours',
    contactPerson: 'Anna Kruger',
    email: 'anna@limposafari.co.za',
    phone: '+27 15 234 5678',
    bookkeeperId: 'bk4',
    bookkeeperName: 'Peter Mokoena',
    accountantName: 'Sarah van der Berg',
    status: 'inactive',
    createdAt: '2023-03-28',
    lastActivity: '1 month ago',
    vatTotalThisMonth: 0,
    payeTotalThisMonth: 0,
  },
  {
    id: '13',
    name: 'Mpumalanga Steel Works',
    contactPerson: 'Charles Ndlovu',
    email: 'charles@mpusteelworks.co.za',
    phone: '+27 13 345 6789',
    bookkeeperId: 'bk5',
    bookkeeperName: 'Susan Pretorius',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2024-01-05',
    lastActivity: '3 hours ago',
    vatTotalThisMonth: 567000,
    payeTotalThisMonth: 345000,
  },
  {
    id: '14',
    name: 'Free State Dairy Co-op',
    contactPerson: 'Hendrik Venter',
    email: 'hendrik@fsdairy.co.za',
    phone: '+27 51 456 7890',
    bookkeeperId: 'bk5',
    bookkeeperName: 'Susan Pretorius',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2023-11-20',
    lastActivity: '5 hours ago',
    vatTotalThisMonth: 123000,
    payeTotalThisMonth: 189000,
  },
  {
    id: '15',
    name: 'North West Construction',
    contactPerson: 'Blessing Molefe',
    email: 'blessing@nwconstruct.co.za',
    phone: '+27 18 567 8901',
    bookkeeperId: 'bk5',
    bookkeeperName: 'Susan Pretorius',
    accountantName: 'Sarah van der Berg',
    status: 'active',
    createdAt: '2024-06-01',
    lastActivity: '2 hours ago',
    vatTotalThisMonth: 890000,
    payeTotalThisMonth: 567000,
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  // Generate 100 mock audit log entries
  ...generateMockAuditLogs(),
];

function generateMockAuditLogs(): AuditLogEntry[] {
  const actions: AuditLogEntry['action'][] = ['create', 'update', 'delete', 'approve', 'sign', 'login', 'export'];
  const resourceTypes: AuditLogEntry['resourceType'][] = ['client', 'transaction', 'report', 'user', 'settings', 'system'];
  const users = [
    { id: 'u1', name: 'Sarah van der Berg', role: 'accountant' },
    { id: 'u2', name: 'Linda Dlamini', role: 'bookkeeper' },
    { id: 'u3', name: 'James Sithole', role: 'bookkeeper' },
    { id: 'u4', name: 'Dr. Pieter van Niekerk', role: 'admin' },
    { id: 'u5', name: 'John Mokwena', role: 'client' },
  ];
  const statuses: AuditLogEntry['status'][] = ['success', 'failed'];
  
  const logs: AuditLogEntry[] = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const status = Math.random() > 0.1 ? 'success' : 'failed';
    
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    logs.push({
      id: `log-${i + 1}`,
      timestamp: timestamp.toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      resourceType,
      resourceId: `res-${Math.floor(Math.random() * 100)}`,
      resourceName: getResourceName(resourceType, action),
      status,
      details: getActionDetails(action, resourceType, status),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getResourceName(resourceType: string, action: string): string {
  const names: Record<string, string[]> = {
    client: ['Mokwena Trading', 'Nkosi Technologies', 'Coastal Imports', 'SparkClean Services'],
    transaction: ['Bank Import #4521', 'Journal Entry #892', 'VAT Return Jan', 'Payroll Dec'],
    report: ['Trial Balance Q4', 'Income Statement 2025', 'VAT Summary', 'PAYE Report'],
    user: ['John Mokwena', 'Linda Dlamini', 'New Bookkeeper', 'Client User'],
    settings: ['VAT Rate', 'Email Template', 'Password Policy', 'Backup Schedule'],
    system: ['Database', 'API Connection', 'File Storage', 'Authentication'],
  };
  
  const options = names[resourceType] || ['Unknown Resource'];
  return options[Math.floor(Math.random() * options.length)];
}

function getActionDetails(action: string, resourceType: string, status: string): string {
  if (status === 'failed') {
    return `Failed to ${action} ${resourceType}: Permission denied or resource locked`;
  }
  
  const details: Record<string, string> = {
    create: `Created new ${resourceType} successfully`,
    update: `Updated ${resourceType} details and saved changes`,
    delete: `Permanently deleted ${resourceType} from system`,
    approve: `Approved ${resourceType} for final submission`,
    sign: `Digitally signed ${resourceType} document`,
    login: `User logged in successfully`,
    export: `Exported ${resourceType} data to CSV/PDF`,
  };
  
  return details[action] || 'Action completed';
}

export const mockSystemSettings: SystemSettings = {
  general: {
    companyName: 'Audit Nex Partners',
    logoUrl: undefined,
    vatRate: 15,
    financialYearEnd: '28 February',
    taxTableUrl: undefined,
  },
  email: {
    smtpServer: 'smtp.auditnex.co.za',
    smtpPort: 587,
    smtpUsername: 'notifications@auditnex.co.za',
    emailFromAddress: 'no-reply@auditnex.co.za',
    emailFromName: 'Audit Nex System',
  },
  integrations: {
    apifyApiKey: undefined,
    docusignApiKey: undefined,
    auth0ClientId: undefined,
    auth0Domain: undefined,
  },
  security: {
    lastBackupDate: '2026-01-27T07:00:00Z',
    passwordMinLength: 12,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeoutMinutes: 30,
  },
};

export const mockSystemHealth: SystemHealth = {
  status: 'online',
  uptime: '99.9%',
  lastBackup: '1 hour ago',
  activeUsers: 12,
  storageUsed: 45.2,
  storageTotal: 100,
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};
