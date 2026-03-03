

## Restructure Client Financials + Wire Financial Statements Route

Three files to modify, one route to add. No changes to any other profile.

### File 1: `src/pages/client/ClientFinancials.tsx` — Full rewrite of tab structure

**Current state:** 2 tabs ("Income & Expenses", "Bank Reconciliation") with summary cards and export buttons above.

**New structure:**
- Keep the page header but change title from "Financial Overview" to "Financials"
- Keep the 4 summary cards (Total Income, Total Expenses, Net Profit, Cash on Hand) and export buttons as-is
- **Add a "Financial Statements" callout card** below the export buttons:
  - Card with `FileText` icon, title "Financial Statements", description about compiling the full pack
  - Primary "hero" button: "Go to Financial Statements" → `useNavigate('/client/financial-statements')`
- **Replace the 2-tab layout** with 5 tabs in this exact order:
  1. "Trial Balance" — stub placeholder card
  2. "Balance Sheet" — reuses existing `BalanceSheetForm` from financial components (read-only, using `mockBalanceSheet`)
  3. "Income Statement" — reuses existing `ProfitLossForm` (read-only, using `mockProfitLoss`)
  4. "Cash Flow Statement" — stub placeholder card
  5. "Statement of Changes in Equity" — stub placeholder card
- The existing income/expense breakdown tables and bank reconciliation table are removed from this view (they were the old tabs)
- Add developer note comment at bottom

**Imports to add:** `useNavigate` from react-router-dom, `BalanceSheetForm`, `ProfitLossForm`, `mockBalanceSheet`, `mockProfitLoss` from existing files. Remove unused `Table*` imports and `bankReconciliation`-related code.

### File 2: `src/pages/client/FinancialStatements.tsx` — Reshape into Doc's full-pack scaffold

**Current state:** Has Balance Sheet + P&L tabs with submit-to-accountant flow.

**New structure:**
- Keep `DashboardLayout`, page title "Financial Statements", FY selector, status card, submit button, and dialog — all unchanged
- **Add a summary info section** below the status card: read-only fields for Company Name, Financial Year, Prepared By (placeholder), Bank Name (placeholder)
- **Replace the 2-tab layout** with 6 sections rendered as cards in a vertical list:
  1. "Trial Balance" — stub card
  2. "Balance Sheet" — keeps existing `BalanceSheetForm` (editable, as it is now)
  3. "Income Statement" — keeps existing `ProfitLossForm` (editable, renamed from "Profit & Loss")
  4. "Cash Flow Statement" — stub card
  5. "Statement of Changes in Equity" — stub card
  6. "Notes to the Financial Statements" — stub card
- Add developer note comment at bottom

### File 3: `src/App.tsx` — Add route

- Add `import FinancialStatements from "./pages/client/FinancialStatements";` alongside other client imports (line ~24)
- Add a new `<Route>` for `/client/financial-statements` wrapped in `<ProtectedRoute allowedRoles={['client']}>`, placed after the `/client/financials` route block

### What is NOT touched
- No CEO, Bookkeeper, Accountant, Admin, or Jerome files
- No mock data files
- No existing component files (BalanceSheetForm, ProfitLossForm, CurrencyInput)
- No navigation-config changes (sidebar items stay the same)
- Client dashboard, transactions, payslips pages unchanged

