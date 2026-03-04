// NOTE (2026-03-04):
// This page renders a mock reports hub for the Client profile.
// All report cards use illustrative data consistent with the mock
// financial data set (profit R331,200, VAT payable R35,000, etc.).
// Download, export, and SARS submission integrations are planned
// for the production phase.
// The VAT201 modal is the only interactive element — all other
// action buttons are intentionally disabled scaffolding.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Download } from 'lucide-react';

const fmt = (n: number): string => {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-ZA').replace(/,/g, ' ');
  return n < 0 ? `(R ${formatted})` : `R ${formatted}`;
};

type BadgeStyle = 'amber' | 'green' | 'red' | 'muted';

const statusStyles: Record<BadgeStyle, string> = {
  amber: 'bg-amber-500 text-white border-0',
  green: 'bg-green-600 text-white border-0',
  red: 'bg-red-600 text-white border-0',
  muted: 'bg-muted text-muted-foreground border border-border',
};

function StatusBadge({ label, style }: { label: string; style: BadgeStyle }) {
  return <Badge className={statusStyles[style]}>{label}</Badge>;
}

interface ReportAction {
  viewDisabled: boolean;
  viewTooltip?: string;
  viewRoute?: string;
  onView?: () => void;
  downloadDisabled: boolean;
  downloadTooltip?: string;
}

function ActionButtons({ action }: { action: ReportAction }) {
  const navigate = useNavigate();

  const viewBtn = (
    <Button
      size="sm"
      variant="outline"
      disabled={action.viewDisabled}
      onClick={() => {
        if (action.onView) action.onView();
        else if (action.viewRoute) navigate(action.viewRoute);
      }}
    >
      <Eye className="h-3.5 w-3.5 mr-1.5" />
      View
    </Button>
  );

  const downloadBtn = (
    <Button size="sm" variant="outline" disabled={action.downloadDisabled}>
      <Download className="h-3.5 w-3.5 mr-1.5" />
      Download
    </Button>
  );

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {action.viewTooltip && action.viewDisabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block">{viewBtn}</span>
            </TooltipTrigger>
            <TooltipContent>{action.viewTooltip}</TooltipContent>
          </Tooltip>
        ) : viewBtn}

        {action.downloadTooltip && action.downloadDisabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block">{downloadBtn}</span>
            </TooltipTrigger>
            <TooltipContent>{action.downloadTooltip}</TooltipContent>
          </Tooltip>
        ) : downloadBtn}
      </div>
    </TooltipProvider>
  );
}

interface ReportCardProps {
  name: string;
  description: string;
  period: string;
  statusLabel: string;
  statusStyle: BadgeStyle;
  action: ReportAction;
}

