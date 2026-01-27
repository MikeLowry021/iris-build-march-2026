import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  mockGLAccounts,
  mockAdjustingEntries,
  getClientById,
  getEntriesByClientId,
} from '@/lib/bookkeeper-mock-data';
import { AdjustingEntry, JournalLine } from '@/lib/bookkeeper-types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FormLine {
  id: string;
  accountCode: string;
  type: 'debit' | 'credit';
  amount: string;
}

export default function AdjustingEntries() {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const client = getClientById(clientId || '1');
  const existingEntries = getEntriesByClientId(clientId || '1');

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<FormLine[]>([
    { id: '1', accountCode: '', type: 'debit', amount: '' },
    { id: '2', accountCode: '', type: 'credit', amount: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const totalDebit = lines
    .filter(l => l.type === 'debit')
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const totalCredit = lines
    .filter(l => l.type === 'credit')
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleAddLine = () => {
    setLines(prev => [
      ...prev,
      { id: String(Date.now()), accountCode: '', type: 'debit', amount: '' },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) {
      toast({ title: 'Minimum 2 lines required', variant: 'destructive' });
      return;
    }
    setLines(prev => prev.filter(l => l.id !== id));
  };

  const handleLineChange = (id: string, field: keyof FormLine, value: string) => {
    setLines(prev =>
      prev.map(l => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!description.trim()) {
      newErrors.push('Description is required');
    }

    if (!date) {
      newErrors.push('Date is required');
    }

    const hasEmptyAccounts = lines.some(l => !l.accountCode);
    if (hasEmptyAccounts) {
      newErrors.push('All lines must have an account selected');
    }

    const hasEmptyAmounts = lines.some(l => !l.amount || parseFloat(l.amount) <= 0);
    if (hasEmptyAmounts) {
      newErrors.push('All lines must have a positive amount');
    }

    if (!isBalanced) {
      newErrors.push('Entry must balance (Debit = Credit)');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveDraft = () => {
    if (!validateForm()) {
      toast({ title: 'Please fix validation errors', variant: 'destructive' });
      return;
    }

    // In a real app, this would save to the backend
    toast({
      title: 'Entry saved as draft',
      description: 'The adjusting entry has been saved and is pending accountant approval.',
    });

    // Reset form
    setDescription('');
    setLines([
      { id: '1', accountCode: '', type: 'debit', amount: '' },
      { id: '2', accountCode: '', type: 'credit', amount: '' },
    ]);
    setErrors([]);
  };

  const getAccountName = (code: string): string => {
    return mockGLAccounts.find(a => a.code === code)?.name || '';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Adjusting Entries</h1>
          <p className="text-muted-foreground">
            {client?.company} — Create manual journal entries
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Entry form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Adjusting Entry</CardTitle>
              <CardDescription>
                Entries will be saved as drafts pending accountant approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Errors */}
              {errors.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Validation Errors</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-destructive">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Date and Description */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g., Depreciation for January 2026"
                  />
                </div>
              </div>

              <Separator />

              {/* Journal lines */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Journal Lines</Label>
                  <Button variant="outline" size="sm" onClick={handleAddLine}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Line
                  </Button>
                </div>

                <div className="space-y-3">
                  {lines.map((line, index) => (
                    <div
                      key={line.id}
                      className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_120px_120px_40px]"
                    >
                      <Select
                        value={line.accountCode}
                        onValueChange={v => handleLineChange(line.id, 'accountCode', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGLAccounts.map(acc => (
                            <SelectItem key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={line.type}
                        onValueChange={v =>
                          handleLineChange(line.id, 'type', v as 'debit' | 'credit')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debit">Debit</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Amount"
                        value={line.amount}
                        onChange={e => handleLineChange(line.id, 'amount', e.target.value)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLine(line.id)}
                        disabled={lines.length <= 2}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Debit: </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(totalDebit)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Credit: </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(totalCredit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBalanced ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium text-success">Balanced</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <span className="text-sm font-medium text-destructive">
                          Difference: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleSaveDraft} disabled={!isBalanced}>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            </CardContent>
          </Card>

          {/* Existing entries */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Entries</CardTitle>
              <CardDescription>
                Previously created adjusting entries for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {existingEntries.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No adjusting entries yet
                </div>
              ) : (
                <div className="space-y-4">
                  {existingEntries.map(entry => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{entry.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.date} • Created by {entry.createdBy}
                          </p>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>

                      <div className="mt-3 space-y-1">
                        {entry.entries.map(line => (
                          <div
                            key={line.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {line.accountCode} - {line.accountName}
                            </span>
                            <div className="flex gap-4">
                              <span className={cn('font-mono', line.debit > 0 && 'text-foreground')}>
                                {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                              </span>
                              <span className={cn('font-mono', line.credit > 0 && 'text-foreground')}>
                                {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {entry.status === 'draft' && (
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      )}

                      {entry.approvedBy && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Approved by {entry.approvedBy} on{' '}
                          {entry.approvedAt && format(new Date(entry.approvedAt), 'dd MMM yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
