# POKPOK Changelog

## ACTIVE BUGS
- [x] BUG: LinkedIn share 502 — MOOT: replaced custom LinkedIn API posting with native share dialog (Phase 3.2)
- [ ] BUG: Roast button not active — deployed Provider missing `toggleRoast`. Fix: paste Provider v1.7.4 (or v1.8.0) into Framer
- [x] BUG: Screenshot captures footer — fixed in Overrides v1.10.11 (`main` tag instead of `#main`). Awaiting Framer paste.

## TODO - In Progress
- [ ] X-RAY Phase 3.2: Native LinkedIn Share + Dynamic OG Cards — implement share-og edge fn, screenshot upload, native LinkedIn dialog, remove LinkedIn OAuth
- [ ] X-RAY OG image quality fix — fix og:image:width/height mismatch (1200x630 declared vs 3122x1502 actual), deploy claim-share-bonus v4 with GitHub Pages push, set GITHUB_TOKEN
- [x] X-RAY credit system — full deployment (SQL migration, edge functions, Provider v1.5.0, Overrides v1.9.0)
- [x] X-RAY credits display fix — refreshCredits() 401 fixed (raw fetch → Supabase client), event name mismatch fixed (Provider v1.5.2, Overrides v1.9.6)
- [ ] X-RAY credits idempotency — migrateDoneRef guard to prevent duplicate +1 on repeated auth events (Provider v1.5.3 ready, awaiting deploy)
- [ ] X-RAY: [SIGN IN +1] CTA still visible for authenticated users — should hide after sign-in
- [ ] Consolidate audit docs — OPEN-ISSUES.md created, architecture-flaws-report.md updated, obsolete docs deleted, all statuses set to WIP
- [ ] Full code audit complete — 6 CRITICAL, 25 HIGH, 45+ MEDIUM. Report: www/docs/plans/CODE-AUDIT-2026-03-09.md
- [ ] [CRITICAL] C1: OrderFormProvider WEBHOOK_URL undefined — "Send to Analysis" broken at runtime
- [ ] [CRITICAL] C3: PaywallModal references dead Kinde auth — login button hangs
- [ ] [CRITICAL] C4: RealtimeTickerOverride wrong Supabase key + hardcoded debug execution_id
- [x] [X-RAY] B25: YOUR SCORE clickable — Framer container disabled via mergedRef (v1.11.9)
- [x] [X-RAY] B26: Dial no-toggle — removed re-click toggle, OFF is dedicated zone (v1.11.9)
- [x] [X-RAY] Share clipboard copy — moved before async ops to keep user gesture context (v1.11.9)
- [x] [X-RAY] Share domain "unknown" — reads scanUrl from nav global (v1.11.9)
- [x] [X-RAY] SHARE_OG_BASE → xray.pokpok.ai custom domain (v1.11.9)
- [x] [X-RAY] xray.pokpok.ai redirect to pokpok.ai/products/xray (GitHub Pages)
- [x] [X-RAY] Migrate share pipeline from xclv-ai/pokpok-report → pokpok-ai/xray + xray.pokpok.ai custom domain
- [ ] [X-RAY] B27: Roast shows "not available" for landor.com despite data existing in Supabase
- [ ] [CRITICAL] C5: Payment system in sandbox mode (USE_PRODUCTION=false, sandbox Polar URLs)
- [ ] [HIGH] Open redirect chain — unvalidated `return` param in AuthOverrides, AuthOrderOverride, NavAuthButton
- [ ] [HIGH] Plaintext password stored on window.__POKPOK_SIGNIN_STATE__
- [ ] [HIGH] Unauthenticated n8n webhook URL exposed in 6 client-side files
- [ ] [HIGH] `return null` from 9 Framer Code Components — violates F002, breaks layout
- [ ] [HIGH] Supabase realtime channel leaks in DashboardDataProvider + AdminPDPViewerOverrides
- [x] Save all Framer live code files to local backup folder (2026-03-09-framer-live)
- [ ] [WIP - awaiting user verification] SubscriptionCheckoutButton v1.1.0 — fix signin redirect delay (1800ms) so "YEAH!" button variant is visible before navigation
- [x] Clean marketing table — delete codex QA records + deduplicate emails
- [ ] Deploy www_system_prompt_v4.6 to n8n + test B0BPXT3GBN (Marker 8 fix)
- [ ] Fix scoring non-determinism — move alignment formula from Gemini to Code node
- [ ] Fix system prompt v3.5/v3.6 — broken UI data format (territory_number string, archetype prefix)
- [ ] WWW v2 — test 1+ more brands (2/3 complete), validate downstream consumption
- [ ] Update `pdp_intro_2.0.md` evidence paths for v2 visual analysis schema
- [ ] Update `www_intro_2.0.md` evidence paths for www v2 schema (Marker 8 references)
- [ ] Test PDP v2 output across 3+ ASINs for composition enum validation
- [ ] Deploy BestSellerCard click-to-run-analysis (v1.0.13 ready)
- [x] POKPOK Index March 2026 podcast — NotebookLM audio overview (Feynman style, 17m49s)
- [ ] Monthly aggregation workflow (top 15 products)
- [ ] Verify n8n webhook flow execution end-to-end
- [ ] Dynamic /order page (product context from source pages)
- [ ] Refactor: Move archetype SVGs from GitHub Pages to Supabase storage — all 12 uploaded to `https://iyyuxilkacylpbweulsa.supabase.co/storage/v1/object/public/assets/archetypes/`. Update `ARCHETYPE_SVG_BASE` in CategoryDataOverrides.tsx (codeFileId: OTlqFfg) and DataOverrides.tsx (codeFileId: PUwIdwd)
- [ ] Deploy security notification email templates to Supabase (email-changed, mfa-added, mfa-removed, password-changed)
- [ ] Fix n8n "Download Image" EPROTO error — Cloudflare Worker proxy deployed (`amazon-image-proxy.pokpok.workers.dev`), need to update n8n workflow URL
- [x] Admin page architecture fix — IndexImportProvider v1.1.1 (remove purchased_reports from auto-import), DB cleanup done
- [x] RecurringOrderItemsList v1.3.8 — RUNNING badge hover shows ASIN number
- [x] AdminPDPProvider v1.5.19 — auto-flag PDPs with alignment < 40

