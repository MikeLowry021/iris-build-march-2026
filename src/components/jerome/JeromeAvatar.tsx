import { cn } from '@/lib/utils';

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

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg font-bold',
          sizeClasses[size],
          textSizes[size]
        )}
      >
        J
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Iris AI</span>
          <span className="text-xs text-muted-foreground">Assistant</span>
        </div>
      )}
    </div>
  );
}
