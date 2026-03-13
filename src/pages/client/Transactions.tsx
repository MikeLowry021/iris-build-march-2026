import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { mockTransactions, formatCurrency } from '@/lib/mock-data';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

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

const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap(g => g.items);

const SALARY_GROUP_ITEMS = new Set(
  CATEGORY_GROUPS.find(g => g.group === 'Salary / Payroll')?.items ?? []
);

export default function Transactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [rowCategories, setRowCategories] = useState<Record<string, string>>({});
  const [rowEmployeeNames, setRowEmployeeNames] = useState<Record<string, string>>({});

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const salaryTransactions = filteredTransactions.filter(
    t => t.category && SALARY_GROUP_ITEMS.has(t.category)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Transactions</h1>
            <p className="mt-1 text-muted-foreground">
              View and categorize your imported transactions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
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
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
              <SelectItem value="categorized">Categorized</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {salaryTransactions.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">{salaryTransactions.length}</span> salary transaction{salaryTransactions.length !== 1 ? 's' : ''} this period — view payslips for full deduction breakdown
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 shrink-0 text-primary border-primary/30 hover:bg-primary/10"
              onClick={() => navigate('/client/payslips')}
            >
              Go to Payslips
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="status-card">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="mt-1 text-2xl font-bold text-success">
              {formatCurrency(
                mockTransactions
                  .filter(t => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="status-card">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="mt-1 text-2xl font-bold text-destructive">
              {formatCurrency(
                mockTransactions
                  .filter(t => t.amount < 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="status-card">
            <p className="text-sm text-muted-foreground">Uncategorized</p>
            <p className="mt-1 text-2xl font-bold text-warning">
              {mockTransactions.filter(t => t.status === 'uncategorized').length}
            </p>
          </div>
        </div>

        {/* Transaction table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map(transaction => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            transaction.amount > 0
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {transaction.category ? (
                        <div className="space-y-1">
                          <span className="text-sm text-foreground">
                            {transaction.category}
                          </span>
                          {SALARY_GROUP_ITEMS.has(transaction.category) && (
                            <Input
                              className="h-7 w-40 text-xs"
                              placeholder="Enter employee name"
                              value={rowEmployeeNames[transaction.id] || ''}
                              onChange={e =>
                                setRowEmployeeNames(prev => ({
                                  ...prev,
                                  [transaction.id]: e.target.value,
                                }))
                              }
                            />
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Select
                            value={rowCategories[transaction.id] || ''}
                            onValueChange={val =>
                              setRowCategories(prev => ({ ...prev, [transaction.id]: val }))
                            }
                          >
                            <SelectTrigger className="h-8 w-44">
                              <SelectValue placeholder="Categorize" />
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
                          {SALARY_GROUP_ITEMS.has(rowCategories[transaction.id] || '') && (
                            <Input
                              className="h-7 w-44 text-xs"
                              placeholder="Enter employee name"
                              value={rowEmployeeNames[transaction.id] || ''}
                              onChange={e =>
                                setRowEmployeeNames(prev => ({
                                  ...prev,
                                  [transaction.id]: e.target.value,
                                }))
                              }
                            />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-success' : 'text-foreground'
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <StatusBadge status={transaction.status} />
                        {transaction.category && SALARY_GROUP_ITEMS.has(transaction.category) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => navigate('/client/payslips')}
                                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  View Payslip
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View related payslip</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredTransactions.length}</span> of{' '}
              <span className="font-medium">{filteredTransactions.length}</span> results
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
