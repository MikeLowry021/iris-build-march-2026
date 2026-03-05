import { cn } from '@/lib/utils';
import irisAvatar from '@/assets/iris-avatar.png';

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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full shadow-lg overflow-hidden',
          sizeClasses[size]
        )}
      >
        <img src={irisAvatar} alt="Iris AI" className="w-full h-full object-cover" />
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
