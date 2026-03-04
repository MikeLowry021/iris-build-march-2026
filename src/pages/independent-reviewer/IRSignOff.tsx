// NOTE (2026-03-04):
// Independent Reviewer profile — mock data only.
// Review checklists and sign-off confirmation are UI simulations.
// Real digital sign-off, ISRE 2400 compliance workflows, and
// document storage are planned for the production phase.

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function IRSignOff() {
  const { toast } = useToast();
  const [signedOff, setSignedOff] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [queryOpen, setQueryOpen] = useState(false);

  const handleConfirmSignOff = () => {
    setConfirmOpen(false);
    setSignedOff(true);
    toast({
      title: 'Financial statements signed off successfully.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Sign-Off</h1>
          <p className="text-sm text-muted-foreground">
            Mokwena Trading (Pty) Ltd — Year ended 28 February 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Independent Review Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-5 text-sm leading-relaxed">
              Based on our review, which was conducted in accordance with the International
              Standard on Review Engagements (ISRE) 2400 (Revised), Engagements to Review
              Historical Financial Statements, nothing has come to our attention that causes
              us to believe that the financial statements of Mokwena Trading (Pty) Ltd for
              the year ended 28 February 2026 are not prepared, in all material respects,
              in accordance with the International Financial Reporting Standard for Small
              and Medium-sized Entities.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviewer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Reviewer Name</p>
                <p className="font-medium">Dr. N. Mthembu</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Firm</p>
                <p className="font-medium">Mthembu Review Services</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">04 March 2026</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Reference</p>
                <p className="font-medium font-mono text-xs">IR-2026-MOK-001</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setQueryOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Raise Query
          </Button>
          {signedOff ? (
            <Button disabled className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Signed Off
            </Button>
          ) : (
            <Button onClick={() => setConfirmOpen(true)}>
              Sign Off Financial Statements
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center pb-2">
          Sign-off functionality is simulated in this demo. Real sign-off will require
          digital signature integration in the production build.
        </p>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Sign-Off</DialogTitle>
            <DialogDescription>
              You are about to sign off the financial statements for Mokwena Trading (Pty)
              Ltd for the year ended 28 February 2026. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSignOff}>Confirm Sign-Off</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={queryOpen} onOpenChange={setQueryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Query</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Describe your query or concern..."
            rows={4}
          />
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
