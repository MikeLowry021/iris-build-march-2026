import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Wallet,
  FileText,
  Receipt,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  mockCEOMetrics,
  mockCEOAlerts,
  mockCEOReimbursements,
  mockCEOBusiness,
} from '@/lib/ceo-mock-data';
import { formatCurrency, formatPercentage } from '@/lib/ceo-types';

const CEODashboard = () => {
  const metrics = mockCEOMetrics;
  const alerts = mockCEOAlerts;
  const pendingReimbursements = mockCEOReimbursements.filter((r) => r.status === 'pending');
  const business = mockCEOBusiness;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Welcome back, {business.ownerName.split(' ')[0]}</h1>
            <p className="text-muted-foreground">{business.name} • Business Overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/ceo/metrics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Metrics
              </Link>
            </Button>
            <Button asChild>
              <Link to="/ceo/payroll">
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payroll
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${getAlertBgColor(alert.type)}`}
              >
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <span className="font-medium">{alert.title}:</span>{' '}
                    <span className="text-muted-foreground">{alert.message}</span>
                  </div>
                </div>
                {alert.actionLabel && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={alert.actionUrl || '#'}>
                      {alert.actionLabel}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Executive Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="status-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Month Profit</CardTitle>
              {metrics.profitTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metrics.currentMonthProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(metrics.currentMonthProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue {formatCurrency(metrics.revenue)} - Expenses {formatCurrency(metrics.expenses)}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {metrics.profitTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={metrics.profitTrend >= 0 ? 'text-success' : 'text-destructive'}>
                  {metrics.profitTrend >= 0 ? '+' : ''}{metrics.profitTrend}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="status-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Position</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.cashPosition)}</div>
              <p className="text-xs text-muted-foreground">From latest bank reconciliation</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className={metrics.cashRunwayMonths >= 6 ? 'text-success' : metrics.cashRunwayMonths >= 4 ? 'text-warning' : 'text-destructive'}>
                  {metrics.cashRunwayMonths.toFixed(1)} months runway
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="status-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.employeeCount} active staff</div>
              <p className="text-xs text-muted-foreground">
                Payroll cost {formatCurrency(metrics.monthlyPayrollCost)} this month
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">
                  {formatPercentage(metrics.employeeCostPercentage)} of revenue
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="status-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReimbursements.length} expenses</div>
              <p className="text-xs text-muted-foreground">
                Total {formatCurrency(pendingReimbursements.reduce((acc, r) => acc + r.amount, 0))}
              </p>
              <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" asChild>
                <Link to="/ceo/reimbursements">
                  Review now
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* KPI Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gross Profit Margin</CardTitle>
              <CardDescription>Target: {formatPercentage(metrics.grossProfitMarginTarget)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPercentage(metrics.grossProfitMargin)}</span>
                <Badge variant={metrics.grossProfitMargin >= metrics.grossProfitMarginTarget ? 'default' : 'destructive'}>
                  {metrics.grossProfitMargin >= metrics.grossProfitMarginTarget
                    ? 'On Target'
                    : `${formatPercentage(metrics.grossProfitMarginTarget - metrics.grossProfitMargin)} below`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue YTD</CardTitle>
              <CardDescription>Budget: {formatCurrency(metrics.revenueBudget)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(metrics.revenueYTD)}</span>
                <Badge variant={metrics.revenueYTD >= metrics.revenueBudget ? 'default' : 'secondary'}>
                  {formatPercentage(((metrics.revenueYTD - metrics.revenueBudget) / metrics.revenueBudget) * 100)} vs budget
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Outstanding Invoices</CardTitle>
              <CardDescription>Avg {metrics.avgDaysOverdue} days overdue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(metrics.outstandingInvoices)}</span>
                <Badge variant={metrics.avgDaysOverdue > 30 ? 'destructive' : metrics.avgDaysOverdue > 14 ? 'secondary' : 'default'}>
                  {metrics.avgDaysOverdue > 30 ? 'Overdue' : metrics.avgDaysOverdue > 14 ? 'Due soon' : 'Current'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link to="/ceo/payroll">
                  <DollarSign className="h-5 w-5" />
                  <span>Process Payroll</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link to="/ceo/reimbursements">
                  <Receipt className="h-5 w-5" />
                  <span>Approve Expenses</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link to="/ceo/employees">
                  <Users className="h-5 w-5" />
                  <span>Employee Records</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link to="/ceo/tax">
                  <FileText className="h-5 w-5" />
                  <span>Tax Summary</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;
