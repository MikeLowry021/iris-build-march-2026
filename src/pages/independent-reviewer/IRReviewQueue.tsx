// NOTE (2026-03-04):
// Independent Reviewer profile — mock data only.
// Review checklists and sign-off confirmation are UI simulations.
// Real digital sign-off, ISRE 2400 compliance workflows, and
// document storage are planned for the production phase.

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

type BadgeStyle = 'amber' | 'blue' | 'green';

const badgeStyles: Record<BadgeStyle, string> = {
  amber: 'bg-amber-500 text-white border-0',
  blue: 'bg-blue-600 text-white border-0',
  green: 'bg-green-600 text-white border-0',
};

interface ReviewCard {
  client: string;
  reg: string;
  yearEnd: string;
  preparedBy: string;
  submitted: string;
  statusLabel: string;
  statusStyle: BadgeStyle;
  buttonLabel: string;
  buttonDisabled: boolean;
}

const reviewCards: ReviewCard[] = [
  {
    client: 'Mokwena Trading (Pty) Ltd',
    reg: '2019/123456/07',
    yearEnd: '28 February 2026',
    preparedBy: 'T. Dlamini (CA)SA',
    submitted: '03 March 2026',
    statusLabel: 'Awaiting Review',
    statusStyle: 'amber',
    buttonLabel: 'Begin Review',
    buttonDisabled: false,
  },
  {
    client: 'Khumalo Retail CC',
    reg: '2021/334455/23',
    yearEnd: '28 February 2026',
    preparedBy: 'T. Dlamini (CA)SA',
    submitted: '01 March 2026',
    statusLabel: 'In Progress',
    statusStyle: 'blue',
    buttonLabel: 'Continue Review',
    buttonDisabled: false,
  },
  {
    client: 'Nkosi Logistics (Pty) Ltd',
    reg: '2017/089012/07',
    yearEnd: '31 January 2026',
    preparedBy: 'S. Patel (CA)SA',
    submitted: '20 February 2026',
    statusLabel: 'Signed Off',
    statusStyle: 'green',
    buttonLabel: 'View Sign-Off',
    buttonDisabled: true,
  },
];

export default function IRReviewQueue() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-sm text-muted-foreground">
            Financial statements awaiting independent review
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
              <SelectItem value="jan-2026">Jan 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="awaiting">Awaiting Review</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="signed-off">Signed Off</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Accountants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accountants</SelectItem>
              <SelectItem value="dlamini">T. Dlamini</SelectItem>
              <SelectItem value="patel">S. Patel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {reviewCards.map((card) => (
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
                      <span>Prepared By: {card.preparedBy}</span>
                      <span>Submitted: {card.submitted}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {card.buttonDisabled ? (
                      <Button size="sm" variant="outline" disabled>
                        {card.buttonLabel}
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to="/independent-reviewer/client-review">
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
