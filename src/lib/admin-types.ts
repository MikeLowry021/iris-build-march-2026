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
  action: 'create' | 'update' | 'delete' | 'approve' | 'sign' | 'login' | 'export' | 'backup' | 'deploy';
  resourceType: 'client' | 'transaction' | 'report' | 'user' | 'settings' | 'system' | 'backup' | 'deployment';
  resourceId?: string;
  resourceName?: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress?: string;
  beforeValue?: string;
  afterValue?: string;
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
    mfaRequirement: 'optional' | 'recommended' | 'required';
  };
}

export interface SystemHealth {
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  uptimePercentage: number;
  lastBackup: string;
  activeUsers: number;
  storageUsed: number;
  storageTotal: number;
  cpuUtilization: number;
  memoryUtilization: number;
  databaseConnections: number;
  databaseConnectionsMax: number;
}

// CTO/DevOps Monitoring Types
export interface InfrastructureHealth {
  uptime: {
    percentage: number;
    last30Days: string;
    slaCompliant: boolean;
    lastIncident?: string;
  };
  server: {
    cpu: number;
    memory: number;
    storage: number;
    databaseConnections: number;
    databaseConnectionsMax: number;
  };
  api: {
    responseTimeAvg: number;
    responseTimeP95: number;
    responseTimeP99: number;
    errorRate5xx: number;
    errorRate4xx: number;
    throughput: number;
  };
}

export interface ApplicationPerformance {
  concurrentUsers: number;
  activeSessions: number;
  pageLoadTimes: {
    lcp: number;
    fid: number;
    cls: number;
  };
  featureUsage: {
    client: number;
    bookkeeper: number;
    accountant: number;
    admin: number;
  };
}

export interface SecurityMetrics {
  authentication: {
    successfulLogins24h: number;
    failedLogins24h: number;
    bruteForceDetected: number;
  };
  authorization: {
    unauthorizedAttempts: number;
    permissionViolations: number;
  };
  ssl: {
    status: 'valid' | 'expiring' | 'expired';
    expiresAt: string;
  };
  compliance: {
    dataResidency: string;
    consentLogsActive: boolean;
    deletionRequestsPending: number;
  };
}

export interface BackupStatus {
  lastBackup: {
    timestamp: string;
    status: 'success' | 'failed';
    size: string;
    duration: number;
  };
  frequency: string;
  restoreTest: {
    lastTested: string;
    status: 'success' | 'failed';
  };
  replicationLag: string;
  failoverReady: boolean;
}

export interface IncidentManagement {
  activeAlerts: number;
  recentIncidents: Incident[];
  mttd: number; // Mean Time to Detect (minutes)
  mttr: number; // Mean Time to Repair (minutes)
}

export interface Incident {
  id: string;
  date: string;
  title: string;
  status: 'active' | 'resolved' | 'investigating';
  severity: 'critical' | 'high' | 'medium' | 'low';
  mttr?: number;
}

export interface DeploymentInfo {
  currentVersion: string;
  deploymentStatus: 'live' | 'deploying' | 'failed';
  lastDeployed: string;
  rollbackAvailable: string;
  cicd: {
    status: 'passing' | 'failing';
    testsTotal: number;
    testsPassed: number;
  };
  codeCoverage: number;
  recentDeployments: Deployment[];
}

export interface Deployment {
  version: string;
  deployedAt: string;
  description: string;
}

export interface CostManagement {
  currentMonthSpend: number;
  budget: number;
  spendTrend: 'up' | 'down' | 'flat';
  breakdown: {
    database: number;
    backend: number;
    frontend: number;
    other: number;
  };
  resourceEfficiency: number;
  costPerUser: number;
}

export interface IntegrationHealth {
  services: ServiceStatus[];
  webhookDeliveryRate: number;
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  lastChecked: string;
}

export interface DevOpsMonitoring {
  infrastructure: InfrastructureHealth;
  performance: ApplicationPerformance;
  security: SecurityMetrics;
  backup: BackupStatus;
  incidents: IncidentManagement;
  deployment: DeploymentInfo;
  costs: CostManagement;
  integrations: IntegrationHealth;
}

// Admin User Management Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'bookkeeper' | 'accountant' | 'admin' | 'ceo';
  office?: string;
  status: 'active' | 'inactive' | 'suspended';
  mfaEnabled: boolean;
  lastLogin: string;
  createdAt: string;
  assignedClients?: string[];
  supervisorId?: string;
}
