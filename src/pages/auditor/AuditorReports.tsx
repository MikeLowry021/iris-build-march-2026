// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const todayFormatted = new Date().toLocaleDateString('en-ZA', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

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

        <div className="space-y-4">
          {issuedOpinions.map((row) => (
            <Card key={row.irbaRef}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{row.client}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Period: {row.period} &bull; IRBA Ref:{' '}
                      <span className="font-mono">{row.irbaRef}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-slate-50 border border-slate-300 text-slate-700 text-xs">
                      {row.auditType}
                    </Badge>
                    <Badge className="bg-green-600 text-white border-0 text-xs">
                      {row.opinionType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>

                {/* Signature Block */}
                <div className="border-t-2 border-dashed border-slate-300 pt-4 space-y-3">
                  <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Auditor Sign-Off
                  </span>
                  <div>
                    <div className="border-b border-gray-300 w-48 mb-1 h-6" />
                    <p className="text-sm text-muted-foreground">Signature</p>
                  </div>
                  <div className="grid gap-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name: </span>
                      Jerome van der Berg
                    </p>
                    <p>
                      <span className="text-muted-foreground">Designation: </span>
                      Registered Auditor
                    </p>
                    <p>
                      <span className="text-muted-foreground">Practice No.: </span>
                      PR-2024-00891
                    </p>
                    <p>
                      <span className="text-muted-foreground">Date: </span>
                      {todayFormatted}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Firm: </span>
                      Iris Audit &amp; Assurance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pb-2">
          Download functionality will be enabled in the production build.
        </p>
      </div>
    </DashboardLayout>
  );
}
