import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  Building2,
  Award,
  PenTool,
  Shield,
  Lock,
  LogOut,
  Save,
} from 'lucide-react';
import { mockAccountantProfile } from '@/lib/accountant-mock-data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountantSettings() {
  const { toast } = useToast();
  const { logout } = useAuth();

  const [profile, setProfile] = useState({
    name: mockAccountantProfile.name,
    email: mockAccountantProfile.email,
    phone: '+27 82 456 7890',
    registrationNumber: mockAccountantProfile.registrationNumber,
    officeLocation: mockAccountantProfile.officeLocation,
  });

  const [preferences, setPreferences] = useState({
    signatureStyle: mockAccountantProfile.signatureStyle as 'typed' | 'electronic',
    canOverride: mockAccountantProfile.canOverride,
    emailNotifications: true,
    autoSaveReview: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your settings have been updated.',
    });
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
    });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, signature settings, and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your professional details displayed on signed documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration">CA Registration Number</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="registration"
                    value={profile.registrationNumber}
                    onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This appears on all signed financial statements
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="office">Office Location</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="office"
                    value={profile.officeLocation}
                    disabled
                    className="bg-muted pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Contact admin to change your office assignment
                </p>
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Signature & Approval Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Signature & Approvals
              </CardTitle>
              <CardDescription>
                Configure how you sign and approve financial statements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Signature Style</Label>
                <Select
                  value={preferences.signatureStyle}
                  onValueChange={(v) => setPreferences({ ...preferences, signatureStyle: v as 'typed' | 'electronic' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typed">Typed Initials</SelectItem>
                    <SelectItem value="electronic">Electronic Signature (Draw)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How your signature appears on approved documents
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Permissions</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Override Entries</Label>
                    <p className="text-xs text-muted-foreground">
                      Ability to correct bookkeeper transactions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferences.canOverride ? (
                      <Badge variant="default">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for new submissions and RFI responses
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(v) => setPreferences({ ...preferences, emailNotifications: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Save Reviews</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically save checklist progress
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoSaveReview}
                    onCheckedChange={(v) => setPreferences({ ...preferences, autoSaveReview: v })}
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              <Button onClick={handleChangePassword} className="w-full">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Session
              </CardTitle>
              <CardDescription>
                Sign out of your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Signing out will end your current session. Unsaved review progress may be lost.
              </p>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
