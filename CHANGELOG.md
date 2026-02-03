# POKPOK Changelog

## TODO - In Progress
- [ ] NavAuthButton user dropdown - Replace email + "SIGN OUT" with initials button + dropdown menu
- [ ] Fix /my-reports button variant not changing (OrderList v1.7.0+)
- [ ] Fix PAID button portal session fetch (DashboardDataProvider edge function needed)
- [ ] Fix /admin/pdp-viewer-2 slot probing failures
- [ ] Apply withPasswordResetDetector override to invisible frame on /signin
- [ ] Test end-to-end password reset flow with v1.4.1

---

## 2026-02-02
### Authentication & Email
- **fix:** Email signup now sends verification emails via Resend SMTP (100 emails/day)
- **fix:** NavAuthButton redirects to /signin page instead of direct OAuth (v3.5.0)
- **feature:** Password reset flow v1.4.1 - Complete end-to-end password reset
  - Email auto-populates from Supabase session during reset
  - Email field shows (read-only) so user sees which account
  - Session verification before updateUser() - prevents "password not saved" bug
  - Better error messages: "NO SESSION - RESET LINK EXPIRED", "PASSWORD TOO SHORT"
  - Console logging for debugging password reset flow
- **feature:** SMTP configuration documented at hey.pokpok.ai subdomain
- **feature:** Email templates updated with POKPOK branding

### Changelog System
- **feature:** Added changelog page at /admin/changelog (live)
- **feature:** ChangelogLoader component with badge styling v1.1.0 (codeFileId: wX7flTS)
- **feature:** CHANGELOG.md created in GitHub repo with markdown format
- **feature:** Automatic fetching from GitHub raw URL

### /my-reports & /admin Fixes [WIP]
- **fix:** Button variant not changing on /my-reports page [WIP]
- **fix:** PAID button link not working (portal session fetch) [WIP]
- **fix:** Slot probing failures for nested admin buttons [WIP]
- **fix:** DataProvider JSON parsing error (static_labels.json was markdown) [WIP]
- **feature:** Polar portal session integration for invoice access [WIP]
- **feature:** Persistence listener for admin button state changes [WIP]

### Documentation
- **improvement:** Updated smtp-config.md with Resend configuration
- **improvement:** Plan file for pattern analysis and fixes created
- **improvement:** Success pattern documented for Polar invoice URLs

## 2026-01-28
### Admin PDP Viewer
- **fix:** Approved/Flagged button persistence to Supabase
- **fix:** Admin PDP viewer data loading race condition
- **fix:** RecentOrder component date/time formatting

### Database Schema
- **improvement:** Database schema: `approved` → `status` column for granular tracking
- **improvement:** Field naming: `pdp-link` → `pdp_link` (underscore convention)

## 2026-01-27
### Framer Architecture
- **fix:** Auth race condition in DashboardDataProvider (synchronous check first)
- **fix:** Dynamic list rendering (switched to slot override pattern)
- **fix:** CSS variable inheritance for nested components

### Documentation & Patterns
- **feature:** Added comprehensive failure registry (FAILURES.md)
- **feature:** Documented slot override pattern for Framer components
- **feature:** F010 documented - dynamic instance rendering impossible in Framer
- **feature:** F011 documented - never assume, always read documentation first

### Admin Panel
- **improvement:** Cross-page pattern analysis completed
- **improvement:** Working patterns identified from /my-reports-test

## 2026-01-26
### Leaderboard System
- **feature:** LeaderboardDataProvider for category leaders tracking [FAILED - to be recoded]
- **feature:** Real-time leaderboard updates on homepage [FAILED - to be recoded]
- **feature:** Supabase pdp_leaderboard table created with JSONB storage
- **improvement:** Table schema with unique constraint on (source, date)

### Code Fixes
- **fix:** Code component null return issue (F002 documented)
- **fix:** Override signature pattern - props as parameter not closure (F003 documented)

### Documentation
- **feature:** LeaderboardOverrides.tsx v1.0.1 created (non-functional)
- **feature:** Best Sellers component override planned (not working)

## 2026-01-25
### Critical Recovery
- **fix:** Site restored after catastrophic architecture failure
- **fix:** Relative imports removed (Framer limitation documented as F004)
- **fix:** Environment switch Web Lock Deadlock resolved (F005 documented)
- **fix:** Auth flow queries moved outside onAuthStateChange callback

### Infrastructure & Safety
- **feature:** deploy-protocol.md created - mandatory Framer deployment checklist
- **feature:** safety.md updated with Framer-specific rules
- **feature:** Post-mortem documentation for catastrophic failures
- **feature:** Documentation integrity rules added

### Leaderboard Setup
- **feature:** Leaderboard project copied from eyeeye repo
- **feature:** CLAUDE.md documentation for leaderboard subproject
- **feature:** n8n-alt MCP configuration added to .mcp.json
- **improvement:** Root navigation updated with leaderboard link

## 2026-01-19
### Webhook System
- **feature:** Documented webhook fulfillment flow (Polar → n8n → Supabase)
- **feature:** webhook-fulfillment.md created with flow diagrams

## 2026-01-18
### Authentication System
- **feature:** Sign in / Sign up tabs on /signin page
- **feature:** Email + password authentication implemented
- **fix:** Auth state synchronization across components

### Paywall Documentation
- **feature:** Document all 6 products in purchase-flow.md
- **improvement:** Polar checkout configuration documented

### Edge Functions
- **improvement:** Edge Functions documentation created
- **improvement:** polar-checkout function deployed (code backup needed)
