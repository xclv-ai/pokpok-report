# POKPOK Changelog

## TODO - In Progress
- [ ] WWW v2 — test 1+ more brands (2/3 complete), validate downstream consumption
- [ ] Update `pdp_intro_2.0.md` evidence paths for v2 visual analysis schema
- [ ] Update `www_intro_2.0.md` evidence paths for www v2 schema (Marker 8 references)
- [ ] Test PDP v2 output across 3+ ASINs for composition enum validation
- [ ] Brand perception engine — Gemini 3 Pro HTTP Request with grounding tools
- [ ] Deploy BestSellerCard click-to-run-analysis (v1.0.13 ready)
- [ ] Monthly aggregation workflow (top 15 products)
- [ ] Verify n8n webhook flow execution end-to-end
- [ ] Dynamic /order page (product context from source pages)

---

## 2026-02-06

### n8n Visual Analysis
- **feature:** WWW Visual Analysis System Prompt & Schema v2 — dual-layer Container/Content analysis for brand website screenshots. Separates website UI shell (Container) from brand visual content (Content). 6 visual territory types: Pharma-Code, Clinical Pop, Gen-Z Pop, Heritage Warm, Luxury Minimal, Warm Shell.
- **feature:** WWW v2 pipeline: Edit Image → Extract from File (binary→base64) → Gemini 3 Flash HTTP Request → Final Combining Code Node. Switched from OpenAI ChatGPT-4o to Gemini 3 Flash.
- **feature:** 9 website-specific `visible_text` types: brand_name, headline, subheadline, navigation, cta_button, body_copy, testimonial, tagline, other
- **feature:** 5 website-specific `image_composition` enums: page_content_type (9 values), imagery_style (8 values), layout_type, text_density, background_type
- **feature:** PDP Visual Analysis v2 — 3-section schema: `visual_analysis_raw` (OCR), `image_composition` (enums), `visual_analysis_interpreted` (AI analysis). Tagged `visible_text` array replaces 6 separate fields.
- **feature:** `visual_temperature` enum (cold/cool/neutral/warm/hot) for Marker 8 Slider A
- **feature:** `dominant_colors`, `color_mood`, `primary_palette` fields for richer visual analysis
- **feature:** Final combining Code node for www workflow — thinking-aware Gemini response parsing, merges visual_analysis with URL metadata

### Documentation
- **improvement:** WWW v2 validated on 2 brands: Dr. Althea (Luxury Minimal territory) and Embryolisse (Pharma-Code product page + Clinical Pop homepage — territory shift validates dual-layer design)
- **improvement:** Downstream path migration plan for both `pdp_intro_2.0.md` and `www_intro_2.0.md` evidence paths

> **Note:** WWW v2 key innovation: same brand shows different visual territories on different pages. Embryolisse product page = Pharma-Code (clinical everything), homepage = Clinical Pop (sterile shell + warm lifestyle imagery). This proves dual-layer analysis captures real visual differences, not brand-level averages.

---

## 2026-02-04

### Admin Panel
- **fix:** /admin/pdp-viewer-2 Approved button toggle — event delegation with capture phase survives Framer/Suspense DOM replacement
- **fix:** OrderItemsList v1.1.2 display logic — only `"approved"` status shows APPROVED variant (was incorrectly showing for "analyzed")

### Leaderboard
- **fix:** BestSellerCard double execution bug (mutex fix in LeaderboardOverrides v1.0.13)
- **feature:** Click-to-run-analysis webhook trigger on BestSellerCard (LeaderboardOverrides v1.0.13)
- **feature:** Separate navigation override for Amazon URL (right-click → open in new tab preserved)

### Documentation
- **improvement:** Event delegation success pattern for Framer Suspense components
- **improvement:** F016 failure documented (direct onclick lost on DOM replacement)

---

## 2026-02-03

