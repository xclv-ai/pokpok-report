# POKPOK Changelog

## 2026-02-02
- **fix:** Email signup now sends verification emails via Resend SMTP
- **fix:** NavAuthButton redirects to /signin page instead of direct OAuth
- **fix:** Button variant not changing on /my-reports page [WIP]
- **fix:** PAID button link not working (portal session) [WIP]
- **fix:** Slot probing failures for nested admin buttons [WIP]
- **fix:** DataProvider JSON parsing error (static_labels.json was markdown instead of JSON) [WIP]
- **feature:** Added changelog page at /admin/changelog
- **feature:** ChangelogLoader component with improved badge styling (v1.1.0)
- **feature:** SMTP configuration documented (hey.pokpok.ai subdomain)
- **feature:** Polar portal session integration for invoice access [WIP]
- **feature:** Persistence listener for admin button state changes [WIP]

## 2026-01-28
- **fix:** Approved/Flagged button persistence to Supabase
- **fix:** Admin PDP viewer data loading race condition
- **fix:** RecentOrder component date/time formatting
- **improvement:** Database schema: `approved` → `status` column
- **improvement:** Field naming: `pdp-link` → `pdp_link` (underscore)

## 2026-01-27
- **fix:** Auth race condition in DashboardDataProvider
- **fix:** Dynamic list rendering (switched to slot override pattern)
- **fix:** CSS variable inheritance for nested components
- **feature:** Added comprehensive failure registry (FAILURES.md)
- **feature:** Documented slot override pattern for Framer components

## 2026-01-26
- **fix:** Code component null return issue
- **fix:** Override signature pattern (props parameter)
- **feature:** LeaderboardDataProvider for category leaders tracking
- **feature:** Real-time leaderboard updates on homepage
