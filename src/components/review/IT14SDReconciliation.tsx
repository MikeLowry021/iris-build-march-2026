import { useState, useMemo } from 'react';
import { ClientReview, TrialBalanceLine } from '@/lib/review-types';
import { calculateReconciliationSummary } from '@/lib/review-mock-data';
import { calculateBalanceSheetTotals, calculateProfitLossTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';
import { VerificationChecklist } from './VerificationChecklist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  Search,
  ArrowRightLeft,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IT14SDReconciliationProps {
  review: ClientReview;
  onChecklistToggle: (itemId: string, checked: boolean) => void;
}

const categoryLabels: Record<TrialBalanceLine['category'], string> = {
  'non-current-assets': 'Non-Current Assets',
  'current-assets': 'Current Assets',
  'equity': 'Equity',
  'non-current-liabilities': 'Non-Current Liabilities',
  'current-liabilities': 'Current Liabilities',
  'revenue': 'Revenue',
  'cost-of-sales': 'Cost of Sales',
  'expenses': 'Operating Expenses',
  'other': 'Other Items',
};

export function IT14SDReconciliation({
  review,
  onChecklistToggle,
}: IT14SDReconciliationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TrialBalanceLine['category'] | 'all'>('all');

  const bsTotals = calculateBalanceSheetTotals(review.financialStatement.balanceSheet);
  const plTotals = calculateProfitLossTotals(review.financialStatement.profitLoss);
  const reconciliation = calculateReconciliationSummary(review.trialBalance, bsTotals, plTotals);

  const filteredTrialBalance = useMemo(() => {
    return review.trialBalance.filter(line => {
      const matchesSearch = 
        line.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.accountName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || line.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [review.trialBalance, searchQuery, categoryFilter]);

  // Group by category for summary
  const categoryTotals = useMemo(() => {
    const totals: Record<string, { debits: number; credits: number }> = {};
    review.trialBalance.forEach(line => {
      if (!totals[line.category]) {
        totals[line.category] = { debits: 0, credits: 0 };
      }
      totals[line.category].debits += line.debit;
      totals[line.category].credits += line.credit;
    });
    return totals;
  }, [review.trialBalance]);

  const ReconciliationCard = ({ 
    label, 
    tbValue, 
    fsValue, 
    variance 
  }: { 
    label: string; 
    tbValue: number; 
    fsValue: number; 
    variance: number;
  }) => {
    const isMatched = Math.abs(variance) < 0.01;
    return (
      <Card className={cn(
        'border',
        isMatched ? 'border-success/50' : 'border-warning/50'
      )}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{label}</span>
            {isMatched ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Trial Balance</p>
              <p className="font-medium tabular-nums">{formatCurrency(tbValue)}</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Fin. Statements</p>
              <p className="font-medium tabular-nums">{formatCurrency(fsValue)}</p>
            </div>
          </div>
          {!isMatched && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-warning">
                Variance: {formatCurrency(variance)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <Card className={cn(
        reconciliation.isBalanced && !reconciliation.hasMaterialVariances
          ? 'border-success/50 bg-success/5'
          : 'border-warning/50 bg-warning/5'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {reconciliation.isBalanced && !reconciliation.hasMaterialVariances ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {reconciliation.isBalanced 
                  ? 'Trial Balance is balanced' 
                  : 'Trial Balance does not balance'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Total Debits: {formatCurrency(reconciliation.totalDebits)} | Total Credits: {formatCurrency(reconciliation.totalCredits)}
              </p>
            </div>
            {reconciliation.hasMaterialVariances && (
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Material Variances Detected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReconciliationCard
          label="Total Assets"
          tbValue={categoryTotals['non-current-assets']?.debits + categoryTotals['current-assets']?.debits || 0}
          fsValue={bsTotals.totalAssets}
          variance={reconciliation.assetVariance}
        />
        <ReconciliationCard
          label="Total Liabilities"
          tbValue={(categoryTotals['non-current-liabilities']?.credits || 0) + (categoryTotals['current-liabilities']?.credits || 0)}
          fsValue={bsTotals.totalLiabilities}
          variance={reconciliation.liabilityVariance}
        />
        <ReconciliationCard
          label="Total Equity"
          tbValue={categoryTotals['equity']?.credits || 0}
          fsValue={bsTotals.totalEquity}
          variance={reconciliation.equityVariance}
        />
        <ReconciliationCard
          label="Net Profit"
          tbValue={(categoryTotals['revenue']?.credits || 0) - 
            (categoryTotals['cost-of-sales']?.debits || 0) - 
            (categoryTotals['expenses']?.debits || 0) - 
            (categoryTotals['other']?.debits || 0) +
            (categoryTotals['other']?.credits || 0)}
          fsValue={plTotals.netProfit}
          variance={reconciliation.profitVariance}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trial Balance Table - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base font-semibold">Trial Balance</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search accounts..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 h-8"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge 
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter('all')}
                >
                  All
                </Badge>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <Badge 
                    key={key}
                    variant={categoryFilter === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(key as TrialBalanceLine['category'])}
                  >
                    {label}
                  </Badge>
                ))}
              </div>

              <div className="rounded-lg border overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                      <TableRow>
                        <TableHead className="w-24">Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead className="text-right w-32">Debit</TableHead>
                        <TableHead className="text-right w-32">Credit</TableHead>
                        <TableHead className="w-40">Mapped To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrialBalance.map((line, index) => (
                        <TableRow key={`${line.accountCode}-${index}`}>
                          <TableCell className="font-mono text-xs">
                            {line.accountCode}
                          </TableCell>
                          <TableCell className="text-sm">
                            {line.accountName}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">
                            {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">
                            {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                          </TableCell>
                          <TableCell>
                            {line.mappedTo && (
                              <Badge variant="outline" className="text-xs">
                                {line.mappedTo}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals Row */}
              <div className="mt-3 flex justify-end gap-4 border-t pt-3">
                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">Total Debits:</span>
                  <span className="font-bold tabular-nums">{formatCurrency(reconciliation.totalDebits)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">Total Credits:</span>
                  <span className="font-bold tabular-nums">{formatCurrency(reconciliation.totalCredits)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IT14SD Checklist - 1 column */}
        <div>
          <VerificationChecklist
            items={review.checklist}
            onItemToggle={onChecklistToggle}
            category="it14sd"
            title="IT14SD Verification"
          />
        </div>
      </div>
    </div>
  );
}
