import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  User,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCEOBusiness } from '@/lib/ceo-mock-data';

const CEOSettings = () => {
  const business = mockCEOBusiness;
  const [notifications, setNotifications] = useState({
    lowCash: true,
    overdueInvoices: true,
    taxDueDates: true,
    payrollReminders: true,
    expenseApprovals: true,
    leaveRequests: true,
  });

  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Business Profile</CardTitle>
              </div>
              <CardDescription>Your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input defaultValue={business.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input defaultValue={business.registrationNumber} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Number</Label>
                  <Input defaultValue={business.taxNumber} readOnly className="bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input defaultValue={business.industry} />
              </div>
              {business.franchiseNumber && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Franchise Number</Label>
                    <Input defaultValue={business.franchiseNumber} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Franchisor</Label>
                    <Input defaultValue={business.franchisor} readOnly className="bg-muted" />
                  </div>
                </div>
              )}
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Personal Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Personal Profile</CardTitle>
              </div>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={business.ownerName} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input type="email" defaultValue={business.email} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input defaultValue={business.phone} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input defaultValue={business.address} />
              </div>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Accountant */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Assigned Accountant</CardTitle>
            </div>
            <CardDescription>Your accountant handles final approvals and compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{business.assignedAccountant.name}</p>
                <p className="text-sm text-muted-foreground">{business.assignedAccountant.email}</p>
              </div>
              <Button variant="outline" className="ml-auto">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose which alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Cash Alerts</p>
                <p className="text-sm text-muted-foreground">
                  When cash runway drops below 6 months
                </p>
              </div>
              <Switch
                checked={notifications.lowCash}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, lowCash: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Overdue Invoices</p>
                <p className="text-sm text-muted-foreground">
                  When invoices are overdue by more than 30 days
                </p>
              </div>
              <Switch
                checked={notifications.overdueInvoices}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, overdueInvoices: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tax Due Dates</p>
                <p className="text-sm text-muted-foreground">
                  Reminders for upcoming tax deadlines
                </p>
              </div>
              <Switch
                checked={notifications.taxDueDates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, taxDueDates: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payroll Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Reminders to process monthly payroll
                </p>
              </div>
              <Switch
                checked={notifications.payrollReminders}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, payrollReminders: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expense Approvals</p>
                <p className="text-sm text-muted-foreground">
                  When staff submit expense reimbursements
                </p>
              </div>
              <Switch
                checked={notifications.expenseApprovals}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, expenseApprovals: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Leave Requests</p>
                <p className="text-sm text-muted-foreground">
                  When employees request time off
                </p>
              </div>
              <Switch
                checked={notifications.leaveRequests}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, leaveRequests: checked })
                }
              />
            </div>
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your password and session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleChangePassword}>Change Password</Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CEOSettings;
