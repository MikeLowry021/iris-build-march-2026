import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface JeromeAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function JeromeAvatar({ size = 'md', className, showLabel = false }: JeromeAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg',
          sizeClasses[size]
        )}
      >
        <Bot className={iconSizes[size]} />
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Jerome</span>
          <span className="text-xs text-muted-foreground">AI Assistant</span>
        </div>
      )}
    </div>
  );
}
