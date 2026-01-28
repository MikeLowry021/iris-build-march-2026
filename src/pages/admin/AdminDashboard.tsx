import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  Building2,
  Activity,
  Server,
  Search,
  MoreHorizontal,
  Settings,
  ClipboardList,
  Download,
  UserPlus,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Bot,
  BarChart3,
  Cpu,
  HardDrive,
  Zap,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { 
  mockAdminClients, 
  mockBookkeepers, 
  mockSystemHealth, 
  mockAuditLogs,
  mockDevOpsMonitoring 
} from '@/lib/admin-mock-data';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookkeeperFilter, setBookkeeperFilter] = useState<string>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const totalClients = mockAdminClients.length;
  const totalUsers = mockAdminClients.length + mockBookkeepers.length + 2;
  const activeProjects = mockAdminClients.filter(c => c.status === 'active').length;

  const pendingSubmissions = 5;
  const overdueSubmissions = 2;
  const totalSubmissionsThisMonth = 48;
  const avgSubmissionTime = 5;

  const monitoring = mockDevOpsMonitoring;

  const filteredClients = mockAdminClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesBookkeeper = bookkeeperFilter === 'all' || client.bookkeeperId === bookkeeperFilter;
    return matchesSearch && matchesStatus && matchesBookkeeper;
  });

  const recentActivity = mockAuditLogs.slice(0, 5);

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600';
    if (uptime >= 99) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getResourceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value < thresholds.good) return 'text-green-600';
    if (value < thresholds.warning) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
            <p className="text-muted-foreground">Manage clients, users, and monitor system health</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/monitoring')}>
              <Activity className="mr-2 h-4 w-4" />
              DevOps
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/audit-logs')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Audit Logs
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Health Alert Banner */}
        {monitoring.incidents.activeAlerts > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">{monitoring.incidents.activeAlerts} Active System Alert(s)</p>
              <p className="text-sm text-muted-foreground">Immediate attention required</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/monitoring')}>
              View Details
            </Button>
          </div>
        ) : overdueSubmissions > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-yellow-700">{overdueSubmissions} submissions overdue</p>
              <p className="text-sm text-muted-foreground">Action required: Review pending submissions</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/manage-clients')}>
              View Details
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-700">All Systems Operational</p>
              <p className="text-sm text-muted-foreground">Platform is running smoothly</p>
            </div>
          </div>
        )}

        {/* System Health Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUptimeColor(monitoring.infrastructure.uptime.percentage)}`}>
                {monitoring.infrastructure.uptime.percentage}%
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monitoring.performance.concurrentUsers}</div>
              <p className="text-xs text-muted-foreground">Online now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">API Response</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                monitoring.infrastructure.api.responseTimeAvg < 200 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {monitoring.infrastructure.api.responseTimeAvg}ms
              </div>
              <p className="text-xs text-muted-foreground">Avg response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">CPU</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getResourceColor(monitoring.infrastructure.server.cpu, { good: 70, warning: 85 })}`}>
                {monitoring.infrastructure.server.cpu}%
              </div>
              <Progress value={monitoring.infrastructure.server.cpu} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getResourceColor(monitoring.infrastructure.server.memory, { good: 75, warning: 88 })}`}>
                {monitoring.infrastructure.server.memory}%
              </div>
              <Progress value={monitoring.infrastructure.server.memory} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                monitoring.infrastructure.api.errorRate5xx < 1 ? 'text-green-600' : 'text-destructive'
              }`}>
                {monitoring.infrastructure.api.errorRate5xx}%
              </div>
              <p className="text-xs text-muted-foreground">5xx errors</p>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Cards - Operational */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects} active, {totalClients - activeProjects} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {mockBookkeepers.filter(b => b.isActive).length} bookkeepers active
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{pendingSubmissions}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className={overdueSubmissions > 0 ? "border-destructive/20 bg-destructive/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${overdueSubmissions > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${overdueSubmissions > 0 ? 'text-destructive' : ''}`}>
                {overdueSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissionsThisMonth}</div>
              <p className="text-xs text-muted-foreground">Submissions processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/users')}
          >
            <UserPlus className="h-6 w-6" />
            <span>Manage Users</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/monitoring')}
          >
            <Activity className="h-6 w-6" />
            <span>DevOps Monitoring</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="h-6 w-6" />
            <span>System Settings</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/audit-logs')}
          >
            <ClipboardList className="h-6 w-6" />
            <span>Audit Logs</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/jerome')}
          >
            <Bot className="h-6 w-6" />
            <span>Jerome AI</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <Download className="h-6 w-6" />
            <span>Export Reports</span>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>Manage and monitor all clients in the system (no financial data)</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={bookkeeperFilter} onValueChange={setBookkeeperFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bookkeeper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookkeepers</SelectItem>
                    {mockBookkeepers.map(bk => (
                      <SelectItem key={bk.id} value={bk.id}>{bk.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedClients.length > 0 && (
                <div className="mb-4 flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <span className="text-sm font-medium">{selectedClients.length} selected</span>
                  <Button size="sm" variant="outline">Assign Bookkeeper</Button>
                  <Button size="sm" variant="outline">Export</Button>
                  <Button size="sm" variant="outline" className="text-destructive">Deactivate</Button>
                </div>
              )}

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                          onCheckedChange={toggleAllClients}
                        />
                      </TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Bookkeeper</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.slice(0, 8).map((client) => (
                      <TableRow key={client.id}>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={() => toggleClientSelection(client.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell>{client.bookkeeperName || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{client.lastActivity}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Assign Bookkeeper</DropdownMenuItem>
                              <DropdownMenuItem>Export Data</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => navigate('/admin/manage-clients')}>
                  View all {totalClients} clients →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                    <div className={`mt-0.5 rounded-full p-1.5 ${
                      log.status === 'success' ? 'bg-green-500/10' :
                      log.status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                    }`}>
                      {log.status === 'success' ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : log.status === 'warning' ? (
                        <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{log.userName}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="mt-4 w-full"
                onClick={() => navigate('/admin/audit-logs')}
              >
                View all activity →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Deployment & Security Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Deployment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{monitoring.deployment.currentVersion}</p>
                  <p className="text-sm text-muted-foreground">
                    Deployed {new Date(monitoring.deployment.lastDeployed).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {monitoring.deployment.deploymentStatus === 'live' ? 'Live' : 'Deploying'}
                  </Badge>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {monitoring.deployment.cicd.testsPassed}/{monitoring.deployment.cicd.testsTotal} tests passing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {monitoring.security.authentication.successfulLogins24h}
                  </p>
                  <p className="text-xs text-muted-foreground">Logins (24h)</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    monitoring.security.authentication.failedLogins24h > 50 ? 'text-destructive' : 'text-yellow-600'
                  }`}>
                    {monitoring.security.authentication.failedLogins24h}
                  </p>
                  <p className="text-xs text-muted-foreground">Failed (24h)</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    monitoring.security.authentication.bruteForceDetected > 0 ? 'text-destructive' : 'text-green-600'
                  }`}>
                    {monitoring.security.authentication.bruteForceDetected}
                  </p>
                  <p className="text-xs text-muted-foreground">Threats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
