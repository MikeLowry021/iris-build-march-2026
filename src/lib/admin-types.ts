export interface AdminClient {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  bookkeeperId?: string;
  bookkeeperName?: string;
  accountantName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActivity: string;
  vatTotalThisMonth: number;
  payeTotalThisMonth: number;
}

export interface Bookkeeper {
  id: string;
  name: string;
  email: string;
  clientsAssigned: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'sign' | 'login' | 'export';
  resourceType: 'client' | 'transaction' | 'report' | 'user' | 'settings' | 'system';
  resourceId?: string;
  resourceName?: string;
  status: 'success' | 'failed';
  details: string;
  ipAddress?: string;
}

export interface SystemSettings {
  general: {
    companyName: string;
    logoUrl?: string;
    vatRate: number;
    financialYearEnd: string;
    taxTableUrl?: string;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    emailFromAddress: string;
    emailFromName: string;
  };
  integrations: {
    apifyApiKey?: string;
    docusignApiKey?: string;
    auth0ClientId?: string;
    auth0Domain?: string;
  };
  security: {
    lastBackupDate: string;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecial: boolean;
    sessionTimeoutMinutes: number;
  };
}

export interface SystemHealth {
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  lastBackup: string;
  activeUsers: number;
  storageUsed: number;
  storageTotal: number;
}
