// NOTE (2026-03-04):
// Independent Reviewer profile — mock data only.
// Review checklists and sign-off confirmation are UI simulations.
// Real digital sign-off, ISRE 2400 compliance workflows, and
// document storage are planned for the production phase.

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Download } from 'lucide-react';

const signedOffReports = [
  {
    client: 'Nkosi Logistics (Pty) Ltd',
    period: 'Jan 2026',
    signedOffBy: 'Dr. N. Mthembu',
    date: '22 Feb 2026',
    reference: 'IR-2026-NKO-001',
  },
  {
    client: 'Boksburg Traders CC',
    period: 'Dec 2025',
    signedOffBy: 'Dr. N. Mthembu',
    date: '15 Jan 2026',
    reference: 'IR-2025-BOK-003',
  },
];

export default function IRReports() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Reports</h1>
          <p className="text-sm text-muted-foreground">
            Signed-off financial statements and review documentation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Signed Off By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signedOffReports.map((row) => (
                  <TableRow key={row.reference}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.signedOffBy}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="font-mono text-xs">{row.reference}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" disabled>
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center pb-2">
          Download functionality will be enabled in the production build.
        </p>
      </div>
    </DashboardLayout>
  );
}
