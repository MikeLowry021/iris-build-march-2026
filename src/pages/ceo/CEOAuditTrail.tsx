import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Search,
  Download,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCEOAuditLog } from '@/lib/ceo-mock-data';
import { CEOAuditEntry } from '@/lib/ceo-types';

const CEOAuditTrail = () => {
  const [auditLog] = useState<CEOAuditEntry[]>(mockCEOAuditLog);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const uniqueUsers = [...new Set(auditLog.map((entry) => entry.userName))];
  const uniqueActions = [...new Set(auditLog.map((entry) => entry.action))];

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'all' || entry.userName === userFilter;
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    return matchesSearch && matchesUser && matchesAction;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'ceo':
        return 'bg-primary';
      case 'accountant':
        return 'bg-success';
      case 'bookkeeper':
        return 'bg-warning text-warning-foreground';
      case 'employee':
        return 'bg-secondary';
      case 'system':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'payroll':
        return '💰';
      case 'financials':
        return '📊';
      case 'reimbursement':
        return '🧾';
      case 'transaction':
        return '💳';
      case 'leave':
        return '🏖️';
      case 'employee':
        return '👤';
      case 'statement':
        return '📄';
      default:
        return '📋';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Audit Trail</h1>
            <p className="text-muted-foreground">Activity log for your business</p>
          </div>
          <Button onClick={() => toast.success('Audit log exported')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by action, details, or entity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <Activity className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              {filteredLog.length} entries • Filtered to your business only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLog.map((entry) => {
                    const { date, time } = formatTimestamp(entry.timestamp);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{date}</p>
                              <p className="text-xs text-muted-foreground">{time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium">{entry.userName}</p>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getRoleBadgeColor(entry.userRole)}`}
                              >
                                {entry.userRole}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getEntityTypeIcon(entry.entityType)}</span>
                            <span>{entry.entityType}</span>
                            {entry.entityId && (
                              <span className="text-xs text-muted-foreground">
                                ({entry.entityId})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[300px] truncate text-sm">{entry.details}</p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filteredLog.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No audit entries match your filters
              </p>
            )}
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This audit trail shows only activities related to your business.
              You cannot view other franchisees' activities. This log is immutable and maintained for
              compliance purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CEOAuditTrail;
