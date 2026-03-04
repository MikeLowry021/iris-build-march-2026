// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

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

const issuedOpinions = [
  {
    client: 'Nova Industrial Ltd',
    period: 'Dec 2025',
    auditType: 'Voluntary',
    opinionType: 'Unmodified',
    dateIssued: '15 Jan 2026',
    irbaRef: 'RA-2026-NOV-001',
  },
  {
    client: 'Boksburg Traders CC',
    period: 'Nov 2025',
    auditType: 'Statutory',
    opinionType: 'Unmodified',
    dateIssued: '02 Dec 2025',
    irbaRef: 'RA-2025-BOK-007',
  },
];

export default function AuditorReports() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Reports</h1>
          <p className="text-sm text-muted-foreground">
            Issued audit opinions and engagement documentation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issued Opinions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Audit Type</TableHead>
                  <TableHead>Opinion Type</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>IRBA Ref</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuedOpinions.map((row) => (
                  <TableRow key={row.irbaRef}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.auditType}</TableCell>
                    <TableCell>{row.opinionType}</TableCell>
                    <TableCell>{row.dateIssued}</TableCell>
                    <TableCell className="font-mono text-xs">{row.irbaRef}</TableCell>
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
