import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfitLossData, profitLossSchema, calculateProfitLossTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';
import { CurrencyInput } from './CurrencyInput';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ProfitLossFormProps {
  data: ProfitLossData;
  onSave: (data: ProfitLossData) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function ProfitLossForm({ data, onSave, isSubmitting, readOnly }: ProfitLossFormProps) {
  const form = useForm<ProfitLossData>({
    resolver: zodResolver(profitLossSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const watchedValues = form.watch();
  const [totals, setTotals] = useState(() => calculateProfitLossTotals(data));

  useEffect(() => {
    setTotals(calculateProfitLossTotals(watchedValues));
  }, [watchedValues]);

  const handleSubmit = (formData: ProfitLossData) => {
    onSave(formData);
  };

  const renderField = (
    name: `${keyof ProfitLossData}.${string}`,
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

  const TotalRow = ({ label, value, percentage, isGrand, isNegative }: { 
    label: string; 
    value: number; 
    percentage?: number;
    isGrand?: boolean;
    isNegative?: boolean;
  }) => (
    <div
      className={cn(
        'flex items-center justify-between py-2 px-3 rounded-lg',
        isGrand 
          ? value >= 0 
            ? 'bg-success text-success-foreground font-semibold' 
            : 'bg-destructive text-destructive-foreground font-semibold'
          : 'bg-muted font-medium'
      )}
    >
      <span>{label}</span>
      <span className="font-mono flex items-center gap-2">
        {isNegative && value > 0 ? `(${formatCurrency(value)})` : formatCurrency(value)}
        {percentage !== undefined && (
          <span className={cn('text-xs', isGrand ? 'opacity-80' : 'text-muted-foreground')}>
            ({percentage.toFixed(1)}%)
          </span>
        )}
      </span>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Profit Summary Banner */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border',
            totals.netProfit >= 0
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          )}
        >
          {totals.netProfit >= 0 ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          <div className="flex-1">
            <span className="font-medium">
              {totals.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
            </span>
            <span className="ml-2 text-lg font-bold">
              {formatCurrency(Math.abs(totals.netProfit))}
            </span>
          </div>
          <div className="text-right text-sm">
            <div>Gross Margin: {totals.grossProfitMargin.toFixed(1)}%</div>
            <div>Net Margin: {totals.netProfitMargin.toFixed(1)}%</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue & Cost of Sales */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-success">Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('revenue.salesRevenue', 'Sales Revenue')}
                {renderField('revenue.serviceRevenue', 'Service Revenue')}
                {renderField('revenue.otherIncome', 'Other Income')}
                <TotalRow label="Total Revenue" value={totals.totalRevenue} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-destructive">Cost of Sales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('costOfSales.directMaterials', 'Direct Materials')}
                {renderField('costOfSales.directLabor', 'Direct Labor')}
                {renderField('costOfSales.manufacturingOverhead', 'Manufacturing Overhead')}
                <TotalRow label="Total Cost of Sales" value={totals.totalCostOfSales} />
              </CardContent>
            </Card>

            <TotalRow 
              label="GROSS PROFIT" 
              value={totals.grossProfit} 
              percentage={totals.grossProfitMargin}
              isGrand 
            />
          </div>

          {/* Operating Expenses & Other Items */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-secondary">Operating Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('operatingExpenses.salariesWages', 'Salaries & Wages')}
                {renderField('operatingExpenses.rentUtilities', 'Rent & Utilities')}
                {renderField('operatingExpenses.depreciation', 'Depreciation')}
                {renderField('operatingExpenses.marketing', 'Marketing & Advertising')}
                {renderField('operatingExpenses.professional', 'Professional Fees')}
                {renderField('operatingExpenses.insurance', 'Insurance')}
                {renderField('operatingExpenses.other', 'Other Expenses')}
                <TotalRow label="Total Operating Expenses" value={totals.totalOperatingExpenses} />
              </CardContent>
            </Card>

            <TotalRow 
              label="OPERATING PROFIT" 
              value={totals.operatingProfit} 
              percentage={totals.operatingMargin}
              isGrand 
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-muted-foreground">Other Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderField('otherItems.interestIncome', 'Interest Income')}
                {renderField('otherItems.interestExpense', 'Interest Expense')}
                <TotalRow 
                  label={`Net Finance ${totals.netInterest >= 0 ? 'Income' : 'Cost'}`} 
                  value={totals.netInterest} 
                />
                <div className="border-t pt-3 mt-3">
                  <TotalRow label="Profit Before Tax" value={totals.profitBeforeTax} />
                  {renderField('otherItems.taxExpense', 'Income Tax Expense')}
                </div>
              </CardContent>
            </Card>

            <TotalRow 
              label="NET PROFIT" 
              value={totals.netProfit} 
              percentage={totals.netProfitMargin}
              isGrand 
            />
          </div>
        </div>

        {!readOnly && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => form.reset(data)}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Profit & Loss'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