---

## 2026-03-20

### Admin Page — Architecture Fix
- **fix:** IndexImportProvider v1.1.1 — removed purchased_reports inserts from auto-import. purchased_reports tracks customer payments (Polar.sh), NOT admin import. Auto-import now only upserts pdp rows.
- **fix:** DB cleanup — deleted 15 fake purchased_reports rows for mar-2026 created by v1.1.0 auto-import.
- **improvement:** Updated PLAN-2026-03-19.md and framer-admin SKILL.md to reflect correct architecture.

### Admin Page — UX Improvements
- **feature:** RecurringOrderItemsList v1.3.8 — RUNNING badges now show ASIN number on hover, mouseleave reverts to "RUNNING". Admin can identify which ASIN is being analyzed.
- **feature:** AdminPDPProvider v1.5.19 — auto-flags analyzed PDPs with alignment score < 40. Parses "X/100" format, writes `flagged=true` to DB on page load. Prevents bad analysis results from reaching customers.

### Cloudflare Worker — Amazon Image Proxy
- **feature:** Deployed `amazon-image-proxy.pokpok.workers.dev` — proxies Amazon CDN image requests through Cloudflare to bypass TLS fingerprinting that blocks Node.js (EPROTO error in n8n).
- **infra:** Registered `pokpok.workers.dev` subdomain on Cloudflare. Worker restricts to Amazon image domains only (m.media-amazon.com, images-na/eu/fe.ssl-images-amazon.com).
- **deploy:** Source at `workers/amazon-image-proxy/`. Usage: `https://amazon-image-proxy.pokpok.workers.dev/?url=<encoded-amazon-url>`

