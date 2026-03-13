import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowLeft, Download } from 'lucide-react';
import { mockPendingSubmissions } from '@/lib/accountant-mock-data';

function fmt(val: number | null): string {
  if (val === null) return '—';
  return `R ${val.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`;
}

function NoteRef({ n }: { n: number }) {
  return (
    <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground align-super">
      {n}
    </span>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell colSpan={3} className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </TableCell>
    </TableRow>
  );
}

function TotalRow({ label, curr, prior, bold }: { label: string; curr: number | null; prior: number | null; bold?: boolean }) {
  return (
    <TableRow className={bold ? 'border-t-2 border-foreground/20 font-bold' : 'font-medium'}>
      <TableCell className={bold ? 'text-foreground font-bold' : 'font-medium'}>{label}</TableCell>
      <TableCell className="text-right tabular-nums font-mono">{fmt(curr)}</TableCell>
      <TableCell className="text-right tabular-nums font-mono">{fmt(prior)}</TableCell>
    </TableRow>
  );
}

function LineItem({
  label,
  note,
  curr,
  prior,
  indent,
}: {
  label: string;
  note?: number;
  curr: number | null;
  prior: number | null;
  indent?: boolean;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className={indent ? 'pl-8 text-sm text-foreground/80' : 'text-sm text-foreground/90'}>
        {label}
        {note !== undefined && <NoteRef n={note} />}
      </TableCell>
      <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(curr)}</TableCell>
      <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(prior)}</TableCell>
    </TableRow>
  );
}

