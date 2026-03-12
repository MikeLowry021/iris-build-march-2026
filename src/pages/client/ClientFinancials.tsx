import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { BalanceSheetForm } from '@/components/financial/BalanceSheetForm';
import { ProfitLossForm } from '@/components/financial/ProfitLossForm';
import { mockBalanceSheet, mockProfitLoss } from '@/lib/financial-mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  mockMonthlyFinancials, 
  availableMonths, 
  formatZAR,
  mockClientInfo 
} from '@/lib/client-mock-data';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  PiggyBank,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  Scale,
  BarChart3,
  Coins,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientFinancials() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>('January 2026');
  const financials = mockMonthlyFinancials[selectedMonth];

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your ${selectedMonth} financial report is being generated...`,
    });
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${selectedMonth}_Financials.${format === 'pdf' ? 'pdf' : 'xlsx'} has been downloaded.`,
      });
    }, 1500);
  };

  const noopSave = () => {};

  if (!financials) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No financial data available for {selectedMonth}</p>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="mt-4 w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(month => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Financials</h1>
            <p className="mt-1 text-muted-foreground">
              View your financial statements for {mockClientInfo.company}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-success">{formatZAR(financials.totalIncome)}</p>
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
                  <p className={`text-2xl font-bold ${financials.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatZAR(financials.netProfit)}
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <PiggyBank className="h-5 w-5 text-primary" />
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
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {/* Financial Statements Callout */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Financial Statements</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compile Trial Balance, Balance Sheet, Income Statement, Cash Flow, and Statement of Changes in Equity into a complete set of financial statements.
                </p>
              </div>
            </div>
            <Button variant="hero" onClick={() => navigate('/client/financial-statements')} className="shrink-0">
              Go to Financial Statements
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* NOTE (2026-03-12): Cash Flow + SOCIE removed from Client view per Doc review. Notes tab added. These statements are Accountant-level only. */}
        {/* 4-Tab Layout */}
        <Tabs defaultValue="trial-balance" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
            <TabsTrigger value="notes">Notes to Financial Statements</TabsTrigger>
          </TabsList>

          <TabsContent value="trial-balance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5 text-primary" />
                  Trial Balance
                </CardTitle>
                <CardDescription>
                  Trial Balance view coming soon — will be populated from categorized transactions and adjusting entries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
                  <p className="text-sm text-muted-foreground">Trial Balance data will appear here once transactions are categorized.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance-sheet" className="animate-fade-in">
            <BalanceSheetForm
              data={mockBalanceSheet}
              onSave={noopSave}
              readOnly
            />
          </TabsContent>

          <TabsContent value="income-statement" className="animate-fade-in">
            <ProfitLossForm
              data={mockProfitLoss}
              onSave={noopSave}
              readOnly
            />
          </TabsContent>

          <TabsContent value="notes" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes to Financial Statements
                </CardTitle>
                <CardDescription>
                  Supporting notes to the financial statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-foreground">Note 1 — Basis of Preparation and Accounting Policies</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    These financial statements have been prepared in accordance with IFRS for SMEs and the Companies Act of South Africa.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Note 2 — Property, Plant and Equipment</h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="border-r px-4 py-2 text-left font-semibold">Asset</th>
                          <th className="border-r px-4 py-2 text-left font-semibold">Cost</th>
                          <th className="border-r px-4 py-2 text-left font-semibold">Accumulated Depreciation</th>
                          <th className="px-4 py-2 text-left font-semibold">Carrying Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            (Data to be populated)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Note 3 — Long Term Loans</h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="border-r px-4 py-2 text-left font-semibold">Description</th>
                          <th className="border-r px-4 py-2 text-left font-semibold">Opening Balance</th>
                          <th className="border-r px-4 py-2 text-left font-semibold">Additions</th>
                          <th className="border-r px-4 py-2 text-left font-semibold">Repayments</th>
                          <th className="px-4 py-2 text-left font-semibold">Closing Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            (Data to be populated)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Note 4 — Cash and Cash Equivalents</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cash on hand and balances with banks: R —
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Note 5 — Revenue</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sales: R —
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Read-only Notice */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a read-only view of your financial data. 
            All calculations are performed by your accountant. If you have questions or need corrections, 
            please contact {mockClientInfo.assignedAccountant.name} at{' '}
            <span className="text-primary">{mockClientInfo.assignedAccountant.email}</span>.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

// NOTE (2026-03-12):
// - Trial Balance, Balance Sheet, Income Statement, and Notes to Financial Statements tabs present.
// - Cash Flow Statement and Statement of Changes in Equity removed (Accountant-level only).
// - Balance Sheet and Income Statement tabs use read-only mock data from financial-mock-data.ts.
// - Notes tab contains 5 note stubs with mock data structure.
// - "Go to Financial Statements" navigates to /client/financial-statements.
// - Real data + export to PDF/Word/Excel to be wired in a future integration phase.
