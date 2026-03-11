import { cn } from '@/lib/utils';
// NOTE (2026-03-11): Iris icon asset replacing AuditNex/Jerome branding. Text-only logo replaced with iris-icon.png. Favicon updated to match.
import irisIcon from '@/assets/iris-icon-new.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img src={irisIcon} alt="Iris" className={cn('rounded-full', sizes[size])} style={{ width: 'auto' }} />
      <span className={cn(
        'font-bold tracking-tight text-foreground',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl',
      )}>
        Ir<span className="text-primary">is</span>
      </span>
    </div>
  );
}
