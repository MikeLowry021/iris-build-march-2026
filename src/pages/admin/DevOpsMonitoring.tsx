import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Server,
  Activity,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Zap,
  Users,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Lock,
  GitBranch,
  ArrowLeftRight,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { mockDevOpsMonitoring, formatCurrency } from '@/lib/admin-mock-data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function DevOpsMonitoring() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const monitoring = mockDevOpsMonitoring;

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value < thresholds.good) return 'text-green-600';
    if (value < thresholds.warning) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getProgressColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value < thresholds.good) return 'bg-green-500';
    if (value < thresholds.warning) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  // Mock API response time data for chart
  const apiResponseData = [
    { time: '00:00', avg: 115, p95: 240 },
    { time: '04:00', avg: 98, p95: 210 },
    { time: '08:00', avg: 145, p95: 320 },
    { time: '12:00', avg: 132, p95: 285 },
    { time: '16:00', avg: 128, p95: 260 },
    { time: '20:00', avg: 118, p95: 235 },
    { time: 'Now', avg: 120, p95: 245 },
  ];

  const featureUsageData = Object.entries(monitoring.performance.featureUsage).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const costBreakdownData = Object.entries(monitoring.costs.breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">DevOps Monitoring</h1>
            <p className="text-muted-foreground">Platform health, performance, and infrastructure metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {monitoring.incidents.activeAlerts > 0 ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  {monitoring.incidents.activeAlerts} Active Alert(s)
                </p>
                <p className="text-sm text-muted-foreground">Immediate attention required</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-600">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">No active alerts</p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="infrastructure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 lg:w-auto">
            <TabsTrigger value="infrastructure" className="gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Infrastructure</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="backups" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Backups</span>
            </TabsTrigger>
            <TabsTrigger value="deployments" className="gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Deployments</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Costs</span>
            </TabsTrigger>
          </TabsList>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            {/* Uptime & Health Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Uptime (30 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    monitoring.infrastructure.uptime.percentage >= 99.9 ? 'text-green-600' :
                    monitoring.infrastructure.uptime.percentage >= 99 ? 'text-yellow-600' : 'text-destructive'
                  }`}>
                    {monitoring.infrastructure.uptime.percentage}%
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {monitoring.infrastructure.uptime.slaCompliant ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        SLA Compliant
                      </Badge>
                    ) : (
                      <Badge variant="destructive">SLA Breach</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">API Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    monitoring.infrastructure.api.responseTimeAvg < 200 ? 'text-green-600' :
                    monitoring.infrastructure.api.responseTimeAvg < 500 ? 'text-yellow-600' : 'text-destructive'
                  }`}>
                    {monitoring.infrastructure.api.responseTimeAvg}ms
                  </div>
                  <p className="text-sm text-muted-foreground">
                    p95: {monitoring.infrastructure.api.responseTimeP95}ms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    monitoring.infrastructure.api.errorRate5xx < 1 ? 'text-green-600' :
                    monitoring.infrastructure.api.errorRate5xx < 2 ? 'text-yellow-600' : 'text-destructive'
                  }`}>
                    {monitoring.infrastructure.api.errorRate5xx}%
                  </div>
                  <p className="text-sm text-muted-foreground">5xx errors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {monitoring.infrastructure.api.throughput}
                  </div>
                  <p className="text-sm text-muted-foreground">requests/sec</p>
                </CardContent>
              </Card>
            </div>

            {/* Server Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Server Resources</CardTitle>
                <CardDescription>Real-time resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">CPU</span>
                      </div>
                      <span className={`text-sm font-bold ${getStatusColor(monitoring.infrastructure.server.cpu, { good: 70, warning: 85 })}`}>
                        {monitoring.infrastructure.server.cpu}%
                      </span>
                    </div>
                    <Progress 
                      value={monitoring.infrastructure.server.cpu} 
                      className={`h-2 ${getProgressColor(monitoring.infrastructure.server.cpu, { good: 70, warning: 85 })}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Memory</span>
                      </div>
                      <span className={`text-sm font-bold ${getStatusColor(monitoring.infrastructure.server.memory, { good: 75, warning: 88 })}`}>
                        {monitoring.infrastructure.server.memory}%
                      </span>
                    </div>
                    <Progress 
                      value={monitoring.infrastructure.server.memory}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Storage</span>
                      </div>
                      <span className={`text-sm font-bold ${getStatusColor(monitoring.infrastructure.server.storage, { good: 80, warning: 90 })}`}>
                        {monitoring.infrastructure.server.storage}%
                      </span>
                    </div>
                    <Progress 
                      value={monitoring.infrastructure.server.storage}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">DB Connections</span>
                      </div>
                      <span className="text-sm font-bold">
                        {monitoring.infrastructure.server.databaseConnections}/{monitoring.infrastructure.server.databaseConnectionsMax}
                      </span>
                    </div>
                    <Progress 
                      value={(monitoring.infrastructure.server.databaseConnections / monitoring.infrastructure.server.databaseConnectionsMax) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API Response Times (24h)</CardTitle>
                <CardDescription>Average and p95 response times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={apiResponseData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" unit="ms" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avg" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Average"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p95" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="p95"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Integration Health */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
                <CardDescription>Third-party service connectivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoring.integrations.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{service.lastChecked}</span>
                        {service.status === 'online' ? (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Online
                          </Badge>
                        ) : service.status === 'degraded' ? (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Degraded
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Webhook Delivery Rate</span>
                    <span className="font-medium text-green-600">{monitoring.integrations.webhookDeliveryRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Concurrent Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monitoring.performance.concurrentUsers}</div>
                  <p className="text-sm text-muted-foreground">Online right now</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monitoring.performance.activeSessions}</div>
                  <p className="text-sm text-muted-foreground">Total sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monitoring.infrastructure.api.throughput}</div>
                  <p className="text-sm text-muted-foreground">requests/sec</p>
                </CardContent>
              </Card>
            </div>

            {/* Core Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
                <CardDescription>User experience metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      monitoring.performance.pageLoadTimes.lcp < 2.5 ? 'text-green-600' :
                      monitoring.performance.pageLoadTimes.lcp < 4 ? 'text-yellow-600' : 'text-destructive'
                    }`}>
                      {monitoring.performance.pageLoadTimes.lcp}s
                    </div>
                    <p className="text-sm font-medium">LCP</p>
                    <p className="text-xs text-muted-foreground">Largest Contentful Paint</p>
                    {monitoring.performance.pageLoadTimes.lcp < 2.5 && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600">Good</Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      monitoring.performance.pageLoadTimes.fid < 100 ? 'text-green-600' :
                      monitoring.performance.pageLoadTimes.fid < 300 ? 'text-yellow-600' : 'text-destructive'
                    }`}>
                      {monitoring.performance.pageLoadTimes.fid}ms
                    </div>
                    <p className="text-sm font-medium">FID</p>
                    <p className="text-xs text-muted-foreground">First Input Delay</p>
                    {monitoring.performance.pageLoadTimes.fid < 100 && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600">Good</Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      monitoring.performance.pageLoadTimes.cls < 0.1 ? 'text-green-600' :
                      monitoring.performance.pageLoadTimes.cls < 0.25 ? 'text-yellow-600' : 'text-destructive'
                    }`}>
                      {monitoring.performance.pageLoadTimes.cls}
                    </div>
                    <p className="text-sm font-medium">CLS</p>
                    <p className="text-xs text-muted-foreground">Cumulative Layout Shift</p>
                    {monitoring.performance.pageLoadTimes.cls < 0.1 && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600">Good</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Request distribution by profile type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={featureUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {featureUsageData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Successful Logins (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {monitoring.security.authentication.successfulLogins24h}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    monitoring.security.authentication.failedLogins24h > 50 ? 'text-destructive' : 'text-yellow-600'
                  }`}>
                    {monitoring.security.authentication.failedLogins24h}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Brute Force Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    monitoring.security.authentication.bruteForceDetected > 0 ? 'text-destructive' : 'text-green-600'
                  }`}>
                    {monitoring.security.authentication.bruteForceDetected}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SSL Certificate */}
            <Card>
              <CardHeader>
                <CardTitle>SSL/TLS Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className={`h-5 w-5 ${
                      monitoring.security.ssl.status === 'valid' ? 'text-green-600' :
                      monitoring.security.ssl.status === 'expiring' ? 'text-yellow-600' : 'text-destructive'
                    }`} />
                    <div>
                      <p className="font-medium">
                        {monitoring.security.ssl.status === 'valid' ? 'Valid' :
                         monitoring.security.ssl.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(monitoring.security.ssl.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {monitoring.security.ssl.status !== 'valid' && (
                    <Button>Renew Certificate</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>POPIA/GDPR compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Residency</span>
                    <Badge variant="outline">{monitoring.security.compliance.dataResidency}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consent Logs</span>
                    {monitoring.security.compliance.consentLogsActive ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deletion Requests Pending</span>
                    <span className="font-medium">{monitoring.security.compliance.deletionRequestsPending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {monitoring.backup.lastBackup.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium">
                      {new Date(monitoring.backup.lastBackup.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(monitoring.backup.lastBackup.timestamp).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Backup Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monitoring.backup.lastBackup.size}</div>
                  <p className="text-sm text-muted-foreground">
                    Duration: {monitoring.backup.lastBackup.duration}s
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Replication Lag</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{monitoring.backup.replicationLag}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Failover Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {monitoring.backup.failoverReady ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Not Ready</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Restore Test */}
            <Card>
              <CardHeader>
                <CardTitle>Restore Testing</CardTitle>
                <CardDescription>Last restore test status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {monitoring.backup.restoreTest.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">
                        {monitoring.backup.restoreTest.status === 'success' ? 'Successful' : 'Failed'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last tested: {new Date(monitoring.backup.restoreTest.lastTested).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Run Test</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployments Tab */}
          <TabsContent value="deployments" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monitoring.deployment.currentVersion}</div>
                  {monitoring.deployment.deploymentStatus === 'live' && (
                    <Badge variant="outline" className="mt-2 border-green-500 text-green-600">Live</Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Deployed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">
                    {new Date(monitoring.deployment.lastDeployed).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(monitoring.deployment.lastDeployed).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CI/CD Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {monitoring.deployment.cicd.status === 'passing' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium capitalize">{monitoring.deployment.cicd.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {monitoring.deployment.cicd.testsPassed}/{monitoring.deployment.cicd.testsTotal} tests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Code Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    monitoring.deployment.codeCoverage >= 80 ? 'text-green-600' :
                    monitoring.deployment.codeCoverage >= 60 ? 'text-yellow-600' : 'text-destructive'
                  }`}>
                    {monitoring.deployment.codeCoverage}%
                  </div>
                  <Progress value={monitoring.deployment.codeCoverage} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Deployments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deployments</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoring.deployment.recentDeployments.map((deployment, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{deployment.version}</p>
                          <p className="text-sm text-muted-foreground">{deployment.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{deployment.deployedAt}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button variant="outline">View Changelog</Button>
                  <Button variant="outline" className="text-yellow-600">
                    Rollback to {monitoring.deployment.rollbackAvailable}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(monitoring.costs.currentMonthSpend)}</div>
                  <p className="text-sm text-muted-foreground">
                    Budget: {formatCurrency(monitoring.costs.budget)}
                  </p>
                  <Progress 
                    value={(monitoring.costs.currentMonthSpend / monitoring.costs.budget) * 100} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Spend Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {monitoring.costs.spendTrend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-destructive" />
                    ) : monitoring.costs.spendTrend === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    ) : (
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-xl font-bold capitalize">{monitoring.costs.spendTrend}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resource Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{monitoring.costs.resourceEfficiency}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost per User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(monitoring.costs.costPerUser)}</div>
                  <p className="text-sm text-muted-foreground">per month avg</p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Monthly spend by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {costBreakdownData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(monitoring.costs.breakdown).map(([service, percentage], i) => (
                      <div key={service} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="capitalize">{service}</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency((monitoring.costs.currentMonthSpend * percentage) / 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Incident History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Last 30 days • MTTD: {monitoring.incidents.mttd}min • MTTR: {monitoring.incidents.mttr}min</CardDescription>
          </CardHeader>
          <CardContent>
            {monitoring.incidents.recentIncidents.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                No incidents in the last 30 days
              </div>
            ) : (
              <div className="space-y-4">
                {monitoring.incidents.recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {incident.status === 'resolved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : incident.status === 'investigating' ? (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">{incident.title}</p>
                        <p className="text-sm text-muted-foreground">{incident.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        incident.severity === 'critical' ? 'destructive' :
                        incident.severity === 'high' ? 'default' :
                        'secondary'
                      }>
                        {incident.severity}
                      </Badge>
                      {incident.mttr && (
                        <span className="text-sm text-muted-foreground">MTTR: {incident.mttr}min</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
