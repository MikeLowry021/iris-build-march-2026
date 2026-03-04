// NOTE (2026-03-04):
// Independent Reviewer profile — mock data only.
// Review checklists and sign-off confirmation are UI simulations.
// Real digital sign-off, ISRE 2400 compliance workflows, and
// document storage are planned for the production phase.

import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Clock,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Awaiting Review', value: 3, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { label: 'In Progress', value: 1, icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { label: 'Signed Off', value: 7, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'Queries Raised', value: 2, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
];

const recentActivity = [
  {
    client: 'Mokwena Trading (Pty) Ltd',
    period: 'Feb 2026',
    submittedBy: 'T. Dlamini (CA)SA',
    submittedDate: '03 Mar 2026',
    status: 'Awaiting Review',
    statusStyle: 'bg-amber-500 text-white border-0',
  },
  {
    client: 'Khumalo Retail CC',
    period: 'Feb 2026',
    submittedBy: 'T. Dlamini (CA)SA',
    submittedDate: '01 Mar 2026',
    status: 'In Progress',
    statusStyle: 'bg-blue-600 text-white border-0',
  },
  {
    client: 'Nkosi Logistics (Pty) Ltd',
    period: 'Jan 2026',
    submittedBy: 'S. Patel (CA)SA',
    submittedDate: '20 Feb 2026',
    status: 'Signed Off',
    statusStyle: 'bg-green-600 text-white border-0',
  },
];

export default function IRDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Independent Reviewer Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name?.split(' ').slice(0, 2).join(' ')} — here is your review workload
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                      <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${s.bg}`}>
                      <Icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.submittedBy}</TableCell>
                    <TableCell>{row.submittedDate}</TableCell>
                    <TableCell>
                      <Badge className={row.statusStyle}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/independent-reviewer/review-queue">
              Go to Review Queue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
