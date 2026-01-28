import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientFinancials() {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<string>('January 2026');
  const financials = mockMonthlyFinancials[selectedMonth];

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your ${selectedMonth} financial report is being generated...`,
    });
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${selectedMonth}_Financials.${format === 'pdf' ? 'pdf' : 'xlsx'} has been downloaded.`,
      });
    }, 1500);
  };

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
            <h1 className="page-title">Financial Overview</h1>
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

        {/* Tabs for Income/Expenses and Bank Reconciliation */}
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList>
            <TabsTrigger value="breakdown">Income & Expenses</TabsTrigger>
            <TabsTrigger value="reconciliation">Bank Reconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Income Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Income Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financials.incomeBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right font-medium text-success">
                            {formatZAR(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold text-success">
                          {formatZAR(financials.totalIncome)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financials.expenseBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right font-medium text-destructive">
                            {formatZAR(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold text-destructive">
                          {formatZAR(financials.totalExpenses)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reconciliation">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Reconciliation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit (Out)</TableHead>
                        <TableHead className="text-right">Credit (In)</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financials.bankReconciliation.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right text-destructive">
                            {item.debit > 0 ? formatZAR(item.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right text-success">
                            {item.credit > 0 ? formatZAR(item.credit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatZAR(item.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