---

## 2026-03-19

### POKPOK Index — Monthly Podcast
- **feature:** Generated first POKPOK Index podcast via NotebookLM — two-person deep dive discussing March 2026 monthly results (top 15 movers, 5 uncomfortable truths). Feynman style: provocative, straightforward, no jargon. 17m49s, 128kbps MP3.
- **data:** Source: Supabase Storage `index/monthly/latest.json` (349 products scanned, 28-day period Feb 17 – Mar 18)
- **deploy:** MP3 pushed to GitHub Pages: `https://xclv-ai.github.io/pokpok-report/products/index/pokpok-index-march-2026.mp3`
- **local:** Backup at `pokpok-ai/index/podcast/pokpok-index-march-2026.mp3`

---

## 2026-03-17

### X-RAY Bug Fixes (B25, B26) + Share Improvements
- **fix:** B25 — YOUR SCORE button not clickable with mouse. Root cause: Space Invaders Framer container (position:absolute, z-index:1) blocked all clicks in display area. Fix: useEffect + mergedRef reaches up to Framer container and sets pointer-events:none + visibility:hidden when not scanning. (Overrides v1.11.9)
- **fix:** B26 — Dial label re-click toggled OFF unexpectedly. Removed toggle behavior — each zone now navigates to its state and stays. OFF is a dedicated zone (top-right). No double-click needed. (Overrides v1.11.9)
- **fix:** Share clipboard copy failed silently — navigator.clipboard.writeText() called after async captureScreenshot(), losing user gesture context. Moved to before any awaits. (Overrides v1.11.9)
- **fix:** Share text showed "unknown" domain — xrayData.url undefined. Now reads from window.__POKPOK_XRAY_NAV__.scanUrl. (Overrides v1.11.9)
- **improvement:** SHARE_OG_BASE updated to xray.pokpok.ai custom domain (was xclv-ai.github.io/pokpok-report)
- **feature:** xray.pokpok.ai → pokpok.ai/products/xray redirect (GitHub Pages custom domain)

### X-RAY Phase 3.2 — Native LinkedIn Share + Dynamic OG Cards
- **feature:** `share-og` edge function v1 — serves dynamic OG HTML with per-scan title, description, and image. LinkedIn crawler gets proper og:tags; browsers get meta-refresh redirect to Framer page. Deployed with `no-verify-jwt`.
- **feature:** `generate-scorecard` edge function v2 — added GET handler so the function URL works as `og:image` src (was POST-only). Fixed CTA URL from `pokpok.ai/scan` to `pokpok.ai/products/xray`.
- **feature:** `claim-share-bonus` edge function v2 — `SHARE_BASE_URL` changed from Framer URL to `share-og` edge function URL. Share links now point to the OG proxy, not directly to Framer.
- **feature:** SQL migration `004_screenshot_url.sql` — added `screenshot_url` text column to `free_scans`, RLS policy for user updates.
- **feature:** Supabase Storage bucket `xray-screenshots` (public) — stores html-to-image captures for og:image cards.
- **feature:** XrayOverrides v1.11.0 (local, awaiting Framer paste) — screenshot uploads to Supabase Storage after html-to-image capture. Native LinkedIn share dialog (`linkedin.com/sharing/share-offsite`) replaces custom preview overlay. Removed: showPreview state, preview overlay, handleConfirmPost, _buildPreview, _ledColor helper.
- **feature:** XrayProvider v1.8.0 (local, awaiting Framer paste) — removed LinkedIn OAuth flow (LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI, openLinkedInAuthPopup), removed `linkedin_post` action handler, removed `__POKPOK_LINKEDIN__` global. Share action unchanged.
- **improvement:** B7 (LinkedIn share 502) and B16 (LinkedIn re-auth) now moot — no more custom LinkedIn API posting or OAuth needed.

