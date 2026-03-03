import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { BalanceSheetForm } from '@/components/financial/BalanceSheetForm';
import { ProfitLossForm } from '@/components/financial/ProfitLossForm';
import { useFinancialPDF } from '@/hooks/useFinancialPDF';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  BalanceSheetData, 
  ProfitLossData, 
  FinancialStatement,
  calculateBalanceSheetTotals 
} from '@/lib/financial-types';
import { 
  mockBalanceSheet, 
  mockProfitLoss, 
  mockFinancialStatement,
} from '@/lib/financial-mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  FileText, 
  Download, 
  Send, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Scale,
  TrendingUp,
  Coins,
  BookOpen,
  StickyNote,
} from 'lucide-react';

export default function FinancialStatements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { generatePDF } = useFinancialPDF();

  // State
  const [statement, setStatement] = useState<FinancialStatement>(mockFinancialStatement);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData>(mockBalanceSheet);
  const [profitLoss, setProfitLoss] = useState<ProfitLossData>(mockProfitLoss);
  const [financialYear, setFinancialYear] = useState('2025');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const bsTotals = calculateBalanceSheetTotals(balanceSheet);
  const canSubmit = statement.status === 'draft' && bsTotals.isBalanced;

  const handleSaveBalanceSheet = (data: BalanceSheetData) => {
    setBalanceSheet(data);
    setStatement(prev => ({
      ...prev,
      balanceSheet: data,
      lastModified: new Date().toISOString(),
    }));
    toast({
      title: 'Balance Sheet Saved',
      description: 'Your balance sheet has been saved as a draft.',
    });
  };

  const handleSaveProfitLoss = (data: ProfitLossData) => {
    setProfitLoss(data);
    setStatement(prev => ({
      ...prev,
      profitLoss: data,
      lastModified: new Date().toISOString(),
    }));
    toast({
      title: 'Income Statement Saved',
      description: 'Your income statement has been saved as a draft.',
    });
  };

  const handleSubmitToAccountant = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatement(prev => ({
      ...prev,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }));
    setIsSubmitting(false);
    setShowSubmitDialog(false);
    toast({
      title: 'Submitted Successfully',
      description: 'Your financial statements have been submitted for review.',
    });
  };

  const handleExportPDF = (type: 'all' | 'balance-sheet' | 'profit-loss') => {
    generatePDF({
      companyName: user?.company || 'Company',
      financialYear,
      balanceSheet: type === 'profit-loss' ? undefined : balanceSheet,
      profitLoss: type === 'balance-sheet' ? undefined : profitLoss,
    });
    toast({
      title: 'PDF Generated',
      description: 'Your financial report has been generated. Check your browser for the print dialog.',
    });
  };

  const StatusIcon = ({ status }: { status: FinancialStatement['status'] }) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'submitted':
      case 'under-review':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isEditable = statement.status === 'draft' || statement.status === 'rejected';

  const StubSection = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
          <p className="text-sm text-muted-foreground">This section will be populated in a future update.</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Financial Statements</h1>
            <p className="mt-1 text-muted-foreground">
              Prepare and submit your annual financial statements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">FY 2025</SelectItem>
                <SelectItem value="2024">FY 2024</SelectItem>
                <SelectItem value="2023">FY 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <StatusIcon status={statement.status} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Statement Status</span>
                  <StatusBadge 
                    status={statement.status === 'approved' ? 'complete' : 
                            statement.status === 'rejected' ? 'action-required' :
                            statement.status === 'draft' ? 'not-started' : 'pending'} 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Last modified: {new Date(statement.lastModified).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(value) => handleExportPDF(value as 'all' | 'balance-sheet' | 'profit-loss')}>
                <SelectTrigger className="w-auto border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Export PDF</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Full Report</SelectItem>
                  <SelectItem value="balance-sheet">Balance Sheet Only</SelectItem>
                  <SelectItem value="profit-loss">Income Statement Only</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="hero" 
                onClick={() => setShowSubmitDialog(true)}
                disabled={!canSubmit}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            </div>
          </div>

          {statement.status !== 'draft' && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm">
                {statement.status === 'submitted' && 'Your statements are awaiting review by your accountant.'}
                {statement.status === 'under-review' && 'Your accountant is currently reviewing your statements.'}
                {statement.status === 'approved' && 'Your financial statements have been approved.'}
                {statement.status === 'rejected' && (
                  <>
                    Your statements require revisions. 
                    {statement.comments && <span className="block mt-1 text-muted-foreground">Comment: {statement.comments}</span>}
                  </>
                )}
              </p>
            </div>
          )}

          {!bsTotals.isBalanced && statement.status === 'draft' && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Balance Sheet must balance before you can submit. Please review your entries.</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary Info Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Statement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Company Name</p>
                <p className="text-sm font-medium">{user?.company || 'Company Name'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Financial Year</p>
                <p className="text-sm font-medium">FY {financialYear}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prepared By</p>
                <p className="text-sm font-medium text-muted-foreground">Accountant (TBC)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bank Name</p>
                <p className="text-sm font-medium text-muted-foreground">Bank (TBC)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6 Sections as vertical card list */}
        <div className="space-y-6">
          {/* 1. Trial Balance */}
          <StubSection
            title="Trial Balance"
            description="Trial Balance view coming soon — will be populated from categorized transactions and adjusting entries."
            icon={Scale}
          />

          {/* 2. Balance Sheet */}
          <div>
            <BalanceSheetForm
              data={balanceSheet}
              onSave={handleSaveBalanceSheet}
              isSubmitting={isSubmitting}
              readOnly={!isEditable}
            />
          </div>

          {/* 3. Income Statement */}
          <div>
            <ProfitLossForm
              data={profitLoss}
              onSave={handleSaveProfitLoss}
              isSubmitting={isSubmitting}
              readOnly={!isEditable}
            />
          </div>

          {/* 4. Cash Flow Statement */}
          <StubSection
            title="Cash Flow Statement"
            description="Cash Flow Statement coming soon — will show operating, investing, and financing activities."
            icon={Coins}
          />

          {/* 5. Statement of Changes in Equity */}
          <StubSection
            title="Statement of Changes in Equity"
            description="Coming soon — will track movements in share capital, retained earnings, and reserves."
            icon={BookOpen}
          />

          {/* 6. Notes to the Financial Statements */}
          <StubSection
            title="Notes to the Financial Statements"
            description="Notes and disclosures supporting the financial statements — to be added in a future update."
            icon={StickyNote}
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Financial Statements</DialogTitle>
            <DialogDescription>
              You are about to submit your financial statements to your accountant for review.
              Once submitted, you won't be able to make changes until they are reviewed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{user?.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Financial Year</span>
                <span className="font-medium">{financialYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance Sheet Status</span>
                <span className="font-medium text-success">Balanced ✓</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitToAccountant} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// NOTE (2026-03-03):
// - Trial Balance, Cash Flow Statement, Statement of Changes in Equity, and Notes are UI stubs.
// - Balance Sheet and Income Statement use editable mock data from financial-mock-data.ts.
// - "Submit for Review" currently simulates an API call with a 1.5s delay.
// - Real data + export to PDF/Word/Excel to be wired in a future Supabase integration phase.
