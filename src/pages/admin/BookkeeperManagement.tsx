import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  UserPlus,
  Search,
  MoreHorizontal,
  Download,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { mockBookkeepers, mockAdminClients } from '@/lib/admin-mock-data';
import { Bookkeeper } from '@/lib/admin-types';
import { toast } from 'sonner';

export default function BookkeeperManagement() {
  const [bookkeepers, setBookkeepers] = useState<Bookkeeper[]>(mockBookkeepers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookkeepers, setSelectedBookkeepers] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBookkeeperForAssign, setSelectedBookkeeperForAssign] = useState<Bookkeeper | null>(null);

  // New bookkeeper form state
  const [newBookkeeper, setNewBookkeeper] = useState({
    name: '',
    email: '',
    password: '',
    selectedClients: [] as string[],
  });

  const filteredBookkeepers = bookkeepers.filter(bk => {
    const matchesSearch = bk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && bk.isActive) ||
      (statusFilter === 'inactive' && !bk.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeCount = bookkeepers.filter(b => b.isActive).length;
  const inactiveCount = bookkeepers.filter(b => !b.isActive).length;

  const toggleBookkeeperStatus = (id: string) => {
    setBookkeepers(prev =>
      prev.map(bk =>
        bk.id === id ? { ...bk, isActive: !bk.isActive } : bk
      )
    );
    toast.success('Bookkeeper status updated');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewBookkeeper(prev => ({ ...prev, password }));
  };

  const handleCreateBookkeeper = () => {
    if (!newBookkeeper.name || !newBookkeeper.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBk: Bookkeeper = {
      id: `bk${bookkeepers.length + 1}`,
      name: newBookkeeper.name,
      email: newBookkeeper.email,
      clientsAssigned: newBookkeeper.selectedClients,
      isActive: true,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookkeepers(prev => [...prev, newBk]);
    setNewBookkeeper({ name: '', email: '', password: '', selectedClients: [] });
    setIsAddDialogOpen(false);
    toast.success('Bookkeeper created successfully');
  };

  const openAssignDialog = (bookkeeper: Bookkeeper) => {
    setSelectedBookkeeperForAssign(bookkeeper);
    setIsAssignDialogOpen(true);
  };

  const getClientName = (clientId: string) => {
    const client = mockAdminClients.find(c => c.id === clientId);
    return client?.name || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookkeeper Management</h1>
            <p className="text-muted-foreground">Manage bookkeeper accounts and client assignments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Bookkeeper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Bookkeeper</DialogTitle>
                <DialogDescription>Create a new bookkeeper account and assign clients</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newBookkeeper.name}
                      onChange={(e) => setNewBookkeeper(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newBookkeeper.email}
                      onChange={(e) => setNewBookkeeper(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@auditnex.co.za"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="text"
                      value={newBookkeeper.password}
                      onChange={(e) => setNewBookkeeper(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                    <Button type="button" variant="outline" onClick={generatePassword}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign Clients</Label>
                  <div className="max-h-48 overflow-y-auto rounded-md border p-3">
                    <div className="space-y-2">
                      {mockAdminClients.filter(c => c.status === 'active').map(client => (
                        <div key={client.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`client-${client.id}`}
                            checked={newBookkeeper.selectedClients.includes(client.id)}
                            onCheckedChange={(checked) => {
                              setNewBookkeeper(prev => ({
                                ...prev,
                                selectedClients: checked
                                  ? [...prev.selectedClients, client.id]
                                  : prev.selectedClients.filter(id => id !== client.id)
                              }));
                            }}
                          />
                          <label
                            htmlFor={`client-${client.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {client.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {newBookkeeper.selectedClients.length} clients selected
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateBookkeeper}>Create Bookkeeper</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookkeepers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookkeepers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{inactiveCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookkeepers</CardTitle>
            <CardDescription>View and manage all bookkeeper accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
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
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Clients Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookkeepers.map((bookkeeper) => (
                    <TableRow key={bookkeeper.id}>
                      <TableCell className="font-medium">{bookkeeper.name}</TableCell>
                      <TableCell className="text-muted-foreground">{bookkeeper.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bookkeeper.clientsAssigned.length} clients</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={bookkeeper.isActive}
                            onCheckedChange={() => toggleBookkeeperStatus(bookkeeper.id)}
                          />
                          <span className={bookkeeper.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                            {bookkeeper.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{bookkeeper.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openAssignDialog(bookkeeper)}>
                              Assign Clients
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleBookkeeperStatus(bookkeeper.id)}>
                              {bookkeeper.isActive ? 'Disable' : 'Enable'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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

        {/* Assign Clients Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Assign Clients to {selectedBookkeeperForAssign?.name}</DialogTitle>
              <DialogDescription>
                Select clients to assign to this bookkeeper
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto rounded-md border p-3">
              <div className="space-y-2">
                {mockAdminClients.filter(c => c.status === 'active').map(client => (
                  <div key={client.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`assign-${client.id}`}
                        checked={selectedBookkeeperForAssign?.clientsAssigned.includes(client.id)}
                      />
                      <label htmlFor={`assign-${client.id}`} className="text-sm font-medium">
                        {client.name}
                      </label>
                    </div>
                    {client.bookkeeperName && client.bookkeeperId !== selectedBookkeeperForAssign?.id && (
                      <span className="text-xs text-muted-foreground">
                        Currently: {client.bookkeeperName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                setIsAssignDialogOpen(false);
                toast.success('Client assignments updated');
              }}>
                Save Assignments
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
