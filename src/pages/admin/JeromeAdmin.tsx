import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Bot,
  MessageSquare,
  PenTool,
  Lightbulb,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChatLog {
  id: string;
  user_id: string | null;
  user_role: string | null;
  user_message: string;
  jerome_response: string;
  response_time_ms: number | null;
  created_at: string;
}

interface Tip {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: string;
  is_active: boolean;
  created_at: string;
}

interface AutoSignLog {
  id: string;
  document_id: string;
  document_name: string;
  client_id: string;
  client_name: string;
  signed_at: string | null;
  conditions: unknown;
  status: string;
  failure_reason: string | null;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function JeromeAdmin() {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [autoSignLogs, setAutoSignLogs] = useState<AutoSignLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for tip editing
  const [tipForm, setTipForm] = useState({
    category: 'general',
    title: '',
    content: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [chatRes, tipsRes, autoSignRes] = await Promise.all([
        supabase.from('jerome_chat_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('jerome_tips').select('*').order('created_at', { ascending: false }),
        supabase.from('jerome_auto_sign_logs').select('*').order('signed_at', { ascending: false }).limit(50),
      ]);

      if (chatRes.data) setChatLogs(chatRes.data);
      if (tipsRes.data) setTips(tipsRes.data);
      if (autoSignRes.data) setAutoSignLogs(autoSignRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load Iris AI admin data');
    } finally {
      setIsLoading(false);
    }
  };

  // Analytics calculations
  const totalChats = chatLogs.length;
  const avgResponseTime = chatLogs.length > 0
    ? Math.round(chatLogs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / chatLogs.length)
    : 0;
  const activeTips = tips.filter(t => t.is_active).length;
  const autoSignSuccessRate = autoSignLogs.length > 0
    ? Math.round((autoSignLogs.filter(l => l.status === 'signed').length / autoSignLogs.length) * 100)
    : 0;

  // Category distribution for pie chart
  const categoryData = tips.reduce((acc, tip) => {
    const existing = acc.find(item => item.name === tip.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: tip.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Chat activity by day
  const chatActivityData = chatLogs.reduce((acc, log) => {
    const date = format(new Date(log.created_at), 'MMM dd');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.chats += 1;
    } else {
      acc.push({ date, chats: 1 });
    }
    return acc;
  }, [] as { date: string; chats: number }[]).reverse().slice(-7);

  const handleSaveTip = async () => {
    try {
      if (selectedTip) {
        const { error } = await supabase
          .from('jerome_tips')
          .update({
            category: tipForm.category,
            title: tipForm.title,
            content: tipForm.content,
            priority: tipForm.priority,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedTip.id);
        
        if (error) throw error;
        toast.success('Tip updated successfully');
      } else {
        const { error } = await supabase
          .from('jerome_tips')
          .insert({
            category: tipForm.category,
            title: tipForm.title,
            content: tipForm.content,
            priority: tipForm.priority,
          });
        
        if (error) throw error;
        toast.success('Tip created successfully');
      }
      
      setIsDialogOpen(false);
      setSelectedTip(null);
      setTipForm({ category: 'general', title: '', content: '', priority: 'medium' });
      fetchData();
    } catch (error) {
      console.error('Failed to save tip:', error);
      toast.error('Failed to save tip');
    }
  };

  const handleDeleteTip = async (id: string) => {
    try {
      const { error } = await supabase.from('jerome_tips').delete().eq('id', id);
      if (error) throw error;
      toast.success('Tip deleted');
      fetchData();
    } catch (error) {
      console.error('Failed to delete tip:', error);
      toast.error('Failed to delete tip');
    }
  };

  const handleToggleTipActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('jerome_tips')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Failed to toggle tip:', error);
      toast.error('Failed to update tip status');
    }
  };

  const openEditDialog = (tip: Tip) => {
    setSelectedTip(tip);
    setTipForm({
      category: tip.category,
      title: tip.title,
      content: tip.content,
      priority: tip.priority || 'medium',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedTip(null);
    setTipForm({ category: 'general', title: '', content: '', priority: 'medium' });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Iris AI Admin</h1>
          <p className="text-muted-foreground">
            Monitor and manage the Iris AI assistant
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChats}</div>
              <p className="text-xs text-muted-foreground">Conversations logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">AI response latency</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tips</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTips}</div>
              <p className="text-xs text-muted-foreground">of {tips.length} total tips</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Sign Rate</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{autoSignSuccessRate}%</div>
              <p className="text-xs text-muted-foreground">Success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chats">Chat Logs</TabsTrigger>
            <TabsTrigger value="tips">Tips Management</TabsTrigger>
            <TabsTrigger value="autosign">Auto-Sign Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chatActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="chats" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tips by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle>Recent Chat Logs</CardTitle>
                <CardDescription>Last 100 conversations with Iris AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>User Role</TableHead>
                        <TableHead>User Message</TableHead>
                        <TableHead>Response Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs">
                            {format(new Date(log.created_at), 'MMM dd, HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.user_role || 'Unknown'}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {log.user_message}
                          </TableCell>
                          <TableCell>{log.response_time_ms || '-'}ms</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tips Management</CardTitle>
                  <CardDescription>Create and manage Iris AI tips</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tip
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedTip ? 'Edit Tip' : 'Create New Tip'}</DialogTitle>
                      <DialogDescription>
                        {selectedTip ? 'Update the tip details below.' : 'Add a new tip for Iris AI to share with users.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={tipForm.category}
                          onValueChange={(value) => setTipForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tax">Tax</SelectItem>
                            <SelectItem value="vat">VAT</SelectItem>
                            <SelectItem value="paye">PAYE</SelectItem>
                            <SelectItem value="deduction">Deduction</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={tipForm.title}
                          onChange={(e) => setTipForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter tip title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={tipForm.content}
                          onChange={(e) => setTipForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter tip content"
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={tipForm.priority}
                          onValueChange={(value) => setTipForm(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTip}>
                        {selectedTip ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Active</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tips.map((tip) => (
                      <TableRow key={tip.id}>
                        <TableCell>
                          <Switch
                            checked={tip.is_active}
                            onCheckedChange={(checked) => handleToggleTipActive(tip.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tip.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{tip.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              tip.priority === 'high' ? 'destructive' : 
                              tip.priority === 'medium' ? 'default' : 'secondary'
                            }
                          >
                            {tip.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(tip)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTip(tip.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="autosign">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Sign Logs</CardTitle>
                <CardDescription>History of Iris AI automatic document signing</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Signed At</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {autoSignLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {log.status === 'signed' ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : log.status === 'failed' ? (
                              <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-amber-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{log.document_name}</TableCell>
                          <TableCell>{log.client_name}</TableCell>
                          <TableCell className="text-xs">
                            {log.signed_at ? format(new Date(log.signed_at), 'MMM dd, HH:mm') : '-'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {log.failure_reason || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
