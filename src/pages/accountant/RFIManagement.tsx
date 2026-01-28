import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle,
  Plus,
  Send,
  User,
  Calendar,
  FileText,
} from 'lucide-react';
import { mockRFIs, mockPendingSubmissions, RFI, RFIType } from '@/lib/accountant-mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const getRFITypeConfig = (type: RFIType) => {
  switch (type) {
    case 'error':
      return { label: 'Error', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-500/10' };
    case 'warning':
      return { label: 'Warning', icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    case 'clarification':
      return { label: 'Clarification', icon: HelpCircle, color: 'text-blue-600', bgColor: 'bg-blue-500/10' };
  }
};

export default function RFIManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRFI, setNewRFI] = useState({
    clientId: '',
    type: 'clarification' as RFIType,
    issue: '',
    message: '',
    attachedAccount: '',
  });

  const pendingRFIs = mockRFIs.filter(r => r.status === 'pending');
  const resolvedRFIs = mockRFIs.filter(r => r.status === 'resolved');

  const handleCreateRFI = () => {
    if (!newRFI.clientId || !newRFI.issue || !newRFI.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'RFI Sent',
      description: 'The bookkeeper has been notified of your request.',
    });
    setIsDialogOpen(false);
    setNewRFI({ clientId: '', type: 'clarification', issue: '', message: '', attachedAccount: '' });
  };

  const RFICard = ({ rfi }: { rfi: RFI }) => {
    const typeConfig = getRFITypeConfig(rfi.type);
    const TypeIcon = typeConfig.icon;

    return (
      <Card className={cn(rfi.status === 'pending' && 'border-l-4 border-l-orange-500')}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn('rounded-lg p-2', typeConfig.bgColor)}>
                <TypeIcon className={cn('h-5 w-5', typeConfig.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{rfi.clientName}</h3>
                  <Badge variant="outline" className={cn(typeConfig.bgColor, typeConfig.color)}>
                    {typeConfig.label}
                  </Badge>
                  {rfi.status === 'pending' && (
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Awaiting Response
                    </Badge>
                  )}
                  {rfi.status === 'resolved' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Resolved
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{rfi.issue}</p>
                <p className="mt-2 text-sm text-muted-foreground">{rfi.message}</p>

                {/* Attached info */}
                {rfi.attachedAccount && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    {rfi.attachedAccount && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {rfi.attachedAccount}
                      </span>
                    )}
                    {rfi.attachedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rfi.attachedDate}
                      </span>
                    )}
                  </div>
                )}

                {/* Bookkeeper info */}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>To: {rfi.bookkeeperName} ({rfi.bookkeeperEmail})</span>
                  <span>•</span>
                  <span>Sent {format(new Date(rfi.createdAt), 'dd MMM yyyy, HH:mm')}</span>
                </div>

                {/* Response section */}
                {rfi.response && (
                  <div className="mt-4 rounded-lg bg-green-500/5 border border-green-500/20 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Bookkeeper Response
                    </div>
                    <p className="mt-2 text-sm text-foreground">{rfi.response}</p>
                    {rfi.resolvedBy && rfi.resolvedAt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Resolved by {rfi.resolvedBy} on {format(new Date(rfi.resolvedAt), 'dd MMM yyyy, HH:mm')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {rfi.status === 'pending' && (
              <Button variant="outline" size="sm">
                Send Reminder
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Request for Information</h1>
            <p className="text-muted-foreground">
              Manage queries sent to bookkeepers for clarification
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create RFI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Request for Information</DialogTitle>
                <DialogDescription>
                  Send a query to the bookkeeper for clarification or correction
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select
                    value={newRFI.clientId}
                    onValueChange={(v) => setNewRFI({ ...newRFI, clientId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPendingSubmissions.map((s) => (
                        <SelectItem key={s.clientId} value={s.clientId}>
                          {s.clientCompany}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={newRFI.type}
                    onValueChange={(v) => setNewRFI({ ...newRFI, type: v as RFIType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error - Requires correction</SelectItem>
                      <SelectItem value="warning">Warning - Potential issue</SelectItem>
                      <SelectItem value="clarification">Clarification - Need more info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Summary *</Label>
                  <Input
                    id="issue"
                    value={newRFI.issue}
                    onChange={(e) => setNewRFI({ ...newRFI, issue: e.target.value })}
                    placeholder="e.g., Salary entry R50,000 - not explained"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachedAccount">Attached GL Account (optional)</Label>
                  <Input
                    id="attachedAccount"
                    value={newRFI.attachedAccount}
                    onChange={(e) => setNewRFI({ ...newRFI, attachedAccount: e.target.value })}
                    placeholder="e.g., 5100 - Salaries & Wages"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={newRFI.message}
                    onChange={(e) => setNewRFI({ ...newRFI, message: e.target.value })}
                    placeholder="Please provide supporting documentation for..."
                    rows={4}
                  />
                </div>

                <Button className="w-full" onClick={handleCreateRFI}>
                  <Send className="mr-2 h-4 w-4" />
                  Send RFI
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Awaiting Response</p>
                  <p className="mt-1 text-3xl font-bold text-orange-600">{pendingRFIs.length}</p>
                </div>
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved This Month</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{resolvedRFIs.length}</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RFI List */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'resolved')}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingRFIs.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolved ({resolvedRFIs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {pendingRFIs.length > 0 ? (
              pendingRFIs.map((rfi) => <RFICard key={rfi.id} rfi={rfi} />)
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No pending RFIs</p>
                  <p className="text-sm text-muted-foreground">All queries have been resolved</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="mt-6 space-y-4">
            {resolvedRFIs.length > 0 ? (
              resolvedRFIs.map((rfi) => <RFICard key={rfi.id} rfi={rfi} />)
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No resolved RFIs yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