### Admin Panel
- **fix:** PendingOrdersList v1.2.8 — button state persists until `status="analyzed"` (removed 5s timeout reset)
- **fix:** OrderItemsList v1.0.1 — handles legacy status values ("true" treated as approved)
- **fix:** OrderItemSlotsOverrides v1.6.8 — SSR crash fix (`typeof window !== "undefined"` checks)
- **fix:** PDP links clickable via DOM binding (find elements by text content, not class names)
- **feature:** PendingOrdersList code component v1.0.4 — dynamic rendering of pending orders with timer logic (green/red variants)
- **feature:** OrderItemsList code component v1.0.1 — replaces slot override pattern for processed orders
- **feature:** AdminPDPHeaderOverrides v1.0.0 — dynamic pending count in header
- **feature:** RUN ANALYSIS webhook integration in PendingOrdersList (triggers n8n workflow)

### Authentication & Paywall
- **feature:** NavAuthDropdown component v1.6.0 — user initials button with hover dropdown (DASHBOARD + LOG OUT)
- **feature:** Password reset flow v1.4.1 — email auto-populates, session verification, better error messages

### Documentation
- **improvement:** F015 failure documented (class-based selectors don't work in Framer DOM)
- **improvement:** Polar per-order invoice URL success pattern documented

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
- **feature:** SMTP configuration documented at hey.pokpok.ai subdomain
- **feature:** Email templates updated with POKPOK branding

### Changelog System
- **feature:** Added changelog page at /admin/changelog (live)
- **feature:** ChangelogLoader component with badge styling v1.1.0 (codeFileId: wX7flTS)
- **feature:** CHANGELOG.md created in GitHub repo with markdown format
- **feature:** Automatic fetching from GitHub raw URL

### /my-reports & /admin Fixes
- **fix:** Button variant not changing on /my-reports page
- **fix:** PAID button link not working (portal session fetch)
- **fix:** Slot probing failures for nested admin buttons
- **fix:** DataProvider JSON parsing error (static_labels.json was markdown instead of JSON)
- **feature:** Polar portal session integration for invoice access
- **feature:** Per-order invoice URLs via Polar Customer Portal API (web page URLs, not PDF downloads)
- **feature:** Persistence listener for admin button state changes

### Documentation
- **improvement:** Updated smtp-config.md with Resend configuration
- **improvement:** Plan file for pattern analysis and fixes created
- **improvement:** Success pattern documented for Polar invoice URLs

> **Note:** Schema migration completed. The `approved` column has been replaced with `status` for more granular state tracking.

---

## 2026-01-28

### Admin PDP Viewer
- **fix:** Approved/Flagged button persistence to Supabase
- **fix:** Admin PDP viewer data loading race condition
- **fix:** RecentOrder component date/time formatting

### Database Schema
- **improvement:** Database schema: `approved` → `status` column for granular tracking
- **improvement:** Field naming: `pdp-link` → `pdp_link` (underscore convention)

---

## 2026-01-27

### Framer Architecture
- **fix:** Auth race condition in DashboardDataProvider (synchronous check first)
- **fix:** Dynamic list rendering (switched to slot override pattern)
- **fix:** CSS variable inheritance for nested components

### Documentation & Patterns
- **feature:** Added comprehensive failure registry (FAILURES.md)
- **feature:** Documented slot override pattern for Framer components
- **improvement:** Cross-page pattern analysis completed
- **improvement:** Working patterns identified from /my-reports-test

---

## 2026-01-26

### Leaderboard System
- **feature:** Supabase pdp_leaderboard table created with JSONB storage
- **feature:** LeaderboardDataProvider for category leaders tracking
- **feature:** Real-time leaderboard updates on homepage
- **improvement:** Table schema with unique constraint on (source, date)

### Code Fixes
- **fix:** Code component null return issue (F002 documented)
- **fix:** Override signature pattern - props as parameter not closure (F003 documented)

---

## 2026-01-25

### Critical Recovery
- **fix:** Site restored after catastrophic architecture failure
- **fix:** Relative imports removed (Framer limitation documented as F004)
- **fix:** Auth flow Web Lock Deadlock resolved (F005 documented)

### Infrastructure & Safety
- **feature:** deploy-protocol.md created - mandatory Framer deployment checklist
- **feature:** safety.md updated with Framer-specific rules
- **feature:** Leaderboard project initialized from eyeeye repo
- **feature:** n8n-alt MCP configuration added to .mcp.json

