import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { FileText, FileSpreadsheet, FileDown } from 'lucide-react';

/** Format number as "R 1 234 567" with space-separated thousands */
const fmt = (n: number): string => {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-ZA').replace(/,/g, ' ');
  return n < 0 ? `(R ${formatted})` : `R ${formatted}`;
};

// ─── Reusable table row components ───────────────────────────────────

function Row({ label, amount, bold, note, indent }: { label: string; amount?: number; bold?: boolean; note?: string; indent?: boolean }) {
  return (
    <tr className={bold ? 'font-bold' : ''}>
      <td className={`py-1.5 pr-4 ${indent ? 'pl-6' : ''}`}>
        {label}
        {note && <span className="text-muted-foreground text-xs ml-1">({note})</span>}
      </td>
      {amount !== undefined && <td className="py-1.5 text-right whitespace-nowrap">{fmt(amount)}</td>}
    </tr>
  );
}

function SeparatorRow({ double }: { double?: boolean }) {
  return (
    <tr>
      <td colSpan={2} className={`py-1 ${double ? 'border-t-2 border-b-2 border-foreground' : 'border-t border-border'}`} />
    </tr>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={2} className="pt-4 pb-2 text-xs font-bold uppercase tracking-wider bg-primary/10 px-2 rounded">
        {label}
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function FinancialStatements() {
  const handleExport = (format: string) => {
    toast.info(`Export to ${format} coming soon`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">

        {/* ── 1. COVER / HEADER ──────────────────────────────────────── */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Financial Statements</h1>
                <p className="text-lg font-semibold">Mokwena Trading (Pty) Ltd</p>
                <p className="text-sm text-muted-foreground">Registration No: 2020/123456/07</p>
              </div>
              <Badge className="bg-amber-500/90 text-white hover:bg-amber-500 self-start">DRAFT — MOCK DATA</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Financial Period</p>
                <p className="font-medium">Year ended 28 Feb 2026</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Prepared By</p>
                <p className="font-medium">Iris Accounting Services</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Accountant</p>
                <p className="font-medium">T. Dlamini (B.Compt, CA(SA))</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Banking Institution</p>
                <p className="font-medium">Capitec Business Bank</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 2. EXPORT ACTION BAR ───────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><FileDown className="h-4 w-4 mr-1.5" />Export to PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Word')}><FileText className="h-4 w-4 mr-1.5" />Export to Word</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}><FileSpreadsheet className="h-4 w-4 mr-1.5" />Export to Excel</Button>
        </div>

        {/* ── 3. STATEMENT OF PROFIT OR LOSS ─────────────────────────── */}
        {/* Gross Profit = 1 840 000 − 1 104 000 = 736 000
            PBT = 736 000 − 298 000 − 48 000 = 390 000
            Tax = 390 000 × 28% = 109 200
            PAT = 280 800 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statement of Profit or Loss</CardTitle>
            <p className="text-sm text-muted-foreground">For the year ended 28 February 2026</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <Row label="Revenue" amount={1840000} />
                <Row label="Cost of Sales" amount={-1104000} />
                <SeparatorRow />
                <Row label="Gross Profit" amount={736000} bold />
                <tr><td className="py-1" /></tr>
                <Row label="Operating Expenses" amount={-298000} />
                <Row label="Depreciation" amount={-48000} />
                <SeparatorRow />
                <Row label="Profit Before Tax" amount={390000} bold />
                <tr><td className="py-1" /></tr>
                <Row label="Income Tax Expense (28%)" amount={-109200} />
                <SeparatorRow />
                <Row label="Profit for the Year" amount={280800} bold />
                <SeparatorRow double />
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── 4. STATEMENT OF CHANGES IN EQUITY ──────────────────────── */}
        {/* Closing Equity = 100 000 + 540 800 = 640 800 ✓ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statement of Changes in Equity</CardTitle>
            <p className="text-sm text-muted-foreground">For the year ended 28 February 2026</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border font-bold text-xs uppercase tracking-wider">
                  <th className="py-2 text-left" />
                  <th className="py-2 text-right">Share Capital</th>
                  <th className="py-2 text-right">Retained Earnings</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1.5">Balance 1 Mar 2025</td>
                  <td className="py-1.5 text-right">{fmt(100000)}</td>
                  <td className="py-1.5 text-right">{fmt(340000)}</td>
                  <td className="py-1.5 text-right">{fmt(440000)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">Profit for the year</td>
                  <td className="py-1.5 text-right text-muted-foreground">—</td>
                  <td className="py-1.5 text-right">{fmt(280800)}</td>
                  <td className="py-1.5 text-right">{fmt(280800)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">Dividends declared</td>
                  <td className="py-1.5 text-right text-muted-foreground">—</td>
                  <td className="py-1.5 text-right">{fmt(-80000)}</td>
                  <td className="py-1.5 text-right">{fmt(-80000)}</td>
                </tr>
                <tr className="font-bold border-t-2 border-foreground">
                  <td className="py-1.5">Balance 28 Feb 2026</td>
                  <td className="py-1.5 text-right">{fmt(100000)}</td>
                  <td className="py-1.5 text-right">{fmt(540800)}</td>
                  <td className="py-1.5 text-right">{fmt(640800)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── 5. STATEMENT OF FINANCIAL POSITION ─────────────────────── */}
        {/* TOTAL ASSETS = 408 000 + 465 000 = 873 000
            TOTAL EQUITY & LIABILITIES = 640 800 + 172 200 + 60 000 = 873 000 ✓ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statement of Financial Position (Balance Sheet)</CardTitle>
            <p className="text-sm text-muted-foreground">As at 28 February 2026</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <SectionHeader label="Non-Current Assets" />
                <Row label="Property, Plant & Equipment" amount={384000} indent note="Note 1" />
                <Row label="Intangible Assets" amount={24000} indent note="Note 2" />
                <SeparatorRow />
                <Row label="Total Non-Current Assets" amount={408000} bold />

                <SectionHeader label="Current Assets" />
                <Row label="Inventory" amount={186000} indent note="Note 3" />
                <Row label="Trade Receivables" amount={162000} indent note="Note 4" />
                <Row label="Cash and Cash Equivalents" amount={117000} indent />
                <SeparatorRow />
                <Row label="Total Current Assets" amount={465000} bold />

                <SeparatorRow double />
                <Row label="TOTAL ASSETS" amount={873000} bold />
                <SeparatorRow double />

                <SectionHeader label="Equity" />
                <Row label="Share Capital" amount={100000} indent />
                <Row label="Retained Earnings" amount={540800} indent />
                <SeparatorRow />
                <Row label="Total Equity" amount={640800} bold />

                <SectionHeader label="Non-Current Liabilities" />
                <Row label="Long-term Loan" amount={160000} indent note="Note 5" />
                <Row label="Deferred Tax Liability" amount={12200} indent note="Note 6" />
                <SeparatorRow />
                <Row label="Total Non-Current Liabilities" amount={172200} bold />

                <SectionHeader label="Current Liabilities" />
                <Row label="Trade Payables" amount={36000} indent />
                <Row label="VAT Payable" amount={15000} indent />
                <Row label="Income Tax Payable" amount={9000} indent />
                <SeparatorRow />
                <Row label="Total Current Liabilities" amount={60000} bold />

                <SeparatorRow double />
                <Row label="TOTAL EQUITY AND LIABILITIES" amount={873000} bold />
                <SeparatorRow double />
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── 6. STATEMENT OF CASH FLOWS ─────────────────────────────── */}
        {/* Closing cash = 25 200 + 91 800 = 117 000 = SOFP cash ✓ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statement of Cash Flows</CardTitle>
            <p className="text-sm text-muted-foreground">For the year ended 28 February 2026 (Indirect Method)</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <SectionHeader label="Cash Flows from Operating Activities" />
                <Row label="Profit Before Tax" amount={390000} indent />
                <Row label="Add: Depreciation" amount={48000} indent />
                <Row label="Increase in Inventory" amount={-24000} indent />
                <Row label="Increase in Trade Receivables" amount={-18000} indent />
                <Row label="Increase in Trade Payables" amount={12000} indent />
                <SeparatorRow />
                <Row label="Cash Generated from Operations" amount={408000} bold />
                <Row label="Income Tax Paid" amount={-100200} indent />
                <SeparatorRow />
                <Row label="Net Cash from Operating Activities" amount={307800} bold />

                <SectionHeader label="Cash Flows from Investing Activities" />
                <Row label="Purchase of Equipment" amount={-96000} indent />
                <SeparatorRow />
                <Row label="Net Cash Used in Investing Activities" amount={-96000} bold />

                <SectionHeader label="Cash Flows from Financing Activities" />
                <Row label="Loan Repayment" amount={-40000} indent />
                <Row label="Dividends Paid" amount={-80000} indent />
                <SeparatorRow />
                <Row label="Net Cash from Financing Activities" amount={-120000} bold />

                <SeparatorRow />
                <Row label="Net Increase in Cash and Cash Equivalents" amount={91800} bold />
                <Row label="Cash at Beginning of Year" amount={25200} />
                <SeparatorRow double />
                <Row label="Cash at End of Year" amount={117000} bold />
                <SeparatorRow double />
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── 7. NOTES TO THE FINANCIAL STATEMENTS ───────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes to the Financial Statements</CardTitle>
            <p className="text-sm text-muted-foreground">The following notes form an integral part of these financial statements.</p>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="note-1">
                <AccordionTrigger className="text-sm">Note 1: Property, Plant and Equipment</AccordionTrigger>
                <AccordionContent>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-xs uppercase text-muted-foreground"><th className="py-1 text-left">Item</th><th className="py-1 text-right">Cost</th><th className="py-1 text-right">Acc. Depr.</th><th className="py-1 text-right">Carrying</th></tr></thead>
                    <tbody>
                      <tr><td className="py-1">Land & Buildings</td><td className="py-1 text-right">{fmt(200000)}</td><td className="py-1 text-right">{fmt(-40000)}</td><td className="py-1 text-right">{fmt(160000)}</td></tr>
                      <tr><td className="py-1">Equipment</td><td className="py-1 text-right">{fmt(320000)}</td><td className="py-1 text-right">{fmt(-96000)}</td><td className="py-1 text-right">{fmt(224000)}</td></tr>
                      <tr className="font-bold border-t"><td className="py-1">Total PPE</td><td /><td /><td className="py-1 text-right">{fmt(384000)}</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground mt-2">Depreciation method: Straight-line.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="note-2">
                <AccordionTrigger className="text-sm">Note 2: Intangible Assets</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">Accounting Software: Cost R 40 000 | Acc. Amortisation (R 16 000) | Carrying R 24 000</p>
                  <p className="text-xs text-muted-foreground mt-1">Amortised over 5 years.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="note-3">
                <AccordionTrigger className="text-sm">Note 3: Inventory</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">Finished Goods: R 186 000</p>
                  <p className="text-xs text-muted-foreground mt-1">Measured at lower of cost and net realisable value.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="note-4">
                <AccordionTrigger className="text-sm">Note 4: Trade Receivables</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">Gross Receivables: R 180 000</p>
                  <p className="text-sm">Allowance for Credit Losses: (R 18 000)</p>
                  <p className="text-sm font-medium">Net Trade Receivables: R 162 000</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="note-5">
                <AccordionTrigger className="text-sm">Note 5: Long-term Loan</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">Loan from Capitec Business Bank: R 160 000</p>
                  <p className="text-sm">Interest rate: 11.75% per annum. Repayable over 3 years from 1 March 2024.</p>
                  <p className="text-xs text-muted-foreground mt-1">Current portion: R 40 000 (reclassified to current liabilities). Non-current portion: R 160 000. For this mock, the full R 160 000 is shown as non-current for simplicity.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="note-6">
                <AccordionTrigger className="text-sm">Note 6: Deferred Tax</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">Arises from temporary differences between accounting and SARS tax depreciation rates.</p>
                  <p className="text-sm font-medium">Balance: R 12 200</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* ── 8. ANALYTICAL REVIEW ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytical Review</CardTitle>
            <p className="text-sm text-muted-foreground">Key Financial Ratios — Year ended 28 February 2026</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Gross Profit Margin', value: '40.0%', detail: 'For every R1 of revenue, R0.40 is retained after cost of sales.' },
                { name: 'Current Ratio', value: '7.75 : 1', detail: 'Strong short-term liquidity position.' },
                { name: 'Debt-to-Equity Ratio', value: '0.36', detail: 'Conservative financial leverage.' },
                { name: 'Net Profit Margin', value: '15.3%', detail: 'R0.15 of every R1.00 in revenue converts to net profit.' },
              ].map((m) => (
                <div key={m.name} className="rounded-lg border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">{m.name}</p>
                  <p className="text-2xl font-bold text-primary">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── 9. REVIEW & SIGN-OFF STATUS (STUB) ────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review & Sign-off Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { role: 'Bookkeeper Review', status: '✓ Submitted', color: 'bg-green-600' },
                { role: 'Accountant Review', status: '⏳ Pending', color: 'bg-amber-500' },
                { role: 'Independent Reviewer', status: '⏳ Not Assigned', color: 'bg-muted text-muted-foreground' },
                { role: 'Auditor', status: '⏳ Not Assigned', color: 'bg-muted text-muted-foreground' },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between text-sm">
                  <span>{r.role}</span>
                  <Badge className={`${r.color} text-white border-0`}>{r.status}</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Sign-off is managed by the assigned Accountant or Independent Reviewer. Actions will be available in a future release.</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-block">
                    <Button disabled>Submit for Sign-off</Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Available once Accountant review is complete.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* ── 10. Developer note ─────────────────────────────────────── */}
      </div>
    </DashboardLayout>
  );
}

// NOTE (2026-03-04):
// All figures on this page are illustrative mock data for Mokwena Trading (Pty) Ltd.
// Statement structure follows IFRS for SMEs / IAS 1 presentation order:
//   1. Statement of Profit or Loss
//   2. Statement of Changes in Equity
//   3. Statement of Financial Position
//   4. Statement of Cash Flows (Indirect Method)
//   5. Notes to the Financial Statements
//   6. Analytical Review (key ratios)
// Sign-off panel and export functions are UI stubs pending future Supabase integration.
// Independent Reviewer and Auditor sign-off to be wired in a future role-expansion sprint.
// Cross-checks: Assets = Equity + Liabilities = R873,000; Closing cash = R117,000; Closing equity = R640,800
