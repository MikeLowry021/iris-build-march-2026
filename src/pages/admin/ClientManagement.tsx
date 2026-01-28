import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Search,
  MoreHorizontal,
  Download,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mockAdminClients, mockBookkeepers, formatCurrency } from '@/lib/admin-mock-data';
import { AdminClient } from '@/lib/admin-types';
import { toast } from 'sonner';

export default function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<AdminClient[]>(mockAdminClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookkeeperFilter, setBookkeeperFilter] = useState<string>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New client form state
  const [newClient, setNewClient] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    bookkeeperId: '',
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesBookkeeper = bookkeeperFilter === 'all' || client.bookkeeperId === bookkeeperFilter;
    return matchesSearch && matchesStatus && matchesBookkeeper;
  });

  const activeCount = clients.filter(c => c.status === 'active').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const handleCreateClient = () => {
    if (!newClient.companyName || !newClient.email || !newClient.contactPerson) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bookkeeper = mockBookkeepers.find(b => b.id === newClient.bookkeeperId);

    const newClientData: AdminClient = {
      id: `${clients.length + 1}`,
      name: newClient.companyName,
      contactPerson: newClient.contactPerson,
      email: newClient.email,
      phone: newClient.phone,
      bookkeeperId: newClient.bookkeeperId || undefined,
      bookkeeperName: bookkeeper?.name,
      accountantName: 'Sarah van der Berg',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      vatTotalThisMonth: 0,
      payeTotalThisMonth: 0,
    };

    setClients(prev => [...prev, newClientData]);
    setNewClient({ companyName: '', contactPerson: '', email: '', phone: '', bookkeeperId: '' });
    setIsAddDialogOpen(false);
    toast.success('Client created successfully');
  };

  const handleBulkDeactivate = () => {
    setClients(prev =>
      prev.map(client =>
        selectedClients.includes(client.id)
          ? { ...client, status: 'inactive' as const }
          : client
      )
    );
    setSelectedClients([]);
    toast.success(`${selectedClients.length} clients deactivated`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">Manage all clients in the system</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Create a new client account</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={newClient.companyName}
                    onChange={(e) => setNewClient(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="ABC Trading (Pty) Ltd"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={newClient.contactPerson}
                      onChange={(e) => setNewClient(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+27 11 123 4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@company.co.za"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookkeeper">Assign Bookkeeper</Label>
                  <Select
                    value={newClient.bookkeeperId}
                    onValueChange={(value) => setNewClient(prev => ({ ...prev, bookkeeperId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bookkeeper" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No bookkeeper</SelectItem>
                      {mockBookkeepers.filter(b => b.isActive).map(bk => (
                        <SelectItem key={bk.id} value={bk.id}>{bk.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateClient}>Create Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{inactiveCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>View and manage all client accounts (financial data not accessible to admin)</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, contact, or email..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={bookkeeperFilter} onValueChange={setBookkeeperFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bookkeeper" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookkeepers</SelectItem>
                  {mockBookkeepers.map(bk => (
                    <SelectItem key={bk.id} value={bk.id}>{bk.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedClients.length > 0 && (
              <div className="mb-4 flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <span className="text-sm font-medium">{selectedClients.length} selected</span>
                <Button size="sm" variant="outline">Assign Bookkeeper</Button>
                <Button size="sm" variant="outline">Export</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={handleBulkDeactivate}>
                  Deactivate
                </Button>
              </div>
            )}

            {/* Table - NO financial data columns (admin privacy requirement) */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                        onCheckedChange={toggleAllClients}
                      />
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Accountant</TableHead>
                    <TableHead>Bookkeeper</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => toggleClientSelection(client.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                        </div>
                      </TableCell>
                      <TableCell>{client.accountantName}</TableCell>
                      <TableCell>{client.bookkeeperName || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{client.createdAt}</TableCell>
                      <TableCell className="text-muted-foreground">{client.lastActivity}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/clients/${client.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Assign Bookkeeper</DropdownMenuItem>
                            <DropdownMenuItem>Export Data</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              {client.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
