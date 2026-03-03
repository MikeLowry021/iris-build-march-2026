# Iris – Visual Audit Screenshots

**Audit Date:** February 2026  
**Total Screenshots:** 49  
**Naming Convention:** `##-descriptive-name.png`

> These screenshots document the visual state of every profile, page, and key interaction in the Iris platform. Add the actual `.png` files to this directory via GitHub.

---

## Auth (1–2)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 01 | `01-login-desktop.png` | Login page – desktop viewport | Role selector, branding, form layout |
| 02 | `02-login-mobile.png` | Login page – mobile viewport (390px) | Responsive stacking, touch targets |

## Client Profile (3–10)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 03 | `03-client-dashboard.png` | Client dashboard overview | KPI cards, recent activity, sidebar nav |
| 04 | `04-client-financials.png` | Financial statements list | Document cards, status badges, filters |
| 05 | `05-client-financial-detail.png` | Individual financial statement view | Balance sheet / P&L data, formatting |
| 06 | `06-client-transactions.png` | Transaction history | Table layout, date/amount columns, search |
| 07 | `07-client-upload.png` | Upload statements page | Drag-and-drop zone, file type guidance |
| 08 | `08-client-payslips.png` | Payslips listing | Payslip cards, download actions |
| 09 | `09-client-dashboard-mobile.png` | Client dashboard – mobile viewport | Card stacking, hamburger menu, scroll |
| 10 | `10-client-financials-mobile.png` | Financial statements – mobile viewport | Responsive table/card layout |

## CEO Profile (11–20)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 11 | `11-ceo-dashboard.png` | CEO dashboard overview | Executive KPIs, charts, company health |
| 12 | `12-ceo-metrics.png` | Business metrics page | Charts, trend indicators, date ranges |
| 13 | `13-ceo-payroll.png` | Payroll overview | Payroll summary, cost breakdown |
| 14 | `14-ceo-employees.png` | Employee directory | Employee cards/table, department filters |
| 15 | `15-ceo-tax-summary.png` | Tax summary page | Tax obligations, SARS compliance |
| 16 | `16-ceo-reimbursements.png` | Reimbursements page | Claims list, approval status |
| 17 | `17-ceo-audit-trail.png` | Audit trail log | Timestamped entries, action types |
| 18 | `18-ceo-settings.png` | CEO settings page | Profile, preferences, notifications |
| 19 | `19-ceo-dashboard-mobile.png` | CEO dashboard – mobile viewport | Chart responsiveness, card layout |
| 20 | `20-ceo-payroll-mobile.png` | Payroll – mobile viewport | Table scroll, data density |

## Bookkeeper Profile (21–28)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 21 | `21-bookkeeper-dashboard.png` | Bookkeeper dashboard overview | Task queue, client summary, deadlines |
| 22 | `22-bookkeeper-clients.png` | My Clients page | Client cards, status indicators |
| 23 | `23-bookkeeper-categorization.png` | Transaction categorization | Category dropdowns, bulk actions |
| 24 | `24-bookkeeper-adjusting.png` | Adjusting entries page | Journal entry form, debit/credit |
| 25 | `25-bookkeeper-drafts.png` | Draft reports page | Report list, draft status badges |
| 26 | `26-bookkeeper-submissions.png` | Submissions page | Submission history, review status |
| 27 | `27-bookkeeper-settings.png` | Bookkeeper settings | Preferences, notification toggles |
| 28 | `28-bookkeeper-dashboard-mobile.png` | Bookkeeper dashboard – mobile viewport | Responsive task list, navigation |

## Accountant Profile (29–37)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 29 | `29-accountant-dashboard.png` | Accountant dashboard overview | Review queue summary, pending items |
| 30 | `30-accountant-review-queue.png` | Review queue page | Sortable table, priority indicators |
| 31 | `31-accountant-client-review.png` | Client review detail | Financials review, checklist, comments |
| 32 | `32-accountant-client-review-signoff.png` | Client review – sign-off panel | Signature capture pad, approval controls |
| 33 | `33-accountant-rfi.png` | RFI management page | Request list, status tracking |
| 34 | `34-accountant-override.png` | Override entry page | Entry form, justification field |
| 35 | `35-accountant-settings.png` | Accountant settings | Profile, review preferences |
| 36 | `36-accountant-dashboard-mobile.png` | Accountant dashboard – mobile viewport | Responsive layout, touch targets |
| 37 | `37-accountant-review-mobile.png` | Client review – mobile viewport | Form stacking, signature pad sizing |

## Admin Profile (38–42)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 38 | `38-admin-dashboard.png` | Admin dashboard overview | System health, user stats, alerts |
| 39 | `39-admin-users.png` | User management page | User table, role assignments, actions |
| 40 | `40-admin-clients.png` | Client management page | Client list, onboarding status |
| 41 | `41-admin-bookkeepers.png` | Bookkeeper management page | Assignment matrix, workload |
| 42 | `42-admin-system-settings.png` | System settings page | Configuration panels, toggles |

## Jerome AI (43–46)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 43 | `43-jerome-chat-widget.png` | Jerome chat overlay (open) | Chat bubbles, input field, "J" avatar |
| 44 | `44-jerome-guidance-panel.png` | Jerome guidance panel | Contextual tips, action suggestions |
| 45 | `45-jerome-tips-panel.png` | Jerome tips tab | Tip cards, categories, priorities |
| 46 | `46-jerome-admin-panel.png` | Jerome admin configuration | Settings, auto-sign rules, logs |

## Mobile Views (47–48)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 47 | `47-admin-dashboard-mobile.png` | Admin dashboard – mobile viewport (390px) | Responsive grid, sidebar collapse |
| 48 | `48-bookkeeper-dashboard-mobile-alt.png` | Bookkeeper dashboard – mobile alt view | Navigation drawer, card stacking |

## Stub Routes (49)

| # | Filename | Description | What to Look For |
|---|----------|-------------|------------------|
| 49 | `49-stub-routes.png` | Stub routes (`/client/reports`, `/accountant/it14sd`, `/admin/reports`) | Currently redirect to parent dashboards – no dedicated placeholder pages |

---

## Notes

- All screenshots were captured from the live preview at `1280×720` (desktop) and `390×844` (mobile) viewports unless otherwise noted.
- Stub routes (item 49) do not have dedicated pages yet — they redirect silently to their profile's dashboard.
- The branding shows "Iris" throughout (previously "AuditNex" in some views — see branding audit notes).
- Jerome AI's avatar uses a bold "J" lettermark instead of a bot icon.
