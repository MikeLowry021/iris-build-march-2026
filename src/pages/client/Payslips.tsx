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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(payslip)}
                              disabled={payslip.status !== 'generated'}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              PDF
                            </Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
            <DialogDescription>
              {selectedPayslip?.employeeName} - {selectedPayslip?.month} {selectedPayslip?.year}
            </DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Pay</span>
                  <span className="font-medium">{formatZAR(selectedPayslip.grossPay)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm font-medium mb-2">Deductions</p>
                  {selectedPayslip.deductions.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{d.type}</span>
                      <span className="text-destructive">-{formatZAR(d.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Net Pay</span>
                  <span className="text-success">{formatZAR(selectedPayslip.netPay)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => handleDownload(selectedPayslip)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
