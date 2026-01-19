import { useState } from 'react';
import { ChecklistItem, getChecklistProgress } from '@/lib/review-types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerificationChecklistProps {
  items: ChecklistItem[];
  onItemToggle: (itemId: string, checked: boolean) => void;
  category?: ChecklistItem['category'];
  title?: string;
  readonly?: boolean;
  showProgress?: boolean;
}

const categoryLabels: Record<ChecklistItem['category'], string> = {
  'balance-sheet': 'Balance Sheet',
  'profit-loss': 'Profit & Loss',
  'it14sd': 'IT14SD Reconciliation',
  'general': 'General',
};

export function VerificationChecklist({
  items,
  onItemToggle,
  category,
  title,
  readonly = false,
  showProgress = true,
}: VerificationChecklistProps) {
  const filteredItems = category 
    ? items.filter(item => item.category === category)
    : items;

  const progress = getChecklistProgress(filteredItems);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {title || (category ? categoryLabels[category] : 'Verification Checklist')}
          </CardTitle>
          {showProgress && (
            <Badge 
              variant={progress.percentage === 100 ? 'default' : 'secondary'}
              className={cn(
                progress.percentage === 100 && 'bg-success text-success-foreground'
              )}
            >
              {progress.completed}/{progress.total}
            </Badge>
          )}
        </div>
        {showProgress && (
          <Progress 
            value={progress.percentage} 
            className="h-1.5 mt-2" 
          />
        )}
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 rounded-lg p-2.5 transition-colors',
              !readonly && 'hover:bg-muted/50',
              item.isChecked && 'bg-success/5'
            )}
          >
            <Checkbox
              id={item.id}
              checked={item.isChecked}
              onCheckedChange={(checked) => onItemToggle(item.id, checked as boolean)}
              disabled={readonly}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <label
                htmlFor={item.id}
                className={cn(
                  'text-sm cursor-pointer',
                  item.isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
                )}
              >
                {item.label}
              </label>
              
              {item.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="inline-block ml-1.5 h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {item.isChecked && item.checkedBy && item.checkedAt && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span>{item.checkedBy}</span>
                  <span>•</span>
                  <span>{formatDate(item.checkedAt)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            No checklist items
          </div>
        )}
      </CardContent>
    </Card>
  );
}
