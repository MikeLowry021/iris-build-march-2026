import { useJerome } from '@/contexts/JeromeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Lightbulb,
  Receipt,
  Wallet,
  FileText,
  Shield,
  Calculator
} from 'lucide-react';

const categoryIcons = {
  tax: Calculator,
  vat: Receipt,
  paye: Wallet,
  deduction: FileText,
  compliance: Shield,
  general: Lightbulb,
};

const categoryColors = {
  tax: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  vat: 'bg-green-500/10 text-green-600 dark:text-green-400',
  paye: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  deduction: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  compliance: 'bg-red-500/10 text-red-600 dark:text-red-400',
  general: 'bg-primary/10 text-primary',
};

const priorityBadges = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-muted text-muted-foreground',
};

export function JeromeTipsPanel() {
  const { tips } = useJerome();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-3">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Tips & Guidance Library
          </h3>
          <p className="text-xs text-muted-foreground">
            Expert accounting tips powered by Dr. Swartz's knowledge
          </p>
        </div>

        {tips.map((tip) => {
          const Icon = categoryIcons[tip.category];
          
          return (
            <Card key={tip.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('rounded-lg p-1.5', categoryColors[tip.category])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-semibold">
                      {tip.title}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs capitalize', priorityBadges[tip.priority])}
                  >
                    {tip.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 px-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.content}
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {tip.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