const mockData: Record<string, {
  company: string;
  bs: Record<string, number | null>;
  is: Record<string, number | null>;
  cf: Record<string, number | null>;
  eq: Record<string, [number | null, number | null, number | null]>;
}> = {
  '1': {
    company: 'Mokwena Trading (Pty) Ltd',
    bs: {
      ppe_curr: 1_240_000, ppe_prior: 1_380_000,
      intangibles_curr: 85_000, intangibles_prior: 110_000,
      cash_curr: 342_800, cash_prior: 218_500,
      receivables_curr: 621_400, receivables_prior: 498_200,
      inventory_curr: 415_600, inventory_prior: 380_900,
      total_assets_curr: 2_704_800, total_assets_prior: 2_587_600,
      share_capital_curr: 500_000, share_capital_prior: 500_000,
      retained_curr: 842_300, retained_prior: 610_700,
      lt_loans_curr: 780_000, lt_loans_prior: 920_000,
      payables_curr: 482_500, payables_prior: 436_900,
      overdraft_curr: 100_000, overdraft_prior: 120_000,
      total_equity_liab_curr: 2_704_800, total_equity_liab_prior: 2_587_600,
    },
    is: {
      revenue_curr: 3_850_000, revenue_prior: 3_210_000,
      cos_curr: 1_540_000, cos_prior: 1_284_000,
      gross_profit_curr: 2_310_000, gross_profit_prior: 1_926_000,
      acc_fees_curr: 48_000, acc_fees_prior: 42_000,
      advert_curr: 62_000, advert_prior: 55_000,
      bank_charges_curr: 18_400, bank_charges_prior: 15_600,
      cleaning_curr: 12_000, cleaning_prior: 10_000,
      computer_curr: 28_000, computer_prior: 24_000,
      consulting_curr: 95_000, consulting_prior: 80_000,
      electricity_curr: 34_000, electricity_prior: 29_000,
      insurance_curr: 58_000, insurance_prior: 52_000,
      legal_curr: 22_000, legal_prior: 15_000,
      lease_curr: 216_000, lease_prior: 216_000,
      motor_curr: 45_000, motor_prior: 38_000,
      printing_curr: 8_200, printing_prior: 7_100,
      repairs_curr: 18_500, repairs_prior: 22_000,
      security_curr: 24_000, security_prior: 24_000,
      staff_welfare_curr: 14_400, staff_welfare_prior: 12_000,
      subscriptions_curr: 9_600, subscriptions_prior: 8_400,
      telephone_curr: 16_800, telephone_prior: 15_000,
      travel_curr: 38_000, travel_prior: 32_000,
      total_opex_curr: 767_900, total_opex_prior: 697_100,
      operating_result_curr: 1_542_100, operating_result_prior: 1_228_900,
      finance_charges_curr: 98_400, finance_charges_prior: 112_000,
      profit_before_tax_curr: 1_443_700, profit_before_tax_prior: 1_116_900,
      taxation_curr: 404_236, taxation_prior: 312_732,
      net_profit_curr: 1_039_464, net_profit_prior: 804_168,
    },
    cf: {
      net_profit_curr: 1_039_464, net_profit_prior: 804_168,
      depreciation_curr: 165_000, depreciation_prior: 152_000,
      receivables_change_curr: -123_200, receivables_change_prior: 68_400,
      inventory_change_curr: -34_700, inventory_change_prior: 22_100,
      payables_change_curr: 45_600, payables_change_prior: -18_300,
      operating_cf_curr: 1_092_164, operating_cf_prior: 1_028_368,
      ppe_additions_curr: -25_000, ppe_additions_prior: -180_000,
      intangibles_additions_curr: 0, intangibles_additions_prior: -55_000,
      investing_cf_curr: -25_000, investing_cf_prior: -235_000,
      loan_repayments_curr: -140_000, loan_repayments_prior: -120_000,
      financing_cf_curr: -140_000, financing_cf_prior: -120_000,
      net_movement_curr: 927_164, net_movement_prior: 673_368,
      opening_balance_curr: 218_500, opening_balance_prior: -454_868,
      closing_balance_curr: 342_800, closing_balance_prior: 218_500,
    },
    eq: {
      opening: [500_000, 610_700, 1_110_700],
      profit: [null, 1_039_464, 1_039_464],
      dividends: [null, -808_000, -808_000],
      closing: [500_000, 842_164, 1_342_164],
    },
  },
  '2': {
    company: 'Nkosi Technologies CC',
    bs: {
      ppe_curr: 920_000, ppe_prior: 780_000,
      intangibles_curr: 210_000, intangibles_prior: 180_000,
      cash_curr: 580_400, cash_prior: 320_100,
      receivables_curr: 980_200, receivables_prior: 820_400,
      inventory_curr: 0, inventory_prior: 0,
      total_assets_curr: 2_690_600, total_assets_prior: 2_100_500,
      share_capital_curr: 200_000, share_capital_prior: 200_000,
      retained_curr: 1_240_600, retained_prior: 882_500,
      lt_loans_curr: 600_000, lt_loans_prior: 700_000,
      payables_curr: 520_000, payables_prior: 218_000,
      overdraft_curr: 130_000, overdraft_prior: 100_000,
      total_equity_liab_curr: 2_690_600, total_equity_liab_prior: 2_100_500,
    },
    is: {
      revenue_curr: 5_200_000, revenue_prior: 4_100_000,
      cos_curr: 1_820_000, cos_prior: 1_435_000,
      gross_profit_curr: 3_380_000, gross_profit_prior: 2_665_000,
      acc_fees_curr: 72_000, acc_fees_prior: 60_000,
      advert_curr: 84_000, advert_prior: 72_000,
      bank_charges_curr: 22_000, bank_charges_prior: 18_000,
      cleaning_curr: 0, cleaning_prior: 0,
      computer_curr: 95_000, computer_prior: 78_000,
      consulting_curr: 180_000, consulting_prior: 150_000,
      electricity_curr: 28_000, electricity_prior: 24_000,
      insurance_curr: 64_000, insurance_prior: 58_000,
      legal_curr: 38_000, legal_prior: 24_000,
      lease_curr: 360_000, lease_prior: 360_000,
      motor_curr: 55_000, motor_prior: 48_000,
      printing_curr: 6_400, printing_prior: 5_200,
      repairs_curr: 12_000, repairs_prior: 15_000,
      security_curr: 18_000, security_prior: 18_000,
      staff_welfare_curr: 22_000, staff_welfare_prior: 18_000,
      subscriptions_curr: 32_000, subscriptions_prior: 28_000,
      telephone_curr: 24_000, telephone_prior: 21_000,
      travel_curr: 62_000, travel_prior: 54_000,
      total_opex_curr: 1_174_400, total_opex_prior: 1_052_200,
      operating_result_curr: 2_205_600, operating_result_prior: 1_612_800,
      finance_charges_curr: 88_000, finance_charges_prior: 102_000,
      profit_before_tax_curr: 2_117_600, profit_before_tax_prior: 1_510_800,
      taxation_curr: 592_928, taxation_prior: 423_024,
      net_profit_curr: 1_524_672, net_profit_prior: 1_087_776,
    },
    cf: {
      net_profit_curr: 1_524_672, net_profit_prior: 1_087_776,
      depreciation_curr: 120_000, depreciation_prior: 108_000,
      receivables_change_curr: -159_800, receivables_change_prior: 92_000,
      inventory_change_curr: 0, inventory_change_prior: 0,
      payables_change_curr: 302_000, payables_change_prior: -42_000,
      operating_cf_curr: 1_786_872, operating_cf_prior: 1_245_776,
      ppe_additions_curr: -260_000, ppe_additions_prior: -110_000,
      intangibles_additions_curr: -30_000, intangibles_additions_prior: -80_000,
      investing_cf_curr: -290_000, investing_cf_prior: -190_000,
      loan_repayments_curr: -100_000, loan_repayments_prior: -100_000,
      financing_cf_curr: -100_000, financing_cf_prior: -100_000,
      net_movement_curr: 1_396_872, net_movement_prior: 955_776,
      opening_balance_curr: 320_100, opening_balance_prior: -635_676,
      closing_balance_curr: 580_400, closing_balance_prior: 320_100,
    },
    eq: {
      opening: [200_000, 882_500, 1_082_500],
      profit: [null, 1_524_672, 1_524_672],
      dividends: [null, -1_166_572, -1_166_572],
      closing: [200_000, 1_240_600, 1_440_600],
    },
  },
};