- **fix:** `share-og` edge function v2 — LinkedIn "Cannot display preview" (B19). Root cause: `meta http-equiv="refresh"` made LinkedIn's crawler follow redirect before reading OG tags. Fix: replaced with `<script>window.location.replace(url)</script>` — crawlers don't execute JS (F030).

> **Note:** Backend fully deployed. Frontend files (XrayOverrides v1.11.0 + XrayProvider v1.8.0) awaiting user paste into Framer editor.

---

## 2026-03-13

### X-RAY Credit System — Full Deployment
- **feature:** SQL migration `002_credit_system_v2.sql` — `anon_credits` table, `signin_bonus`/`share_bonus` columns on `credits`, 4 atomic RPCs (`decrement_credit`, `decrement_anon_credit`, `claim_share_bonus`, `migrate_anon_to_user`), RLS + grants
- **feature:** `claim-share-bonus` edge function v1 — awards +3 credits (capped at 7) on share, requires JWT, validates share_id exists
- **feature:** `scan-url` edge function v4 — handles both anonymous (fingerprint) and authenticated credit tracking, always returns `credits_remaining` as integer
- **feature:** XrayProvider v1.5.0 — removed `balance: -1` unlimited sentinel, added `refreshCredits()` via PostgREST, `migrate_anon_to_user` RPC on auth change, share action handler calling `claim-share-bonus` edge fn
- **feature:** XrayOverrides v1.9.0 — removed UNLIMITED branch from `withCreditsCounter`, auth-aware `withShareCta` (hidden for anon, `[SHARED ✓]` after claiming)
- **improvement:** Credit flow: 3 anonymous → +1 Google sign-in → +3 share = 7 max. Each scan -1. Hard wall at 0.

> **Note:** [SIGN IN +1] CTA still visible for authenticated users — UI bug to fix in Overrides.

### X-RAY Credits Display Fix
- **fix:** XrayProvider v1.5.1 — event name mismatch `pokpok-auth-change` → `pokpok-auth-ready` (AuthProvider dispatched `ready`, Provider listened for `change`)
- **fix:** XrayProvider v1.5.2 — `refreshCredits()` replaced raw `fetch()` to Supabase REST API with `supabase.from("credits").select()`. Raw fetch returned 401 "No API key found" — apikey header not reaching server. Supabase client handles headers automatically.
- **fix:** XrayOverrides v1.9.5 → v1.9.6 — Login link triggers Google OAuth directly, withSignInCta reactivity on auth change, event name fix
- **improvement:** Failure patterns F025 (always check console errors FIRST) and F026 (use Supabase client, not raw fetch) documented

### X-RAY Credits Idempotency (v1.5.3 — awaiting deploy)
- **fix:** XrayProvider v1.5.3 — `migrateDoneRef` guard prevents `migrate_anon_to_user` RPC from being called multiple times per session (sign-out → sign-in, duplicate auth events, page already authenticated on load). DB RPC was already idempotent via `signin_bonus` flag, but client now skips the network call entirely.

---

## 2026-03-09

### Subscription Checkout Button
- **fix:** SubscriptionCheckoutButton v1.1.0 — added 1800ms delay before `/signin` redirect in `goSignin()` so Framer button interaction ("YEAH!" variant) is visible before page navigates. Backups: `www/framer-website/code/backups/2026-03-09_SubscriptionCheckoutButton_v1.0.0.tsx` (original) and `_v1.1.0.tsx` (fix). [WIP - awaiting user verification on live site]

### Database Maintenance
- **improvement:** Deleted 217 Codex QA test records (`codex.qa+*@example.com`) from `marketing` table in Supabase (pokpok project)
- **improvement:** Deduplicated `marketing` table — merged 5 duplicate email groups (davolt666@ukr.net ×6, test@pokpok.ai ×5, george.dzhyn@gmail.com ×4, ceo@xclv.com ×2, georgio-jiovanni@ukr.net ×2), keeping latest record per email with its subscription status preserved

---

## 2026-03-08

