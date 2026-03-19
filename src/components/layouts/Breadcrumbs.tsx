import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Chrome as Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  // Client routes
  'client': 'Client',
  'upload': 'Upload Statements',
  'transactions': 'Transactions',
  'financials': 'Financials',
  'tax-status': 'Tax Status',
  'payslips': 'Payslips',
  'reports': 'Reports',
  'help': 'Help',
  
  // Bookkeeper routes
  'bookkeeper': 'Bookkeeper',
  'categorize': 'Categorize Transactions',
  'adjusting-entries': 'Adjusting Entries',
  'draft-reports': 'Draft Reports',
  'clients': 'Clients',
  
  // Accountant routes
  'accountant': 'Accountant',
  'review': 'Review',
  'sign-off': 'Sign-Off',
  'audit-trail': 'Audit Trail',
  'settings': 'Settings',
  
  // CEO / Director routes
  'ceo': 'Director',

  // Admin routes
  'admin': 'Admin',
  'manage-clients': 'Manage Clients',
  'manage-bookkeepers': 'Manage Bookkeepers',
  'system-settings': 'System Settings',
  'audit-logs': 'Audit Logs',
  'backup-security': 'Backup & Security',
  'jerome': 'Jerome AI',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) return null;
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Iris', path: '/' },
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // Don't add link for the last item (current page)
    if (index === pathSegments.length - 1) {
      breadcrumbs.push({ label });
    } else {
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          {item.path ? (
            <Link
              to={item.path}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors',
                index === 0 && 'flex items-center gap-1'
              )}
            >
              {index === 0 && <Home className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
