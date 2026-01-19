import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BalanceSheetData, balanceSheetSchema, calculateBalanceSheetTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';
import { CurrencyInput } from './CurrencyInput';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BalanceSheetFormProps {
  data: BalanceSheetData;
  onSave: (data: BalanceSheetData) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function BalanceSheetForm({ data, onSave, isSubmitting, readOnly }: BalanceSheetFormProps) {
  const form = useForm<BalanceSheetData>({
    resolver: zodResolver(balanceSheetSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const watchedValues = form.watch();
  const [totals, setTotals] = useState(() => calculateBalanceSheetTotals(data));

  useEffect(() => {
    setTotals(calculateBalanceSheetTotals(watchedValues));
  }, [watchedValues]);

  const handleSubmit = (formData: BalanceSheetData) => {
    onSave(formData);
  };

  const renderField = (
    name: `${keyof BalanceSheetData}.${string}`,
    label: string
  ) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field, fieldState }) => (
        <FormItem className="flex items-center justify-between gap-4">
          <FormLabel className="text-sm font-normal text-foreground flex-1 min-w-0">
            {label}
          </FormLabel>
          <div className="w-40">
            <FormControl>
              <CurrencyInput
                value={field.value as number}
                onChange={field.onChange}
                error={!!fieldState.error}
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage className="text-xs mt-1" />
          </div>
        </FormItem>
      )}
    />
  );

  const TotalRow = ({ label, value, isGrand }: { label: string; value: number; isGrand?: boolean }) => (
    <div
      className={cn(
        'flex items-center justify-between py-2 px-3 rounded-lg',
        isGrand ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted font-medium'
      )}
    >
      <span>{label}</span>
      <span className="font-mono">{formatCurrency(value)}</span>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Balance Status Banner */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border',
            totals.isBalanced
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          )}
        >
          {totals.isBalanced ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Balance Sheet is Balanced</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <div>
                <span className="font-medium">Balance Sheet does not balance</span>
                <span className="ml-2 text-sm opacity-80">
                  (Difference: {formatCurrency(Math.abs(totals.totalAssets - totals.totalEquityAndLiabilities))})
                </span>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Assets Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary">Non-Current Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('nonCurrentAssets.propertyPlantEquipment', 'Property, Plant & Equipment')}
                {renderField('nonCurrentAssets.intangibleAssets', 'Intangible Assets')}
                {renderField('nonCurrentAssets.investments', 'Investments')}
                {renderField('nonCurrentAssets.otherNonCurrentAssets', 'Other Non-Current Assets')}
                <TotalRow label="Total Non-Current Assets" value={totals.totalNonCurrentAssets} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary">Current Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('currentAssets.inventory', 'Inventory')}
                {renderField('currentAssets.tradeReceivables', 'Trade Receivables')}
                {renderField('currentAssets.cashAndEquivalents', 'Cash & Cash Equivalents')}
                {renderField('currentAssets.otherCurrentAssets', 'Other Current Assets')}
                <TotalRow label="Total Current Assets" value={totals.totalCurrentAssets} />
              </CardContent>
            </Card>

            <TotalRow label="TOTAL ASSETS" value={totals.totalAssets} isGrand />
          </div>

          {/* Equity & Liabilities Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-secondary">Equity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('equity.shareCapital', 'Share Capital')}
                {renderField('equity.retainedEarnings', 'Retained Earnings')}
                {renderField('equity.reserves', 'Reserves')}
                <TotalRow label="Total Equity" value={totals.totalEquity} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-secondary">Non-Current Liabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('nonCurrentLiabilities.longTermLoans', 'Long-Term Loans')}
                {renderField('nonCurrentLiabilities.deferredTax', 'Deferred Tax')}
                {renderField('nonCurrentLiabilities.otherNonCurrentLiabilities', 'Other Non-Current Liabilities')}
                <TotalRow label="Total Non-Current Liabilities" value={totals.totalNonCurrentLiabilities} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-secondary">Current Liabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('currentLiabilities.tradePayables', 'Trade Payables')}
                {renderField('currentLiabilities.shortTermLoans', 'Short-Term Loans')}
                {renderField('currentLiabilities.vatPayable', 'VAT Payable')}
                {renderField('currentLiabilities.otherCurrentLiabilities', 'Other Current Liabilities')}
                <TotalRow label="Total Current Liabilities" value={totals.totalCurrentLiabilities} />
              </CardContent>
            </Card>

            <TotalRow label="TOTAL EQUITY & LIABILITIES" value={totals.totalEquityAndLiabilities} isGrand />
          </div>
        </div>

        {!readOnly && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => form.reset(data)}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Balance Sheet'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