### Architecture: Rules → Skills Migration
- **improvement:** Consolidated all duplicate rules from subproject `.claude/rules/` directories into centralized `.claude/skills/` with reference files
- **improvement:** Removed 7 copies of global FAILURES.md, safety.md, version-numbers.md from subproject directories (www, ops, paywall, leaderboard, n8n, marketing, changelog, xray)
- **improvement:** Moved framer docs/plans/test-protocols to `www/docs/`, paywall docs to `paywall/docs/`, leaderboard docs to `leaderboard/docs/`, n8n docs to `n8n/docs/`
- **improvement:** Created new skills: pokpok-ui (813 lines), supabase (139 lines), ui-audit (267 lines) with evaluation criteria and failure references
- **improvement:** Added failure reference files to framer, n8n-workflows, pokpok-ui, supabase skills
- **improvement:** Archived `xray/BUGS.md` → `xray/BUGS.archived.md` (bugs migrated to changelog.md)

### Security Notification Email Templates
- **feature:** 4 security notification email templates with POKPOK branding: email-changed, mfa-added, mfa-removed, password-changed
- **feature:** Both display HTML and Supabase-compatible versions for each template
- **improvement:** F019 failure documented in dedicated file (`marketing/docs/failures/F019-email-template-audit.md`)

### /subscription Page Design Iterations
- **improvement:** 8 iterations of metrics infographic HTML prototypes exploring different visual layouts
- **improvement:** ChangelogLoader v2.0.0 through v2.3.0 — iterative component improvements
- **improvement:** Raw methodology data files added (Monthly + Weekly formats)

### Documentation
- **feature:** PokPok Score visual allegories document for NotebookLM infographic generation
- **feature:** Changelog TODO protocol — new sessions/tasks auto-add `- [ ]` entry to changelog
- **improvement:** changelog-update-protocol.md rule created with session-start rule

---

## 2026-03-07

### /subscription Page Redesign
- **feature:** Full HTML/CSS prototype for /subscription page redesign — 8 color-blocked sections following pokpok-ui design system
- **feature:** Page sections: Pink Hero, Beige "What You Get" (stat blocks + 5 section cards), Report Preview (top 5 movers), Pink Pathology Preview (5 truths accordion), Teal Methodology (4 filter cards + yellow quote banner), Yellow CTA + Pricing
- **feature:** MonthlyReportPreview.tsx v1.0.0 — Framer code component for top 5 movers with rank badges, PokPok Scores, rank jumps (local, not deployed)
- **feature:** PathologyPreview.tsx v1.0.0 — Framer code component for 5 truth rows in collapsed accordion style (local, not deployed)
- **improvement:** Sample data files saved: monthly-report-sample.json, methodology.md
- **improvement:** Full page spec document with all copy, typography, colors, and layout details

### pokpok-ui SKILL.md — Round 2 Fixes
- **fix:** Duplicate SKILL.md in `marketing/.claude/skills/pokpok-ui/` — identical copy of main skill, guaranteed drift bug. Deleted duplicate; monorepo skills in `.claude/skills/` are accessible to all subprojects.
- **fix:** 8 verified errors corrected via live DevTools evaluation: LOG IN button (missing font-size/uppercase), status labels (missing uppercase), incomplete italic words list, H2 dual-font usage undocumented, danger badge display-p3 color, footer tagline/subscribe button/brand therapy label undocumented
- **improvement:** 7 undocumented components added from screenshot analysis: truth source cards, question/answer cards, accordion sections, tone sliders, archetype territory grid, saturation summary blocks, category distribution bars
- **improvement:** Added screenshot reference to SKILL.md for visual verification

### Email Template Audit
- **improvement:** F019 failure documented — email template audit used local files instead of Supabase dashboard
- **improvement:** Discovered Supabase has TWO email template sections: Auth emails + Security notifications (5 templates need POKPOK styling)

### Monorepo
- **feature:** Initial monorepo git commit with consolidated structure

