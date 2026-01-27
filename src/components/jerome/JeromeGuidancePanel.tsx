import { useJerome } from '@/contexts/JeromeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { useEffect } from 'react';

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  action: Sparkles,
};

const typeColors = {
  info: 'text-primary bg-primary/10 border-primary/20',
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  action: 'text-primary bg-accent border-primary/20',
};

export function JeromeGuidancePanel() {
  const { currentGuidance, markGuidanceRead } = useJerome();
  const navigate = useNavigate();

  useEffect(() => {
    markGuidanceRead();
  }, [markGuidanceRead]);

  if (currentGuidance.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Guidance Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Navigate to different pages to see contextual tips and guidance from Jerome.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-3">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Contextual Guidance
          </h3>
          <p className="text-xs text-muted-foreground">
            Tips for this page based on your current context
          </p>
        </div>

        {currentGuidance.map((guidance) => {
          const Icon = typeIcons[guidance.type];
          
          return (
            <Card
              key={guidance.id}
              className={cn(
                'border transition-all hover:shadow-md',
                typeColors[guidance.type]
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium leading-relaxed">
                      {guidance.message}
                    </p>
                    {guidance.actionLabel && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (guidance.actionRoute) {
                            navigate(guidance.actionRoute);
                          }
                        }}
                      >
                        {guidance.actionLabel}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
