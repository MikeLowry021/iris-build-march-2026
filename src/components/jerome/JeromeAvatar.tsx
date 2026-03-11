import { cn } from '@/lib/utils';
import irisIcon from '@/assets/iris-icon-new.png';

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
      {/* NOTE (2026-03-11): Iris icon asset replacing AuditNex/Jerome branding. Avatar "J" initial replaced with iris-icon.png. */}
      <div className={cn('rounded-full overflow-hidden shadow-lg', sizeClasses[size])}>
        <img
          src={irisIcon}
          alt="Iris AI"
          className="w-full h-full object-cover"
        />
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
