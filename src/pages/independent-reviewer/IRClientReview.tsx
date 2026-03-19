// NOTE (2026-03-04):
// Independent Reviewer profile — mock data only.
// Review checklists and sign-off confirmation are UI simulations.
// Real digital sign-off, ISRE 2400 compliance workflows, and
// document storage are planned for the production phase.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { ArrowRight, CircleCheck as CheckCircle } from 'lucide-react';

const analyticalRows = [
  { item: 'Revenue', current: 'R4,600,000', prior: 'R4,100,000', movement: '+12.2%' },
  { item: 'Gross Profit %', current: '36.96%', prior: '35.40%', movement: '+1.56%' },
  { item: 'Operating Costs', current: 'R1,240,000', prior: 'R1,180,000', movement: '+5.1%' },
  { item: 'Profit Before Tax', current: 'R460,000', prior: 'R390,000', movement: '+17.9%' },
  { item: 'Total Assets', current: 'R5,582,000', prior: 'R5,100,000', movement: '+9.5%' },
];

const ratios = [
  {
    label: 'Gross Profit Margin',
    value: '36.96%',
    benchmark: '30–40%',
    verdict: 'Within range',
    explanation: 'Revenue remaining after cost of goods sold. Higher % = stronger core trading profitability.',
  },
  {
    label: 'Current Ratio',
    value: '2.04:1',
    benchmark: '>1.5',
    verdict: 'Adequate',
    explanation: 'Measures ability to pay short-term obligations. Above 1.5 is healthy; below 1.0 is a warning.',
  },
  {
    label: 'Debt-to-Equity',
    value: '0.78',
    benchmark: '<1.5',
    verdict: 'Low leverage',
    explanation: 'How much the business owes vs. what owners own. Below 2.0 is generally acceptable.',
  },
  {
    label: 'Return on Equity',
    value: '17.89%',
    benchmark: '>10%',
    verdict: 'Strong',
    explanation: 'Profit generated per rand of shareholder equity. Higher = better use of owner investment.',
  },
];

const enquiryQuestions = [
  'Have there been any significant changes in the business during the year?',
  'Are there any contingent liabilities not reflected in the financial statements?',
  'Has the entity complied with all applicable laws and regulations?',
  'Are there any subsequent events after the reporting date that require disclosure?',
  'Has management reviewed and approved the financial statements?',
];

const docLabels = [
  'Trial balance reviewed',
  'Bank reconciliation reviewed',
  'Fixed asset register reviewed',
  'Loan schedule reviewed',
  'Tax calculation reviewed',
  'Adjusting journals reviewed',
];

export default function IRClientReview() {
  const [analyticalChecked, setAnalyticalChecked] = useState<boolean[]>(
    new Array(analyticalRows.length).fill(false)
  );
  const [enquiryAnswers, setEnquiryAnswers] = useState<(boolean | null)[]>(
    new Array(enquiryQuestions.length).fill(null)
  );
  const [docChecked, setDocChecked] = useState<boolean[]>(
    new Array(docLabels.length).fill(false)
  );

  const docsReviewed = docChecked.filter(Boolean).length;

  const toggleAnalytical = (idx: number) => {
    setAnalyticalChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const toggleEnquiry = (idx: number, val: boolean) => {
    setEnquiryAnswers((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const toggleDoc = (idx: number) => {
    setDocChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Client Review — Mokwena Trading (Pty) Ltd
          </h1>
          <p className="text-sm text-muted-foreground">
            Year ended 28 February 2026 | Prepared by T. Dlamini (CA)SA
          </p>
        </div>

        {/* SECTION A */}
        <Card>
          <CardHeader>
            <CardTitle>Section A — Analytical Procedures</CardTitle>
            <CardDescription>
              Compare current year figures against prior year and identify unusual movements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Current Year</TableHead>
                  <TableHead className="text-right">Prior Year</TableHead>
                  <TableHead className="text-right">Movement</TableHead>
                  <TableHead className="text-center w-[80px]">Reviewed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticalRows.map((row, idx) => (
                  <TableRow key={row.item}>
                    <TableCell className="font-medium">{row.item}</TableCell>
                    <TableCell className="text-right">{row.current}</TableCell>
                    <TableCell className="text-right">{row.prior}</TableCell>
                    <TableCell className="text-right">{row.movement}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={analyticalChecked[idx]}
                        onCheckedChange={() => toggleAnalytical(idx)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <Label className="text-sm text-muted-foreground">Reviewer notes on analytical procedures</Label>
              <Textarea
                placeholder="Enter observations on material movements, unusual trends, or items requiring further enquiry..."
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION B */}
        <Card>
          <CardHeader>
            <CardTitle>Section B — Key Ratio Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {ratios.map((r) => (
                <div key={r.label} className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">{r.label}</p>
                  <p className="text-2xl font-bold">{r.value}</p>
                  <p className="text-xs text-muted-foreground">{r.explanation}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Benchmark: {r.benchmark}</span>
                    <Badge className="bg-green-600 text-white border-0 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {r.verdict}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION C */}
        <Card>
          <CardHeader>
            <CardTitle>Section C — Management Enquiry</CardTitle>
            <CardDescription>
              Document responses to standard enquiry questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {enquiryQuestions.map((q, idx) => (
              <div key={idx} className="space-y-2 rounded-lg border p-4">
                <p className="text-sm font-medium">
                  {idx + 1}. {q}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={enquiryAnswers[idx] === true}
                      onCheckedChange={(checked) => toggleEnquiry(idx, checked)}
                    />
                    <Label className="text-sm">
                      {enquiryAnswers[idx] === true ? 'Yes' : enquiryAnswers[idx] === false ? 'No' : 'Yes / No'}
                    </Label>
                  </div>
                </div>
                <Textarea placeholder="Notes..." className="mt-1" rows={2} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION D */}
        <Card>
          <CardHeader>
            <CardTitle>Section D — Supporting Documentation Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {docLabels.map((label, idx) => (
                <div key={label} className="flex items-center gap-3">
                  <Checkbox
                    checked={docChecked[idx]}
                    onCheckedChange={() => toggleDoc(idx)}
                  />
                  <Label className="text-sm cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Documents reviewed</span>
                <span className="font-medium">{docsReviewed} / {docLabels.length}</span>
              </div>
              <Progress value={(docsReviewed / docLabels.length) * 100} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild>
            <Link to="/independent-reviewer/sign-off">
              Proceed to Sign-Off
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
