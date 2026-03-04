// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

const riskItems = [
  'Entity and environment understood',
  'Internal controls assessed',
  'Fraud risk factors considered',
  'Going concern assessment completed',
  'Materiality threshold set (mock: R279,100 — 0.5% of revenue)',
];

const substantiveRows = [
  { area: 'Revenue', procedure: 'Trace to invoices & bank', sample: '25 items', status: 'Complete', complete: true },
  { area: 'Trade Debtors', procedure: 'Debtor confirmation letters', sample: '15 items', status: 'In Progress', complete: false },
  { area: 'PPE', procedure: 'Physical inspection', sample: 'All items', status: 'Complete', complete: true },
  { area: 'Trade Creditors', procedure: 'Supplier statement recon', sample: '20 items', status: 'In Progress', complete: false },
  { area: 'Bank', procedure: 'Bank confirmation received', sample: 'N/A', status: 'Complete', complete: true },
];

const analyticalCards = [
  { label: 'Gross Profit Margin', value: '37.5%', priorLabel: 'Prior Year', prior: '35.4%', movLabel: 'Movement', mov: '+2.1%' },
  { label: 'Current Ratio', value: '1.9:1', priorLabel: 'Prior Year', prior: '2.1:1', movLabel: 'Movement', mov: '-0.2' },
  { label: 'Debt-to-Equity', value: '0.65', priorLabel: 'Prior Year', prior: '0.71', movLabel: 'Movement', mov: '-0.06' },
  { label: 'Revenue Growth', value: '+11.5%', priorLabel: 'Prior Year', prior: '+8.2%', movLabel: 'Trend', mov: 'Consistent' },
];

const completionLabels = [
  'All workpapers completed and reviewed',
  'Misstatements evaluated and resolved',
  'Subsequent events reviewed',
  'Management representation letter received',
  'Engagement quality control review completed',
  'Financial statements agreed to final signed version',
];

export default function ClientAudit() {
  const [riskChecked, setRiskChecked] = useState<boolean[]>(new Array(riskItems.length).fill(false));
  const [completionChecked, setCompletionChecked] = useState<boolean[]>(new Array(completionLabels.length).fill(false));

  const toggleRisk = (idx: number) => {
    setRiskChecked((prev) => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  };

  const toggleCompletion = (idx: number) => {
    setCompletionChecked((prev) => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  };

  const completedCount = completionChecked.filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Audit Engagement — Delta Distributors (Pty) Ltd
          </h1>
          <p className="text-sm text-muted-foreground">
            Year ended 28 February 2026 | Statutory Audit | PIS: 290
          </p>
        </div>

        {/* SECTION A */}
        <Card>
          <CardHeader>
            <CardTitle>Section A — Risk Assessment</CardTitle>
            <CardDescription>
              Identify and assess risks of material misstatement at the financial statement and assertion level.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskItems.map((item, idx) => (
              <div key={item} className="flex items-start gap-3">
                <Checkbox
                  checked={riskChecked[idx]}
                  onCheckedChange={() => toggleRisk(idx)}
                  className="mt-0.5"
                />
                <Label className="text-sm leading-snug cursor-pointer">{item}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION B */}
        <Card>
          <CardHeader>
            <CardTitle>Section B — Substantive Testing</CardTitle>
            <CardDescription>
              Testing of transactions, balances, and disclosures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Sample Size</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {substantiveRows.map((row) => (
                  <TableRow key={row.area}>
                    <TableCell className="font-medium">{row.area}</TableCell>
                    <TableCell>{row.procedure}</TableCell>
                    <TableCell>{row.sample}</TableCell>
                    <TableCell>
                      {row.complete ? (
                        <Badge className="bg-green-600 text-white border-0 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white border-0 gap-1">
                          <Clock className="h-3 w-3" />
                          In Progress
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* SECTION C */}
        <Card>
          <CardHeader>
            <CardTitle>Section C — Final Analytical Procedures</CardTitle>
            <CardDescription>
              Overall review of financial statements before forming opinion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {analyticalCards.map((c) => (
                <div key={c.label} className="rounded-lg border p-4 space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold">{c.value}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{c.priorLabel}: {c.prior}</span>
                    <span>{c.movLabel}: {c.mov}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION D */}
        <Card>
          <CardHeader>
            <CardTitle>Section D — Engagement Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {completionLabels.map((label, idx) => (
                <div key={label} className="flex items-start gap-3">
                  <Checkbox
                    checked={completionChecked[idx]}
                    onCheckedChange={() => toggleCompletion(idx)}
                    className="mt-0.5"
                  />
                  <Label className="text-sm leading-snug cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion items</span>
                <span className="font-medium">{completedCount} / {completionLabels.length}</span>
              </div>
              <Progress value={(completedCount / completionLabels.length) * 100} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild>
            <Link to="/auditor/audit-opinion">
              Proceed to Audit Opinion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
