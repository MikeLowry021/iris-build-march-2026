// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

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
import { CirclePlay as PlayCircle, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Fieldwork in Progress', value: 2, icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { label: 'Awaiting Opinion', value: 1, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { label: 'Opinions Issued', value: 4, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'Queries Outstanding', value: 3, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
];

const engagements = [
  {
    client: 'Orion Manufacturing Ltd',
    period: 'Dec 2025',
    auditType: 'Statutory Audit',
    status: 'Fieldwork in Progress',
    statusStyle: 'bg-blue-600 text-white border-0',
    pis: 'PIS: 350',
  },
  {
    client: 'Delta Distributors (Pty) Ltd',
    period: 'Feb 2026',
    auditType: 'Statutory Audit',
    status: 'Awaiting Opinion',
    statusStyle: 'bg-amber-500 text-white border-0',
    pis: 'PIS: 290',
  },
  {
    client: 'Nova Industrial Ltd',
    period: 'Dec 2025',
    auditType: 'Voluntary Audit',
    status: 'Opinion Issued',
    statusStyle: 'bg-green-600 text-white border-0',
    pis: 'PIS: 180',
  },
];

export default function AuditorDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name?.split(' ').slice(0, 3).join(' ')} — your active audit engagements
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
            <CardTitle>Recent Engagements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Audit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>PIS Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagements.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.auditType}</TableCell>
                    <TableCell>
                      <Badge className={row.statusStyle}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{row.pis}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/auditor/audit-queue">
              Go to Audit Queue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