function ReportCard({ name, description, period, statusLabel, statusStyle, action }: ReportCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">{name}</h3>
              <StatusBadge label={statusLabel} style={statusStyle} />
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{description}</p>
            <p className="text-xs text-muted-foreground">Period: {period}</p>
          </div>
          <div className="shrink-0">
            <ActionButtons action={action} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientReports() {
  const navigate = useNavigate();
  const [vatModalOpen, setVatModalOpen] = useState(false);

  const finReports: ReportCardProps[] = [
    {
      name: 'Annual Financial Statements',
      description: 'Complete set of compiled financial statements including Balance Sheet, Income Statement, Cash Flow, and Notes',
      period: 'Year ended 28 February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: false,
        viewRoute: '/client/financial-statements',
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
    {
      name: 'Statement of Financial Position',
      description: 'Assets, liabilities, and equity as at year end',
      period: '28 February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: false,
        viewRoute: '/client/financial-statements',
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
    {
      name: 'Statement of Profit or Loss',
      description: 'Revenue, expenses, and profit for the year',
      period: 'Year ended 28 February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: false,
        viewRoute: '/client/financial-statements',
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
    {
      name: 'Statement of Cash Flows',
      description: 'Cash generated from operating, investing, and financing activities',
      period: 'Year ended 28 February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: false,
        viewRoute: '/client/financial-statements',
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
    {
      name: 'Statement of Changes in Equity',
      description: 'Movement in share capital and retained earnings',
      period: 'Year ended 28 February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: false,
        viewRoute: '/client/financial-statements',
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
  ];

  const taxReports: ReportCardProps[] = [
    {
      name: 'IT14 — Corporate Income Tax Return',
      description: 'Annual income tax return for submission to SARS',
      period: 'FY 2024/2025',
      statusLabel: 'Pending',
      statusStyle: 'amber',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available once accountant has completed IT14',
        downloadDisabled: true,
        downloadTooltip: 'Available once accountant has completed IT14',
      },
    },
    {
      name: 'VAT201 — VAT Return',
      description: 'Bi-monthly VAT return — output tax less input tax',
      period: 'January / February 2026',
      statusLabel: 'Submitted',
      statusStyle: 'green',
      action: {
        viewDisabled: false,
        onView: () => setVatModalOpen(true),
        downloadDisabled: true,
        downloadTooltip: 'Available once finalised',
      },
    },
    {
      name: 'IRP6 — Provisional Tax Return (1st Payment)',
      description: 'First provisional tax estimate based on projected taxable income',
      period: 'August 2025',
      statusLabel: 'Overdue',
      statusStyle: 'red',
      action: {
        viewDisabled: true,
        viewTooltip: 'IRP6 not yet filed — contact your accountant',
        downloadDisabled: true,
        downloadTooltip: 'IRP6 not yet filed — contact your accountant',
      },
    },
    {
      name: 'IRP6 — Provisional Tax Return (2nd Payment)',
      description: 'Second provisional tax estimate',
      period: 'February 2026',
      statusLabel: 'Due',
      statusStyle: 'amber',
      action: {
        viewDisabled: true,
        viewTooltip: 'IRP6 preparation in progress',
        downloadDisabled: true,
        downloadTooltip: 'IRP6 preparation in progress',
      },
    },
  ];

  const payrollReports: ReportCardProps[] = [
    {
      name: 'EMP201 — Monthly Payroll Declaration',
      description: 'Monthly PAYE, UIF, and SDL declaration to SARS',
      period: 'January 2026',
      statusLabel: 'Submitted',
      statusStyle: 'green',
      action: {
        viewDisabled: true,
        viewTooltip: 'Payroll reports available from the Payslips section',
        downloadDisabled: true,
        downloadTooltip: 'Payroll reports available from the Payslips section',
      },
    },
    {
      name: 'EMP501 — Annual Payroll Reconciliation',
      description: 'Annual reconciliation of all PAYE, UIF, SDL deductions',
      period: 'FY 2025/2026',
      statusLabel: 'Pending',
      statusStyle: 'amber',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available at tax year end',
        downloadDisabled: true,
        downloadTooltip: 'Available at tax year end',
      },
    },
    {
      name: 'IRP5 — Employee Tax Certificates',
      description: 'Annual tax certificates issued to all employees',
      period: 'FY 2025/2026',
      statusLabel: 'Pending',
      statusStyle: 'amber',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available at tax year end',
        downloadDisabled: true,
        downloadTooltip: 'Available at tax year end',
      },
    },
  ];

  const mgmtReports: ReportCardProps[] = [
    {
      name: 'Management Accounts',
      description: 'Monthly income statement and balance sheet summary for internal review',
      period: 'February 2026',
      statusLabel: 'Draft',
      statusStyle: 'amber',
      action: {
        viewDisabled: true,
        downloadDisabled: true,
      },
    },
    {
      name: 'Aged Debtors Report',
      description: 'Outstanding customer invoices by age bucket',
      period: 'As at 28 February 2026',
      statusLabel: 'Coming Soon',
      statusStyle: 'muted',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available in a future update',
        downloadDisabled: true,
        downloadTooltip: 'Available in a future update',
      },
    },
    {
      name: 'Aged Creditors Report',
      description: 'Outstanding supplier invoices by age bucket',
      period: 'As at 28 February 2026',
      statusLabel: 'Coming Soon',
      statusStyle: 'muted',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available in a future update',
        downloadDisabled: true,
        downloadTooltip: 'Available in a future update',
      },
    },
    {
      name: 'Cash Flow Forecast',
      description: '3-month forward-looking cash flow projection',
      period: 'March – May 2026',
      statusLabel: 'Coming Soon',
      statusStyle: 'muted',
      action: {
        viewDisabled: true,
        viewTooltip: 'Available in a future update',
        downloadDisabled: true,
        downloadTooltip: 'Available in a future update',
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Download, view, and track all compliance and financial reports for your business
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium">
              Financial Year: <span className="ml-1 font-semibold">2025/2026</span>
            </div>
            <Badge variant="outline" className="text-xs">As at 28 February 2026</Badge>
          </div>
        </div>

        {/* ── 2. CATEGORY TABS ───────────────────────────────────────── */}
        <Tabs defaultValue="financial-statements">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-2">
            <TabsTrigger value="financial-statements">Financial Statements</TabsTrigger>
            <TabsTrigger value="tax-reports">Tax Reports</TabsTrigger>
            <TabsTrigger value="payroll-reports">Payroll Reports</TabsTrigger>
            <TabsTrigger value="management-reports">Management Reports</TabsTrigger>
          </TabsList>

          {/* ── 3. TAB 1: FINANCIAL STATEMENTS ──────────────────────── */}
          <TabsContent value="financial-statements" className="space-y-3 mt-4">
            {finReports.map((r) => <ReportCard key={r.name} {...r} />)}
          </TabsContent>

          {/* ── 4. TAB 2: TAX REPORTS ───────────────────────────────── */}
          <TabsContent value="tax-reports" className="space-y-3 mt-4">
            {taxReports.map((r) => <ReportCard key={r.name} {...r} />)}
          </TabsContent>

          {/* ── 5. TAB 3: PAYROLL REPORTS ───────────────────────────── */}
          <TabsContent value="payroll-reports" className="space-y-3 mt-4">
            {payrollReports.map((r) => <ReportCard key={r.name} {...r} />)}
          </TabsContent>

          {/* ── 6. TAB 4: MANAGEMENT REPORTS ────────────────────────── */}
          <TabsContent value="management-reports" className="space-y-3 mt-4">
            {mgmtReports.map((r) => <ReportCard key={r.name} {...r} />)}
          </TabsContent>
        </Tabs>

        {/* ── 8. FOOTER DISCLAIMER ──────────────────────────────────── */}
        <p className="text-xs text-muted-foreground text-center pb-2">
          Reports shown are based on mock data for demonstration purposes only.
          Download and submission functionality will be enabled in the production build.
        </p>

      </div>

      {/* ── 7. VAT201 MODAL ───────────────────────────────────────────── */}
      <Dialog open={vatModalOpen} onOpenChange={setVatModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>VAT201 — January / February 2026</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1.5">VAT Output (Sales)</td>
                  <td className="py-1.5 text-right font-medium">{fmt(85000)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">VAT Input (Purchases)</td>
                  <td className="py-1.5 text-right font-medium">{fmt(-50000)}</td>
                </tr>
                <tr className="border-t border-border font-bold">
                  <td className="py-2">Net VAT Payable</td>
                  <td className="py-2 text-right">{fmt(35000)}</td>
                </tr>
              </tbody>
            </table>
            <div className="space-y-1.5 text-sm border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Return Status</span>
                <Badge className="bg-green-600 text-white border-0">Submitted</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submission Date</span>
                <span className="font-medium">24 February 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium font-mono text-xs">VAT-2026-01/02-0042</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setVatModalOpen(false)} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
