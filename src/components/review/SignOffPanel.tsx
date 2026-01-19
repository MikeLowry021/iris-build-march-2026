import { useState } from 'react';
import { ClientReview, getChecklistProgress, isChecklistComplete, getUnresolvedCommentsCount } from '@/lib/review-types';
import { SignatureCapture } from './SignatureCapture';
import { VerificationChecklist } from './VerificationChecklist';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileCheck,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SignOffPanelProps {
  review: ClientReview;
  onChecklistToggle: (itemId: string, checked: boolean) => void;
  onApprove: (signatureDataUrl: string) => void;
  onRequestRevision: (reason: string) => void;
}

export function SignOffPanel({
  review,
  onChecklistToggle,
  onApprove,
  onRequestRevision,
}: SignOffPanelProps) {
  const { user } = useAuth();
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [revisionReason, setRevisionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const checklistProgress = getChecklistProgress(review.checklist);
  const allChecklistComplete = isChecklistComplete(review.checklist);
  const unresolvedComments = getUnresolvedCommentsCount(review.comments);
  const canSignOff = allChecklistComplete && unresolvedComments === 0 && signatureDataUrl;

  const handleApprove = async () => {
    if (!signatureDataUrl) return;
    
    setIsApproving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onApprove(signatureDataUrl);
    setIsApproving(false);
    toast.success('Financial statements approved successfully');
  };

  const handleRequestRevision = () => {
    if (!revisionReason.trim()) {
      toast.error('Please provide a reason for requesting revision');
      return;
    }
    
    setIsRejecting(true);
    // Simulate API call
    setTimeout(() => {
      onRequestRevision(revisionReason);
      setIsRejecting(false);
      toast.success('Revision request sent to client');
    }, 500);
  };

  const PrerequisiteItem = ({ 
    label, 
    isComplete, 
    detail 
  }: { 
    label: string; 
    isComplete: boolean; 
    detail?: string;
  }) => (
    <div className={cn(
      'flex items-center gap-3 rounded-lg p-3',
      isComplete ? 'bg-success/5' : 'bg-muted/50'
    )}>
      {isComplete ? (
        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
      <div className="flex-1">
        <p className={cn(
          'text-sm font-medium',
          isComplete ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {label}
        </p>
        {detail && (
          <p className="text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sign-off Status Banner */}
      <Card className={cn(
        canSignOff 
          ? 'border-success/50 bg-success/5' 
          : 'border-warning/50 bg-warning/5'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {canSignOff ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning" />
            )}
            <div>
              <p className="text-sm font-medium">
                {canSignOff 
                  ? 'Ready for sign-off' 
                  : 'Complete all prerequisites before signing off'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {checklistProgress.completed} of {checklistProgress.total} checklist items complete
                {unresolvedComments > 0 && ` • ${unresolvedComments} unresolved comment${unresolvedComments > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column - Prerequisites */}
        <div className="space-y-4">
          {/* Prerequisites Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sign-off Prerequisites
              </CardTitle>
              <CardDescription>
                All items must be complete before signing off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrerequisiteItem
                label="Balance Sheet verification complete"
                isComplete={checklistProgress.byCategory.find(c => c.category === 'balance-sheet')?.completed === 
                           checklistProgress.byCategory.find(c => c.category === 'balance-sheet')?.total}
                detail={`${checklistProgress.byCategory.find(c => c.category === 'balance-sheet')?.completed || 0} of ${checklistProgress.byCategory.find(c => c.category === 'balance-sheet')?.total || 0} items`}
              />
              <PrerequisiteItem
                label="Profit & Loss verification complete"
                isComplete={checklistProgress.byCategory.find(c => c.category === 'profit-loss')?.completed === 
                           checklistProgress.byCategory.find(c => c.category === 'profit-loss')?.total}
                detail={`${checklistProgress.byCategory.find(c => c.category === 'profit-loss')?.completed || 0} of ${checklistProgress.byCategory.find(c => c.category === 'profit-loss')?.total || 0} items`}
              />
              <PrerequisiteItem
                label="IT14SD reconciliation verified"
                isComplete={checklistProgress.byCategory.find(c => c.category === 'it14sd')?.completed === 
                           checklistProgress.byCategory.find(c => c.category === 'it14sd')?.total}
                detail={`${checklistProgress.byCategory.find(c => c.category === 'it14sd')?.completed || 0} of ${checklistProgress.byCategory.find(c => c.category === 'it14sd')?.total || 0} items`}
              />
              <PrerequisiteItem
                label="General verification complete"
                isComplete={checklistProgress.byCategory.find(c => c.category === 'general')?.completed === 
                           checklistProgress.byCategory.find(c => c.category === 'general')?.total}
                detail={`${checklistProgress.byCategory.find(c => c.category === 'general')?.completed || 0} of ${checklistProgress.byCategory.find(c => c.category === 'general')?.total || 0} items`}
              />
              <PrerequisiteItem
                label="All comments resolved"
                isComplete={unresolvedComments === 0}
                detail={unresolvedComments > 0 ? `${unresolvedComments} comment${unresolvedComments > 1 ? 's' : ''} need resolution` : 'No outstanding comments'}
              />
              <PrerequisiteItem
                label="Digital signature captured"
                isComplete={!!signatureDataUrl}
              />
            </CardContent>
          </Card>

          {/* General Checklist */}
          <VerificationChecklist
            items={review.checklist}
            onItemToggle={onChecklistToggle}
            category="general"
            title="General Verification"
          />
        </div>

        {/* Right column - Signature & Actions */}
        <div className="space-y-4">
          {/* Declaration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Declaration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I, <strong className="text-foreground">{user?.name}</strong>, hereby confirm that I have 
                  reviewed the financial statements for <strong className="text-foreground">{review.clientCompany}</strong> for 
                  the financial year ending <strong className="text-foreground">{review.financialYear}</strong>. 
                  I have verified that:
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    The Balance Sheet and Profit & Loss statements are accurate and complete
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    The Trial Balance reconciles with the Financial Statements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    All verification procedures have been completed satisfactorily
                  </li>
                </ul>
              </div>

              <SignatureCapture
                onSignatureChange={setSignatureDataUrl}
                disabled={!allChecklistComplete || unresolvedComments > 0}
              />

              {/* Approve Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!canSignOff || isApproving}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve Financial Statements
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to approve the financial statements for {review.clientCompany}. 
                      This action will mark the statements as approved and notify the client.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove}>
                      Confirm Approval
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Request Revision Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-destructive flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Request Revision
              </CardTitle>
              <CardDescription>
                If issues are found, request the client to revise their submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the issues found and what changes are required..."
                value={revisionReason}
                onChange={e => setRevisionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    disabled={!revisionReason.trim() || isRejecting}
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Request Revision
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Revision Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to request a revision from {review.clientCompany}. 
                      They will be notified and asked to update their financial statements.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleRequestRevision}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Send Revision Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
