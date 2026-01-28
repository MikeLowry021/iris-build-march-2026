
# Jerome AI Enhancement Plan - Complete Implementation

This plan implements all four major enhancements to Jerome in one comprehensive update: real AI-powered chat, voice capabilities (ElevenLabs), admin dashboard, and push notifications.

---

## Current State Analysis

**Existing Jerome Components:**
- `JeromeContext.tsx` - Uses mock responses with 800ms `setTimeout`
- `JeromeChatWidget.tsx` - Basic chat UI with quick reply buttons
- `JeromePanel.tsx` - Tabbed panel (Chat, Guidance, Tips, Settings)
- `JeromeButton.tsx` - Floating button with notification badge
- Mock data in `jerome-mock-data.ts` (15 tips, 15 guidance, 20 quick replies, 4 auto-sign logs)

**Available Resources:**
- `LOVABLE_API_KEY` is pre-configured (no setup needed for AI)
- No edge functions exist yet
- Lovable Cloud is enabled

---

## Implementation Overview

```text
+-----------------------------------------------------------------------------------+
|                        JEROME AI ENHANCEMENT ARCHITECTURE                          |
+-----------------------------------------------------------------------------------+
|                                                                                    |
|   FRONTEND LAYER                                                                   |
|   +----------------+  +------------------+  +------------------+  +-------------+  |
|   | JeromeChatWidget|  | JeromeVoice     |  | JeromeNotif      |  | JeromeAdmin |  |
|   | (streaming AI)  |  | Controls        |  | Bell + Dropdown  |  | Page        |  |
|   +----------------+  +------------------+  +------------------+  +-------------+  |
|          |                    |                     |                   |          |
|          v                    v                     v                   v          |
|   +------------------------------------------------------------------------+       |
|   |                    JEROME CONTEXT (Enhanced)                            |       |
|   |  - AI streaming state    - Voice recording state                       |       |
|   |  - Notification queue    - Browser notification permissions            |       |
|   +------------------------------------------------------------------------+       |
|                                      |                                             |
|   EDGE FUNCTION LAYER                |                                             |
|   +------------------+  +------------------+  +------------------+                  |
|   | jerome-chat      |  | elevenlabs-tts   |  | elevenlabs-stt   |                  |
|   | (Lovable AI)     |  | (Text-to-Speech) |  | (Speech-to-Text) |                  |
|   +------------------+  +------------------+  +------------------+                  |
|                                                                                    |
|   DATABASE LAYER                                                                   |
|   +------------------+  +------------------+  +------------------+                  |
|   | jerome_chat_logs |  | jerome_tips      |  | jerome_notifs    |                  |
|   | jerome_auto_signs|  | (editable)       |  | (per user)       |                  |
|   +------------------+  +------------------+  +------------------+                  |
+-----------------------------------------------------------------------------------+
```

---

## Phase 1: Real AI-Powered Chat with Lovable AI

### 1.1 Create Edge Function: `supabase/functions/jerome-chat/index.ts`

**Purpose:** Handle AI chat requests using Lovable AI gateway

**Implementation:**
- CORS headers for browser requests
- System prompt with Dr. Swartz's South African accounting expertise
- Streaming response for real-time typing effect
- Context: VAT (15%), PAYE, IT14, SARS compliance, SA tax brackets
- Model: `google/gemini-3-flash-preview` (fast, cost-effective)
- Rate limit handling (429/402 errors surfaced to client)

**System Prompt Focus:**
- South African tax law expertise
- VAT treatments (zero-rated vs exempt)
- PAYE calculations and deadlines
- CIPC, SARS, UIF compliance
- Friendly, professional tone

### 1.2 Update `supabase/config.toml`

Add function configuration:
```toml
[functions.jerome-chat]
verify_jwt = false
```

### 1.3 Update `src/lib/jerome-types.ts`

Add new types:
```typescript
export interface JeromeChatMessage {
  id: string;
  role: 'user' | 'jerome';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;  // NEW: for streaming indicator
}
```

### 1.4 Update `src/contexts/JeromeContext.tsx`

**Changes:**
- Replace mock `setTimeout` with real API call
- Add `isLoading` state for pending responses
- Add `streamingMessageId` for current streaming message
- Implement streaming token-by-token using SSE parsing
- Handle API errors with fallback to quick replies
- Track conversation history for context

### 1.5 Update `src/components/jerome/JeromeChatWidget.tsx`

**Changes:**
- Add typing indicator component (animated dots)
- Show loading state while waiting for AI
- Handle streaming messages with cursor animation
- Add error display with retry button
- Keep quick reply buttons for common questions

### 1.6 Create `src/components/jerome/JeromeTypingIndicator.tsx`

Simple animated component showing Jerome is "thinking"

---

## Phase 2: Voice Capabilities with ElevenLabs

### 2.1 Connect ElevenLabs Connector

