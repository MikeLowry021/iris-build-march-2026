import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  mockClientInfo, 
  mockClientDocuments, 
  mockMonthlyFinancials,
  formatZAR,
  getClientStatusLabel 
} from '@/lib/client-mock-data';
import { 
  Upload, 
  FileText, 
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const client = mockClientInfo;
  const latestMonth = 'January 2026';
  const financials = mockMonthlyFinancials[latestMonth];
  const recentDocs = mockClientDocuments.slice(0, 3);

  const getStatusBadgeType = (status: typeof client.status) => {
    switch (status) {
      case 'approved':
        return 'complete';
      case 'rejected':
        return 'action-required';
      case 'pending-review':
        return 'pending';
      default:
        return 'not-started';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Welcome back, {client.name.split(' ')[0]}</h1>
            <p className="mt-1 text-muted-foreground">
              Here's an overview of your accounting status for {client.company}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/client/financials">
                <FileText className="mr-2 h-4 w-4" />
                View Financials
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/client/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Link>
            </Button>
          </div>
        </div>

        {/* Client Info & Status Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client Name</p>
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client ID</p>
                      <p className="font-mono font-medium">{client.id}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Submission</p>
                      <p className="font-medium">
                        {new Date(client.lastSubmissionDate).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Accountant Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Submission Status</p>
                <StatusBadge 
                  status={getStatusBadgeType(client.status)} 
                  label={getClientStatusLabel(client.status)}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Your accountant is reviewing your latest submission.
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Assigned Accountant</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.assignedAccountant.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-primary">{client.assignedAccountant.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-success">{formatZAR(financials.totalIncome)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{latestMonth}</p>
                </div>
                <div className="rounded-full bg-success/10 p-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-destructive">{formatZAR(financials.totalExpenses)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{latestMonth}</p>
                </div>
                <div className="rounded-full bg-destructive/10 p-3">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">{formatZAR(financials.netProfit)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{latestMonth}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cash on Hand</p>
                  <p className="text-2xl font-bold">{formatZAR(financials.cashOnHand)}</p>
                  <p className="text-xs text-muted-foreground mt-1">From bank statement</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Uploads</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/client/upload">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.period} • Uploaded {new Date(doc.uploadDate).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                  </div>
                  <StatusBadge 
                    status={doc.status === 'processed' ? 'complete' : doc.status === 'error' ? 'error' : 'pending'} 
                    showIcon={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
