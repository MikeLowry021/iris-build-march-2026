export type JeromeNotificationType = 'deadline' | 'auto_sign' | 'compliance' | 'tip' | 'system';
export type JeromeNotificationUrgency = 'info' | 'warning' | 'critical';

export interface JeromeNotification {
  id: string;
  userId: string;
  type: JeromeNotificationType;
  title: string;
  message: string;
  urgency: JeromeNotificationUrgency;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
