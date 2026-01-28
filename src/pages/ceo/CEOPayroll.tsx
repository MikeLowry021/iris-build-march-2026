import { useState } from 'react';
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
import {
  DollarSign,
  FileText,
  Send,
  Check,
  Download,
  ChevronDown,
  Edit,
  Eye,
} from 'lucide-react';
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
  const [payroll, setPayroll] = useState(mockCEOPayroll);
  const [selectedMonth, setSelectedMonth] = useState(payroll.month);
  const [selectedYear, setSelectedYear] = useState(payroll.year);
  const [editingEmployee, setEditingEmployee] = useState<CEOPayrollEmployee | null>(null);
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
                          <Button variant="ghost" size="icon">
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
      </div>
    </DashboardLayout>
  );
};

export default CEOPayroll;
