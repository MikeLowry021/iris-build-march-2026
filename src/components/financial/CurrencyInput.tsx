import { forwardRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => 
      value === 0 ? '' : value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      setDisplayValue(value === 0 ? '' : value.toString());
    }, [value]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      const numValue = parseFloat(displayValue.replace(/[^\d.-]/g, '')) || 0;
      onChange(numValue);
      setDisplayValue(
        numValue === 0 ? '' : numValue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
    }, [displayValue, onChange]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Allow numbers, decimal point, and minus sign
      if (/^-?\d*\.?\d*$/.test(rawValue) || rawValue === '') {
        setDisplayValue(rawValue);
      }
    }, []);

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          R
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'pl-7 text-right font-mono',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
