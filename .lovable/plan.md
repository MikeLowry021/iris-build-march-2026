

## Rewrite FinancialStatements.tsx — Professional IFRS-aligned Financial Pack

Complete rewrite of `src/pages/client/FinancialStatements.tsx` with all 10 sections from the prompt. Single file change, no other files touched.

### Structure

The page will contain these sections in order, all using hardcoded mock data for Mokwena Trading:

1. **Cover/Header Card** — Company details, "DRAFT — MOCK DATA" amber badge, teal left border
2. **Export Action Bar** — 3 buttons (PDF/Word/Excel) showing toast "coming soon" on click
3. **Statement of Profit or Loss** — Read-only table with R-prefixed ZAR amounts, bold subtotals
4. **Statement of Changes in Equity** — 4-column table (Share Capital, Retained Earnings, Total)
5. **Statement of Financial Position** — Balanced at R873,000; uppercase bold section headers with teal bg
6. **Statement of Cash Flows (Indirect)** — Closing cash R117,000 matching SOFP
7. **Notes to Financial Statements** — 6 accordion items using shadcn Accordion, collapsed by default
8. **Analytical Review** — 4 metric cards (GP Margin 40%, Current Ratio 7.75, D/E 0.36, NP Margin 15.3%)
9. **Review & Sign-off Status** — 4 role rows with coloured badges, disabled "Submit for Sign-off" button with tooltip
10. **Developer note comment** at bottom

### Technical details

- Remove all existing state management, BalanceSheetForm/ProfitLossForm imports, submit dialog, and PDF export logic — the page becomes entirely read-only with hardcoded mock data
- Import `Accordion, AccordionItem, AccordionTrigger, AccordionContent` from shadcn
- Import `Tooltip, TooltipContent, TooltipProvider, TooltipTrigger` from shadcn for the disabled button tooltip
- Import `toast` from `sonner` for export button toasts
- Import `Badge` from shadcn for the DRAFT badge and sign-off status badges
- Keep `DashboardLayout` wrapper
- All amounts formatted with `R` prefix and space-separated thousands using a local helper function
- Cross-checks embedded as comments: Assets = Equity + Liabilities = R873,000; Closing cash = R117,000; Closing equity = R640,800

### What is removed
- `BalanceSheetForm` and `ProfitLossForm` component usage (replaced by hardcoded read-only tables)
- `useFinancialPDF` hook, `useAuth`, `useToast`, all state variables, submit dialog
- All imports from `financial-types` and `financial-mock-data`
- The old `StubSection` helper component

### What is NOT touched
- No other files
- No routes, no other pages, no components, no mock data files

