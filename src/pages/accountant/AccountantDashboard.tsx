import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  PenTool,
  FileText,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  mockPendingSubmissions,
  mockRFIs,
  getAccountantStats,
  getStatusConfig,
  getUrgencyConfig,
} from '@/lib/accountant-mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AccountantDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const stats = getAccountantStats();

  // Filter submissions that need attention (not approved)
  const activeSubmissions = mockPendingSubmissions
    .filter(s => s.status !== 'approved')
    .filter(s => 
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientCompany.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const pendingRFIs = mockRFIs.filter(r => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Review bookkeeper submissions and approve financial statements
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{stats.pendingReview}</p>
                  <p className="text-xs text-muted-foreground">Submissions waiting</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Awaiting RFI</p>
                  <p className="mt-1 text-3xl font-bold text-orange-600">{stats.awaitingRFI}</p>
                  <p className="text-xs text-muted-foreground">Bookkeeper responses</p>
                </div>
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to Sign</p>
                  <p className="mt-1 text-3xl font-bold text-purple-600">{stats.readyToSign}</p>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <PenTool className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{stats.approvedThisMonth}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Submissions queue */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Review Queue</CardTitle>
                  <CardDescription>Submissions requiring your attention</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/accountant/review-queue">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSubmissions.slice(0, 5).map((submission) => {
                  const statusConfig = getStatusConfig(submission.status);
                  const urgencyConfig = getUrgencyConfig(submission.urgency);

                  return (
                    <div
                      key={submission.id}
                      className={cn(
                        'rounded-lg border p-4 transition-colors hover:bg-muted/50',
                        submission.urgency === 'overdue' && 'border-red-500/50 bg-red-500/5',
                        submission.urgency === 'urgent' && 'border-yellow-500/50 bg-yellow-500/5'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{submission.clientName}</h3>
                            <Badge 
                              variant="outline" 
                              className={cn(statusConfig.bgColor, statusConfig.color)}
                            >
                              {statusConfig.label}
                            </Badge>
                            {submission.urgency !== 'normal' && (
                              <Badge 
                                variant="outline" 
                                className={cn(urgencyConfig.bgColor, urgencyConfig.color)}
                              >
                                {submission.urgency === 'overdue' && <AlertCircle className="mr-1 h-3 w-3" />}
                                {submission.urgency === 'urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
                                {urgencyConfig.label}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{submission.clientCompany}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>{submission.periodLabel}</span>
                            <span>•</span>
                            <span>{submission.transactionCount} transactions</span>
                            <span>•</span>
                            <span>By {submission.bookkeeperName}</span>
                            {!submission.isBalanced && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-red-600">
                                  <AlertCircle className="h-3 w-3" />
                                  GL Variance: R{submission.glVariance?.toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/accountant/clients/${submission.clientId}`}>
                            Review
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {activeSubmissions.length === 0 && (
                  <div className="py-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500/50" />
                    <p className="mt-4 text-muted-foreground">All caught up!</p>
                    <p className="text-sm text-muted-foreground">No submissions waiting for review</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RFI Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Pending RFIs
                  </CardTitle>
                  <CardDescription>Awaiting bookkeeper response</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/accountant/rfi">
                    Manage
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingRFIs.length > 0 ? (
                <div className="space-y-3">
                  {pendingRFIs.map((rfi) => (
                    <div key={rfi.id} className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-sm">{rfi.clientName}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{rfi.issue}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Sent {format(new Date(rfi.createdAt), 'dd MMM')} to {rfi.bookkeeperName}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto h-10 w-10 text-green-500/50" />
                  <p className="mt-3 text-sm text-muted-foreground">No pending RFIs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link to="/accountant/review-queue">
                  <FileText className="h-5 w-5" />
                  <span>Review Queue</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link to="/accountant/rfi">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send RFI</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link to="/accountant/override">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Override Entry</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link to="/accountant/settings">
                  <PenTool className="h-5 w-5" />
                  <span>Signature Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
