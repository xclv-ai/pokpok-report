# Changelog JSON Migration Plan

**Date:** 2026-02-02
**Status:** Planned
**Location:** pokpok-report repo

---

## Goal

Replace hardcoded HTML changelog with JSON-driven system for easier maintenance.

## Current State

- ✅ `updates.html` - Custom styled page (beige bg, teal text, checkbox format)
- ❌ Updates require editing HTML directly
- ❌ Non-technical users can't easily add entries

## Proposed Solution

Store changelog data in `changelog.json`, render with JavaScript.

---

## File Structure

```
pokpok-report/
├── updates.html (modified to render from JSON)
├── changelog.json (NEW - data source)
└── docs/
    └── changelog-json-migration-plan.md (this file)
```

---

## changelog.json Structure

```json
{
  "entries": [
    {
      "date": "2026-02-02",
      "changes": {
        "fixed": [
          "Button variant not changing on /my-reports page",
          "PAID button link not working (portal session)",
          "Slot probing failures for nested admin buttons"
        ],
        "added": [
          "Polar portal session integration for invoice access",
          "Persistence listener for admin button state changes"
        ],
        "changed": [],
        "documentation": [],
        "note": "Schema migration completed. The `approved` column has been replaced with `status` for more granular state tracking."
      }
    },
    {
      "date": "2026-01-28",
      "changes": {
        "fixed": [
          "Approved/Flagged button persistence to Supabase",
          "Admin PDP viewer data loading race condition",
          "RecentOrder component date/time formatting"
        ],
        "changed": [
          "Database schema: `approved` → `status` column",
          "Field naming: `pdp-link` → `pdp_link` (underscore)"
        ]
      }
    }
  ],
  "todo": [
    "Custom domain support for category reports",
    "Bulk export functionality for admin panel",
    "Real-time notification system for new reports",
    "Enhanced search and filtering in admin dashboard"
  ]
}
```

---

## Implementation Steps

### Step 1: Create changelog.json

Extract existing changelog data from HTML into JSON format.

### Step 2: Add JavaScript Renderer

Add to `updates.html` before closing `</body>`:

```html
<script>
  // Fetch and render changelog
  fetch('./changelog.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('changelog-container')

      // Render entries
      data.entries.forEach(entry => {
        const entryEl = createEntry(entry)
        container.appendChild(entryEl)
      })

      // Render TODO section
      const todoEl = createTodoSection(data.todo)
      container.appendChild(todoEl)
    })

  function createEntry(entry) {
    const div = document.createElement('div')
    div.className = 'changelog-entry'

    // Date header
    const date = document.createElement('h2')
    date.className = 'date-header'
    date.textContent = entry.date
    div.appendChild(date)

    // Categories
    const categories = ['fixed', 'added', 'changed', 'documentation']
    categories.forEach(cat => {
      if (entry.changes[cat]?.length > 0) {
        div.appendChild(createCategory(cat, entry.changes[cat]))
      }
    })

    // Note (if exists)
    if (entry.changes.note) {
      const note = document.createElement('div')
      note.className = 'highlight-box'
      note.innerHTML = `<strong>Developer Note:</strong> ${entry.changes.note}`
      div.appendChild(note)
    }

    return div
  }

  function createCategory(name, items) {
    const container = document.createElement('div')

    const header = document.createElement('div')
    header.className = 'change-category'
    header.textContent = name.toUpperCase()
    container.appendChild(header)

    items.forEach(text => {
      const item = document.createElement('div')
      item.className = 'change-item done'
      item.textContent = text
      container.appendChild(item)
    })

    return container
  }

  function createTodoSection(todos) {
    const div = document.createElement('div')
    div.className = 'changelog-entry'

    const date = document.createElement('h2')
    date.className = 'date-header'
    date.textContent = 'Coming Soon'
    div.appendChild(date)

    const header = document.createElement('div')
    header.className = 'change-category'
    header.textContent = 'TO BE FIXED'
    div.appendChild(header)

    todos.forEach(text => {
      const item = document.createElement('div')
      item.className = 'change-item todo'
      item.textContent = text
      div.appendChild(item)
    })

    return div
  }
</script>
```

### Step 3: Modify HTML Structure

Replace hardcoded changelog entries with:

```html
<div class="container">
    <h1>Product <em>Updates</em></h1>
    <div class="subtitle">What's new, what's fixed, what's coming</div>

    <!-- Dynamic content rendered here -->
    <div id="changelog-container"></div>

    <a href="#" class="back-to-top">↑ Back to Top</a>
</div>
```

### Step 4: Test Locally

```bash
cd pokpok-products/github
python -m http.server 8000
# Visit: http://localhost:8000/updates.html
```

### Step 5: Deploy

```bash
git add changelog.json updates.html
git commit -m "Migrate changelog to JSON-driven system"
git push
```

---

## Maintenance Workflow (After Implementation)

### Add New Entry

Edit `changelog.json`:

```json
{
  "entries": [
    {
      "date": "2026-02-03",
      "changes": {
        "fixed": ["Your new fix"],
        "added": ["Your new feature"]
      }
    },
    ...existing entries...
  ]
}
```

Commit and push. Done.

### Add TODO Item

Edit `changelog.json`:

```json
{
  "todo": [
    "Your new planned feature",
    ...existing todos...
  ]
}
```

---

## Benefits

| Before | After |
|--------|-------|
| Edit HTML directly | Edit JSON only |
| 338 lines of HTML | ~50 lines of JSON |
| Manual formatting | Auto-formatted |
| Prone to typos | Schema validated |
| Hard to parse | Easy to query/filter |

---

## Future Enhancements

- [ ] JSON schema validation
- [ ] Automatic date sorting
- [ ] Filter by category (FIXED, ADDED, etc.)
- [ ] Search functionality
- [ ] Export to Markdown
- [ ] GitHub Actions to auto-generate from commits

---

## Rollback Plan

If issues occur:
1. Revert to `updates.html` from commit `5c3a174`
2. Remove `changelog.json`
3. Push changes

Original working version preserved in git history.
