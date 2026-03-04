// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CircleCheck as CheckCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type OpinionType = 'unmodified' | 'qualified' | 'adverse';

const opinionOptions: { value: OpinionType; label: string; description: string }[] = [
  { value: 'unmodified', label: 'Unmodified Opinion', description: 'Clean opinion — financials present fairly in all material respects' },
  { value: 'qualified', label: 'Qualified Opinion', description: 'Opinion with exception — specific matter is materially misstated' },
  { value: 'adverse', label: 'Adverse / Disclaimer', description: 'Financials do not present fairly or auditor is unable to obtain sufficient evidence' },
];

const opinionTexts: Record<OpinionType, string> = {
  unmodified: `To the shareholders of Delta Distributors (Pty) Ltd

Opinion
We have audited the financial statements of Delta Distributors (Pty) Ltd, which comprise the statement of financial position as at 28 February 2026, the statement of profit or loss, statement of changes in equity and statement of cash flows for the year then ended, and notes to the financial statements, including material accounting policy information.

In our opinion, the accompanying financial statements present fairly, in all material respects, the financial position of Delta Distributors (Pty) Ltd as at 28 February 2026, and its financial performance and cash flows for the year then ended in accordance with International Financial Reporting Standards.`,

  qualified: `To the shareholders of Delta Distributors (Pty) Ltd

Qualified Opinion
We have audited the financial statements of Delta Distributors (Pty) Ltd for the year ended 28 February 2026.

In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion section, the accompanying financial statements present fairly, in all material respects, the financial position of Delta Distributors (Pty) Ltd as at 28 February 2026 in accordance with International Financial Reporting Standards.

Basis for Qualified Opinion
[Describe the specific matter giving rise to the qualification here.]`,

  adverse: `To the shareholders of Delta Distributors (Pty) Ltd

Adverse Opinion / Disclaimer of Opinion
We have audited the financial statements of Delta Distributors (Pty) Ltd for the year ended 28 February 2026.

[Adverse] In our opinion, because of the significance of the matters described in the Basis for Adverse Opinion section, the accompanying financial statements do not present fairly the financial position of Delta Distributors (Pty) Ltd as at 28 February 2026 in accordance with International Financial Reporting Standards.

[Disclaimer] Because of the significance of the matters described in the Basis for Disclaimer of Opinion section, we have not been able to obtain sufficient appropriate audit evidence to provide a basis for an audit opinion on these financial statements.`,
};

export default function AuditOpinion() {
  const { toast } = useToast();
  const [selectedOpinion, setSelectedOpinion] = useState<OpinionType>('unmodified');
  const [opinionIssued, setOpinionIssued] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [queryOpen, setQueryOpen] = useState(false);

  const handleConfirmIssue = () => {
    setConfirmOpen(false);
    setOpinionIssued(true);
    toast({ title: 'Audit opinion issued successfully.' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Opinion</h1>
          <p className="text-sm text-muted-foreground">
            Delta Distributors (Pty) Ltd — Year ended 28 February 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opinion Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {opinionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedOpinion(opt.value)}
                className={cn(
                  'w-full rounded-lg border p-4 text-left transition-colors',
                  selectedOpinion === opt.value
                    ? 'border-foreground bg-muted'
                    : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-4 w-4 rounded-full border-2 flex-shrink-0',
                    selectedOpinion === opt.value
                      ? 'border-foreground bg-foreground'
                      : 'border-muted-foreground'
                  )} />
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Independent Auditor's Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-5 text-sm leading-relaxed whitespace-pre-line">
              {opinionTexts[selectedOpinion]}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auditor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Auditor</p>
                <p className="font-medium">P. van der Merwe (RA)</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Firm</p>
                <p className="font-medium">Van der Merwe Registered Auditors</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">IRBA Registration</p>
                <p className="font-medium font-mono text-xs">RA-2024-00421</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">04 March 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setQueryOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Raise Query
          </Button>
          {opinionIssued ? (
            <Button disabled className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Opinion Issued
            </Button>
          ) : (
            <Button onClick={() => setConfirmOpen(true)}>
              Issue Audit Opinion
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center pb-2">
          Audit opinion issuance is simulated in this demo. Real issuance requires
          IRBA-registered digital signature in production.
        </p>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Opinion Issuance</DialogTitle>
            <DialogDescription>
              You are about to issue an audit opinion for Delta Distributors (Pty) Ltd
              for the year ended 28 February 2026. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmIssue}>Confirm Issuance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={queryOpen} onOpenChange={setQueryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Query</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="Describe your query or concern..." rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setQueryOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setQueryOpen(false);
              toast({ title: 'Query raised successfully.' });
            }}>
              Submit Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
