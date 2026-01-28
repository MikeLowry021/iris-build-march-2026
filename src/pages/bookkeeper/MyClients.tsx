import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Clock,
  Receipt,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  Building2,
} from 'lucide-react';
import { mockBookkeeperClients } from '@/lib/bookkeeper-mock-data';
import { BookkeeperClientStatus } from '@/lib/bookkeeper-types';
import { cn } from '@/lib/utils';

interface ClientDetail {
  id: string;
  name: string;
  company: string;
  status: BookkeeperClientStatus;
  lastActivity: string;
  pendingTransactions: number;
  draftReports: number;
  lastUploadDate: string;
  lastReviewStatus: 'approved' | 'pending' | 'changes_requested';
  progress: number;
  industry: string;
}

// Extended client data with more details
const clientDetails: ClientDetail[] = [
  {
    id: '1',
    name: 'John Mokwena',
    company: 'Mokwena Trading (Pty) Ltd',
    status: 'in-progress',
    lastActivity: '2 hours ago',
    pendingTransactions: 12,
    draftReports: 1,
    lastUploadDate: '2026-01-25',
    lastReviewStatus: 'pending',
    progress: 65,
    industry: 'Retail',
  },
  {
    id: '2',
    name: 'Thabo Nkosi',
    company: 'Nkosi Technologies CC',
    status: 'pending',
    lastActivity: '1 day ago',
    pendingTransactions: 8,
    draftReports: 0,
    lastUploadDate: '2026-01-20',
    lastReviewStatus: 'changes_requested',
    progress: 30,
    industry: 'Technology',
  },
  {
    id: '3',
    name: 'Priya Naidoo',
    company: 'Coastal Imports (Pty) Ltd',
    status: 'submitted',
    lastActivity: '3 days ago',
    pendingTransactions: 0,
    draftReports: 1,
    lastUploadDate: '2026-01-18',
    lastReviewStatus: 'approved',
    progress: 100,
    industry: 'Import/Export',
  },
  {
    id: '5',
    name: 'Fatima Mahomed',
    company: 'SparkClean Services',
    status: 'pending',
    lastActivity: '5 hours ago',
    pendingTransactions: 5,
    draftReports: 0,
    lastUploadDate: '2026-01-26',
    lastReviewStatus: 'approved',
    progress: 45,
    industry: 'Services',
  },
  {
    id: '6',
    name: 'David van Wyk',
    company: 'Van Wyk Engineering',
    status: 'in-progress',
    lastActivity: '1 hour ago',
    pendingTransactions: 0,
    draftReports: 0,
    lastUploadDate: '2026-01-27',
    lastReviewStatus: 'pending',
    progress: 80,
    industry: 'Engineering',
  },
];

const getStatusBadgeConfig = (status: BookkeeperClientStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', variant: 'secondary' as const, color: 'text-blue-600' };
    case 'in-progress':
      return { label: 'In Progress', variant: 'default' as const, color: 'text-yellow-600' };
    case 'submitted':
      return { label: 'Submitted', variant: 'outline' as const, color: 'text-green-600' };
  }
};

const getReviewStatusConfig = (status: 'approved' | 'pending' | 'changes_requested') => {
  switch (status) {
    case 'approved':
      return { label: 'Approved', icon: CheckCircle, color: 'text-green-600' };
    case 'pending':
      return { label: 'Pending Review', icon: Clock, color: 'text-blue-600' };
    case 'changes_requested':
      return { label: 'Changes Requested', icon: AlertCircle, color: 'text-yellow-600' };
  }
};

export default function MyClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookkeeperClientStatus | 'all'>('all');

  const filteredClients = clientDetails.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clientDetails.length,
    pending: clientDetails.filter(c => c.status === 'pending').length,
    inProgress: clientDetails.filter(c => c.status === 'in-progress').length,
    submitted: clientDetails.filter(c => c.status === 'submitted').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Clients</h1>
            <p className="text-muted-foreground">
              Manage bookkeeping for your assigned clients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{stats.total} Assigned Clients</span>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="mt-1 text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="mt-1 text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 p-3">
                  <Receipt className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{stats.submitted}</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as BookkeeperClientStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client list */}
        <div className="space-y-4">
          {filteredClients.map((client) => {
            const statusConfig = getStatusBadgeConfig(client.status);
            const reviewConfig = getReviewStatusConfig(client.lastReviewStatus);
            const ReviewIcon = reviewConfig.icon;

            return (
              <Card key={client.id} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Client info */}
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{client.company}</h3>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{client.name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {client.lastActivity}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last upload: {client.lastUploadDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <ReviewIcon className={cn('h-3 w-3', reviewConfig.color)} />
                            <span className={reviewConfig.color}>{reviewConfig.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress and stats */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:gap-8">
                      {/* Progress */}
                      <div className="w-full sm:w-48">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Monthly Progress</span>
                          <span className="font-medium">{client.progress}%</span>
                        </div>
                        <Progress value={client.progress} className="h-2" />
                      </div>

                      {/* Quick stats */}
                      <div className="flex items-center gap-4">
                        {client.pendingTransactions > 0 && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-yellow-600">{client.pendingTransactions}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                        )}
                        {client.draftReports > 0 && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{client.draftReports}</p>
                            <p className="text-xs text-muted-foreground">Drafts</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/bookkeeper/clients/${client.id}/categorize`}>
                            <Receipt className="mr-1 h-4 w-4" />
                            Categorize
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/bookkeeper/clients/${client.id}/draft-reports`}>
                            <FileText className="mr-1 h-4 w-4" />
                            Reports
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredClients.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No clients found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
