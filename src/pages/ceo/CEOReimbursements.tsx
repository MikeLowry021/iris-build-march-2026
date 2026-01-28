import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Plus,
  Check,
  X,
  Eye,
  Download,
  FileText,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCEOReimbursements } from '@/lib/ceo-mock-data';
import {
  formatCurrency,
  getReimbursementStatusLabel,
  CEOExpenseReimbursement,
  ReimbursementStatus,
} from '@/lib/ceo-types';

const CEOReimbursements = () => {
  const [reimbursements, setReimbursements] = useState(mockCEOReimbursements);
  const [selectedReimbursement, setSelectedReimbursement] = useState<CEOExpenseReimbursement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [requestInfoDialogId, setRequestInfoDialogId] = useState<string | null>(null);

  const pendingReimbursements = reimbursements.filter((r) => r.status === 'pending');
  const approvedReimbursements = reimbursements.filter((r) => r.status === 'approved');
  const paidReimbursements = reimbursements.filter((r) => r.status === 'paid');
  const rejectedReimbursements = reimbursements.filter((r) => r.status === 'rejected');

  const getStatusBadgeVariant = (status: ReimbursementStatus) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'paid':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleApprove = (id: string) => {
    setReimbursements(
      reimbursements.map((r) =>
        r.id === id
          ? { ...r, status: 'approved' as const, approvedAt: new Date().toISOString(), approvedBy: 'Jane Smith' }
          : r
      )
    );
    setSelectedReimbursement(null);
    toast.success('Expense reimbursement approved');
  };

  const handleReject = (id: string, reason?: string) => {
    setReimbursements(
      reimbursements.map((r) =>
        r.id === id
          ? { ...r, status: 'rejected' as const, rejectionReason: reason || 'Not approved' }
          : r
      )
    );
    setSelectedReimbursement(null);
    toast.success('Expense reimbursement rejected');
  };

  const handleRequestInfo = (id: string, message: string) => {
    toast.success(`Request for more information sent to employee`);
    setRequestInfoDialogId(null);
  };

  const getMonthlyStats = () => {
    const thisMonth = reimbursements.filter(
      (r) => new Date(r.submissionDate).getMonth() === new Date().getMonth()
    );
    return {
      total: thisMonth.length,
      approved: thisMonth.filter((r) => r.status === 'approved' || r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
      rejected: thisMonth.filter((r) => r.status === 'rejected').reduce((sum, r) => sum + r.amount, 0),
    };
  };

  const monthlyStats = getMonthlyStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Expense Reimbursements</h1>
            <p className="text-muted-foreground">Review and approve staff expense claims</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Business Expense</DialogTitle>
                <DialogDescription>
                  Submit your own business expense for review by your accountant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Describe the expense" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">Travel & Entertainment</SelectItem>
                        <SelectItem value="supplies">Office Supplies</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (R)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Upload Receipt</Label>
                  <Input type="file" accept="image/*,.pdf" />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea placeholder="Additional details about this expense" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Expense submitted for review');
                  setIsAddDialogOpen(false);
                }}>
                  Submit Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold">{pendingReimbursements.length}</p>
              <p className="text-xs text-muted-foreground">
                Total: {formatCurrency(pendingReimbursements.reduce((sum, r) => sum + r.amount, 0))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">This Month Approved</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(monthlyStats.approved)}</p>
              <p className="text-xs text-muted-foreground">{monthlyStats.total} submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">This Month Rejected</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(monthlyStats.rejected)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">YTD Approved</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  reimbursements
                    .filter((r) => r.status === 'approved' || r.status === 'paid')
                    .reduce((sum, r) => sum + r.amount, 0)
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              {pendingReimbursements.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingReimbursements.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Reimbursements</CardTitle>
                <CardDescription>Review and approve pending expense claims</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReimbursements.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No pending reimbursements
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingReimbursements.map((reimbursement) => (
                      <div
                        key={reimbursement.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{reimbursement.employeeName}</p>
                            <Badge variant="outline">{reimbursement.category}</Badge>
                          </div>
                          <p className="text-sm">{reimbursement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(reimbursement.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold">{formatCurrency(reimbursement.amount)}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedReimbursement(reimbursement)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(reimbursement.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(reimbursement.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Reimbursements</CardTitle>
                <CardDescription>Expenses approved and awaiting payment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedReimbursements.map((reimbursement) => (
                      <TableRow key={reimbursement.id}>
                        <TableCell className="font-medium">{reimbursement.employeeName}</TableCell>
                        <TableCell>{reimbursement.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{reimbursement.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(reimbursement.amount)}</TableCell>
                        <TableCell>
                          {reimbursement.approvedAt && new Date(reimbursement.approvedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reimbursement History</CardTitle>
                    <CardDescription>All past expense reimbursements</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...paidReimbursements, ...rejectedReimbursements].map((reimbursement) => (
                      <TableRow key={reimbursement.id}>
                        <TableCell>{new Date(reimbursement.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{reimbursement.employeeName}</TableCell>
                        <TableCell>{reimbursement.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{reimbursement.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(reimbursement.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(reimbursement.status)}>
                            {getReimbursementStatusLabel(reimbursement.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={!!selectedReimbursement} onOpenChange={() => setSelectedReimbursement(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Review Expense Reimbursement</DialogTitle>
              <DialogDescription>
                Review the details and approve or reject this expense claim
              </DialogDescription>
            </DialogHeader>
            {selectedReimbursement && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{selectedReimbursement.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Submitted</p>
                    <p className="font-medium">
                      {new Date(selectedReimbursement.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedReimbursement.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="outline">{selectedReimbursement.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedReimbursement.amount)}</p>
                  </div>
                </div>
                {selectedReimbursement.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes from Employee</p>
                    <p className="text-sm">{selectedReimbursement.notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-1 h-4 w-4" />
                    View Receipt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    {selectedReimbursement.isDeductible ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm">
                      {selectedReimbursement.isDeductible
                        ? `Deductible (${selectedReimbursement.taxCategory})`
                        : 'Not deductible'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setRequestInfoDialogId(selectedReimbursement?.id || null)}
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                Request Info
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => selectedReimbursement && handleReject(selectedReimbursement.id)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => selectedReimbursement && handleApprove(selectedReimbursement.id)}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Request Info Dialog */}
        <Dialog open={!!requestInfoDialogId} onOpenChange={() => setRequestInfoDialogId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request More Information</DialogTitle>
              <DialogDescription>
                Send a message to the employee requesting additional details
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Please provide more details about this expense..."
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestInfoDialogId(null)}>
                Cancel
              </Button>
              <Button onClick={() => requestInfoDialogId && handleRequestInfo(requestInfoDialogId, '')}>
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CEOReimbursements;
