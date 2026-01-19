import { useState } from 'react';
import { ClientReview, ChecklistItem, ReviewComment } from '@/lib/review-types';
import { calculateBalanceSheetTotals, calculateProfitLossTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';
import { VerificationChecklist } from './VerificationChecklist';
import { CommentThread } from './CommentThread';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialsReviewProps {
  review: ClientReview;
  onChecklistToggle: (itemId: string, checked: boolean) => void;
  onAddComment: (content: string, section?: string) => void;
  onResolveComment: (commentId: string) => void;
}

export function FinancialsReview({
  review,
  onChecklistToggle,
  onAddComment,
  onResolveComment,
}: FinancialsReviewProps) {
  const [activeSection, setActiveSection] = useState<'balance-sheet' | 'profit-loss'>('balance-sheet');
  
  const bsTotals = calculateBalanceSheetTotals(review.financialStatement.balanceSheet);
  const plTotals = calculateProfitLossTotals(review.financialStatement.profitLoss);
  const bs = review.financialStatement.balanceSheet;
  const pl = review.financialStatement.profitLoss;

  const FinancialRow = ({ label, value, indent = false, isTotal = false, isGrandTotal = false }: { 
    label: string; 
    value: number; 
    indent?: boolean;
    isTotal?: boolean;
    isGrandTotal?: boolean;
  }) => (
    <div className={cn(
      'flex justify-between items-center py-2',
      indent && 'pl-4',
      isTotal && 'border-t border-border font-medium',
      isGrandTotal && 'border-t-2 border-foreground font-bold text-primary'
    )}>
      <span className={cn(
        'text-sm',
        !isTotal && !isGrandTotal && 'text-muted-foreground'
      )}>
        {label}
      </span>
      <span className={cn(
        'text-sm tabular-nums',
        value < 0 && 'text-destructive'
      )}>
        {formatCurrency(value)}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className={cn(
        bsTotals.isBalanced ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {bsTotals.isBalanced ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
            <div>
              <p className="text-sm font-medium">
                {bsTotals.isBalanced 
                  ? 'Balance Sheet is balanced' 
                  : 'Balance Sheet does not balance'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Assets: {formatCurrency(bsTotals.totalAssets)} | Equity + Liabilities: {formatCurrency(bsTotals.totalEquityAndLiabilities)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant={plTotals.netProfit >= 0 ? 'default' : 'destructive'}>
                {plTotals.netProfit >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                Net Profit: {formatCurrency(plTotals.netProfit)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Financial Data - 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Assets */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Non-Current Assets</p>
                  <FinancialRow label="Property, Plant & Equipment" value={bs.nonCurrentAssets.propertyPlantEquipment} indent />
                  <FinancialRow label="Intangible Assets" value={bs.nonCurrentAssets.intangibleAssets} indent />
                  <FinancialRow label="Investments" value={bs.nonCurrentAssets.investments} indent />
                  <FinancialRow label="Other Non-Current Assets" value={bs.nonCurrentAssets.otherNonCurrentAssets} indent />
                  <FinancialRow label="Total Non-Current Assets" value={bsTotals.totalNonCurrentAssets} isTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Current Assets</p>
                  <FinancialRow label="Inventory" value={bs.currentAssets.inventory} indent />
                  <FinancialRow label="Trade Receivables" value={bs.currentAssets.tradeReceivables} indent />
                  <FinancialRow label="Cash and Equivalents" value={bs.currentAssets.cashAndEquivalents} indent />
                  <FinancialRow label="Other Current Assets" value={bs.currentAssets.otherCurrentAssets} indent />
                  <FinancialRow label="Total Current Assets" value={bsTotals.totalCurrentAssets} isTotal />
                  
                  <FinancialRow label="TOTAL ASSETS" value={bsTotals.totalAssets} isGrandTotal />
                </CardContent>
              </Card>

              {/* Equity & Liabilities */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Equity & Liabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Equity</p>
                  <FinancialRow label="Share Capital" value={bs.equity.shareCapital} indent />
                  <FinancialRow label="Retained Earnings" value={bs.equity.retainedEarnings} indent />
                  <FinancialRow label="Reserves" value={bs.equity.reserves} indent />
                  <FinancialRow label="Total Equity" value={bsTotals.totalEquity} isTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Non-Current Liabilities</p>
                  <FinancialRow label="Long-Term Loans" value={bs.nonCurrentLiabilities.longTermLoans} indent />
                  <FinancialRow label="Deferred Tax" value={bs.nonCurrentLiabilities.deferredTax} indent />
                  <FinancialRow label="Other Non-Current Liabilities" value={bs.nonCurrentLiabilities.otherNonCurrentLiabilities} indent />
                  <FinancialRow label="Total Non-Current Liabilities" value={bsTotals.totalNonCurrentLiabilities} isTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Current Liabilities</p>
                  <FinancialRow label="Trade Payables" value={bs.currentLiabilities.tradePayables} indent />
                  <FinancialRow label="Short-Term Loans" value={bs.currentLiabilities.shortTermLoans} indent />
                  <FinancialRow label="VAT Payable" value={bs.currentLiabilities.vatPayable} indent />
                  <FinancialRow label="Other Current Liabilities" value={bs.currentLiabilities.otherCurrentLiabilities} indent />
                  <FinancialRow label="Total Current Liabilities" value={bsTotals.totalCurrentLiabilities} isTotal />
                  
                  <FinancialRow label="TOTAL EQUITY & LIABILITIES" value={bsTotals.totalEquityAndLiabilities} isGrandTotal />
                </CardContent>
              </Card>
            </div>

            {/* Checklist & Comments - 1 column */}
            <div className="space-y-4">
              <VerificationChecklist
                items={review.checklist}
                onItemToggle={onChecklistToggle}
                category="balance-sheet"
                title="Balance Sheet Verification"
              />
              <CommentThread
                comments={review.comments.filter(c => c.section?.includes('Balance Sheet'))}
                onAddComment={(content) => onAddComment(content, 'Balance Sheet')}
                onResolveComment={onResolveComment}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Financial Data - 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* P&L Statement */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Income Statement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Revenue</p>
                  <FinancialRow label="Sales Revenue" value={pl.revenue.salesRevenue} indent />
                  <FinancialRow label="Service Revenue" value={pl.revenue.serviceRevenue} indent />
                  <FinancialRow label="Other Income" value={pl.revenue.otherIncome} indent />
                  <FinancialRow label="Total Revenue" value={plTotals.totalRevenue} isTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Cost of Sales</p>
                  <FinancialRow label="Direct Materials" value={pl.costOfSales.directMaterials} indent />
                  <FinancialRow label="Direct Labour" value={pl.costOfSales.directLabor} indent />
                  <FinancialRow label="Manufacturing Overhead" value={pl.costOfSales.manufacturingOverhead} indent />
                  <FinancialRow label="Total Cost of Sales" value={plTotals.totalCostOfSales} isTotal />
                  
                  <FinancialRow label="GROSS PROFIT" value={plTotals.grossProfit} isGrandTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Operating Expenses</p>
                  <FinancialRow label="Salaries & Wages" value={pl.operatingExpenses.salariesWages} indent />
                  <FinancialRow label="Rent & Utilities" value={pl.operatingExpenses.rentUtilities} indent />
                  <FinancialRow label="Depreciation" value={pl.operatingExpenses.depreciation} indent />
                  <FinancialRow label="Marketing" value={pl.operatingExpenses.marketing} indent />
                  <FinancialRow label="Professional Fees" value={pl.operatingExpenses.professional} indent />
                  <FinancialRow label="Insurance" value={pl.operatingExpenses.insurance} indent />
                  <FinancialRow label="Other Operating Expenses" value={pl.operatingExpenses.other} indent />
                  <FinancialRow label="Total Operating Expenses" value={plTotals.totalOperatingExpenses} isTotal />
                  
                  <FinancialRow label="OPERATING PROFIT" value={plTotals.operatingProfit} isGrandTotal />
                  
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 mt-4">Other Items</p>
                  <FinancialRow label="Interest Income" value={pl.otherItems.interestIncome} indent />
                  <FinancialRow label="Interest Expense" value={-pl.otherItems.interestExpense} indent />
                  <FinancialRow label="Net Interest" value={plTotals.netInterest} isTotal />
                  
                  <FinancialRow label="Profit Before Tax" value={plTotals.profitBeforeTax} isTotal />
                  <FinancialRow label="Tax Expense" value={-pl.otherItems.taxExpense} indent />
                  
                  <FinancialRow label="NET PROFIT" value={plTotals.netProfit} isGrandTotal />
                </CardContent>
              </Card>

              {/* Key Ratios */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Key Ratios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-lg font-bold text-primary">{plTotals.grossProfitMargin.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Gross Margin</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-lg font-bold text-primary">{plTotals.operatingMargin.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Operating Margin</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className={cn(
                        "text-lg font-bold",
                        plTotals.netProfitMargin >= 0 ? 'text-success' : 'text-destructive'
                      )}>
                        {plTotals.netProfitMargin.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Net Margin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checklist & Comments - 1 column */}
            <div className="space-y-4">
              <VerificationChecklist
                items={review.checklist}
                onItemToggle={onChecklistToggle}
                category="profit-loss"
                title="Profit & Loss Verification"
              />
              <CommentThread
                comments={review.comments.filter(c => c.section?.includes('Profit & Loss'))}
                onAddComment={(content) => onAddComment(content, 'Profit & Loss')}
                onResolveComment={onResolveComment}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