### Tracking Consolidation
- **improvement:** Universal changelog — migrated all bugs from xray/BUGS.md, TODOs from changelog/TODO.md into single changelog.md
- **feature:** Changelog update protocol rule created (.claude/rules/global/changelog-update-protocol.md)

---

## 2026-03-04

### X-RAY LED Bar Iterations
- **fix:** XrayOverrides v1.6.31 through v1.6.34 — no lower section, passthrough lower, smooth transition, robust lower section
- **improvement:** LED bar colors now correct via CSS filter approach, but semi-transparent opacity issue remains

> **Note:** 40+ local iterations on LED bar display. All versions local only — Framer MCP `updateCodeFile` fails on files >200 lines. Manual copy-paste deployment required.

---

## 2026-03-03

### X-RAY LED Bar Iterations
- **fix:** XrayOverrides v1.6.28 through v1.6.30 — row fixes, smooth lower section, restore group hiding

---

## 2026-03-02

### X-RAY LED Bar Iterations
- **fix:** XrayOverrides v1.6.24 through v1.6.27 — score vertical display, row fix iterations

---

## 2026-03-01

### X-RAY DevTools Audit
- **improvement:** Live testing audit: 10 failure points confirmed, 23 working features verified
- **improvement:** v1.0.8 Provider / v1.1.0 Overrides / v1.3 Content status — DEPLOYED with failures

### X-RAY Local Fixes (NOT DEPLOYED)
- **fix:** XrayProvider v1.2.0 — keyboard navigation fixed (Space for section switching)
- **fix:** XrayOverrides v1.5.0 — Dial OFF click fix, data guards removed for pre-scan educational mode
- **fix:** XrayOverrides v1.6.4 — LED bar color fixes using CSS filter DOM manipulation

---

## 2026-02-28

### Monorepo Consolidation
- **feature:** All pokpok-* repos consolidated into single monorepo `pokpok-ai/`
- **improvement:** Subprojects moved to root: xray/, www/, paywall/, leaderboard/, n8n/, marketing/, changelog/, extension/, ops/
- **improvement:** All .claude/ rules, skills, and agents consolidated under pokpok-ai/.claude/

### X-RAY Full Audit
- **improvement:** Comprehensive X-RAY audit discovered 26 bugs across keyboard navigation, LED displays, auth gating, and click handlers
- **improvement:** Bug registry created (BUG-1 through BUG-21 + 5 additional)

---

## 2026-02-25

### X-RAY Benchmarking
- **feature:** ShipOrDie benchmark teardown — performance analysis of competitor X-RAY tools
- **feature:** ShipOrDie prompt options — Gemini configuration testing for scan quality

---

## 2026-02-24

### X-RAY Design
- **improvement:** Display screens finalization complete

---

## 2026-02-23

### X-RAY Design
- **feature:** Display screens specification finalized — all 13 UI states documented (idle, scanning, results, error, etc.)

---

## 2026-02-21

### n8n System Prompts
- **feature:** WWW system prompt v4.7 — M14 + M16 cross-marker coherence self-checks. Medicube score 31->36/100.
- **feature:** WWW system prompt v4.8 — M15 Slider A Self-Check: if M14 territory = Correction/Protection, M15 Anxiety cannot be <=2/5. Expected Medicube 36->40.6/100.

---

## 2026-02-20

### Brand Perception System Prompt
- **feature:** WWW system prompt v4.6 — Marker 8 Warm Palette Self-Check rule. If palette description contains warm descriptors ("warm," "pink," "rose," "beige," "gold," etc.), thermostat cannot be <=2/5. Self-contradiction detector stops and re-scores from gallery only.
- **feature:** WWW system prompt v4.6 — Marker 8 PDP Visual Reference Rule. When `pdp_marker_8` field provided in input and WWW gallery visually similar to PDP gallery, use PDP territory as reference to prevent territory flipping on identical images.
- **improvement:** B0BPXT3GBN (Medicube) anomaly investigation complete — score 26->31 after visual pipeline fix. M8 self-contradiction identified (warm pink palette + Sterile thermostat). Score ceiling ~37/100 without brand alignment decisions.
- **improvement:** Execution 26984 visual analysis validated — confirmed URL fix, Clinical Pop (not Pharma-Code) is correct page-level territory, warm pink gallery imagery captured correctly.

