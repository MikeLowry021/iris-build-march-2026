import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Edit3,
  AlertTriangle,
  History,
  ArrowRight,
  CheckCircle,
  User,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  mockOverrideEntries,
  mockPendingSubmissions,
  OverrideEntry as OverrideEntryType,
  OverrideReason,
  mockAccountantProfile,
} from '@/lib/accountant-mock-data';
import { mockGLAccounts } from '@/lib/bookkeeper-mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const reasonLabels: Record<OverrideReason, string> = {
  'incorrect-categorization': 'Incorrect Categorization',
  'system-error': 'System Error',
  'tax-adjustment': 'Tax Adjustment',
  'bookkeeper-typo': 'Bookkeeper Typo',
  'other': 'Other',
};

export default function OverrideEntryPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [override, setOverride] = useState({
    clientId: '',
    transactionId: '',
    originalAccount: '',
    originalAmount: '',
    newAccount: '',
    newAmount: '',
    reason: '' as OverrideReason | '',
    notes: '',
  });

  const handleCreateOverride = () => {
    if (!override.clientId || !override.newAccount || !override.reason || !override.notes) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry Overridden',
      description: 'The transaction has been updated with an audit trail.',
    });
    setIsDialogOpen(false);
    setOverride({
      clientId: '',
      transactionId: '',
      originalAccount: '',
      originalAmount: '',
      newAccount: '',
      newAmount: '',
      reason: '',
      notes: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Override Entries</h1>
            <p className="text-muted-foreground">
              Correct transactions with full audit trail documentation
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit3 className="mr-2 h-4 w-4" />
                Create Override
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Override Entry</DialogTitle>
                <DialogDescription>
                  Correct a transaction entry with documented reason. This action is audited.
                </DialogDescription>
              </DialogHeader>

              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Caution</AlertTitle>
                <AlertDescription>
                  Overrides create a permanent audit trail. Only use when bookkeeper corrections are not possible.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select
                    value={override.clientId}
                    onValueChange={(v) => setOverride({ ...override, clientId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPendingSubmissions.map((s) => (
                        <SelectItem key={s.clientId} value={s.clientId}>
                          {s.clientCompany}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={override.transactionId}
                    onChange={(e) => setOverride({ ...override, transactionId: e.target.value })}
                    placeholder="e.g., t_001"
                  />
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-semibold mb-4">Original Entry</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Original Account</Label>
                        <Select
                          value={override.originalAccount}
                          onValueChange={(v) => setOverride({ ...override, originalAccount: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGLAccounts.map((acc) => (
                              <SelectItem key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Original Amount (R)</Label>
                        <Input
                          type="number"
                          value={override.originalAmount}
                          onChange={(e) => setOverride({ ...override, originalAmount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                    <h4 className="text-sm font-semibold mb-4">Corrected Entry</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>New Account *</Label>
                        <Select
                          value={override.newAccount}
                          onValueChange={(v) => setOverride({ ...override, newAccount: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGLAccounts.map((acc) => (
                              <SelectItem key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>New Amount (R)</Label>
                        <Input
                          type="number"
                          value={override.newAmount}
                          onChange={(e) => setOverride({ ...override, newAmount: e.target.value })}
                          placeholder={override.originalAmount || '0.00'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select
                    value={override.reason}
                    onValueChange={(v) => setOverride({ ...override, reason: v as OverrideReason })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reasonLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Detailed Explanation *</Label>
                  <Textarea
                    id="notes"
                    value={override.notes}
                    onChange={(e) => setOverride({ ...override, notes: e.target.value })}
                    placeholder="Provide a detailed explanation for this override..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOverride}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Apply Override
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Warning notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Override Policy</AlertTitle>
          <AlertDescription>
            Overrides should only be used when the bookkeeper cannot make corrections themselves.
            All overrides are permanently recorded in the audit trail with your name, timestamp, and reason.
          </AlertDescription>
        </Alert>

        {/* Override History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Override History
            </CardTitle>
            <CardDescription>
              Recent entries that have been overridden by accountants
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockOverrideEntries.length > 0 ? (
              <div className="space-y-4">
                {mockOverrideEntries.map((entry) => (
                  <div key={entry.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{entry.clientName}</h3>
                          <Badge variant="outline">
                            {reasonLabels[entry.reason]}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{entry.notes}</p>

                        {/* Change details */}
                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <div className="rounded bg-red-500/10 px-3 py-1.5 text-red-600">
                            <span className="font-mono">{entry.originalAccount}</span>
                            <span className="ml-2">R{entry.originalAmount.toLocaleString()}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="rounded bg-green-500/10 px-3 py-1.5 text-green-600">
                            <span className="font-mono">{entry.newAccount}</span>
                            <span className="ml-2">R{entry.newAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Audit info */}
                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.overriddenBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(entry.overriddenAt), 'dd MMM yyyy, HH:mm')}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Transaction: {entry.transactionId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Edit3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No override entries yet</p>
                <p className="text-sm text-muted-foreground">
                  Overrides will appear here when you correct transactions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
