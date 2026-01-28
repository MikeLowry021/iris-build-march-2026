import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Receipt,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle,
  Send,
} from 'lucide-react';
import {
  mockBookkeeperClients,
  mockActivityFeed,
  getTotalPendingTransactions,
  getTotalDraftReports,
  getOverdueItems,
} from '@/lib/bookkeeper-mock-data';
import { cn } from '@/lib/utils';
import { BookkeeperClientStatus } from '@/lib/bookkeeper-types';

const getStatusBadgeConfig = (status: BookkeeperClientStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
      };
    case 'submitted':
      return {
        label: 'Submitted',
        className: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
      };
    default:
      return {
        label: status,
        className: '',
      };
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'categorization':
      return Receipt;
    case 'entry':
      return Plus;
    case 'report':
      return FileText;
    case 'submission':
      return Send;
    default:
      return Clock;
  }
};

export default function BookkeeperDashboard() {
  // Calculate stats
  const documentsApproved = 8;
  const documentsInReview = 2;
  const documentsPending = getTotalPendingTransactions();
  
  const stats = [
    {
      title: 'Documents Pending',
      value: documentsPending,
      description: 'Need categorization',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'In Review',
      value: documentsInReview,
      description: 'With accountant',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Approved',
      value: documentsApproved,
      description: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Assigned Clients',
      value: mockBookkeeperClients.length,
      description: 'Active clients',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookkeeper Portal</h1>
            <p className="text-muted-foreground">
              Manage transactions and prepare draft reports for your assigned clients
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/bookkeeper/clients/1/adjusting-entries">
                <Plus className="mr-2 h-4 w-4" />
                Create Adjusting Entry
              </Link>
            </Button>
            <Button asChild>
              <Link to="/bookkeeper/clients/1/categorize">
                <Receipt className="mr-2 h-4 w-4" />
                Start Categorization
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={cn('rounded-lg p-3', stat.bgColor)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client list */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assigned Clients</CardTitle>
                  <CardDescription>
                    Clients you are responsible for bookkeeping
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/bookkeeper/my-clients">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBookkeeperClients.slice(0, 4).map((client) => {
                  const statusConfig = getStatusBadgeConfig(client.status);
                  // Calculate a mock progress for each client
                  const progress = client.status === 'submitted' ? 100 : client.status === 'in-progress' ? 65 : 30;

                  return (
                    <div
                      key={client.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-foreground">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.company}</p>
                            </div>
                            <Badge variant="outline" className={statusConfig.className}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {client.lastActivity}
                            </span>
                            {client.pendingTransactions > 0 && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Receipt className="h-3 w-3" />
                                {client.pendingTransactions} pending
                              </span>
                            )}
                          </div>
                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Monthly Progress</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/bookkeeper/clients/${client.id}/categorize`}>
                              <Receipt className="mr-1 h-4 w-4" />
                              Categorize
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/bookkeeper/clients/${client.id}/draft-reports`}>
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityFeed.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.clientName}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
