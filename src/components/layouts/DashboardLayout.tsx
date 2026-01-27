import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Receipt,
  Calculator,
  Users,
  ClipboardCheck,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const clientNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { label: 'Upload Statements', href: '/client/upload', icon: Upload },
  { label: 'Transactions', href: '/client/transactions', icon: Receipt },
  { label: 'Financials', href: '/client/financials', icon: FileText },
  { label: 'VAT', href: '/client/vat', icon: Calculator },
];

const accountantNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/accountant', icon: LayoutDashboard },
  { label: 'Clients', href: '/accountant/clients', icon: Users },
  { label: 'Reviews', href: '/accountant/reviews', icon: ClipboardCheck },
  { label: 'Payroll', href: '/accountant/payroll', icon: Wallet },
];

const bookkeeperNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/bookkeeper', icon: LayoutDashboard },
  { label: 'Categorize', href: '/bookkeeper/clients/1/categorize', icon: Receipt },
  { label: 'Adjusting Entries', href: '/bookkeeper/clients/1/adjusting-entries', icon: FileText },
  { label: 'Draft Reports', href: '/bookkeeper/clients/1/draft-reports', icon: ClipboardCheck },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'accountant' 
    ? accountantNavItems 
    : user?.role === 'bookkeeper' 
      ? bookkeeperNavItems 
      : clientNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Logo size="md" />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map(item => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn('nav-link', isActive && 'nav-link-active')}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-3">
            <Link
              to="/settings"
              className="nav-link"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden text-sm text-muted-foreground lg:block">
              {user?.role === 'accountant' 
                ? 'Accountant Portal' 
                : user?.role === 'bookkeeper' 
                  ? 'Bookkeeper Portal' 
                  : 'Client Portal'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {user ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
