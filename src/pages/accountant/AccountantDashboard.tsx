import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockClients } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Users, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AccountantDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary stats
  const stats = {
    totalClients: mockClients.length,
    actionRequired: mockClients.filter(c => 
      c.vatStatus === 'action-required' || 
      c.payeStatus === 'action-required' || 
      c.financialsStatus === 'action-required'
    ).length,
    pending: mockClients.filter(c => 
      c.vatStatus === 'pending' || 
      c.payeStatus === 'pending' || 
      c.financialsStatus === 'pending'
    ).length,
    upToDate: mockClients.filter(c => 
      c.vatStatus === 'complete' && 
      c.payeStatus === 'complete' && 
      c.financialsStatus === 'complete' &&
      c.taxStatus === 'complete'
    ).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your clients and review their accounting status
          </p>
        </div>

        {/* Stats cards */}
        <div className="dashboard-grid">
          <div className="status-card animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalClients}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </div>
          
          <div className="status-card animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.actionRequired}</p>
                <p className="text-sm text-muted-foreground">Action Required</p>
              </div>
            </div>
          </div>
          
          <div className="status-card animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="status-card animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.upToDate}</p>
                <p className="text-sm text-muted-foreground">Up to Date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client list */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="section-title">Client Overview</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    VAT
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    PAYE
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Financials
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last Activity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClients.map(client => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {client.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {client.company}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={client.vatStatus} showIcon={false} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={client.payeStatus} showIcon={false} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={client.financialsStatus} showIcon={false} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={client.taxStatus} showIcon={false} />
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {client.lastActivity}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/accountant/clients/${client.id}`}>
                          Review
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                No clients found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
