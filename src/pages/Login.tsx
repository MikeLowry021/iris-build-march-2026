import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { 
  Building2, 
  User, 
  Loader2, 
  ArrowRight, 
  BookOpen, 
  Shield,
  Bot,
  Mail,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

import { Briefcase } from 'lucide-react';

const demoProfiles: { role: UserRole; label: string; icon: React.ElementType; email: string }[] = [
  { role: 'client', label: 'Client', icon: User, email: 'client@iris.demo' },
  { role: 'bookkeeper', label: 'Bookkeeper', icon: BookOpen, email: 'bookkeeper@iris.demo' },
  { role: 'accountant', label: 'Accountant', icon: Building2, email: 'accountant@iris.demo' },
  { role: 'ceo', label: 'CEO', icon: Briefcase, email: 'ceo@iris.demo' },
  { role: 'admin', label: 'Admin', icon: Shield, email: 'admin@iris.demo' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');

  const getRedirectPath = (role: UserRole): string => {
    switch (role) {
      case 'admin': return '/admin';
      case 'ceo': return '/ceo';
      case 'accountant': return '/accountant';
      case 'bookkeeper': return '/bookkeeper';
      case 'client': return '/client';
      default: return '/client';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      // For demo, detect role from email
      let role: UserRole = 'client';
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('ceo')) role = 'ceo';
      else if (email.includes('accountant')) role = 'accountant';
      else if (email.includes('bookkeeper')) role = 'bookkeeper';
      
      const success = await login(email, password, role);
      if (success) {
        navigate(getRedirectPath(role));
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setLoadingRole(role);
    
    try {
      const profile = demoProfiles.find(p => p.role === role);
      const success = await login(profile?.email || `${role}@iris.demo`, 'demo123', role);
      if (success) {
        navigate(getRedirectPath(role));
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center justify-between">
            <Logo size="lg" />
            <ThemeToggle />
          </div>

          <div className="mt-10">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your accounting portal
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.co.za"
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Profiles Section */}
            <div className="mt-8">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                  Demo Profiles
                </span>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground mb-4">
                Quick access for demonstration purposes
              </p>

              <div className="grid grid-cols-2 gap-3">
                {demoProfiles.map((profile) => {
                  const Icon = profile.icon;
                  const isLoadingThis = loadingRole === profile.role;
                  
                  return (
                    <button
                      key={profile.role}
                      type="button"
                      onClick={() => handleDemoLogin(profile.role)}
                      disabled={loadingRole !== null}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-lg border-2 border-border p-3 text-sm font-medium transition-all duration-200',
                        'bg-background text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isLoadingThis ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {profile.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Contact your accountant
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Decorative */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-white">
                Professional Accounting,<br />
                Made Simple.
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Streamline your bookkeeping, VAT returns, and tax compliance with Iris — 
                built for South African businesses.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  VAT201 Filing
                </div>
                <div className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  PAYE Returns
                </div>
                <div className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  IT14SD Reconciliation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