> **Note:** B0BPXT3GBN score is legitimately low (31/100). 12 of 17 markers reflect genuine brand splits between medicube.us ($30) and Amazon PDP ($16). The ~2x price gap drives different brand stories on each channel. The v4.6 fix addresses the one remaining pipeline anomaly (Marker 8 self-contradiction, +4.7 pts).

---

## 2026-02-18

### n8n Audit
- **improvement:** Full execution audit of B002BADJVE (MISSHA BB Cream) — score varies 51->56->61 across consecutive runs. Root cause: alignment formula computed by Gemini 2.5 Pro at temperature 1, not by code.
- **improvement:** F018 failure documented — system prompt refactoring (v3.5/v3.6) broke JSON output types. `territory_number` became string instead of integer, archetype names lost "The " prefix. UI shows blank data for affected ASINs.
- **improvement:** 90-point per-marker swings confirmed (KSP: 10%->100% between runs). No seed parameter on any Gemini node.

> **Note:** Three critical fixes needed: (1) Move scoring to Code node (deterministic), (2) Lower temperatures on all Gemini nodes (1.0->0.2/0.3), (3) Add seed parameter to all generationConfig blocks.

---

## 2026-02-08

### Admin Panel — Recurring Orders
- **feature:** RecurringOrderItemsList v1.1.0 — 1 component instance per category group (not 15), binds title/alignment/category/orderCount per group, asin1-15 badge binding
- **fix:** AdminPDPProvider v1.5.15 — removed wrong `if (row.report_id) return false` filter that excluded all category rows from on-demand section
- **feature:** RecurringOrderItemsList v1.2.0 + AdminPDPProvider v1.5.16 — group title from `pdp.leaderboard` column instead of report_id
- **feature:** RecurringOrderItemsList v1.2.1 — per-ASIN badge variants (Yellow=analyzed, Green=approved, Muted=pending)
- **feature:** RecurringOrderItemsList v1.2.4 — DOM workaround for badge text colors (Framer variants only control BG)
- **feature:** RecurringOrderItemsList v1.2.5 — MutationObserver for badge text color persistence across re-renders

### Admin Panel — Processed Orders
- **fix:** OrderItemsList v1.2.5 — Rerun button stays disabled until status updates
- **fix:** OrderItemsList v1.2.7 — Flagged ASINs show Critical/BG pink badges
- **fix:** OrderItemsList v1.2.8 — Hide category badge when report_id is NULL (opacity 0 workaround)

### Documentation
- **improvement:** Recurring orders failure analysis documented (F010 violation, architecture misunderstanding)
- **improvement:** F017 failure documented — universal rule: camelCase for data props, prop IDs only for variants

---

## 2026-02-06

### n8n Visual Analysis
- **feature:** WWW Visual Analysis System Prompt & Schema v2 — dual-layer Container/Content analysis for brand website screenshots. Separates website UI shell (Container) from brand visual content (Content). 6 visual territory types: Pharma-Code, Clinical Pop, Gen-Z Pop, Heritage Warm, Luxury Minimal, Warm Shell.
- **feature:** WWW v2 pipeline: Edit Image -> Extract from File (binary->base64) -> Gemini 3 Flash HTTP Request -> Final Combining Code Node. Switched from OpenAI ChatGPT-4o to Gemini 3 Flash.
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
- **feature:** Separate navigation override for Amazon URL (right-click -> open in new tab preserved)

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
- **improvement:** Database schema: `approved` -> `status` column for granular tracking
- **improvement:** Field naming: `pdp-link` -> `pdp_link` (underscore convention)

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
