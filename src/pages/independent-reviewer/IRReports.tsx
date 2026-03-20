// NOTE (2026-03-20):
// IR Reports — removed duplicate financials, replaced with formal report cards.

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const formalReports = [
  {
    id: 'fr1',
    title: 'Independent Review Report',
    client: 'Mokwena Trading',
    period: 'Year ended 28 February 2026',
    status: 'Draft',
    statusColor: 'bg-amber-100 text-amber-700',
    preparedBy: 'Jerome van der Berg',
    date: '15 March 2026',
  },
  {
    id: 'fr2',
    title: 'Management Letter',
    client: 'Mokwena Trading',
    period: 'Year ended 28 February 2026',
    status: 'Pending Sign-off',
    statusColor: 'bg-orange-100 text-orange-700',
    preparedBy: 'Jerome van der Berg',
    date: '16 March 2026',
  },
  {
    id: 'fr3',
    title: 'Agreed-Upon Procedures Report',
    client: 'Mokwena Trading',
    period: 'Q3 2025',
    status: 'Issued',
    statusColor: 'bg-green-100 text-green-700',
    preparedBy: 'Jerome van der Berg',
    date: '10 January 2026',
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

        <div>
          <h2 className="text-lg font-semibold mb-4">Report Documents</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {formalReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{report.title} — {report.client}</h3>
                    <p className="text-xs text-muted-foreground">{report.period}</p>
                  </div>
                  <Badge className={report.statusColor} variant="secondary">
                    {report.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Prepared by: {report.preparedBy}</p>
                    <p>Date: {report.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    title="Available in production build"
                    className="w-full"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
