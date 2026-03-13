import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Calendar,
  FileText,
  MessageSquare,
} from 'lucide-react';
import {
  mockPendingSubmissions,
  getStatusConfig,
  getUrgencyConfig,
  PendingSubmission,
} from '@/lib/accountant-mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ReviewQueue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PendingSubmission['status'] | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<PendingSubmission['urgency'] | 'all'>('all');

  const filteredSubmissions = mockPendingSubmissions.filter(submission => {
    const matchesSearch = 
      submission.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.bookkeeperName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || submission.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Sort by urgency (overdue first, then urgent, then normal)
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const urgencyOrder = { overdue: 0, urgent: 1, normal: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
          <p className="text-muted-foreground">
            Pending submissions from bookkeepers awaiting your review
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by client, company, or bookkeeper..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as PendingSubmission['status'] | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="rfi_pending">RFI Pending</SelectItem>
                  <SelectItem value="ready_to_sign">Ready to Sign</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={urgencyFilter}
                onValueChange={(v) => setUrgencyFilter(v as PendingSubmission['urgency'] | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Queue table */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions ({sortedSubmissions.length})</CardTitle>
            <CardDescription>
              Click on a submission to begin or continue your review
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Bookkeeper</TableHead>
                  <TableHead className="text-center">Transactions</TableHead>
                  <TableHead className="text-center">GL Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubmissions.map((submission) => {
                  const statusConfig = getStatusConfig(submission.status);
                  const urgencyConfig = getUrgencyConfig(submission.urgency);

                  return (
                    <TableRow
                      key={submission.id}
                      className={cn(
                        'transition-colors',
                        submission.urgency === 'overdue' && 'bg-red-500/5',
                        submission.urgency === 'urgent' && 'bg-yellow-500/5'
                      )}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.clientName}</p>
                          <p className="text-xs text-muted-foreground">{submission.clientCompany}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{submission.periodLabel}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.bookkeeperName}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono">{submission.transactionCount}</span>
                          {submission.adjustingEntries > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{submission.adjustingEntries} adj
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {submission.isBalanced ? (
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Balanced</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-mono">
                              R{submission.glVariance?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(submission.dueDate), 'dd MMM')}
                          </span>
                          {submission.urgency !== 'normal' && (
                            <Badge 
                              variant="outline" 
                              className={cn('text-xs', urgencyConfig.color)}
                            >
                              {urgencyConfig.label}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(statusConfig.bgColor, statusConfig.color)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/accountant/clients/${submission.clientId}/financials`}>
                              <FileText className="mr-1 h-3.5 w-3.5" />
                              Financials
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link to={`/accountant/clients/${submission.clientId}`}>
                              Review
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {sortedSubmissions.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No submissions found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