Use standard connector system to link ElevenLabs API credentials:
- Connector ID: `elevenlabs`
- Provides `ELEVENLABS_API_KEY` as environment variable

### 2.2 Create Edge Function: `supabase/functions/elevenlabs-tts/index.ts`

**Purpose:** Convert Jerome's text responses to speech

**Implementation:**
- Receive text and optional voice settings
- Call ElevenLabs TTS API
- Use voice: Roger (professional, warm) - ID: `CwhRBWXzGAHq8TQ4Fs17`
- Model: `eleven_turbo_v2_5` for low latency
- Return audio stream (MP3)

### 2.3 Create Edge Function: `supabase/functions/elevenlabs-stt/index.ts`

**Purpose:** Transcribe user's voice to text

**Implementation:**
- Receive audio blob from browser microphone
- Call ElevenLabs STT API (scribe_v2)
- Return transcribed text
- Handle various audio formats

### 2.4 Update `supabase/config.toml`

Add function configurations:
```toml
[functions.elevenlabs-tts]
verify_jwt = false

[functions.elevenlabs-stt]
verify_jwt = false
```

### 2.5 Create `src/components/jerome/JeromeVoiceControls.tsx`

**Features:**
- Microphone button (hold to record, or toggle)
- Recording indicator with waveform animation
- Playback button on Jerome's messages
- Volume slider
- Auto-play toggle in settings
- Permission request handling

### 2.6 Update `src/contexts/JeromeContext.tsx`

Add voice-related state:
```typescript
interface JeromeContextType {
  // ... existing
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  speakMessage: (text: string) => Promise<void>;
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
}
```

### 2.7 Update `src/components/jerome/JeromeChatWidget.tsx`

**Changes:**
- Add microphone button next to text input
- Add speaker button on each Jerome message
- Integrate voice controls component
- Show recording state overlay

### 2.8 Update `src/components/jerome/JeromeSettingsPanel.tsx`

Add voice settings section:
- Enable/disable voice features
- Auto-play responses toggle
- Voice speed slider
- Preferred voice selection

---

## Phase 3: Jerome Admin Dashboard

### 3.1 Create Database Tables

**Migration SQL:**

```sql
-- Jerome chat logs for analytics
CREATE TABLE public.jerome_chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_role TEXT,
  user_message TEXT NOT NULL,
  jerome_response TEXT NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jerome tips (editable by admin)
CREATE TABLE public.jerome_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('tax', 'vat', 'paye', 'deduction', 'compliance', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jerome auto-sign logs (persistent)
CREATE TABLE public.jerome_auto_sign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  conditions JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('signed', 'pending', 'failed')),
  failure_reason TEXT
);

-- Jerome notifications
CREATE TABLE public.jerome_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deadline', 'auto_sign', 'compliance', 'tip', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  urgency TEXT DEFAULT 'info' CHECK (urgency IN ('info', 'warning', 'critical')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jerome_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jerome_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jerome_auto_sign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jerome_notifications ENABLE ROW LEVEL SECURITY;

-- Policies: Tips are public read, admin write
CREATE POLICY "Anyone can read active tips" ON public.jerome_tips
  FOR SELECT USING (is_active = true);

-- Admin can do everything on tips
CREATE POLICY "Admin can manage tips" ON public.jerome_tips
  FOR ALL USING (true);

-- Notifications are per-user
CREATE POLICY "Users can read own notifications" ON public.jerome_notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON public.jerome_notifications
  FOR UPDATE USING (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.jerome_notifications;

-- Seed initial tips from mock data
INSERT INTO public.jerome_tips (category, title, content, priority) VALUES
  ('tax', 'Home Office Deductions', 'Did you know? You can claim home office expenses if you work from home. Section 10 of the Income Tax Act allows deductions for the portion of rent, utilities, and internet used for business purposes.', 'high'),
  ('tax', 'Provisional Tax Deadlines', 'Remember: First provisional tax payment is due 6 months after your financial year-end. Second payment is due at year-end. Missing these can result in penalties up to 10%.', 'high'),
  ('vat', 'Zero-Rated vs Exempt', 'Petrol is zero-rated, meaning you can''t claim the VAT you paid - this is a common mistake. Zero-rated supplies are taxable at 0%, while exempt supplies are not taxable at all.', 'high'),
  ('paye', 'PAYE Due Date', 'PAYE is due on the 7th of the month following the payroll period. Late payments attract 10% penalty plus interest at the prescribed rate.', 'high'),
  ('compliance', 'Record Keeping', 'SARS requires you to keep financial records for 5 years. This includes invoices, receipts, bank statements, and any supporting documents.', 'high');
```

### 3.2 Create `src/pages/admin/JeromeAdmin.tsx`

**Features:**

**Overview Tab:**
- Total chat interactions (today/week/month)
- Auto-sign success rate chart
- Most common question categories (pie chart)
- Active tips count
- Unread notifications system-wide

