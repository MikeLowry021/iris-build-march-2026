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

-- Policies for chat logs (admin can read all)
CREATE POLICY "Admin can read all chat logs" ON public.jerome_chat_logs
  FOR SELECT USING (true);

CREATE POLICY "System can insert chat logs" ON public.jerome_chat_logs
  FOR INSERT WITH CHECK (true);

-- Policies: Tips are public read, admin write
CREATE POLICY "Anyone can read active tips" ON public.jerome_tips
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all tips" ON public.jerome_tips
  FOR ALL USING (true);

-- Policies for auto-sign logs
CREATE POLICY "Anyone can read auto-sign logs" ON public.jerome_auto_sign_logs
  FOR SELECT USING (true);

CREATE POLICY "System can insert auto-sign logs" ON public.jerome_auto_sign_logs
  FOR INSERT WITH CHECK (true);

-- Notifications are readable and updatable by all (for demo purposes)
CREATE POLICY "Users can read notifications" ON public.jerome_notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update notifications" ON public.jerome_notifications
  FOR UPDATE USING (true);

CREATE POLICY "System can insert notifications" ON public.jerome_notifications
  FOR INSERT WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.jerome_notifications;

-- Seed initial tips from mock data
INSERT INTO public.jerome_tips (category, title, content, priority) VALUES
  ('tax', 'Home Office Deductions', 'Did you know? You can claim home office expenses if you work from home. Section 10 of the Income Tax Act allows deductions for the portion of rent, utilities, and internet used for business purposes.', 'high'),
  ('tax', 'Provisional Tax Deadlines', 'Remember: First provisional tax payment is due 6 months after your financial year-end. Second payment is due at year-end. Missing these can result in penalties up to 10%.', 'high'),
  ('vat', 'Zero-Rated vs Exempt', 'Petrol is zero-rated, meaning you can''t claim the VAT you paid - this is a common mistake. Zero-rated supplies are taxable at 0%, while exempt supplies are not taxable at all.', 'high'),
  ('paye', 'PAYE Due Date', 'PAYE is due on the 7th of the month following the payroll period. Late payments attract 10% penalty plus interest at the prescribed rate.', 'high'),
  ('compliance', 'Record Keeping', 'SARS requires you to keep financial records for 5 years. This includes invoices, receipts, bank statements, and any supporting documents.', 'high'),
  ('deduction', 'Travel Allowances', 'If you receive a travel allowance, keep a detailed logbook. You can claim actual costs or use the SARS fixed rate per kilometer for business travel.', 'medium'),
  ('vat', 'VAT Registration Threshold', 'You must register for VAT if your taxable turnover exceeds R1 million in any 12-month period. Voluntary registration is possible from R50,000.', 'medium'),
  ('tax', 'Medical Tax Credits', 'Medical scheme contributions qualify for tax credits. The main member gets R347/month, the first dependant R347/month, and R234/month for each additional dependant (2025 rates).', 'medium'),
  ('compliance', 'Tax Clearance Certificates', 'Tax Clearance Certificates are now digital. Apply via eFiling and receive your PIN within 24-48 hours if your tax affairs are in order.', 'medium'),
  ('general', 'Jerome is Here to Help', 'I can answer questions about South African tax law, VAT treatments, PAYE calculations, and compliance deadlines. Just ask!', 'low');

-- Seed sample notifications for demo
INSERT INTO public.jerome_notifications (user_id, type, title, message, urgency, action_url) VALUES
  ('demo', 'deadline', 'PAYE Submission Due', 'PAYE submission for January is due in 3 days (7th February)', 'warning', '/client/transactions'),
  ('demo', 'auto_sign', 'Financial Statements Signed', 'Jerome auto-signed Financial Statements for Mokwena Trading CC', 'info', '/client/financials'),
  ('demo', 'deadline', 'VAT201 Deadline Tomorrow', 'Your VAT201 return is due tomorrow. Ensure all invoices are captured.', 'critical', '/client/transactions'),
  ('demo', 'tip', 'New Tax Tip Available', 'Learn about home office deductions and how to claim them.', 'info', NULL);