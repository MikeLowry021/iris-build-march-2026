import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Mail,
  Link,
  Shield,
  Upload,
  Save,
  Download,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { mockSystemSettings } from '@/lib/admin-mock-data';
import { SystemSettings as SystemSettingsType } from '@/lib/admin-types';
import { toast } from 'sonner';

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsType>(mockSystemSettings);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const handleGeneralSave = () => {
    toast.success('General settings saved successfully');
  };

  const handleEmailSave = () => {
    toast.success('Email settings saved successfully');
  };

  const handleIntegrationsSave = () => {
    toast.success('Integration settings saved successfully');
  };

  const handleSecuritySave = () => {
    toast.success('Security settings saved successfully');
  };

  const handleManualBackup = () => {
    toast.success('Backup initiated. This may take a few minutes.');
  };

  const toggleShowApiKey = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic configuration for your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.general.companyName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, companyName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatRate">VAT Rate (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      value={settings.general.vatRate}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, vatRate: parseFloat(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted">
                      {settings.general.logoUrl ? (
                        <img src={settings.general.logoUrl} alt="Logo" className="h-16 w-16 object-contain" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="financialYearEnd">Financial Year End</Label>
                    <Input
                      id="financialYearEnd"
                      value={settings.general.financialYearEnd}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Contact support to change this</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Table</Label>
                    <div className="flex gap-2">
                      <Input placeholder="No file uploaded" disabled className="flex-1" />
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleGeneralSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure SMTP and email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      value={settings.email.smtpServer}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpServer: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpUsername: e.target.value }
                    }))}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">From Email Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.email.emailFromAddress}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, emailFromAddress: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.email.emailFromName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, emailFromName: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Send Test Email</Button>
                  <Button onClick={handleEmailSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure third-party service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apify */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">Apify (Bank Statement Parser)</h4>
                  <div className="space-y-2">
                    <Label htmlFor="apifyKey">API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="apifyKey"
                          type={showApiKeys.apify ? 'text' : 'password'}
                          value={settings.integrations.apifyApiKey || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { ...prev.integrations, apifyApiKey: e.target.value }
                          }))}
                          placeholder="Enter Apify API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleShowApiKey('apify')}
                        >
                          {showApiKeys.apify ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DocuSign */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">DocuSign (Digital Signatures)</h4>
                  <div className="space-y-2">
                    <Label htmlFor="docusignKey">API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="docusignKey"
                          type={showApiKeys.docusign ? 'text' : 'password'}
                          value={settings.integrations.docusignApiKey || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { ...prev.integrations, docusignApiKey: e.target.value }
                          }))}
                          placeholder="Enter DocuSign API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleShowApiKey('docusign')}
                        >
                          {showApiKeys.docusign ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auth0 */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">Auth0 (Authentication)</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="auth0ClientId">Client ID</Label>
                      <Input
                        id="auth0ClientId"
                        value={settings.integrations.auth0ClientId || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, auth0ClientId: e.target.value }
                        }))}
                        placeholder="Enter Auth0 Client ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auth0Domain">Domain</Label>
                      <Input
                        id="auth0Domain"
                        value={settings.integrations.auth0Domain || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, auth0Domain: e.target.value }
                        }))}
                        placeholder="your-tenant.auth0.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleIntegrationsSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Security</CardTitle>
                <CardDescription>Configure security policies and manage backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Backup Section */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">Backup Status</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Last backup:</p>
                      <p className="font-medium">
                        {new Date(settings.security.lastBackupDate).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={handleManualBackup}>
                      <Download className="mr-2 h-4 w-4" />
                      Manual Backup
                    </Button>
                  </div>
                </div>

                {/* Password Policy */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Lock className="h-4 w-4" />
                    Password Policy
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Minimum Password Length</Label>
                        <p className="text-sm text-muted-foreground">
                          Require at least this many characters
                        </p>
                      </div>
                      <Input
                        type="number"
                        className="w-20"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                        }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Uppercase Letters</Label>
                        <p className="text-sm text-muted-foreground">At least one uppercase letter</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequireUppercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireUppercase: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Numbers</Label>
                        <p className="text-sm text-muted-foreground">At least one number</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequireNumbers}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireNumbers: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Special Characters</Label>
                        <p className="text-sm text-muted-foreground">At least one special character</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequireSpecial}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireSpecial: checked }
                        }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Timeout (minutes)</Label>
                        <p className="text-sm text-muted-foreground">
                          Auto-logout after inactivity
                        </p>
                      </div>
                      <Input
                        type="number"
                        className="w-20"
                        value={settings.security.sessionTimeoutMinutes}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, sessionTimeoutMinutes: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSecuritySave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