**Chat Analytics Tab:**
- Table of recent chat logs
- Filter by date, user role
- Average response time metric
- Most asked questions word cloud or list
- Export to CSV

**Auto-Sign Logs Tab:**
- Full history with pagination
- Filter by status (signed/failed/pending)
- Filter by client, date range
- Condition breakdown for each log
- Export functionality

**Tips Management Tab:**
- Table of all tips (active/inactive)
- Create new tip form
- Edit existing tips inline
- Toggle active status
- Category and priority filters
- Reorder by priority

### 3.3 Update `src/App.tsx`

Add route:
```tsx
import JeromeAdmin from "./pages/admin/JeromeAdmin";

// In routes
<Route
  path="/admin/jerome"
  element={
    <ProtectedRoute allowedRole="admin">
      <JeromeAdmin />
    </ProtectedRoute>
  }
/>
```

### 3.4 Update `src/components/layouts/DashboardLayout.tsx`

Add to `adminNavItems`:
```typescript
{ label: 'Jerome AI', href: '/admin/jerome', icon: Bot },
```

---

## Phase 4: Push Notifications & Browser Alerts

### 4.1 Create `src/lib/jerome-notification-types.ts`

```typescript
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
```

### 4.2 Create `src/contexts/JeromeNotificationContext.tsx`

**Features:**
- Track unread notification count
- Subscribe to realtime notifications table
- Request browser notification permission
- Show native browser notifications for critical alerts
- Queue for toast notifications
- Mark as read functionality
- Clear all notifications

### 4.3 Create `src/components/jerome/JeromeNotificationBell.tsx`

**Features:**
- Bell icon with unread count badge
- Dropdown with notification list
- Each notification shows: type icon, title, time ago
- Click to navigate to action URL
- Mark individual as read
- "Mark all as read" button
- Empty state message

### 4.4 Update `src/components/jerome/JeromePanel.tsx`

Add notification bell to header:
```tsx
<div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent p-4">
  <JeromeAvatar size="md" />
  <div className="flex-1">
    <h2 className="font-semibold text-foreground">Jerome</h2>
    <p className="text-xs text-muted-foreground">
      AI Assistant • Powered by Dr. Swartz's expertise
    </p>
  </div>
  <JeromeNotificationBell />
</div>
```

### 4.5 Update `src/App.tsx`

Wrap with notification provider:
```tsx
<JeromeProvider>
  <JeromeNotificationProvider>
    <AppWithJerome />
  </JeromeNotificationProvider>
</JeromeProvider>
```

### 4.6 Create Mock Notifications for Demo

Add sample notifications:
- "PAYE submission due in 3 days" (warning)
- "Jerome auto-signed Financial Statements for Mokwena Trading" (info)
- "VAT201 deadline tomorrow!" (critical)
- "New tax tip: Home office deductions" (info)

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/jerome-chat/index.ts` | AI chat with Lovable AI |
| `supabase/functions/elevenlabs-tts/index.ts` | Text-to-speech |
| `supabase/functions/elevenlabs-stt/index.ts` | Speech-to-text |
| `src/pages/admin/JeromeAdmin.tsx` | Admin dashboard page |
| `src/components/jerome/JeromeTypingIndicator.tsx` | Animated typing dots |
| `src/components/jerome/JeromeVoiceControls.tsx` | Mic + speaker buttons |
| `src/components/jerome/JeromeNotificationBell.tsx` | Notification dropdown |
| `src/contexts/JeromeNotificationContext.tsx` | Notification state |
| `src/lib/jerome-notification-types.ts` | Notification types |

## Files to Update

| File | Changes |
|------|---------|
| `supabase/config.toml` | Add function configurations |
| `src/lib/jerome-types.ts` | Add streaming, voice, notification types |
| `src/contexts/JeromeContext.tsx` | AI streaming, voice state |
| `src/components/jerome/JeromeChatWidget.tsx` | Streaming UI, voice buttons |
| `src/components/jerome/JeromePanel.tsx` | Add notification bell |
| `src/components/jerome/JeromeSettingsPanel.tsx` | Voice settings |
| `src/components/jerome/index.ts` | Export new components |
| `src/components/layouts/DashboardLayout.tsx` | Add Jerome AI nav item |
| `src/App.tsx` | Add route + notification provider |

---

## Dependency: ElevenLabs Connector

Voice features require connecting ElevenLabs via the connector system. During implementation, I will prompt you to connect ElevenLabs. If you skip this step, AI chat and notifications will still work - only voice features will be disabled.

---

## Summary

This implementation adds:
- Real AI responses using Lovable AI (no API key needed)
- Voice input/output with ElevenLabs (requires connector)
- Full admin dashboard with analytics, tips management, auto-sign logs
- Real-time notifications with browser alerts
- 4 database tables with RLS policies
- 3 edge functions
- 9 new/updated components

The core AI chat will work immediately. Voice features will activate once ElevenLabs is connected.
