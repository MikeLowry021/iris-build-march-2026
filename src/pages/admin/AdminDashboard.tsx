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
  FileCheck,
  AlertCircle,
  TrendingUp,
  Bot,
  BarChart3,
} from 'lucide-react';
import { mockAdminClients, mockBookkeepers, mockSystemHealth, mockAuditLogs } from '@/lib/admin-mock-data';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookkeeperFilter, setBookkeeperFilter] = useState<string>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const totalClients = mockAdminClients.length;
  const totalUsers = mockAdminClients.length + mockBookkeepers.length + 2; // + accountant + admin
  const activeProjects = mockAdminClients.filter(c => c.status === 'active').length;

  // Admin cannot see financial data - privacy requirement
  // Instead show submission status
  const pendingSubmissions = 5; // Mock data
  const overdueSubmissions = 2; // Mock data
  const totalSubmissionsThisMonth = 48;
  const avgSubmissionTime = 5; // days

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
            <p className="text-muted-foreground">Manage clients, users, and system settings</p>
          </div>
          <div className="flex gap-2">
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

        {/* System Health Alert */}
        {overdueSubmissions > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">{overdueSubmissions} submissions overdue</p>
              <p className="text-sm text-muted-foreground">Action required: Review pending submissions</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/manage-clients')}>
              View Details
            </Button>
          </div>
        )}

        {/* Metrics Cards - Admin sees operational metrics, NOT financial data */}
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
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold capitalize">{mockSystemHealth.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">{mockSystemHealth.uptime} uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Submissions This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissionsThisMonth}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>12% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Turnaround</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSubmissionTime} days</div>
              <p className="text-xs text-muted-foreground">Bookkeeper + Accountant</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemHealth.storageUsed}%</div>
              <Progress value={mockSystemHealth.storageUsed} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-lg font-medium">{mockSystemHealth.lastBackup}</span>
              </div>
              <p className="text-xs text-muted-foreground">Automated daily</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/admin/manage-bookkeepers')}
          >
            <UserPlus className="h-6 w-6" />
            <span>Manage Users</span>
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
            <span>View Audit Logs</span>
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
          {/* Client Table - No financial data visible to admin */}
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

              {/* Table - NO VAT/PAYE columns (privacy) */}
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
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.slice(0, 10).map((client) => (
                      <TableRow
                        key={client.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/admin/clients/${client.id}`)}
                      >
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
                        <TableCell className="text-muted-foreground">{client.createdAt}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/clients/${client.id}`)}>
                                View Details
                              </DropdownMenuItem>
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
                      log.status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {log.status === 'success' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
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
      </div>
    </DashboardLayout>
  );
}
