# POKPOK Changelog

> Edit this file to update the changelog. Run `npm run build` to generate changelog.json.

---

## 2026-02-02

### FIXED
- Button variant not changing on /my-reports page
- PAID button link not working (portal session)
- Slot probing failures for nested admin buttons
- DataProvider JSON parsing error (static_labels.json was markdown instead of JSON)

### ADDED
- Polar portal session integration for invoice access
- Persistence listener for admin button state changes

> **Note:** Schema migration completed. The `approved` column has been replaced with `status` for more granular state tracking.

---

## 2026-01-28

### FIXED
- Approved/Flagged button persistence to Supabase
- Admin PDP viewer data loading race condition
- RecentOrder component date/time formatting

### CHANGED
- Database schema: `approved` → `status` column
- Field naming: `pdp-link` → `pdp_link` (underscore)

---

## 2026-01-27

### FIXED
- Auth race condition in DashboardDataProvider
- Dynamic list rendering (switched to slot override pattern)
- CSS variable inheritance for nested components

### DOCUMENTATION
- Added comprehensive failure registry (FAILURES.md)
- Documented slot override pattern for Framer components

---

## 2026-01-26

### FIXED
- Code component null return issue
- Override signature pattern (props parameter)

### ADDED
- LeaderboardDataProvider for category leaders tracking
- Real-time leaderboard updates on homepage

---

## Coming Soon

### TO BE FIXED
- Custom domain support for category reports
- Bulk export functionality for admin panel
- Real-time notification system for new reports
- Enhanced search and filtering in admin dashboard
