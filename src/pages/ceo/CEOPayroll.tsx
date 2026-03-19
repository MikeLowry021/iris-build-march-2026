import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DollarSign, FileText, Send, Check, Download, ChevronDown, CreditCard as Edit, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { mockCEOPayroll, mockCEOPayrollHistory } from '@/lib/ceo-mock-data';
import {
  formatCurrency,
  getPayrollStatusLabel,
  getEmploymentTypeLabel,
  CEOPayrollEmployee,
} from '@/lib/ceo-types';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CEOPayroll = () => {
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState(mockCEOPayroll);
  const [selectedMonth, setSelectedMonth] = useState(payroll.month);
  const [selectedYear, setSelectedYear] = useState(payroll.year);
  const [editingEmployee, setEditingEmployee] = useState<CEOPayrollEmployee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<CEOPayrollEmployee | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'pending_approval':
        return 'default';
      case 'approved':
      case 'processed':
      case 'paid':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleEditEmployee = (employee: CEOPayrollEmployee) => {
    setEditingEmployee({ ...employee });
  };

  const handleSaveEmployee = () => {
    if (!editingEmployee) return;

    const updatedEmployees = payroll.employees.map((emp) =>
      emp.employeeId === editingEmployee.employeeId ? editingEmployee : emp
    );

    const totalGross = updatedEmployees.reduce((sum, emp) => sum + emp.gross, 0);
    const totalDeductions = updatedEmployees.reduce(
      (sum, emp) => sum + emp.paye + emp.uif + emp.sdl + emp.deductionAmount,
      0
    );
    const totalNet = updatedEmployees.reduce((sum, emp) => sum + emp.net, 0);

    setPayroll({
      ...payroll,
      employees: updatedEmployees,
      totalGross,
      totalDeductions,
      totalNet,
    });

    setEditingEmployee(null);
    toast.success('Employee payroll updated');
  };

  const handleReviewConfirm = () => {
    setPayroll({ ...payroll, status: 'pending_approval' });
    toast.success('Payroll submitted for review');
  };

  const handleGeneratePayslips = () => {
    toast.success('Payslips generated successfully');
  };

  const handleExportToBank = () => {
    toast.success('Bank export file downloaded');
  };

  const handleSubmitToAccountant = () => {
    setPayroll({ ...payroll, status: 'pending_approval', submittedAt: new Date().toISOString() });
    toast.success('Payroll submitted to accountant for verification');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Payroll Processing</h1>
            <p className="text-muted-foreground">Manage employee wages and deductions</p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={idx} value={(idx + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payroll Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {months[payroll.month - 1]} {payroll.year} Payroll
                </CardTitle>
                <CardDescription>
                  {payroll.employees.length} employees
                </CardDescription>
              </div>
              <Badge variant={getStatusColor(payroll.status)}>
                {getPayrollStatusLabel(payroll.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Gross Payroll</p>
                <p className="text-2xl font-bold">{formatCurrency(payroll.totalGross)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(payroll.totalDeductions)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Net Payroll</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(payroll.totalNet)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Employer Contributions</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    payroll.employees.reduce((sum, emp) => sum + emp.uif + emp.sdl, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Payroll Details</CardTitle>
            <CardDescription>Click on an employee to edit their payroll details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Bonus/Ded</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">PAYE</TableHead>
                    <TableHead className="text-right">UIF</TableHead>
                    <TableHead className="text-right">SDL</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.employees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getEmploymentTypeLabel(employee.employmentType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(employee.baseSalary)}</TableCell>
                      <TableCell className="text-right">{employee.hoursWorked}</TableCell>
                      <TableCell className="text-right">
                        {employee.bonus > 0 && (
                          <span className="text-success">+{formatCurrency(employee.bonus)}</span>
                        )}
                        {employee.deductionAmount > 0 && (
                          <span className="text-destructive">-{formatCurrency(employee.deductionAmount)}</span>
                        )}
                        {employee.bonus === 0 && employee.deductionAmount === 0 && '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(employee.gross)}</TableCell>
                      <TableCell className="text-right text-destructive">{formatCurrency(employee.paye)}</TableCell>
                      <TableCell className="text-right text-destructive">{formatCurrency(employee.uif)}</TableCell>
                      <TableCell className="text-right text-destructive">{formatCurrency(employee.sdl)}</TableCell>
                      <TableCell className="text-right font-medium text-success">{formatCurrency(employee.net)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEmployee(employee)}
                            disabled={payroll.status !== 'draft'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setViewingEmployee(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleReviewConfirm} disabled={payroll.status !== 'draft'}>
                <Check className="mr-2 h-4 w-4" />
                Review & Confirm
              </Button>
              <Button variant="outline" onClick={handleGeneratePayslips}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Payslips
              </Button>
              <Button variant="outline" onClick={handleExportToBank}>
                <Download className="mr-2 h-4 w-4" />
                Export to Bank
              </Button>
              <Button
                variant="outline"
                onClick={handleSubmitToAccountant}
                disabled={payroll.status !== 'draft'}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit to Accountant
              </Button>
              {payroll.status === 'approved' && (
                <Button variant="default">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Approve & Process
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payroll History */}
        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <CardTitle>Payroll History</CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-3">
                  {mockCEOPayrollHistory.map((period) => (
                    <div
                      key={period.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {months[period.month - 1]} {period.year}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Paid {formatCurrency(period.totalNet)} (Net)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default">
                          {getPayrollStatusLabel(period.status)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Payroll - {editingEmployee?.employeeName}</DialogTitle>
              <DialogDescription>
                Modify payroll details for this pay period
              </DialogDescription>
            </DialogHeader>
            {editingEmployee && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base Salary</Label>
                    <Input
                      type="number"
                      value={editingEmployee.baseSalary}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hours Worked</Label>
                    <Input
                      type="number"
                      value={editingEmployee.hoursWorked}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          hoursWorked: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bonus</Label>
                    <Input
                      type="number"
                      value={editingEmployee.bonus}
                      onChange={(e) => {
                        const bonus = parseFloat(e.target.value) || 0;
                        const gross = editingEmployee.baseSalary + bonus;
                        const paye = gross * 0.12;
                        const uif = gross * 0.01;
                        const sdl = gross * 0.005;
                        const net = gross - paye - uif - sdl - editingEmployee.deductionAmount;
                        setEditingEmployee({
                          ...editingEmployee,
                          bonus,
                          gross,
                          paye,
                          uif,
                          sdl,
                          net,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deduction Amount</Label>
                    <Input
                      type="number"
                      value={editingEmployee.deductionAmount}
                      onChange={(e) => {
                        const deductionAmount = parseFloat(e.target.value) || 0;
                        const net = editingEmployee.gross - editingEmployee.paye - editingEmployee.uif - editingEmployee.sdl - deductionAmount;
                        setEditingEmployee({
                          ...editingEmployee,
                          deductionAmount,
                          net,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deduction Description</Label>
                  <Input
                    value={editingEmployee.deductionDescription || ''}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        deductionDescription: e.target.value,
                      })
                    }
                    placeholder="e.g., Loan repayment"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editingEmployee.notes || ''}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Any notes about this payroll"
                  />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>Gross:</span>
                    <span className="text-right font-medium">{formatCurrency(editingEmployee.gross)}</span>
                    <span>PAYE:</span>
                    <span className="text-right text-destructive">{formatCurrency(editingEmployee.paye)}</span>
                    <span>UIF:</span>
                    <span className="text-right text-destructive">{formatCurrency(editingEmployee.uif)}</span>
                    <span>SDL:</span>
                    <span className="text-right text-destructive">{formatCurrency(editingEmployee.sdl)}</span>
                    <span className="font-medium">Net:</span>
                    <span className="text-right font-medium text-success">{formatCurrency(editingEmployee.net)}</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEmployee}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payslip Detail Dialog */}
        <Dialog open={!!viewingEmployee} onOpenChange={() => setViewingEmployee(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payslip</DialogTitle>
              <DialogDescription>
                {viewingEmployee?.employeeName} — {months[payroll.month - 1]} {payroll.year}
              </DialogDescription>
            </DialogHeader>
            {viewingEmployee && (
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
                        <span className="font-medium">{viewingEmployee.employeeName}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Address</span>
                        <span>45 Rose Street, Bellville, 7530</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">ID Number</span>
                        <span>8801015800080</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Tax Number</span>
                        <span>1234567890</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Start Date</span>
                        <span>01 March 2021</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Employee No.</span>
                        <span>{viewingEmployee.employeeId}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Department</span>
                        <span>{viewingEmployee.position}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Pay Period</span>
                        <span>{months[payroll.month - 1]} {payroll.year}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Pay Date</span>
                        <span>28 {months[payroll.month - 1]} {payroll.year}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Bank</span>
                        <span>First National Bank</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-36 shrink-0 text-muted-foreground">Account</span>
                        <span>62XXXXXXX910</span>
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
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.baseSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.baseSalary * 9)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Director's Remuneration</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bonus</TableCell>
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.bonus)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.bonus)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Commission</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow className="border-t-2 font-semibold">
                        <TableCell>Gross Earnings</TableCell>
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.gross)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(viewingEmployee.gross * 9 + viewingEmployee.bonus)}</TableCell>
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
                      <TableRow>
                        <TableCell>PAYE Income Tax</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.paye)}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.paye * 9)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>UIF (Employee 1%)</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.uif)}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.uif * 9)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SDL (Employer 1%)</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.sdl)}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.sdl * 9)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medical Aid</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.deductionAmount)}</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(viewingEmployee.deductionAmount * 9)}</TableCell>
                      </TableRow>
                      <TableRow className="border-t-2 font-semibold">
                        <TableCell>Total Deductions</TableCell>
                        <TableCell className="text-right text-destructive">
                          -{formatCurrency(viewingEmployee.paye + viewingEmployee.uif + viewingEmployee.sdl + viewingEmployee.deductionAmount)}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          -{formatCurrency((viewingEmployee.paye + viewingEmployee.uif + viewingEmployee.sdl + viewingEmployee.deductionAmount) * 9)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* SECTION E — NET PAY SUMMARY */}
                <div className="rounded-lg border bg-primary/5 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Earnings</span>
                    <span>{formatCurrency(viewingEmployee.gross)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Total Deductions</span>
                    <span className="text-destructive">
                      -{formatCurrency(viewingEmployee.paye + viewingEmployee.uif + viewingEmployee.sdl + viewingEmployee.deductionAmount)}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between border-t pt-3">
                    <span className="text-xl font-bold">NET PAY</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(viewingEmployee.net)}</span>
                  </div>
                </div>

                {/* SECTION F — CUMULATIVE YTD SUMMARY */}
                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">Year to Date Summary</p>
                  <div className="flex gap-8">
                    <span>YTD Gross: <span className="font-medium text-foreground">{formatCurrency(viewingEmployee.gross * 9 + viewingEmployee.bonus)}</span></span>
                    <span>YTD Tax Paid: <span className="font-medium text-foreground">{formatCurrency(viewingEmployee.paye * 9)}</span></span>
                    <span>YTD Net: <span className="font-medium text-foreground">{formatCurrency(viewingEmployee.net * 9)}</span></span>
                  </div>
                </div>

                {/* SECTION G — FOOTER */}
                <div className="space-y-3">
                  <p className="text-center text-xs text-muted-foreground">
                    This payslip is computer generated and valid without a signature. | Generated by Iris
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <Button variant="outline" className="w-full cursor-not-allowed opacity-50" disabled={true}>
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
      </div>
    </DashboardLayout>
  );
};

export default CEOPayroll;
