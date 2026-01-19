import { Employee, getEmployeeStatusLabel, formatCurrency } from '@/lib/payroll-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Building2, FileText, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails?: (employee: Employee) => void;
  onGeneratePayslip?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
}

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

export const EmployeeCard = ({
  employee,
  onViewDetails,
  onGeneratePayslip,
  onEdit,
}: EmployeeCardProps) => {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Employee Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {employee.firstName} {employee.lastName}
                </h3>
                <Badge variant={getStatusVariant(employee.status)} className="shrink-0">
                  {getEmployeeStatusLabel(employee.status)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                {employee.position}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[180px]">{employee.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {employee.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Salary and Actions */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Monthly Salary</p>
              <p className="font-semibold text-foreground">
                {formatCurrency(employee.basicSalary)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(employee)}
                className="h-8"
              >
                View Details
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(employee)}>
                    Edit Employee
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onGeneratePayslip?.(employee)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Payslip
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Payslip History</DropdownMenuItem>
                  <DropdownMenuItem>View Tax Info</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Employee Number Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Employee No: {employee.employeeNumber}</span>
          <span>Started: {new Date(employee.startDate).toLocaleDateString('en-ZA')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
