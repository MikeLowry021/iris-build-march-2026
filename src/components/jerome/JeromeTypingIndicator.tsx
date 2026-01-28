import { cn } from '@/lib/utils';

interface JeromeTypingIndicatorProps {
  className?: string;
}

export function JeromeTypingIndicator({ className }: JeromeTypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="text-xs text-muted-foreground">Jerome is thinking</span>
      <div className="flex gap-0.5">
        <span 
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '0ms' }}
        />
        <span 
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '150ms' }}
        />
        <span 
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
