import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Receipt, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { mockClients, mockTransactions, formatCurrency } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

// Mock documents data
const mockDocuments = [
  { id: '1', name: 'VAT201 - January 2026', type: 'VAT Return', client: 'Mokwena Trading', path: '/client/financials' },
  { id: '2', name: 'EMP201 - December 2025', type: 'PAYE Return', client: 'Mokwena Trading', path: '/client/financials' },
  { id: '3', name: 'IT14 - 2025 Tax Year', type: 'Income Tax', client: 'Nkosi Technologies', path: '/client/financials' },
  { id: '4', name: 'Balance Sheet - Q4 2025', type: 'Financial Statement', client: 'Coastal Imports', path: '/client/financials' },
  { id: '5', name: 'Profit & Loss - 2025', type: 'Financial Statement', client: 'Botha Agricultural', path: '/client/financials' },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  // Filter results based on user role
  const canViewClients = ['accountant', 'admin', 'bookkeeper'].includes(user?.role || '');
  const canViewTransactions = ['accountant', 'admin', 'bookkeeper', 'client'].includes(user?.role || '');

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:w-64 md:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline-flex">Search everything...</span>
        <span className="inline-flex sm:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search clients, transactions, documents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Clients */}
          {canViewClients && (
            <CommandGroup heading="Clients">
              {mockClients.slice(0, 5).map((client) => (
                <CommandItem
                  key={client.id}
                  value={`client-${client.name}-${client.company}`}
                  onSelect={() => handleSelect(`/accountant/clients/${client.id}`)}
                >
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{client.company}</span>
                    <span className="text-xs text-muted-foreground">{client.name} • {client.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Transactions */}
          {canViewTransactions && (
            <CommandGroup heading="Recent Transactions">
              {mockTransactions.slice(0, 5).map((tx) => (
                <CommandItem
                  key={tx.id}
                  value={`transaction-${tx.description}-${tx.amount}`}
                  onSelect={() => handleSelect(user?.role === 'client' ? '/client/transactions' : '/bookkeeper/categorize')}
                >
                  <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[200px]">{tx.description}</span>
                      <span className="text-xs text-muted-foreground">{tx.date} • {tx.bank}</span>
                    </div>
                    <span className={tx.amount >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Documents */}
          <CommandGroup heading="Documents">
            {mockDocuments.map((doc) => (
              <CommandItem
                key={doc.id}
                value={`document-${doc.name}-${doc.type}-${doc.client}`}
                onSelect={() => handleSelect(doc.path)}
              >
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{doc.name}</span>
                  <span className="text-xs text-muted-foreground">{doc.type} • {doc.client}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect('/settings')}>
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Go to Settings</span>
            </CommandItem>
            {user?.role === 'client' && (
              <CommandItem onSelect={() => handleSelect('/client/upload')}>
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Upload Bank Statement</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
