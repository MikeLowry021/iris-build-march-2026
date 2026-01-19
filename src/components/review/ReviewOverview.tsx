import { ClientReview, getChecklistProgress, getUnresolvedCommentsCount } from '@/lib/review-types';
import { getReviewStatusLabel, getReviewStatusColor } from '@/lib/review-mock-data';
import { calculateBalanceSheetTotals, calculateProfitLossTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Mail, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface ReviewOverviewProps {
  review: ClientReview;
}

export function ReviewOverview({ review }: ReviewOverviewProps) {
  const checklistProgress = getChecklistProgress(review.checklist);
  const unresolvedComments = getUnresolvedCommentsCount(review.comments);
  const bsTotals = calculateBalanceSheetTotals(review.financialStatement.balanceSheet);
  const plTotals = calculateProfitLossTotals(review.financialStatement.profitLoss);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const daysSinceSubmission = review.financialStatement.submittedAt
    ? Math.floor((new Date().getTime() - new Date(review.financialStatement.submittedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <p className="text-sm font-medium">{review.clientCompany}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{review.clientEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Financial Year</p>
              <p className="text-sm font-medium">{review.financialYear}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Review Status</p>
              <StatusBadge 
                status={getReviewStatusColor(review.reviewStatus) as any} 
                label={getReviewStatusLabel(review.reviewStatus)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Checklist Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2.5">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{checklistProgress.completed}/{checklistProgress.total}</p>
                  <p className="text-sm text-muted-foreground">Checklist Items</p>
                </div>
              </div>
            </div>
            <Progress value={checklistProgress.percentage} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* Unresolved Comments */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${unresolvedComments > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
                <MessageSquare className={`h-5 w-5 ${unresolvedComments > 0 ? 'text-warning' : 'text-success'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{unresolvedComments}</p>
                <p className="text-sm text-muted-foreground">Unresolved Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Days Since Submission */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${daysSinceSubmission && daysSinceSubmission > 7 ? 'bg-warning/10' : 'bg-muted'}`}>
                <Clock className={`h-5 w-5 ${daysSinceSubmission && daysSinceSubmission > 7 ? 'text-warning' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{daysSinceSubmission ?? '-'}</p>
                <p className="text-sm text-muted-foreground">Days Since Submission</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${bsTotals.isBalanced ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {bsTotals.isBalanced ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{bsTotals.isBalanced ? 'Balanced' : 'Not Balanced'}</p>
                <p className="text-sm text-muted-foreground">Balance Sheet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Balance Sheet Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Assets</span>
                <span className="text-sm font-medium">{formatCurrency(bsTotals.totalAssets)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Equity</span>
                <span className="text-sm font-medium">{formatCurrency(bsTotals.totalEquity)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Liabilities</span>
                <span className="text-sm font-medium">{formatCurrency(bsTotals.totalLiabilities)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Equity + Liabilities</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(bsTotals.totalEquityAndLiabilities)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profit & Loss Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-medium">{formatCurrency(plTotals.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Gross Profit</span>
                <span className="text-sm font-medium">{formatCurrency(plTotals.grossProfit)} ({plTotals.grossProfitMargin.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Operating Profit</span>
                <span className="text-sm font-medium">{formatCurrency(plTotals.operatingProfit)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Net Profit</span>
                <span className={`text-sm font-bold ${plTotals.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(plTotals.netProfit)} ({plTotals.netProfitMargin.toFixed(1)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Review Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                <FileText className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Statement Submitted</p>
                <p className="text-xs text-muted-foreground">{formatDate(review.financialStatement.submittedAt)}</p>
              </div>
            </div>
            {review.reviewStartedAt && (
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Review Started</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.reviewStartedAt)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-xs text-muted-foreground">{formatDate(review.lastUpdatedAt)}</p>
              </div>
            </div>
            {review.signature && (
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Signed Off by {review.signature.signedBy}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.signature.signedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
