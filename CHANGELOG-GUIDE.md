# Changelog Usage Guide

**Live Site:** https://xclv-ai.github.io/pokpok-report/updates.html

---

## ✨ Now Using Markdown!

You edit **changelog.md** (simple markdown) instead of JSON.

---

## Quick Start

### 1. Edit changelog.md

```markdown
## 2026-02-03

### FIXED
- Your bug fix here

### ADDED
- Your new feature here

> **Note:** Optional developer note with inline `code` tags
```

### 2. Build JSON

```bash
npm run build
```

Or manually:
```bash
node build-changelog.js
```

### 3. Commit & Push

```bash
git add changelog.md changelog.json
git commit -m "Add changelog: [description]"
git push
```

**Done!** GitHub Pages auto-deploys in ~1 minute.

---

## Markdown Format

### Date Entry

```markdown
## 2026-02-02
```

Format: `## YYYY-MM-DD` (heading level 2)

### Categories

```markdown
### FIXED
- Item 1
- Item 2

### ADDED
- Item 3

### CHANGED
- Item 4

### DOCUMENTATION
- Item 5
```

Categories (heading level 3):
- `FIXED` - Bug fixes
- `ADDED` - New features
- `CHANGED` - Breaking changes, schema updates
- `DOCUMENTATION` - Docs updates

### Optional Note

```markdown
> **Note:** Your developer note here with `inline code` tags.
```

Format: Blockquote starting with `**Note:**`

### TODO Section

```markdown
## Coming Soon

### TO BE FIXED
- Future feature 1
- Future feature 2
```

Must be at the bottom, uses heading `## Coming Soon`

---

## Complete Example

```markdown
## 2026-02-02

### FIXED
- Button variant not changing on /my-reports page
- PAID button link not working (portal session)

### ADDED
- Polar portal session integration for invoice access

> **Note:** Schema migration completed. The `approved` column has been replaced with `status`.

---

## 2026-01-28

### FIXED
- Admin PDP viewer data loading race condition

### CHANGED
- Database schema: `approved` → `status` column

---

## Coming Soon

### TO BE FIXED
- Custom domain support
- Bulk export functionality
```

---

## Build Script

**What it does:**
- Reads `changelog.md`
- Parses markdown structure
- Generates `changelog.json`
- Outputs entry/todo count

**Output:**
```bash
🔨 Building changelog.json from changelog.md...
✅ Generated changelog.json
   4 entries
   4 todo items
```

**Files:**
- `changelog.md` - Source (you edit this)
- `changelog.json` - Generated (don't edit directly)
- `build-changelog.js` - Build script
- `updates.html` - Renders from JSON

---

## Automatic Building (Optional)

### Option 1: Git Pre-Commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Auto-build changelog before commit

if git diff --cached --name-only | grep -q "changelog.md"; then
  echo "🔨 Building changelog.json..."
  npm run build
  git add changelog.json
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

Now `git commit` auto-runs build!

### Option 2: Watch Mode

```bash
npm run build:watch
```

Auto-rebuilds when you save changelog.md.

---

## Troubleshooting

**Build fails:**
```bash
node --version  # Check Node.js installed
```

**JSON invalid:**
- Check markdown syntax (heading levels)
- Verify date format: `YYYY-MM-DD`
- Test build output

**Changes not showing:**
- Clear browser cache (Cmd+Shift+R)
- Wait ~1 minute for GitHub Pages

---

## Before (JSON)

```json
{
  "date": "2026-02-02",
  "changes": {
    "fixed": ["Item 1", "Item 2"],
    "added": ["Item 3"]
  }
}
```

## After (Markdown)

```markdown
## 2026-02-02

### FIXED
- Item 1
- Item 2

### ADDED
- Item 3
```

**Much easier!** 🎉

---

**Questions?** See [changelog-json-migration-plan.md](../../pokpok-www/pokpok-changelog/changelog-json-migration-plan.md)

**Last Updated:** 2026-02-02