function getFallback(clientId: string) {
  return mockData['1'];
}

export default function ClientFinancialsPreview() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const submission = mockPendingSubmissions.find(s => s.clientId === clientId);
  const data = (clientId && mockData[clientId]) ? mockData[clientId] : getFallback(clientId ?? '1');
  const clientName = submission?.clientName ?? 'Client';
  const companyName = submission?.clientCompany ?? data.company;

  const { bs, is, cf, eq } = data;

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => navigate('/accountant/review-queue')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{clientName}</h1>
                <p className="text-sm text-muted-foreground">{companyName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Financial Year: Feb 2025 &nbsp;|&nbsp; Comparative: Feb 2024
                </p>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" disabled className="gap-2">
                    <Download className="h-4 w-4" />
                    Print / Export PDF
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>PDF export enabled in production build</TooltipContent>
            </Tooltip>
          </div>

          <Tabs defaultValue="balance-sheet">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="balance-sheet" className="text-xs sm:text-sm">
                Fin. Position
              </TabsTrigger>
              <TabsTrigger value="income" className="text-xs sm:text-sm">
                Income & Exp.
              </TabsTrigger>
              <TabsTrigger value="cashflow" className="text-xs sm:text-sm">
                Cash Flows
              </TabsTrigger>
              <TabsTrigger value="equity" className="text-xs sm:text-sm">
                Equity
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm">
                Notes
              </TabsTrigger>
            </TabsList>

            {/* TAB 1 — Statement of Financial Position */}
            <TabsContent value="balance-sheet" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Statement of Financial Position</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    As at 28 February 2025
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60">
                        <TableHead className="w-[55%]"></TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2025</TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2024</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SectionLabel label="ASSETS" />
                      <SectionLabel label="Non-current Assets" />
                      <LineItem label="Property, Plant & Equipment" note={2} curr={bs.ppe_curr} prior={bs.ppe_prior} indent />
                      <LineItem label="Intangible Assets" curr={bs.intangibles_curr} prior={bs.intangibles_prior} indent />
                      <SectionLabel label="Current Assets" />
                      <LineItem label="Cash & Cash Equivalents" note={4} curr={bs.cash_curr} prior={bs.cash_prior} indent />
                      <LineItem label="Trade & Other Receivables" curr={bs.receivables_curr} prior={bs.receivables_prior} indent />
                      <LineItem label="Inventory" curr={bs.inventory_curr} prior={bs.inventory_prior} indent />
                      <TotalRow label="TOTAL ASSETS" curr={bs.total_assets_curr} prior={bs.total_assets_prior} bold />

                      <TableRow><TableCell colSpan={3} className="py-2" /></TableRow>

                      <SectionLabel label="EQUITY AND LIABILITIES" />
                      <SectionLabel label="Equity" />
                      <LineItem label="Share Capital" curr={bs.share_capital_curr} prior={bs.share_capital_prior} indent />
                      <LineItem label="Retained Earnings" curr={bs.retained_curr} prior={bs.retained_prior} indent />
                      <SectionLabel label="Long-term Liabilities" />
                      <LineItem label="Long-term Loans" note={3} curr={bs.lt_loans_curr} prior={bs.lt_loans_prior} indent />
                      <SectionLabel label="Current Liabilities" />
                      <LineItem label="Trade & Other Payables" curr={bs.payables_curr} prior={bs.payables_prior} indent />
                      <LineItem label="Bank Overdraft" note={4} curr={bs.overdraft_curr} prior={bs.overdraft_prior} indent />
                      <TotalRow label="TOTAL EQUITY AND LIABILITIES" curr={bs.total_equity_liab_curr} prior={bs.total_equity_liab_prior} bold />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2 — Statement of Income & Expenses */}
            <TabsContent value="income" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Statement of Income & Expenses</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    For the year ended 28 February 2025
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60">
                        <TableHead className="w-[55%]"></TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2025</TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2024</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <LineItem label="Revenue" note={5} curr={is.revenue_curr} prior={is.revenue_prior} />
                      <LineItem label="Cost of Sales" note={6} curr={is.cos_curr ? -is.cos_curr : null} prior={is.cos_prior ? -is.cos_prior : null} />
                      <TotalRow label="Gross Profit" curr={is.gross_profit_curr} prior={is.gross_profit_prior} />

                      <SectionLabel label="Operating Expenses" />
                      <LineItem label="Accounting Fees" curr={is.acc_fees_curr ? -is.acc_fees_curr : null} prior={is.acc_fees_prior ? -is.acc_fees_prior : null} indent />
                      <LineItem label="Advertising & Promotions" curr={is.advert_curr ? -is.advert_curr : null} prior={is.advert_prior ? -is.advert_prior : null} indent />
                      <LineItem label="Bank Charges" curr={is.bank_charges_curr ? -is.bank_charges_curr : null} prior={is.bank_charges_prior ? -is.bank_charges_prior : null} indent />
                      {(is.cleaning_curr ?? 0) > 0 && <LineItem label="Cleaning" curr={is.cleaning_curr ? -is.cleaning_curr : null} prior={is.cleaning_prior ? -is.cleaning_prior : null} indent />}
                      <LineItem label="Computer Expenses" curr={is.computer_curr ? -is.computer_curr : null} prior={is.computer_prior ? -is.computer_prior : null} indent />
                      <LineItem label="Consulting Fees" curr={is.consulting_curr ? -is.consulting_curr : null} prior={is.consulting_prior ? -is.consulting_prior : null} indent />
                      <LineItem label="Electricity & Water" curr={is.electricity_curr ? -is.electricity_curr : null} prior={is.electricity_prior ? -is.electricity_prior : null} indent />
                      <LineItem label="Insurance" curr={is.insurance_curr ? -is.insurance_curr : null} prior={is.insurance_prior ? -is.insurance_prior : null} indent />
                      <LineItem label="Legal Fees" curr={is.legal_curr ? -is.legal_curr : null} prior={is.legal_prior ? -is.legal_prior : null} indent />
                      <LineItem label="Lease Rentals" curr={is.lease_curr ? -is.lease_curr : null} prior={is.lease_prior ? -is.lease_prior : null} indent />
                      <LineItem label="Motor Vehicle Expenses" curr={is.motor_curr ? -is.motor_curr : null} prior={is.motor_prior ? -is.motor_prior : null} indent />
                      <LineItem label="Printing & Stationery" curr={is.printing_curr ? -is.printing_curr : null} prior={is.printing_prior ? -is.printing_prior : null} indent />
                      <LineItem label="Repairs & Maintenance" curr={is.repairs_curr ? -is.repairs_curr : null} prior={is.repairs_prior ? -is.repairs_prior : null} indent />
                      <LineItem label="Security" curr={is.security_curr ? -is.security_curr : null} prior={is.security_prior ? -is.security_prior : null} indent />
                      <LineItem label="Staff Welfare" curr={is.staff_welfare_curr ? -is.staff_welfare_curr : null} prior={is.staff_welfare_prior ? -is.staff_welfare_prior : null} indent />
                      <LineItem label="Subscriptions" curr={is.subscriptions_curr ? -is.subscriptions_curr : null} prior={is.subscriptions_prior ? -is.subscriptions_prior : null} indent />
                      <LineItem label="Telephone & Fax" curr={is.telephone_curr ? -is.telephone_curr : null} prior={is.telephone_prior ? -is.telephone_prior : null} indent />
                      <LineItem label="Travel & Accommodation" curr={is.travel_curr ? -is.travel_curr : null} prior={is.travel_prior ? -is.travel_prior : null} indent />
                      <TotalRow label="Results from Operating Activities" curr={is.operating_result_curr} prior={is.operating_result_prior} />

                      <LineItem label="Finance Charges" curr={is.finance_charges_curr ? -is.finance_charges_curr : null} prior={is.finance_charges_prior ? -is.finance_charges_prior : null} />
                      <TotalRow label="Profit / (Loss) Before Tax" curr={is.profit_before_tax_curr} prior={is.profit_before_tax_prior} />
                      <LineItem label="Taxation" note={8} curr={is.taxation_curr ? -is.taxation_curr : null} prior={is.taxation_prior ? -is.taxation_prior : null} />
                      <TotalRow label="Net Profit for the Period" curr={is.net_profit_curr} prior={is.net_profit_prior} bold />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3 — Statement of Cash Flows */}
            <TabsContent value="cashflow" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Statement of Cash Flows</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    For the year ended 28 February 2025
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60">
                        <TableHead className="w-[55%]"></TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2025</TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">2024</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SectionLabel label="Cash Flows from Operating Activities" />
                      <LineItem label="Net profit for the period" curr={cf.net_profit_curr} prior={cf.net_profit_prior} indent />
                      <LineItem label="Add: Depreciation" curr={cf.depreciation_curr} prior={cf.depreciation_prior} indent />
                      <LineItem label="(Increase) / Decrease in trade receivables" curr={cf.receivables_change_curr} prior={cf.receivables_change_prior} indent />
                      <LineItem label="(Increase) / Decrease in inventory" curr={cf.inventory_change_curr} prior={cf.inventory_change_prior} indent />
                      <LineItem label="Increase / (Decrease) in trade payables" curr={cf.payables_change_curr} prior={cf.payables_change_prior} indent />
                      <TotalRow label="Net cash from operating activities" curr={cf.operating_cf_curr} prior={cf.operating_cf_prior} />

                      <TableRow><TableCell colSpan={3} className="py-1" /></TableRow>

                      <SectionLabel label="Cash Flows from Investing Activities" />
                      <LineItem label="Acquisition of property, plant & equipment" curr={cf.ppe_additions_curr} prior={cf.ppe_additions_prior} indent />
                      <LineItem label="Acquisition of intangible assets" curr={cf.intangibles_additions_curr} prior={cf.intangibles_additions_prior} indent />
                      <TotalRow label="Net cash from investing activities" curr={cf.investing_cf_curr} prior={cf.investing_cf_prior} />

                      <TableRow><TableCell colSpan={3} className="py-1" /></TableRow>

                      <SectionLabel label="Cash Flows from Financing Activities" />
                      <LineItem label="Repayment of long-term loans" curr={cf.loan_repayments_curr} prior={cf.loan_repayments_prior} indent />
                      <TotalRow label="Net cash from financing activities" curr={cf.financing_cf_curr} prior={cf.financing_cf_prior} />

                      <TableRow><TableCell colSpan={3} className="py-2" /></TableRow>
                      <TotalRow label="Net movement in cash and cash equivalents" curr={cf.net_movement_curr} prior={cf.net_movement_prior} bold />
                      <LineItem label="Opening balance" curr={cf.opening_balance_curr} prior={cf.opening_balance_prior} />
                      <TotalRow label="Closing balance" curr={cf.closing_balance_curr} prior={cf.closing_balance_prior} bold />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4 — Statement of Changes in Equity */}
            <TabsContent value="equity" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Statement of Changes in Equity</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    For the year ended 28 February 2025
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60">
                        <TableHead className="w-[35%]"></TableHead>
                        <TableHead className="text-right w-[21%] font-semibold">Share Capital</TableHead>
                        <TableHead className="text-right w-[21%] font-semibold">Retained Earnings</TableHead>
                        <TableHead className="text-right w-[22%] font-semibold">Total Equity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Opening balance</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.opening[0])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.opening[1])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.opening[2])}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm pl-6 text-foreground/80">Profit for the year</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.profit[0])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.profit[1])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.profit[2])}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm pl-6 text-foreground/80">Dividends declared</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.dividends[0])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.dividends[1])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-sm">{fmt(eq.dividends[2])}</TableCell>
                      </TableRow>
                      <TableRow className="border-t-2 border-foreground/20 font-bold">
                        <TableCell className="font-bold">Closing balance</TableCell>
                        <TableCell className="text-right tabular-nums font-mono">{fmt(eq.closing[0])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono">{fmt(eq.closing[1])}</TableCell>
                        <TableCell className="text-right tabular-nums font-mono">{fmt(eq.closing[2])}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5 — Notes */}
            <TabsContent value="notes" className="mt-6 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Notes to the Financial Statements</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    For the year ended 28 February 2025
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  {/* Note 1 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 1 — Basis of Preparation</h3>
                    <Separator className="mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These financial statements have been prepared in accordance with the International Financial
                      Reporting Standard for Small and Medium-sized Entities (IFRS for SMEs) and in accordance with
                      the requirements of the Companies Act, 71 of 2008. They have been prepared on the historical
                      cost basis, except where otherwise noted. The financial statements are presented in South
                      African Rand (ZAR), which is the functional currency of the entity.
                    </p>
                  </div>

                  {/* Note 2 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 2 — Property, Plant & Equipment</h3>
                    <Separator className="mb-3" />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-right">Accum. Depreciation</TableHead>
                          <TableHead className="text-right">Carrying Amount 2025</TableHead>
                          <TableHead className="text-right">Carrying Amount 2024</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">Furniture & Fittings</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 320 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">(R 128 000)</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 192 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 224 000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Computer Equipment</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 485 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">(R 242 500)</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 242 500</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 308 000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Motor Vehicles</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 980 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">(R 414 500)</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 565 500</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 612 000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Leasehold Improvements</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 360 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">(R 120 000)</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 240 000</TableCell>
                          <TableCell className="text-right font-mono text-sm">R 236 000</TableCell>
                        </TableRow>
                        <TableRow className="font-bold border-t">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right font-mono">R 2 145 000</TableCell>
                          <TableCell className="text-right font-mono">(R 905 000)</TableCell>
                          <TableCell className="text-right font-mono">{fmt(bs.ppe_curr)}</TableCell>
                          <TableCell className="text-right font-mono">{fmt(bs.ppe_prior)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Note 3 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 3 — Long-term Loans</h3>
                    <Separator className="mb-3" />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead>Lender</TableHead>
                          <TableHead>Interest Rate</TableHead>
                          <TableHead>Maturity</TableHead>
                          <TableHead className="text-right">2025</TableHead>
                          <TableHead className="text-right">2024</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">FNB Business Loan</TableCell>
                          <TableCell className="text-sm">Prime + 2% (13.75%)</TableCell>
                          <TableCell className="text-sm">Feb 2028</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(bs.lt_loans_curr)}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(bs.lt_loans_prior)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Note 4 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 4 — Cash & Cash Equivalents</h3>
                    <Separator className="mb-3" />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead></TableHead>
                          <TableHead className="text-right">2025</TableHead>
                          <TableHead className="text-right">2024</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">FNB Current Account</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((bs.cash_curr ?? 0) * 0.72))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((bs.cash_prior ?? 0) * 0.68))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">FNB Savings Account</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((bs.cash_curr ?? 0) * 0.28))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((bs.cash_prior ?? 0) * 0.32))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Less: Bank overdraft (Note 4)</TableCell>
                          <TableCell className="text-right font-mono text-sm text-red-600">({fmt(bs.overdraft_curr)})</TableCell>
                          <TableCell className="text-right font-mono text-sm text-red-600">({fmt(bs.overdraft_prior)})</TableCell>
                        </TableRow>
                        <TableRow className="font-bold border-t">
                          <TableCell>Net cash and cash equivalents</TableCell>
                          <TableCell className="text-right font-mono">{fmt((bs.cash_curr ?? 0) - (bs.overdraft_curr ?? 0))}</TableCell>
                          <TableCell className="text-right font-mono">{fmt((bs.cash_prior ?? 0) - (bs.overdraft_prior ?? 0))}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Note 5 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 5 — Revenue</h3>
                    <Separator className="mb-3" />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead></TableHead>
                          <TableHead className="text-right">2025</TableHead>
                          <TableHead className="text-right">2024</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">Cash sale income</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_curr ?? 0) * 0.35))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_prior ?? 0) * 0.32))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">EFT received</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_curr ?? 0) * 0.58))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_prior ?? 0) * 0.60))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Other income</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_curr ?? 0) * 0.07))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.revenue_prior ?? 0) * 0.08))}</TableCell>
                        </TableRow>
                        <TableRow className="font-bold border-t">
                          <TableCell>Total Revenue</TableCell>
                          <TableCell className="text-right font-mono">{fmt(is.revenue_curr)}</TableCell>
                          <TableCell className="text-right font-mono">{fmt(is.revenue_prior)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Note 6 */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Note 6 — Cost of Sales</h3>
                    <Separator className="mb-3" />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead></TableHead>
                          <TableHead className="text-right">2025</TableHead>
                          <TableHead className="text-right">2024</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">Opening inventory</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(bs.inventory_prior)}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((bs.inventory_prior ?? 0) * 0.92))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Purchases</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.cos_curr ?? 0) * 1.06))}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Math.round((is.cos_prior ?? 0) * 1.07))}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Less: Closing inventory</TableCell>
                          <TableCell className="text-right font-mono text-sm text-red-600">({fmt(bs.inventory_curr)})</TableCell>
                          <TableCell className="text-right font-mono text-sm text-red-600">({fmt(bs.inventory_prior)})</TableCell>
                        </TableRow>
                        <TableRow className="font-bold border-t">
                          <TableCell>Cost of Sales</TableCell>
                          <TableCell className="text-right font-mono">{fmt(is.cos_curr)}</TableCell>
                          <TableCell className="text-right font-mono">{fmt(is.cos_prior)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
