import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  DollarSign,
  PieChart,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { toast } from 'sonner';
import { mockCEOMetrics } from '@/lib/ceo-mock-data';
import { formatCurrency, formatPercentage } from '@/lib/ceo-types';

const CEOMetrics = () => {
  const metrics = mockCEOMetrics;

  const getVarianceStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-success';
      case 'over':
        return 'text-destructive';
      case 'under':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getVarianceBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge variant="default" className="bg-success">On Track</Badge>;
      case 'over':
        return <Badge variant="destructive">Over Budget</Badge>;
      case 'under':
        return <Badge variant="secondary">Under Budget</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Business Metrics</h1>
            <p className="text-muted-foreground">Real-time KPI dashboards and variance analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Data refreshed')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gross Profit Margin</CardTitle>
              <CardDescription>Target: {formatPercentage(metrics.grossProfitMarginTarget)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPercentage(metrics.grossProfitMargin)}</span>
                <span className={metrics.grossProfitMargin >= metrics.grossProfitMarginTarget ? 'text-success' : 'text-destructive'}>
                  {metrics.grossProfitMargin >= metrics.grossProfitMarginTarget ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Variance: {formatPercentage(metrics.grossProfitMargin - metrics.grossProfitMarginTarget)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Employee Cost %</CardTitle>
              <CardDescription>Benchmark: 35-40%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPercentage(metrics.employeeCostPercentage)}</span>
                <span className={metrics.employeeCostPercentage <= 40 ? 'text-success' : 'text-warning'}>
                  {metrics.employeeCostPercentage <= 40 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(metrics.monthlyPayrollCost)} monthly payroll
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cash Runway</CardTitle>
              <CardDescription>Target: 6+ months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{metrics.cashRunwayMonths.toFixed(1)}</span>
                <span className="text-lg">months</span>
                <span className={metrics.cashRunwayMonths >= 6 ? 'text-success' : metrics.cashRunwayMonths >= 4 ? 'text-warning' : 'text-destructive'}>
                  {metrics.cashRunwayMonths >= 6 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on current burn rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue YTD</CardTitle>
              <CardDescription>Budget: {formatCurrency(metrics.revenueBudget)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(metrics.revenueYTD)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPercentage(((metrics.revenueYTD - metrics.revenueBudget) / metrics.revenueBudget) * 100)} vs budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
              <CardDescription>Avg {metrics.avgDaysOverdue} days overdue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(metrics.outstandingInvoices)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metrics.avgDaysOverdue > 30 ? 'Action required' : 'Within acceptable range'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <CardDescription>vs. last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${metrics.profitTrend >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {metrics.profitTrend >= 0 ? '+' : ''}{formatPercentage(metrics.profitTrend)}
                </span>
                {metrics.profitTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Expenses Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Revenue & Expenses (12 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.revenueHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="hsl(180, 63%, 34%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(180, 63%, 34%)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="hsl(0, 72%, 51%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(0, 72%, 51%)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="hsl(152, 69%, 40%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(152, 69%, 40%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cash Flow Forecast */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>Cash Flow Forecast</CardTitle>
              </div>
              <CardDescription>30/60/90-day projection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <span className="text-muted-foreground">Current Cash</span>
                  <span className="text-2xl font-bold">{formatCurrency(metrics.cashPosition)}</span>
                </div>
                {metrics.cashFlowForecast.map((forecast, index) => (
                  <div
                    key={forecast.days}
                    className="flex items-center justify-between rounded-lg bg-muted p-4"
                  >
                    <span>{forecast.days}-day forecast</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{formatCurrency(forecast.amount)}</span>
                      {forecast.amount > metrics.cashPosition ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm">
                  <strong>Cash Runway:</strong> {metrics.cashRunwayMonths.toFixed(1)} months
                  {metrics.cashRunwayMonths < 6 && (
                    <span className="ml-2 text-warning">(Below recommended 6 months)</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Budget vs Actual */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <CardTitle>Budget vs. Actual</CardTitle>
              </div>
              <CardDescription>Variance analysis by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={metrics.varianceAnalysis}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" tick={{ fontSize: 10 }} />
                    <YAxis
                      tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                      className="text-xs"
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      name="Budget"
                      stackId="1"
                      stroke="hsl(180, 63%, 34%)"
                      fill="hsl(180, 63%, 34%)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      name="Actual"
                      stackId="2"
                      stroke="hsl(38, 92%, 50%)"
                      fill="hsl(38, 92%, 50%)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variance Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle>Variance Analysis</CardTitle>
            <CardDescription>Detailed budget vs actual by category</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance (R)</TableHead>
                  <TableHead className="text-right">Variance (%)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.varianceAnalysis.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                    <TableCell className={`text-right ${getVarianceStatusColor(item.status)}`}>
                      {item.varianceAmount >= 0 ? '+' : ''}{formatCurrency(item.varianceAmount)}
                    </TableCell>
                    <TableCell className={`text-right ${getVarianceStatusColor(item.status)}`}>
                      {item.variancePercentage >= 0 ? '+' : ''}{formatPercentage(item.variancePercentage)}
                    </TableCell>
                    <TableCell className="text-center">{getVarianceBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">Drill-down by category</Button>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CEOMetrics;
