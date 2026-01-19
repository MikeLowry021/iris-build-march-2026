import { cn } from '@/lib/utils';
import { StatusType } from '@/lib/types';
import { Check, AlertCircle, Clock, Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType | string;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete':
      case 'verified':
        return {
          label: status === 'verified' ? 'Verified' : 'Complete',
          icon: Check,
          className: 'status-badge-success',
        };
      case 'pending':
      case 'categorized':
        return {
          label: status === 'categorized' ? 'Categorized' : 'Pending',
          icon: Clock,
          className: 'status-badge-warning',
        };
      case 'action-required':
      case 'error':
        return {
          label: status === 'error' ? 'Error' : 'Action Required',
          icon: AlertCircle,
          className: 'status-badge-error',
        };
      case 'not-started':
      case 'uncategorized':
        return {
          label: status === 'uncategorized' ? 'Uncategorized' : 'Not Started',
          icon: Circle,
          className: 'status-badge-neutral',
        };
      default:
        return {
          label: status,
          icon: Circle,
          className: 'status-badge-neutral',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={cn('status-badge', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
