

## Screenshot Audit Plan

I'll navigate through the entire app using browser tools, capture screenshots of every major screen, and save them to a `docs/screenshots/` folder in the codebase (visible via GitHub).

### Screenshots to capture (~25-30 images):

**1. Auth**
- Login page (desktop)
- Login page (mobile 390px)

**2. Client Profile**
- Client Dashboard
- Upload Statements
- Transactions
- Financials
- Payslips
- Sidebar fully visible

**3. CEO Profile**
- CEO Dashboard
- Payroll tab
- Employees tab
- Tax Summary
- Reimbursements
- Business Metrics (charts)
- Audit Trail
- Settings
- Sidebar fully visible

**4. Bookkeeper Profile**
- Bookkeeper Dashboard
- My Clients
- Transaction Categorization
- Adjusting Entries
- Draft Reports
- Submissions

**5. Accountant Profile**
- Accountant Dashboard
- Review Queue
- Client Review (with sign-off panel)
- RFI Management
- Override Entry

**6. Admin Profile**
- Admin Dashboard
- User Management
- Client Management
- DevOps Monitoring
- Jerome Admin
- Audit Logs

**7. Jerome AI**
- Jerome FAB button (closed)
- Jerome chat panel (open)
- Jerome guidance/tips tabs

**8. Mobile Views**
- Login (390px)
- One dashboard per profile (390px)
- Mobile sidebar open

**9. Broken/Empty States**
- Stub routes (e.g., `/client/tax-status`, `/client/reports`)
- 404 page

### Technical approach
- Use `browser--navigate_to_sandbox` to visit each route
- Use `browser--set_viewport_size` for mobile views
- Use `browser--screenshot` to capture each screen
- Save all images to `docs/screenshots/` with descriptive filenames
- Create a `docs/screenshots/README.md` index file listing every screenshot with description

### Folder structure
```
docs/screenshots/
├── README.md
├── 01-login-desktop.png
├── 02-login-mobile.png
├── 03-client-dashboard.png
├── 04-client-upload.png
├── ...
├── 25-jerome-chat-panel.png
├── 26-mobile-ceo-dashboard.png
└── 27-404-page.png
```

### Limitation
Browser screenshots are captured as base64 images. I'll save each one to the codebase as a file. This will take multiple sequential steps (navigate → screenshot → save), so the full set will require ~30 iterations. I'll batch where possible.

