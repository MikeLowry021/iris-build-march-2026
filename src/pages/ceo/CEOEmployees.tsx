import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Plus, Search, Eye, CreditCard as Edit, FileText, Calendar, UserMinus, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { mockCEOEmployees, mockCEOLeaveRequests } from '@/lib/ceo-mock-data';
import {
  formatCurrency,
  getEmployeeStatusLabel,
  getEmploymentTypeLabel,
  getLeaveTypeLabel,
  CEOEmployee,
  EmployeeStatus,
  EmploymentType,
} from '@/lib/ceo-types';

const CEOEmployees = () => {
  const [employees, setEmployees] = useState(mockCEOEmployees);
  const [leaveRequests, setLeaveRequests] = useState(mockCEOLeaveRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<CEOEmployee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesType = typeFilter === 'all' || emp.employmentType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingLeaveRequests = leaveRequests.filter((req) => req.status === 'pending');

  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'on_leave':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === leaveId
          ? { ...req, status: 'approved' as const, approvedAt: new Date().toISOString() }
          : req
      )
    );
    toast.success('Leave request approved');
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === leaveId
          ? { ...req, status: 'rejected' as const, rejectedAt: new Date().toISOString() }
          : req
      )
    );
    toast.success('Leave request rejected');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Employee Records</h1>
            <p className="text-muted-foreground">Manage staff and leave requests</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee record
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Number</Label>
                    <Input placeholder="9001015800086" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+27 82 555 1234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stylist">Stylist</SelectItem>
                        <SelectItem value="barber">Barber</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full-time</SelectItem>
                        <SelectItem value="part_time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Salary</Label>
                    <Input type="number" placeholder="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reports To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceo">Jane Smith (Director)</SelectItem>
                        <SelectItem value="manager">David Anderson (Manager)</SelectItem>
                        <SelectItem value="senior">Sarah Johnson (Senior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="123 Main Street, Cape Town" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Number (optional)</Label>
                  <Input placeholder="1234567890" />
                </div>
                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Contact name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+27 82 555 9999" />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input placeholder="Spouse" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Employee record created');
                  setIsAddDialogOpen(false);
                }}>
                  Create Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="directory">
          <TabsList>
            <TabsTrigger value="directory">Employee Directory</TabsTrigger>
            <TabsTrigger value="leave">
              Leave Management
              {pendingLeaveRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingLeaveRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Employee Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Salary</TableHead>
                        <TableHead className="text-right">YTD Earnings</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getEmploymentTypeLabel(employee.employmentType)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(employee.status)}>
                              {getEmployeeStatusLabel(employee.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{employee.email}</p>
                              <p className="text-muted-foreground">{employee.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(employee.salary)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(employee.ytdEarnings.net)}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Calendar className="h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            {/* Pending Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
                <CardDescription>Review and approve employee leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLeaveRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending leave requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingLeaveRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{request.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {getLeaveTypeLabel(request.type)} • {request.days} days
                          </p>
                          <p className="text-sm">
                            {new Date(request.startDate).toLocaleDateString()} -{' '}
                            {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-muted-foreground">
                              Reason: {request.reason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectLeave(request.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveLeave(request.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leave Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Summary by Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="text-center">Annual Leave</TableHead>
                      <TableHead className="text-center">Sick Leave</TableHead>
                      <TableHead className="text-center">Used</TableHead>
                      <TableHead className="text-center">Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees
                      .filter((e) => e.status !== 'inactive')
                      .map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.leaveBalance.annualTotal} days
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.leaveBalance.sickTotal} days
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.leaveBalance.annualUsed + employee.leaveBalance.sickUsed} days
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium">
                              {employee.leaveBalance.annualTotal -
                                employee.leaveBalance.annualUsed +
                                employee.leaveBalance.sickTotal -
                                employee.leaveBalance.sickUsed}{' '}
                              days
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Employee Detail Dialog */}
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </DialogTitle>
              <DialogDescription>{selectedEmployee?.position}</DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">ID Number:</span> {selectedEmployee.idNumber}</p>
                      <p><span className="text-muted-foreground">Email:</span> {selectedEmployee.email}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {selectedEmployee.phone}</p>
                      <p><span className="text-muted-foreground">Address:</span> {selectedEmployee.address}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Employment Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Department:</span> {selectedEmployee.department}</p>
                      <p><span className="text-muted-foreground">Type:</span> {getEmploymentTypeLabel(selectedEmployee.employmentType)}</p>
                      <p><span className="text-muted-foreground">Start Date:</span> {new Date(selectedEmployee.startDate).toLocaleDateString()}</p>
                      <p><span className="text-muted-foreground">Reports To:</span> {selectedEmployee.reportsTo || 'Director'}</p>
                      <p><span className="text-muted-foreground">Salary:</span> {formatCurrency(selectedEmployee.salary)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">Leave Balance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">
                        {selectedEmployee.leaveBalance.annualTotal - selectedEmployee.leaveBalance.annualUsed}
                      </p>
                      <p className="text-xs text-muted-foreground">Annual Leave Remaining</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">
                        {selectedEmployee.leaveBalance.sickTotal - selectedEmployee.leaveBalance.sickUsed}
                      </p>
                      <p className="text-xs text-muted-foreground">Sick Leave Remaining</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">{selectedEmployee.leaveBalance.unpaidUsed}</p>
                      <p className="text-xs text-muted-foreground">Unpaid Leave Taken</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">YTD Earnings</h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold">{formatCurrency(selectedEmployee.ytdEarnings.gross)}</p>
                      <p className="text-xs text-muted-foreground">Gross</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold text-destructive">{formatCurrency(selectedEmployee.ytdEarnings.paye)}</p>
                      <p className="text-xs text-muted-foreground">PAYE</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold text-destructive">{formatCurrency(selectedEmployee.ytdEarnings.uif)}</p>
                      <p className="text-xs text-muted-foreground">UIF</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold text-destructive">{formatCurrency(selectedEmployee.ytdEarnings.sdl)}</p>
                      <p className="text-xs text-muted-foreground">SDL</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold text-success">{formatCurrency(selectedEmployee.ytdEarnings.net)}</p>
                      <p className="text-xs text-muted-foreground">Net</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">Emergency Contact</h4>
                  <div className="text-sm">
                    <p>{selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship})</p>
                    <p className="text-muted-foreground">{selectedEmployee.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                Close
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CEOEmployees;
