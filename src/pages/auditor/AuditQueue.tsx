// NOTE (2026-03-04):
// Auditor profile — mock data only.
// Audit workpapers, opinion issuance, and IRBA registration checks
// are UI simulations. Real audit workflow, digital signatures, and
// IRBA API integration are planned for the production phase.

import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type BadgeStyle = 'blue' | 'amber' | 'green';

const badgeStyles: Record<BadgeStyle, string> = {
  blue: 'bg-blue-600 text-white border-0',
  amber: 'bg-amber-500 text-white border-0',
  green: 'bg-green-600 text-white border-0',
};

interface EngagementCard {
  client: string;
  reg: string;
  yearEnd: string;
  auditType: string;
  pisScore: string;
  assignedTo: string;
  statusLabel: string;
  statusStyle: BadgeStyle;
  buttonLabel: string;
  buttonDisabled: boolean;
}

const engagementCards: EngagementCard[] = [
  {
    client: 'Orion Manufacturing Ltd',
    reg: '2015/044521/07',
    yearEnd: '31 December 2025',
    auditType: 'Statutory Audit',
    pisScore: '350 (above threshold)',
    assignedTo: 'P. van der Merwe (RA)',
    statusLabel: 'Fieldwork in Progress',
    statusStyle: 'blue',
    buttonLabel: 'Continue Audit',
    buttonDisabled: false,
  },
  {
    client: 'Delta Distributors (Pty) Ltd',
    reg: '2018/234567/07',
    yearEnd: '28 February 2026',
    auditType: 'Statutory Audit',
    pisScore: '290 (above threshold)',
    assignedTo: 'P. van der Merwe (RA)',
    statusLabel: 'Awaiting Opinion',
    statusStyle: 'amber',
    buttonLabel: 'Issue Opinion',
    buttonDisabled: false,
  },
  {
    client: 'Nova Industrial Ltd',
    reg: '2020/112233/07',
    yearEnd: '31 December 2025',
    auditType: 'Voluntary Audit',
    pisScore: '180 (voluntary)',
    assignedTo: 'P. van der Merwe (RA)',
    statusLabel: 'Opinion Issued',
    statusStyle: 'green',
    buttonLabel: 'View Opinion',
    buttonDisabled: true,
  },
];

export default function AuditQueue() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Queue</h1>
          <p className="text-sm text-muted-foreground">
            Active and pending statutory audit engagements
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Periods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="feb-2026">Feb 2026</SelectItem>
              <SelectItem value="dec-2025">Dec 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="fieldwork">Fieldwork in Progress</SelectItem>
              <SelectItem value="awaiting">Awaiting Opinion</SelectItem>
              <SelectItem value="issued">Opinion Issued</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Audit Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audit Types</SelectItem>
              <SelectItem value="statutory">Statutory Audit</SelectItem>
              <SelectItem value="voluntary">Voluntary Audit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {engagementCards.map((card) => (
            <Card key={card.reg}>
              <CardContent className="pt-5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{card.client}</h3>
                      <Badge className={badgeStyles[card.statusStyle]}>{card.statusLabel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Reg: {card.reg}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1">
                      <span>Year End: {card.yearEnd}</span>
                      <span>Type: {card.auditType}</span>
                      <span>PIS: {card.pisScore}</span>
                      <span>Assigned: {card.assignedTo}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {card.buttonDisabled ? (
                      <Button size="sm" variant="outline" disabled>
                        {card.buttonLabel}
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to="/auditor/client-audit">
                          {card.buttonLabel}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
