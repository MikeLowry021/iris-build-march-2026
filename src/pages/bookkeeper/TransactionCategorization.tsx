import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CircleCheck as CheckCircle, Save, Users, Receipt, Info } from 'lucide-react';
import {
  mockBookkeeperClients,
  mockBookkeeperTransactions,
  mockGLAccounts,
  mockCategories,
  vatTreatmentOptions,
  getClientById,
} from '@/lib/bookkeeper-mock-data';
import { BookkeeperTransaction, VATTreatment } from '@/lib/bookkeeper-types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_GROUPS = [
  {
    group: 'Income',
    items: ['Cash Sale Income', 'EFT Received', 'Other Income'],
  },
  {
    group: 'Transfer',
    items: ['Transfer Between Own Accounts'],
    note: 'Transfers are not income — use for movements between your own accounts',
  },
  {
    group: 'Cost of Sales',
    items: ['Purchases', 'Commissions Paid'],
  },
  {
    group: 'Operating Expenses',
    items: [
      'Accounting Fees',
      'Advertising & Promotions',
      'Bank Charges',
      'Cleaning',
      'Computer Expenses',
      'Consulting Fees',
      'Electricity & Water',
      'Insurance',
      'Legal Fees',
      'Lease Rentals',
      'Motor Vehicle Expenses',
      'Printing & Stationery',
      'Repairs & Maintenance',
      'Security',
      'Staff Welfare',
      'Subscriptions',
      'Telephone & Fax',
      'Travel & Accommodation',
    ],
  },
  {
    group: 'Salary / Payroll',
    items: ["Salaries & Wages", "Director's Remuneration", 'Bonus', 'Commission'],
  },
  {
    group: 'Tax & Compliance',
    items: ['VAT Output', 'VAT Input', 'PAYE', 'Provisional Tax'],
  },
];

const SALARY_GROUP_ITEMS = new Set(
  CATEGORY_GROUPS.find(g => g.group === 'Salary / Payroll')?.items ?? []
);

