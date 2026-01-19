import { cn } from '@/lib/utils';

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
      <div className={cn('relative flex items-center justify-center rounded-lg bg-primary', sizes[size])}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={cn('text-primary-foreground', sizes[size])}
          style={{ width: 'auto' }}
        >
          <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0" />
          <path
            d="M8 24L16 8L24 24H20L16 16L12 24H8Z"
            fill="currentColor"
          />
          <path
            d="M14 20H18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className={cn(
        'font-bold tracking-tight text-foreground',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl',
      )}>
        Audit<span className="text-primary">Nex</span>
      </span>
    </div>
  );
}
