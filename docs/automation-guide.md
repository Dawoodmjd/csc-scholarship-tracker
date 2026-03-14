# Automation Guide

This repository includes a lightweight enrichment script for professor research tracking.

## Input File

Prepare rows in:

- `data/universities/professor_seed_template.csv`

Recommended minimum fields:

- `university_name`
- `department_name`
- `professor_name`
- `faculty_page_url`

## What The Script Does

The script at `scripts/collect-professor-data.mjs` will try to:

- fetch each faculty page
- extract email addresses
- detect a ResearchGate link
- detect a Google Scholar profile link
- estimate a research area from common faculty-page labels
- fetch citation counts from Google Scholar if a scholar profile URL is available

## Run It

```powershell
npm run collect:professors -- --input data/universities/professor_seed_template.csv --output data/universities/professor_enriched_output.csv
```

## Important Notes

- This is a best-effort helper, not a guaranteed scraper.
- University websites use different page structures, so some rows may need manual cleanup.
- Citation counts change over time and should be re-checked before applying.
- Be respectful with request volume. The script includes a small delay between requests.

