import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { mockPayslips, formatZAR, mockClientInfo } from '@/lib/client-mock-data';
import {
  Download,
  FileText,
  Users,
  Mail,
  Info,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Payslips() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPayslip, setSelectedPayslip] = useState<typeof mockPayslips[0] | null>(null);

  const filteredPayslips = selectedMonth === 'all' 
    ? mockPayslips 
    : mockPayslips.filter(p => `${p.month} ${p.year}` === selectedMonth);

  const uniqueMonths = [...new Set(mockPayslips.map(p => `${p.month} ${p.year}`))];

  const handleDownload = (payslip: typeof mockPayslips[0]) => {
    toast({
      title: 'Downloading Payslip',
      description: `${payslip.employeeName}_${payslip.month}${payslip.year}.pdf is being downloaded...`,
    });
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: 'Payslip has been downloaded successfully.',
      });
    }, 1000);
  };

  // Group payslips by employee
  const employees = [...new Set(mockPayslips.map(p => p.employeeName))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Payslips</h1>
            <p className="mt-1 text-muted-foreground">
              View and download employee payslips for {mockClientInfo.company}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* NOTE (2026-03-04): Transaction source banner links back to
            Transactions page. Row indicators are additive — existing detail
            modal and download logic are unchanged. */}
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              Salary transactions for this period have been categorized in your transaction ledger.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-4 shrink-0 text-primary border-primary/30 hover:bg-primary/10"
            onClick={() => navigate('/client/transactions')}
          >
            View in Transactions
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Employee Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map(employee => {
            const employeePayslips = mockPayslips.filter(p => p.employeeName === employee);
            const latestPayslip = employeePayslips[0];
            return (
              <Card key={employee}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{employee}</h3>
                      <p className="text-sm text-muted-foreground">
                        {employeePayslips.length} payslip(s) available
                      </p>
                      {latestPayslip && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Latest: {latestPayslip.month} {latestPayslip.year}</p>
                          <p className="text-sm font-medium">Net: {formatZAR(latestPayslip.netPay)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Payslip Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayslips.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No payslips found for the selected period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Gross Pay</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayslips.map(payslip => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                        <TableCell>{payslip.month} {payslip.year}</TableCell>
                        <TableCell className="text-right">{formatZAR(payslip.grossPay)}</TableCell>
                        <TableCell className="text-right font-medium">{formatZAR(payslip.netPay)}</TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={payslip.status === 'generated' ? 'complete' : 
                                    payslip.status === 'error' ? 'error' : 'pending'} 
                            showIcon={false}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {payslip.status === 'generated' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigate('/client/transactions')}
                                    >
                                      <Link2 className="h-4 w-4 text-primary" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Salary transaction recorded in transactions ledger</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayslip(payslip)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            {/* NOTE (2026-03-10): Download disabled — PDF generation in production phase */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={true}
                                      className="cursor-not-allowed opacity-50"
                                    >
                                      <Download className="mr-1 h-4 w-4" />
                                      PDF
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>PDF downloads will be enabled in the production build</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Missing a Payslip?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                If a payslip is missing or you need corrections, please contact your accountant:
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium">{mockClientInfo.assignedAccountant.name}</span>
                <br />
                <a href={`mailto:${mockClientInfo.assignedAccountant.email}`} className="text-primary hover:underline">
                  {mockClientInfo.assignedAccountant.email}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payslip Detail Dialog */}
      <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip</DialogTitle>
            <DialogDescription>
              {selectedPayslip?.employeeName} — {selectedPayslip?.month} {selectedPayslip?.year}
            </DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6 text-sm">

              {/* SECTION A — COMPANY HEADER */}
              <div className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded border bg-muted text-xs font-medium text-muted-foreground">
                  COMPANY LOGO
                </div>
                <div className="space-y-0.5">
                  <p className="text-base font-semibold">Iris Demo Accounting (Pty) Ltd</p>
                  <p className="text-muted-foreground">12 Church Street, Cape Town, 8001</p>
                  <p className="text-muted-foreground">Tax Number: 9876543210</p>
                  <p className="text-muted-foreground">Registration: 2019/123456/07</p>
                </div>
              </div>

              {/* SECTION B — EMPLOYEE DETAILS */}
              <div>
                <p className="mb-2 font-semibold text-foreground">Employee Details</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Employee Name</span>
                      <span className="font-medium">{selectedPayslip.employeeName}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Address</span>
                      <span>{selectedPayslip.employeeAddress ?? '45 Rose Street, Bellville, 7530'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">ID Number</span>
                      <span>{selectedPayslip.idNumber ?? '8801015800080'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Tax Number</span>
                      <span>{selectedPayslip.taxNumber ?? '1234567890'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Start Date</span>
                      <span>{selectedPayslip.employmentStartDate ?? '01 March 2021'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Employee No.</span>
                      <span>{selectedPayslip.employeeNumber ?? 'EMP-001'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Department</span>
                      <span>{selectedPayslip.department ?? 'Accounting'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Pay Period</span>
                      <span>{selectedPayslip.month} {selectedPayslip.year}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Pay Date</span>
                      <span>{selectedPayslip.payDate ?? `28 ${selectedPayslip.month} ${selectedPayslip.year}`}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Bank</span>
                      <span>{selectedPayslip.bank ?? 'First National Bank'}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-36 shrink-0 text-muted-foreground">Account</span>
                      <span>{selectedPayslip.accountNumber ?? '62XXXXXXX910'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C — EARNINGS TABLE */}
              <div>
                <p className="mb-2 font-semibold text-foreground">Earnings</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Current Month</TableHead>
                      <TableHead className="text-right">YTD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell className="text-right">{formatZAR(selectedPayslip.grossPay)}</TableCell>
                      <TableCell className="text-right">{formatZAR(selectedPayslip.grossPay * 9)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Director's Remuneration</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bonus</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                      <TableCell className="text-right">{formatZAR(Math.round(selectedPayslip.grossPay * 0.5))}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Commission</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Overtime</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                      <TableCell className="text-right">{formatZAR(0)}</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 font-semibold">
                      <TableCell>Gross Earnings</TableCell>
                      <TableCell className="text-right">{formatZAR(selectedPayslip.grossPay)}</TableCell>
                      <TableCell className="text-right">{formatZAR(selectedPayslip.grossPay * 9 + Math.round(selectedPayslip.grossPay * 0.5))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* SECTION D — DEDUCTIONS TABLE */}
              <div>
                <p className="mb-2 font-semibold text-foreground">Deductions</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Current Month</TableHead>
                      <TableHead className="text-right">YTD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPayslip.deductions.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell>{d.type}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatZAR(d.amount)}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatZAR(d.amount * 9)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-semibold">
                      <TableCell>Total Deductions</TableCell>
                      <TableCell className="text-right text-destructive">
                        -{formatZAR(selectedPayslip.deductions.reduce((s, d) => s + d.amount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        -{formatZAR(selectedPayslip.deductions.reduce((s, d) => s + d.amount, 0) * 9)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* SECTION E — NET PAY SUMMARY */}
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gross Earnings</span>
                  <span>{formatZAR(selectedPayslip.grossPay)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Total Deductions</span>
                  <span className="text-destructive">-{formatZAR(selectedPayslip.deductions.reduce((s, d) => s + d.amount, 0))}</span>
                </div>
                <div className="mt-3 flex justify-between border-t pt-3">
                  <span className="text-xl font-bold">NET PAY</span>
                  <span className="text-xl font-bold text-primary">{formatZAR(selectedPayslip.netPay)}</span>
                </div>
              </div>

              {/* SECTION F — CUMULATIVE YTD SUMMARY */}
              <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Year to Date Summary</p>
                <div className="flex gap-8">
                  <span>YTD Gross: <span className="font-medium text-foreground">{formatZAR(selectedPayslip.grossPay * 9 + Math.round(selectedPayslip.grossPay * 0.5))}</span></span>
                  <span>YTD Tax Paid: <span className="font-medium text-foreground">{formatZAR(selectedPayslip.deductions.find(d => d.type === 'PAYE')?.amount ?? 0 * 9)}</span></span>
                  <span>YTD Net: <span className="font-medium text-foreground">{formatZAR(selectedPayslip.netPay * 9)}</span></span>
                </div>
              </div>

              {/* SECTION G — FOOTER */}
              <div className="space-y-3">
                <p className="text-center text-xs text-muted-foreground">
                  This payslip is computer generated and valid without a signature. | Generated by Iris
                </p>
                {/* NOTE (2026-03-19): Download disabled — PDF generation in production phase */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full">
                        <Button className="w-full cursor-not-allowed opacity-50" disabled={true}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>PDF export enabled in production build</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