export default function TransactionCategorization() {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const client = getClientById(clientId || '1');
  
  const [transactions, setTransactions] = useState<BookkeeperTransaction[]>(
    mockBookkeeperTransactions.filter(t => t.clientId === (clientId || '1'))
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<string>('');
  const [bulkGLAccount, setBulkGLAccount] = useState<string>('');
  const [bulkVAT, setBulkVAT] = useState<VATTreatment | ''>('');
  const [rowEmployeeNames, setRowEmployeeNames] = useState<Record<string, string>>({});

  const uncategorizedCount = useMemo(
    () => transactions.filter(t => t.status === 'uncategorized').length,
    [transactions]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(transactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleCategoryChange = (id: string, categoryName: string) => {
    const cat = mockCategories.find(c => c.name === categoryName);
    setTransactions(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              category: categoryName,
              glAccount: cat?.glAccountCode ?? t.glAccount,
              vatTreatment: cat?.defaultVAT ?? t.vatTreatment,
              status: 'categorized' as const,
            }
          : t
      )
    );
  };

  const handleGLAccountChange = (id: string, glAccount: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, glAccount } : t))
    );
  };

  const handleVATChange = (id: string, vatTreatment: VATTreatment) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, vatTreatment } : t))
    );
  };

  const handleBulkApply = () => {
    if (selectedIds.size === 0) {
      toast({ title: 'No transactions selected', variant: 'destructive' });
      return;
    }

    const cat = mockCategories.find(c => c.name === bulkCategory);
    setTransactions(prev =>
      prev.map(t =>
        selectedIds.has(t.id)
          ? {
              ...t,
              category: bulkCategory || t.category,
              glAccount: bulkGLAccount || cat?.glAccountCode || t.glAccount,
              vatTreatment: (bulkVAT || cat?.defaultVAT || t.vatTreatment) as VATTreatment,
              status: 'categorized' as const,
            }
          : t
      )
    );
    setSelectedIds(new Set());
    setBulkCategory('');
    setBulkGLAccount('');
    setBulkVAT('');
    toast({ title: `Updated ${selectedIds.size} transactions` });
  };

  const handleMarkAsReviewed = () => {
    const categorizedIds = transactions.filter(t => t.status === 'categorized').map(t => t.id);
    setTransactions(prev =>
      prev.map(t =>
        categorizedIds.includes(t.id) ? { ...t, status: 'reviewed' as const } : t
      )
    );
    toast({ title: 'Transactions marked as reviewed', description: 'Ready for accountant approval' });
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Left sidebar - Client list */}
        <Card className="hidden w-64 shrink-0 lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Assigned Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="space-y-1 p-2">
                {mockBookkeeperClients.map((c) => (
                  <Link
                    key={c.id}
                    to={`/bookkeeper/clients/${c.id}/categorize`}
                    className={cn(
                      'block rounded-lg p-3 transition-colors hover:bg-muted',
                      c.id === (clientId || '1') && 'bg-muted'
                    )}
                  >
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.company}</p>
                    {c.pendingTransactions > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        {c.pendingTransactions} pending
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main content - Transaction table */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction Categorization</CardTitle>
                <CardDescription>
                  {client?.company} — {uncategorizedCount} uncategorized transactions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleMarkAsReviewed}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Reviewed
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-muted p-3">
                <span className="text-sm font-medium">
                  {selectedIds.size} selected
                </span>
                <Separator orientation="vertical" className="h-6" />
                <Select value={bulkCategory} onValueChange={setBulkCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_GROUPS.map(group => (
                      <SelectGroup key={group.group}>
                        <SelectLabel>{group.group}</SelectLabel>
                        {group.items.map(item => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={bulkGLAccount} onValueChange={setBulkGLAccount}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="GL Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGLAccounts.map((acc) => (
                      <SelectItem key={acc.code} value={acc.code}>
                        {acc.code} - {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={bulkVAT} onValueChange={(v) => setBulkVAT(v as VATTreatment)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="VAT Treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {vatTreatmentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleBulkApply}>
                  Apply to Selected
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === transactions.length && transactions.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-28">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32 text-right">Amount</TableHead>
                    <TableHead className="w-40">Category</TableHead>
                    <TableHead className="w-48">GL Account</TableHead>
                    <TableHead className="w-36">VAT Treatment</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className={cn(
                        tx.status === 'uncategorized' && 'bg-warning/5'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(tx.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(tx.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {tx.date}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-mono',
                          tx.amount >= 0 ? 'text-success' : 'text-foreground'
                        )}
                      >
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Select
                            value={tx.category || ''}
                            onValueChange={(v) => handleCategoryChange(tx.id, v)}
                          >
                            <SelectTrigger className="h-8 min-w-[160px]">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_GROUPS.map(group => (
                                <SelectGroup key={group.group}>
                                  <SelectLabel>{group.group}</SelectLabel>
                                  {group.items.map(item => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                          {SALARY_GROUP_ITEMS.has(tx.category || '') && (
                            <Input
                              className="h-7 min-w-[160px] text-xs"
                              placeholder="Enter employee name"
                              value={rowEmployeeNames[tx.id] || ''}
                              onChange={e =>
                                setRowEmployeeNames(prev => ({
                                  ...prev,
                                  [tx.id]: e.target.value,
                                }))
                              }
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={tx.glAccount || ''}
                          onValueChange={(v) => handleGLAccountChange(tx.id, v)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGLAccounts.map((acc) => (
                              <SelectItem key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={tx.vatTreatment || ''}
                          onValueChange={(v) => handleVATChange(tx.id, v as VATTreatment)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {vatTreatmentOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === 'reviewed'
                              ? 'default'
                              : tx.status === 'categorized'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {tx.status === 'reviewed'
                            ? 'Reviewed'
                            : tx.status === 'categorized'
                            ? 'Categorized'
                            : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right sidebar - Quick reference */}
        <Card className="hidden w-72 shrink-0 xl:block">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">VAT Rates</h4>
                <div className="space-y-2">
                  {vatTreatmentOptions.map((opt) => (
                    <div key={opt.value} className="text-sm">
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Common GL Codes</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {mockGLAccounts.slice(0, 15).map((acc) => (
                      <div key={acc.code} className="text-sm">
                        <span className="font-mono text-primary">{acc.code}</span>
                        <span className="ml-2 text-muted-foreground">{acc.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
