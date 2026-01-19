// Review Types for Client Review and Sign-off (Phases 2 + 3)

import { FinancialStatement } from './financial-types';

// Verification checklist item
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  isChecked: boolean;
  checkedBy?: string;
  checkedAt?: string;
  category: 'balance-sheet' | 'profit-loss' | 'it14sd' | 'general';
}

// Comment/note from accountant
export interface ReviewComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  section?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

// IT14SD Trial Balance line item
export interface TrialBalanceLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  category: 'non-current-assets' | 'current-assets' | 'equity' | 'non-current-liabilities' | 'current-liabilities' | 'revenue' | 'cost-of-sales' | 'expenses' | 'other';
  mappedTo?: string;
  variance?: number;
}

// Digital signature data
export interface SignatureData {
  dataUrl: string;
  signedBy: string;
  signedAt: string;
  ipAddress?: string;
}

// Review status
export type ReviewStatus = 'not-started' | 'in-progress' | 'pending-signoff' | 'completed' | 'revision-requested';

// Complete client review state
export interface ClientReview {
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  financialYear: string;
  financialStatement: FinancialStatement;
  checklist: ChecklistItem[];
  comments: ReviewComment[];
  trialBalance: TrialBalanceLine[];
  signature?: SignatureData;
  reviewStatus: ReviewStatus;
  reviewStartedAt?: string;
  lastUpdatedAt: string;
  revisionReason?: string;
}

// Checklist progress helper
export interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
  byCategory: {
    category: ChecklistItem['category'];
    total: number;
    completed: number;
  }[];
}

// IT14SD Reconciliation Summary
export interface ReconciliationSummary {
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  assetVariance: number;
  liabilityVariance: number;
  equityVariance: number;
  profitVariance: number;
  hasMaterialVariances: boolean;
}

// Helper function to calculate checklist progress
export const getChecklistProgress = (items: ChecklistItem[]): ChecklistProgress => {
  const completed = items.filter(item => item.isChecked).length;
  const categories: ChecklistItem['category'][] = ['balance-sheet', 'profit-loss', 'it14sd', 'general'];
  
  return {
    total: items.length,
    completed,
    percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
    byCategory: categories.map(category => {
      const categoryItems = items.filter(item => item.category === category);
      return {
        category,
        total: categoryItems.length,
        completed: categoryItems.filter(item => item.isChecked).length,
      };
    }),
  };
};

// Helper function to get unresolved comments count
export const getUnresolvedCommentsCount = (comments: ReviewComment[]): number => {
  return comments.filter(comment => !comment.isResolved).length;
};

// Helper function to check if all checklist items are complete
export const isChecklistComplete = (items: ChecklistItem[]): boolean => {
  return items.length > 0 && items.every(item => item.isChecked);
};
