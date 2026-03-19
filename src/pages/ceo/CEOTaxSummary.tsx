import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Download, Lightbulb, MessageSquare, Calculator, ChartPie as PieChart, ArrowRight } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mockCEOTaxSummary } from '@/lib/ceo-mock-data';
import { formatCurrency, formatPercentage } from '@/lib/ceo-types';

const COLORS = ['hsl(180, 63%, 34%)', 'hsl(34, 14%, 31%)', 'hsl(152, 69%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(180, 63%, 50%)', 'hsl(34, 14%, 45%)', 'hsl(152, 69%, 50%)', 'hsl(38, 92%, 60%)'];

const CEOTaxSummary = () => {
  const navigate = useNavigate();
  const taxSummary = mockCEOTaxSummary;

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

        {/* Tax Obligations by Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Obligations</CardTitle>
            <CardDescription>Your tax filing schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PAYE & UIF Group */}
            <div>
              <div className="mb-3 border-b pb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">PAYE & UIF — Monthly</h3>
              </div>
              <div className="space-y-2">
                {/* PAYE Row - Clickable */}
                <button
                  onClick={() => navigate('/ceo/payroll')}
                  className="w-full rounded-lg border border-input bg-background p-4 text-left transition-all hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Click to view payslips"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">PAYE (Pay As You Earn)</p>
                      <p className="text-sm text-muted-foreground">March 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(8450)}</p>
                        <Badge variant="default" className="bg-success">Paid</Badge>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </button>

                {/* UIF Row - Not Clickable */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">UIF (Unemployment Insurance Fund)</p>
                      <p className="text-sm text-muted-foreground">March 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(212)}</p>
                      <Badge variant="default" className="bg-success">Paid</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VAT Group */}
            <div>
              <div className="mb-3 border-b pb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">VAT — Bi-Monthly</h3>
              </div>
              <div className="space-y-2">
                {/* VAT Output */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">VAT Output (Sales)</p>
                      <p className="text-sm text-muted-foreground">Jan–Feb 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(24360)}</p>
                      <Badge variant="default" className="bg-success">Paid</Badge>
                    </div>
                  </div>
                </div>

                {/* VAT Input */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">VAT Input (Expenses)</p>
                      <p className="text-sm text-muted-foreground">Jan–Feb 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(11200)}</p>
                      <Badge variant="default" className="bg-success">Paid</Badge>
                    </div>
                  </div>
                </div>

                {/* VAT Payable */}
                <div className="rounded-lg border border-input bg-warning/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">VAT Payable (Output minus Input)</p>
                      <p className="text-sm text-muted-foreground">Jan–Feb 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-warning">{formatCurrency(13160)}</p>
                      <Badge variant="secondary" className="bg-warning text-warning-foreground">Due</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Income Tax Group */}
            <div>
              <div className="mb-3 border-b pb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Income Tax — Annual</h3>
              </div>
              <div className="space-y-2">
                {/* Provisional Tax Period 1 */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">Provisional Tax — Period 1 (August)</p>
                      <p className="text-sm text-muted-foreground">Due 31 Aug 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(32200)}</p>
                      <Badge variant="default" className="bg-success">Paid</Badge>
                    </div>
                  </div>
                </div>

                {/* Provisional Tax Period 2 */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">Provisional Tax — Period 2 (February)</p>
                      <p className="text-sm text-muted-foreground">Due 28 Feb 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(32200)}</p>
                      <Badge variant="default" className="bg-success">Paid</Badge>
                    </div>
                  </div>
                </div>

                {/* Provisional Tax Period 3 */}
                <div className="rounded-lg border border-input p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">Provisional Tax — Period 3 / Top-up (Optional)</p>
                      <p className="text-sm text-muted-foreground">Due 30 Sep 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-muted-foreground">—</p>
                      <Badge variant="secondary" className="bg-warning text-warning-foreground">Not Required</Badge>
                    </div>
                  </div>
                </div>

                {/* IT14 Annual Return */}
                <div className="rounded-lg border border-input bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">IT14 Annual Return</p>
                      <p className="text-sm text-muted-foreground">Year ended Feb 2026</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        IT14 reconciles PAYE, VAT and provisional tax submissions for the full year.
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
