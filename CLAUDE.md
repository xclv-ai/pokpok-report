# CLAUDE.md - pokpok-report (GitHub Data)

This file provides project-specific guidance for the pokpok-report data repository.

## Project Purpose

Local clone of `xclv-ai/pokpok-report` - the **data source** for Framer brand alignment reports.

**GitHub Pages:** https://xclv-ai.github.io/pokpok-report/

## Current State

- [x] GitHub Pages deployment working
- [x] Basic dashboard (Chart.js)
- [ ] Automated data updates from n8n

## Data Structure

```
github/
├── alignment/
│   └── {ASIN}/
│       ├── pdp_analysis.json      # 17 markers from Amazon PDP
│       ├── www_analysis.json      # 17 markers from brand website
│       └── perception_gaps.json   # Gap analysis + 5 truths
├── data.json                      # Dashboard aggregate data
├── index.html                     # Static dashboard
├── app.js                         # Chart.js visualizations
└── styles.css                     # Dashboard styling
```

## Adding New ASIN Data

```bash
# 1. Create folder
mkdir alignment/{NEW_ASIN}

# 2. Add JSON files (from n8n workflow output)
cp pdp_analysis.json alignment/{NEW_ASIN}/
cp www_analysis.json alignment/{NEW_ASIN}/
cp perception_gaps.json alignment/{NEW_ASIN}/

# 3. Commit and push
git add alignment/{NEW_ASIN}/
git commit -m "Add alignment data for {NEW_ASIN}"
git push origin main
```

## JSON Schema Reference

See `pokpok-www/framer-website/docs/data-schema.md` for full schema.

## Next Steps

1.
2.
3.

## Integration Points

| System | How It Connects |
|--------|-----------------|
| n8n | Outputs JSON files after PDP analysis |
| Framer | Fetches via DataProvider.tsx using ASIN from URL |
| Dashboard | Reads data.json for aggregate view |

## Notes

<!-- Add notes about data quality, missing ASINs, etc. -->

