// Jerome AI Bot Assistant Types

export type JeromeGuidanceLevel = 'beginner' | 'intermediate' | 'advanced';
export type JeromeNotificationFrequency = 'every-action' | 'daily-digest' | 'weekly-digest';
export type JeromeContactTime = 'morning' | 'afternoon' | 'evening';

export interface JeromeSettings {
  notificationFrequency: JeromeNotificationFrequency;
  guidanceLevel: JeromeGuidanceLevel;
  autoSignEnabled: boolean;
  emailNotifications: boolean;
  preferredContactTime: JeromeContactTime;
}

export interface JeromeTip {
  id: string;
  category: 'tax' | 'vat' | 'paye' | 'deduction' | 'compliance' | 'general';
  title: string;
  content: string;
  route?: string; // Page where this tip is relevant
  priority: 'low' | 'medium' | 'high';
}

export interface JeromeContextualGuidance {
  id: string;
  route: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action';
  actionLabel?: string;
  actionRoute?: string;
}

export interface JeromeChatMessage {
  id: string;
  role: 'user' | 'jerome';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface JeromeQuickReply {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface JeromeAutoSignCondition {
  id: string;
  label: string;
  description: string;
  met: boolean;
}

export interface JeromeAutoSignLog {
  id: string;
  documentId: string;
  documentName: string;
  clientName: string;
  signedAt: Date;
  conditions: JeromeAutoSignCondition[];
  status: 'signed' | 'pending' | 'failed';
  failureReason?: string;
}
