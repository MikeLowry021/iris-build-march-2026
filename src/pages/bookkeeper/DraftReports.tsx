import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Download,
  Send,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Receipt,
} from 'lucide-react';
import {
  getClientById,
  getReportsByClientId,
  mockDraftReports,
} from '@/lib/bookkeeper-mock-data';
import { DraftReport, DraftReportStatus } from '@/lib/bookkeeper-types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const reportTypeConfig = {
  'trial-balance': {
    icon: FileSpreadsheet,
    title: 'Trial Balance',
    description: 'Summary of all general ledger accounts',
  },
  'income-statement': {
    icon: FileText,
    title: 'Income Statement',
    description: 'Revenue and expenses for the period',
  },
  'vat-summary': {
    icon: Receipt,
    title: 'VAT Summary',
    description: 'VAT inputs, outputs, and net payable',
  },
};

const getStatusBadge = (status: DraftReportStatus) => {
  switch (status) {
    case 'draft':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Draft
        </Badge>
      );
    case 'submitted':
      return (
        <Badge variant="default" className="gap-1">
          <Send className="h-3 w-3" />
          Submitted
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="gap-1 bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DraftReports() {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const client = getClientById(clientId || '1');
  const clientReports = getReportsByClientId(clientId || '1');

  const [notes, setNotes] = useState('');

  // Available report types that can be generated
  const availableReportTypes: Array<keyof typeof reportTypeConfig> = [
    'trial-balance',
    'income-statement',
    'vat-summary',
  ];

  const handleGenerateReport = (type: keyof typeof reportTypeConfig) => {
    toast({
      title: `Generating ${reportTypeConfig[type].title}`,
      description: 'The draft report is being prepared...',
    });
  };

  const handleDownload = (report: DraftReport) => {
    toast({
      title: 'Downloading report',
      description: `${report.title} will be downloaded as PDF`,
    });
  };

  const handleSubmitForReview = (report: DraftReport) => {
    toast({
      title: 'Submitted for review',
      description: `${report.title} has been sent to the accountant for review`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Draft Reports</h1>
          <p className="text-muted-foreground">
            {client?.company} — Generate and submit reports for accountant review
          </p>
        </div>

        {/* Generate new reports */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>
              Create draft reports based on categorized transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {availableReportTypes.map(type => {
                const config = reportTypeConfig[type];
                const Icon = config.icon;
                const existingDraft = clientReports.find(
                  r => r.type === type && r.status === 'draft'
                );

                return (
                  <Card
                    key={type}
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary/50 hover:shadow-md',
                      existingDraft && 'border-primary/30 bg-primary/5'
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3 rounded-full bg-primary/10 p-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{config.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {config.description}
                        </p>
                        <Button
                          className="mt-4 w-full"
                          variant={existingDraft ? 'secondary' : 'default'}
                          size="sm"
                          onClick={() => handleGenerateReport(type)}
                        >
                          {existingDraft ? 'Regenerate' : 'Generate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Existing reports */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              Draft reports pending submission or already submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientReports.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No reports generated yet</p>
                <p className="text-sm text-muted-foreground">
                  Generate a report above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientReports.map(report => {
                  const config = reportTypeConfig[report.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={report.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-muted p-2">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{report.title}</h3>
                              {getStatusBadge(report.status)}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Created {format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')}
                            </p>
                            {report.submittedAt && (
                              <p className="text-xs text-muted-foreground">
                                Submitted {format(new Date(report.submittedAt), 'dd MMM yyyy, HH:mm')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Export
                          </Button>
                          {report.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => handleSubmitForReview(report)}
                            >
                              <Send className="mr-1 h-4 w-4" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>

                      {report.notes && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Notes: </span>
                            {report.notes}
                          </p>
                        </div>
                      )}

                      {/* Status indicator for drafts */}
                      {report.status === 'draft' && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-warning">
                          <Clock className="h-4 w-4" />
                          Draft - Pending Accountant Review
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes to accountant */}
        <Card>
          <CardHeader>
            <CardTitle>Notes to Accountant</CardTitle>
            <CardDescription>
              Add any comments or observations for the reviewing accountant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Bookkeeper Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes, observations, or questions for the accountant reviewing these reports..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <Button variant="outline" disabled={!notes.trim()}>
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
