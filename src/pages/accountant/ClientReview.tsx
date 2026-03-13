import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReviewOverview } from '@/components/review/ReviewOverview';
import { IT14SDReconciliation } from '@/components/review/IT14SDReconciliation';
import { SignOffPanel } from '@/components/review/SignOffPanel';
import { ClientReview as ClientReviewType, ReviewComment } from '@/lib/review-types';
import { getClientReview, getReviewStatusLabel, getReviewStatusColor } from '@/lib/review-mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  FileText,
  Calculator,
  PenTool,
  LayoutDashboard,
} from 'lucide-react';


export default function ClientReview() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [review, setReview] = useState<ClientReviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      const data = clientId ? getClientReview(clientId) : undefined;
      setReview(data || null);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [clientId]);

  const handleChecklistToggle = (itemId: string, checked: boolean) => {
    if (!review) return;
    
    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        checklist: prev.checklist.map(item =>
          item.id === itemId
            ? {
                ...item,
                isChecked: checked,
                checkedBy: checked ? user?.name : undefined,
                checkedAt: checked ? new Date().toISOString() : undefined,
              }
            : item
        ),
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddComment = (content: string, section?: string) => {
    if (!review || !user) return;
    
    const newComment: ReviewComment = {
      id: `comment-${Date.now()}`,
      author: user.name,
      content,
      createdAt: new Date().toISOString(),
      section,
      isResolved: false,
    };

    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: [...prev.comments, newComment],
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    toast.success('Comment added');
  };

  const handleResolveComment = (commentId: string) => {
    if (!review || !user) return;
    
    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isResolved: true,
                resolvedAt: new Date().toISOString(),
                resolvedBy: user.name,
              }
            : comment
        ),
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    toast.success('Comment resolved');
  };

  const handleApprove = (signatureDataUrl: string) => {
    if (!review || !user) return;
    
    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        reviewStatus: 'completed',
        signature: {
          dataUrl: signatureDataUrl,
          signedBy: user.name,
          signedAt: new Date().toISOString(),
        },
        financialStatement: {
          ...prev.financialStatement,
          status: 'approved',
          reviewedAt: new Date().toISOString(),
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  };

  const handleRequestRevision = (reason: string) => {
    if (!review) return;
    
    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        reviewStatus: 'revision-requested',
        revisionReason: reason,
        financialStatement: {
          ...prev.financialStatement,
          status: 'rejected',
          comments: reason,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!review) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-semibold text-foreground">Client Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            The client you're looking for doesn't exist or has no financial statements.
          </p>
          <Button asChild>
            <Link to="/accountant">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0"
              onClick={() => navigate('/accountant')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{review.clientName}</h1>
                <StatusBadge 
                  status={getReviewStatusColor(review.reviewStatus) as any} 
                  label={getReviewStatusLabel(review.reviewStatus)}
                />
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{review.clientCompany}</span>
                <span className="text-border">•</span>
                <span>FY {review.financialYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4 hidden sm:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="it14sd" className="gap-2">
              <Calculator className="h-4 w-4 hidden sm:inline" />
              IT14SD
            </TabsTrigger>
            <TabsTrigger value="signoff" className="gap-2">
              <PenTool className="h-4 w-4 hidden sm:inline" />
              Sign-off
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ReviewOverview review={review} />
          </TabsContent>

          <TabsContent value="it14sd" className="mt-6">
            <IT14SDReconciliation
              review={review}
              onChecklistToggle={handleChecklistToggle}
            />
          </TabsContent>

          <TabsContent value="signoff" className="mt-6">
            <SignOffPanel
              review={review}
              onChecklistToggle={handleChecklistToggle}
              onApprove={handleApprove}
              onRequestRevision={handleRequestRevision}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
