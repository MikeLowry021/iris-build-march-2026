import { useState, useMemo } from 'react';
import { Employee, EmployeeStatus, getEmployeeStatusLabel, formatCurrency } from '@/lib/payroll-types';
import { EmployeeCard } from './EmployeeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Search, LayoutGrid, LayoutList, UserPlus, Filter } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: () => void;
  onViewDetails: (employee: Employee) => void;
  onGeneratePayslip: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

type ViewMode = 'grid' | 'table';

const getStatusVariant = (status: Employee['status']): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'active':
      return 'default';
    case 'on-leave':
      return 'secondary';
    case 'terminated':
      return 'destructive';
  }
};

export const EmployeeList = ({
  employees,
  onAddEmployee,
  onViewDetails,
  onGeneratePayslip,
  onEdit,
}: EmployeeListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department));
    return Array.from(depts).sort();
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.employeeNumber.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      // Department filter
      const matchesDepartment =
        departmentFilter === 'all' || emp.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on-leave').length;
    const terminated = employees.filter((e) => e.status === 'terminated').length;
    const totalPayroll = employees
      .filter((e) => e.status === 'active')
      .reduce((sum, e) => sum + e.basicSalary, 0);

    return { active, onLeave, terminated, totalPayroll };
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Active Employees</p>
          <p className="text-2xl font-bold text-primary">{stats.active}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">On Leave</p>
          <p className="text-2xl font-bold text-secondary">{stats.onLeave}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Terminated</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.terminated}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Monthly Payroll</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPayroll)}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as EmployeeStatus | 'all')}
          >
            <SelectTrigger className="w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('table')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Employee */}
          <Button onClick={onAddEmployee}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground">No employees found matching your filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onViewDetails={onViewDetails}
              onGeneratePayslip={onGeneratePayslip}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      <p className="text-sm text-muted-foreground">{employee.employeeNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(employee.status)}>
                      {getEmployeeStatusLabel(employee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(employee.basicSalary)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(employee)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
