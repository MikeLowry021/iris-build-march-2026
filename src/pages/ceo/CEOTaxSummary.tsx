import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calculator,
  PieChart,
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';
import { mockCEOTaxSummary } from '@/lib/ceo-mock-data';
import { formatCurrency, formatPercentage } from '@/lib/ceo-types';

const COLORS = ['hsl(180, 63%, 34%)', 'hsl(34, 14%, 31%)', 'hsl(152, 69%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(180, 63%, 50%)', 'hsl(34, 14%, 45%)', 'hsl(152, 69%, 50%)', 'hsl(38, 92%, 60%)'];

const CEOTaxSummary = () => {
  const taxSummary = mockCEOTaxSummary;

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-success">Passed</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const pieData = taxSummary.expenseBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Tax Summary</h1>
            <p className="text-muted-foreground">Tax Year {taxSummary.year} • Self-service tax planning</p>
          </div>
          <Button onClick={() => toast.success('Tax summary downloaded')}>
            <Download className="mr-2 h-4 w-4" />
            Download Summary
          </Button>
        </div>

        {/* Estimated Tax Liability */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Estimated Tax Liability
            </CardTitle>
            <CardDescription>Based on current year-to-date figures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">YTD Income</p>
                <p className="text-2xl font-bold">{formatCurrency(taxSummary.ytdIncome)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Deductible Expenses</p>
                <p className="text-2xl font-bold text-success">
                  -{formatCurrency(taxSummary.ytdDeductibleExpenses)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Estimated Taxable Income</p>
                <p className="text-2xl font-bold">{formatCurrency(taxSummary.estimatedTaxableIncome)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Estimated Tax Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(taxSummary.estimatedTaxRate, 0)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-lg bg-muted p-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Tax Due</p>
                <p className="text-xl font-bold">{formatCurrency(taxSummary.estimatedTaxDue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Provisional Tax Paid</p>
                <p className="text-xl font-bold text-success">-{formatCurrency(taxSummary.provisionalTaxPaid)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Balance Due</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(taxSummary.balanceDue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-xl font-bold">{new Date(taxSummary.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button>Plan Tax Payment</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Tax Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Deductible Expenses Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <Button variant="link" className="mt-4">
                View all categorized deductions
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Compliance Checklist</CardTitle>
              <CardDescription>Status of your tax obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxSummary.complianceChecklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-start gap-3">
                      {getComplianceIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.item}</p>
                        {item.details && (
                          <p className="text-sm text-muted-foreground">{item.details}</p>
                        )}
                      </div>
                    </div>
                    {getComplianceBadge(item.status)}
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4">
                View detailed compliance status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tax Saving Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Potential Tax Savings
            </CardTitle>
            <CardDescription>
              Opportunities to reduce your tax liability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxSummary.taxSavingSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between rounded-lg border border-warning/30 bg-warning/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-success">
                      Potential saving: {formatCurrency(suggestion.potentialSaving)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Discuss with accountant
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Section 10 Deductions (Auto-categorized)</CardTitle>
            <CardDescription>Expenses categorized by tax deductibility</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead className="text-center">Deductible</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxSummary.expenseBreakdown.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="text-right">{formatPercentage(expense.percentage)}</TableCell>
                    <TableCell className="text-center">
                      {expense.isDeductible ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total Deductible</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      taxSummary.expenseBreakdown
                        .filter((e) => e.isDeductible)
                        .reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tax Planning Worksheet */}
        <Accordion type="single" collapsible>
          <AccordionItem value="worksheet">
            <AccordionTrigger className="text-lg font-semibold">
              Tax Planning Worksheet
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-muted-foreground">
                    Use this worksheet to model different scenarios and their tax impact.
                  </p>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Scenario: What if I purchase R20,000 in equipment?</h4>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div className="rounded bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Depreciation Impact</p>
                        <p className="text-lg font-bold">R1,200/year</p>
                        <p className="text-xs text-muted-foreground">6% depreciation rate</p>
                      </div>
                      <div className="rounded bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Tax Saving</p>
                        <p className="text-lg font-bold text-success">R336/year</p>
                        <p className="text-xs text-muted-foreground">at 28% tax rate</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Recalculate</Button>
                        <Button size="sm">Save Scenario</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DashboardLayout>
  );
};

export default CEOTaxSummary;
