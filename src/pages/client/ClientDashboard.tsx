import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockClientStatusCards, mockTransactions, formatCurrency } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuth();

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="mt-1 text-muted-foreground">
              Here's an overview of your accounting status
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/client/upload">
              <Upload className="h-4 w-4" />
              Upload Statement
            </Link>
          </Button>
        </div>

        {/* Status cards grid */}
        <div className="dashboard-grid">
          {mockClientStatusCards.map((card, index) => (
            <div
              key={card.id}
              className="status-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <StatusBadge status={card.status} className="mt-2" />
                </div>
                <Link
                  to={`/client/${card.id}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              
              <p className="mt-3 text-sm text-foreground">{card.description}</p>
              
              {card.dueDate && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Due: {new Date(card.dueDate).toLocaleDateString('en-ZA', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
              )}

              {card.progress !== undefined && (
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{card.progress}%</span>
                  </div>
                  <Progress value={card.progress} className="h-1.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent transactions and quick actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent transactions */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="section-title">Recent Transactions</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/client/transactions">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          transaction.amount > 0 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {transaction.description.length > 35
                            ? transaction.description.slice(0, 35) + '...'
                            : transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('en-ZA')} • {transaction.bank}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-success' : 'text-foreground'
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </p>
                      <StatusBadge status={transaction.status} showIcon={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="section-title mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/client/upload">
                    <Upload className="mr-2 h-4 w-4 text-primary" />
                    Upload Bank Statement
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/client/financials">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    Review Financials
                  </Link>
                </Button>
              </div>
            </div>

            {/* Company info */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="section-title mb-3">Company Details</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{user?.company}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tax Year</p>
                  <p className="font-medium">2025/2026</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned Accountant</p>
                  <p className="font-medium">Sarah van der Berg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
