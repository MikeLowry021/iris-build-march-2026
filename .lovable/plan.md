

## Rename Jerome → Iris AI (Display Text Only)

Surgical string replacement across 10 files. No file renames, no variable/component/import changes.

### Changes

**1. `src/components/jerome/JeromePanel.tsx`**
- Line 34: `"Jerome"` → `"Iris AI"`
- Line 36: `"AI Assistant • Powered by Dr. Swartz's expertise"` → `"Powered by Dr. Swartz's expertise"`

**2. `src/components/jerome/JeromeButton.tsx`**
- Line 53: `"Jerome Assistant"` → `"Iris AI Assistant"`
- Line 55: `"AI-powered accounting assistant. I'm here to help!"` → keep as-is (no "Jerome" reference)
- Line 65: `"Need help?"` → keep
- Line 66: `"Click to chat with Jerome"` → `"Click to chat with Iris AI"`

**3. `src/components/jerome/JeromeChatWidget.tsx`**
- Line 63: `"Chat with Jerome"` → `"Chat with Iris AI"`
- Line 64: `"AI-powered accounting assistant"` → keep

**4. `src/components/jerome/JeromeGuidancePanel.tsx`**
- Line 52: `"Navigate to different pages to see contextual tips and guidance from Jerome."` → `"...from Iris AI."`

**5. `src/components/jerome/JeromeTipsPanel.tsx`**
- Line 56: `"Expert accounting tips powered by Dr. Swartz's knowledge"` → keep (no "Jerome")

**6. `src/components/jerome/JeromeSettingsPanel.tsx`**
- Line 24: `"Jerome Settings"` → `"Iris AI Settings"`
- Line 27: `"Customize how Jerome assists you"` → `"Customize how Iris AI assists you"`
- Line 39: `"How often should Jerome notify you?"` → `"How often should Iris AI notify you?"`
- Line 113: `"Allow Jerome to automatically sign documents..."` → `"Allow Iris AI to automatically sign documents..."`
- Line 138: `"Receive email updates from Jerome"` → `"Receive email updates from Iris AI"`
- Line 163: `"When should Jerome send digest notifications?"` → `"When should Iris AI send digest notifications?"`

**7. `src/components/jerome/JeromeAvatar.tsx`**
- Line 35: `"Jerome"` label → `"Iris AI"`
- Line 36: `"AI Assistant"` subtitle → `"Assistant"`

**8. `src/components/jerome/JeromeAutoSign.tsx`**
- Line 37: `"Jerome automatically signs documents..."` → `"Iris AI automatically signs documents..."`

**9. `src/pages/admin/JeromeAdmin.tsx`**
- Line 260: `"Jerome AI Admin"` → `"Iris AI Admin"`
- Line 262: `"Monitor and manage the Jerome AI assistant"` → `"Monitor and manage the Iris AI assistant"`
- Line 134: toast `"Failed to load Jerome admin data"` → `"Failed to load Iris AI admin data"`
- Line 370: `"Last 100 conversations with Jerome"` → `"Last 100 conversations with Iris AI"`
- Line 410: `"Create and manage Jerome's tips"` → `"Create and manage Iris AI tips"`
- Line 423: `"Add a new tip for Jerome to share..."` → `"Add a new tip for Iris AI to share..."`
- Line 557: `"History of Jerome's automatic document signing"` → `"History of Iris AI automatic document signing"`

**10. `src/lib/navigation-config.ts`**
- Line 85: `'Jerome AI'` label → `'Iris AI'`

**11. `supabase/functions/jerome-chat/index.ts`**
- Line 8: System prompt `"You are Jerome, an AI accounting assistant"` → `"You are Iris AI, an AI accounting assistant"`
- Line 101: Already changed to `'Iris Jerome AI'` in previous fix → update to `'Iris AI'`

**12. `src/lib/jerome-mock-data.ts`**
- Line 269: quick reply answer mentioning "Jerome Settings" → `"Iris AI Settings"`
- No other display strings reference "Jerome" by name

### NOT changed (per instructions)
- `JeromeContext.tsx` — not touched at all (welcome message "I'm Jerome" remains; user explicitly said do not touch this file)
- All component names, variable names, file names, import paths
- All Supabase table names (`jerome_tips`, `jerome_chat_logs`, etc.)
- All channel names, function invocation paths

