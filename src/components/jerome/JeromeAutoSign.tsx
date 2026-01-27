import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Check, 
  X, 
  FileSignature, 
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { jeromeAutoSignLogs } from '@/lib/jerome-mock-data';
import { format } from 'date-fns';

interface JeromeAutoSignProps {
  showRecent?: boolean;
}

export function JeromeAutoSign({ showRecent = true }: JeromeAutoSignProps) {
  const recentLogs = jeromeAutoSignLogs.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Current Auto-Sign Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Auto-Sign Workflow</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-xs text-muted-foreground mb-3">
            Jerome automatically signs documents when all conditions are met.
            This feature is powered by Dr. Swartz's compliance verification protocols.
          </p>
          
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Required Conditions
            </h4>
            <div className="space-y-1.5">
              {[
                'Trial Balance = Adjusted TB = Financials',
                'All transactions categorized',
                'All adjusting entries reviewed',
                'No critical discrepancies detected',
              ].map((condition, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Auto-Sign Activity */}
      {showRecent && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            Recent Auto-Sign Activity
          </h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {log.documentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.clientName}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 text-xs',
                          log.status === 'signed' 
                            ? 'bg-success/10 text-success border-success/20'
                            : log.status === 'failed'
                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        )}
                      >
                        {log.status === 'signed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {log.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {log.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {log.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      {format(log.signedAt, 'MMM d, yyyy h:mm a')}
                    </div>

                    {/* Conditions */}
                    <div className="flex flex-wrap gap-1">
                      {log.conditions.map((condition) => (
                        <div
                          key={condition.id}
                          className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                            condition.met
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          )}
                        >
                          {condition.met ? (
                            <Check className="h-2.5 w-2.5" />
                          ) : (
                            <X className="h-2.5 w-2.5" />
                          )}
                          <span className="truncate max-w-[120px]">
                            {condition.label.split('=')[0].trim()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {log.failureReason && (
                      <p className="mt-2 text-xs text-destructive bg-destructive/10 rounded p-2">
                        {log.failureReason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
