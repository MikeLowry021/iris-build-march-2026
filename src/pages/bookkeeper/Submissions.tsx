import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  MessageSquare,
  FileText,
  Send,
  RefreshCw,
} from 'lucide-react';
import { mockBookkeeperClients } from '@/lib/bookkeeper-mock-data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type SubmissionStatus = 'pending_review' | 'changes_requested' | 'approved';

interface Submission {
  id: string;
  clientId: string;
  clientName: string;
  period: string;
  submittedAt: string;
  status: SubmissionStatus;
  transactionCount: number;
  adjustingEntries: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Mock submissions data
const mockSubmissions: Submission[] = [
  {
    id: 'sub_001',
    clientId: '1',
    clientName: 'Mokwena Trading (Pty) Ltd',
    period: 'January 2026',
    submittedAt: '2026-01-28T09:30:00Z',
    status: 'pending_review',
    transactionCount: 45,
    adjustingEntries: 2,
  },
  {
    id: 'sub_002',
    clientId: '2',
    clientName: 'Nkosi Technologies CC',
    period: 'January 2026',
    submittedAt: '2026-01-27T14:15:00Z',
    status: 'changes_requested',
    transactionCount: 32,
    adjustingEntries: 1,
    feedback: 'Please review the depreciation calculation for office equipment. The useful life should be 5 years, not 3.',
    reviewedBy: 'Sarah van der Berg',
    reviewedAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'sub_003',
    clientId: '3',
    clientName: 'Coastal Imports (Pty) Ltd',
    period: 'December 2025',
    submittedAt: '2026-01-15T11:00:00Z',
    status: 'approved',
    transactionCount: 58,
    adjustingEntries: 3,
    reviewedBy: 'Sarah van der Berg',
    reviewedAt: '2026-01-18T16:30:00Z',
  },
  {
    id: 'sub_004',
    clientId: '5',
    clientName: 'SparkClean Services',
    period: 'December 2025',
    submittedAt: '2026-01-10T08:45:00Z',
    status: 'approved',
    transactionCount: 28,
    adjustingEntries: 1,
    reviewedBy: 'Sarah van der Berg',
    reviewedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'sub_005',
    clientId: '1',
    clientName: 'Mokwena Trading (Pty) Ltd',
    period: 'December 2025',
    submittedAt: '2026-01-05T10:00:00Z',
    status: 'approved',
    transactionCount: 52,
    adjustingEntries: 2,
    reviewedBy: 'Sarah van der Berg',
    reviewedAt: '2026-01-08T14:00:00Z',
  },
];

const getStatusConfig = (status: SubmissionStatus) => {
  switch (status) {
    case 'pending_review':
      return {
        label: 'Pending Review',
        icon: Clock,
        variant: 'secondary' as const,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      };
    case 'changes_requested':
      return {
        label: 'Changes Requested',
        icon: AlertCircle,
        variant: 'destructive' as const,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500/10',
      };
    case 'approved':
      return {
        label: 'Approved',
        icon: CheckCircle,
        variant: 'default' as const,
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      };
  }
};

export default function Submissions() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');

  const filteredSubmissions = filter === 'all' 
    ? mockSubmissions 
    : mockSubmissions.filter(s => s.status === filter);

  const stats = {
    pending: mockSubmissions.filter(s => s.status === 'pending_review').length,
    changesRequested: mockSubmissions.filter(s => s.status === 'changes_requested').length,
    approved: mockSubmissions.filter(s => s.status === 'approved').length,
  };

  const handleDownloadSummary = (submission: Submission) => {
    toast({
      title: 'Downloading Summary',
      description: `Preparing ${submission.period} summary for ${submission.clientName}...`,
    });
  };

  const handleResubmit = (submission: Submission) => {
    toast({
      title: 'Preparing Resubmission',
      description: `Opening ${submission.clientName} for revision...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submissions</h1>
            <p className="text-muted-foreground">
              Track your submissions to the accountant for review
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card 
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              filter === 'pending_review' && 'ring-2 ring-primary'
            )}
            onClick={() => setFilter(filter === 'pending_review' ? 'all' : 'pending_review')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              filter === 'changes_requested' && 'ring-2 ring-primary'
            )}
            onClick={() => setFilter(filter === 'changes_requested' ? 'all' : 'changes_requested')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Changes Requested</p>
                  <p className="mt-1 text-3xl font-bold text-yellow-600">{stats.changesRequested}</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 p-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              filter === 'approved' && 'ring-2 ring-primary'
            )}
            onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submission History</CardTitle>
                <CardDescription>
                  {filter === 'all' ? 'All submissions' : `Filtered by: ${getStatusConfig(filter as SubmissionStatus).label}`}
                </CardDescription>
              </div>
              {filter !== 'all' && (
                <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                  Clear Filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const statusConfig = getStatusConfig(submission.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={submission.id}
                      className={cn(
                        'rounded-lg border p-4 transition-colors',
                        submission.status === 'changes_requested' && 'border-yellow-500/50 bg-yellow-500/5'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={cn('rounded-lg p-2', statusConfig.bgColor)}>
                            <StatusIcon className={cn('h-5 w-5', statusConfig.color)} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{submission.clientName}</h3>
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {submission.period} • {submission.transactionCount} transactions, {submission.adjustingEntries} adjusting entries
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Submitted {format(new Date(submission.submittedAt), 'dd MMM yyyy, HH:mm')}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadSummary(submission)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Summary
                          </Button>
                          {submission.status === 'changes_requested' && (
                            <Button
                              size="sm"
                              onClick={() => handleResubmit(submission)}
                            >
                              <RefreshCw className="mr-1 h-4 w-4" />
                              Revise
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Accountant feedback */}
                      {submission.feedback && (
                        <div className="mt-4 rounded-lg bg-muted p-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Accountant Feedback</p>
                              <p className="mt-1 text-sm text-muted-foreground">{submission.feedback}</p>
                              {submission.reviewedBy && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  — {submission.reviewedBy}, {submission.reviewedAt && format(new Date(submission.reviewedAt), 'dd MMM yyyy')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {submission.status === 'approved' && submission.reviewedBy && !submission.feedback && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Approved by {submission.reviewedBy} on {submission.reviewedAt && format(new Date(submission.reviewedAt), 'dd MMM yyyy')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
