// NOTE (2026-03-04):
// This page renders mock tax status data aligned with South African
// tax compliance requirements (Income Tax, VAT, PAYE/UIF, Provisional Tax).
// All values are illustrative only — sourced from FinancialStatements.tsx
// mock figures (taxable income R460,000, tax rate 28% = R128,800).
// Real data integration via Supabase and SARS eFiling API connections
// are planned for a future production phase.
// Do not remove section stubs — they are intentional scaffolding.

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fmt = (n: number): string => {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-ZA').replace(/,/g, ' ');
  return n < 0 ? `(R ${formatted})` : `R ${formatted}`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Overdue: 'bg-red-600 text-white border-0',
    Due: 'bg-amber-500 text-white border-0',
    Payable: 'bg-amber-500 text-white border-0',
    Partial: 'bg-amber-400 text-white border-0',
    Paid: 'bg-green-600 text-white border-0',
    Claimed: 'bg-green-600 text-white border-0',
    'Up to Date': 'bg-green-600 text-white border-0',
    'Return Submitted': 'bg-green-600 text-white border-0',
  };
  return <Badge className={styles[status] ?? 'border-border'}>{status}</Badge>;
};

const summaryCards = [
  {
    label: 'Income Tax',
    amount: 128800,
    status: 'Payable',
    sub: 'Estimated liability — provisional tax payments pending',
  },
  {
    label: 'VAT',
    amount: 35000,
    status: 'Payable',
    sub: 'VAT output exceeds input — payment due',
  },
  {
    label: 'PAYE / UIF',
    amount: 0,
    status: 'Up to Date',
    sub: 'No outstanding PAYE or UIF obligations',
  },
  {
    label: 'Provisional Tax',
    amount: 64400,
    status: 'Due',
    sub: 'First provisional tax payment due 31 August 2025',
  },
];

const breakdownRows = [
  {
    type: 'Income Tax (Provisional — 1st payment)',
    period: 'Aug 2025',
    dueDate: '31 Aug 2025',
    amount: 64400,
    paid: 0,
    outstanding: 64400,
    status: 'Overdue',
  },
  {
    type: 'Income Tax (Provisional — 2nd payment)',
    period: 'Feb 2026',
    dueDate: '28 Feb 2026',
    amount: 64400,
    paid: 0,
    outstanding: 64400,
    status: 'Due',
  },
  {
    type: 'VAT — Output Tax',
    period: 'Jan/Feb 2026',
    dueDate: '25 Feb 2026',
    amount: 85000,
    paid: 50000,
    outstanding: 35000,
    status: 'Partial',
  },
  {
    type: 'VAT — Input Tax Credit',
    period: 'Jan/Feb 2026',
    dueDate: '25 Feb 2026',
    amountNeg: true,
    amount: -50000,
    paid: null,
    outstanding: null,
    status: 'Claimed',
  },
  {
    type: 'PAYE',
    period: 'Jan 2026',
    dueDate: '7 Feb 2026',
    amount: 18500,
    paid: 18500,
    outstanding: 0,
    status: 'Paid',
  },
  {
    type: 'UIF',
    period: 'Jan 2026',
    dueDate: '7 Feb 2026',
    amount: 1200,
    paid: 1200,
    outstanding: 0,
    status: 'Paid',
  },
  {
    type: 'Income Tax (Annual — IT14)',
    period: 'FY 2024/2025',
    dueDate: '30 Nov 2025',
    amount: 128800,
    paid: 0,
    outstanding: 128800,
    status: 'Payable',
  },
];

const provRows = [
  { payment: '1st IRP6', dueDate: '31 Aug 2025', estimated: 64400, paid: 0, status: 'Overdue' },
  { payment: '2nd IRP6', dueDate: '28 Feb 2026', estimated: 64400, paid: 0, status: 'Due' },
];

export default function TaxStatus() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Tax Status</h1>
            <p className="text-sm text-muted-foreground">
              Summary of tax obligations and compliance status for the current financial year
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium">
              Tax Year: <span className="ml-1 font-semibold">2025/2026</span>
            </div>
            <Badge variant="outline" className="text-xs">As at 28 February 2026</Badge>
          </div>
        </div>

        {/* ── 2. SUMMARY CARDS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardContent className="pt-5 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <StatusBadge status={card.status} />
                </div>
                <p className="text-2xl font-bold tracking-tight">{fmt(card.amount)}</p>
                <p className="text-xs text-muted-foreground leading-snug">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── 3. TAX BREAKDOWN TABLE ─────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 text-left font-semibold">Tax Type</th>
                  <th className="py-2 text-left font-semibold">Period</th>
                  <th className="py-2 text-left font-semibold">Due Date</th>
                  <th className="py-2 text-right font-semibold">Amount (R)</th>
                  <th className="py-2 text-right font-semibold">Paid (R)</th>
                  <th className="py-2 text-right font-semibold">Outstanding (R)</th>
                  <th className="py-2 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {breakdownRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-4 font-medium">{row.type}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{row.period}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">{row.dueDate}</td>
                    <td className="py-2.5 text-right whitespace-nowrap">{fmt(row.amount)}</td>
                    <td className="py-2.5 text-right whitespace-nowrap text-muted-foreground">
                      {row.paid === null ? '—' : fmt(row.paid)}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap text-muted-foreground">
                      {row.outstanding === null ? '—' : fmt(row.outstanding)}
                    </td>
                    <td className="py-2.5 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── 4. VAT DETAIL SECTION ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">VAT Summary</CardTitle>
            <p className="text-sm text-muted-foreground">January / February 2026 bi-monthly return</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm max-w-sm">
              <tbody>
                <tr>
                  <td className="py-1.5">VAT Output (Sales)</td>
                  <td className="py-1.5 text-right font-medium">{fmt(85000)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">VAT Input (Purchases)</td>
                  <td className="py-1.5 text-right font-medium">{fmt(-50000)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 font-bold">Net VAT Payable</td>
                  <td className="py-2 text-right font-bold">{fmt(35000)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-xs text-muted-foreground">
                VAT return submitted. Payment due by 25 February 2026.
              </p>
              <StatusBadge status="Return Submitted" />
            </div>
          </CardContent>
        </Card>

        {/* ── 5. PROVISIONAL TAX SECTION ────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Provisional Tax Schedule</CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on estimated taxable income of R 460,000
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 text-left font-semibold">Payment</th>
                  <th className="py-2 text-left font-semibold">Due Date</th>
                  <th className="py-2 text-right font-semibold">Estimated (R)</th>
                  <th className="py-2 text-right font-semibold">Paid (R)</th>
                  <th className="py-2 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {provRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium">{row.payment}</td>
                    <td className="py-2.5 text-muted-foreground">{row.dueDate}</td>
                    <td className="py-2.5 text-right">{fmt(row.estimated)}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{fmt(row.paid)}</td>
                    <td className="py-2.5 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Provisional tax estimates are based on mock financial data.
              Final liability will be determined upon submission of the IT14.
            </p>
          </CardContent>
        </Card>

        {/* ── 6. FOOTER DISCLAIMER ──────────────────────────────────── */}
        <p className="text-xs text-muted-foreground text-center pb-2">
          Tax values shown are based on mock data for demonstration purposes only.
          All figures will be replaced with real client data in the production build.
        </p>

      </div>
    </DashboardLayout>
  );
}
