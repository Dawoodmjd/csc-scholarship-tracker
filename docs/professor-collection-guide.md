# Professor Collection Guide

This repository now supports a full professor-level database.

## What Can Be Collected Reliably

From official university pages, you can usually collect:

- department or school
- professor name
- title
- email
- faculty profile URL
- lab URL
- research area
- research keywords

From Google Scholar or ResearchGate, you can sometimes collect:

- scholar profile URL
- ResearchGate profile URL
- citation count

## What Cannot Be Guaranteed Automatically

- complete Google Scholar coverage for every professor
- complete ResearchGate coverage for every professor
- stable citation counts without re-checking
- uniform faculty-page layouts across all universities

## Recommended Collection Order

1. `C9`
2. strong `985` universities
3. strong `211` universities
4. remaining CSC host universities

## Main Files

- `data/professors/professor_master.csv`
- `data/professors/professor_collection_queue.csv`
- `data/universities/china_university_tiers.csv`
- `data/universities/master_university_contacts.csv`

## Practical Workflow

1. Generate the professor queue from the university tier file.
2. Mark one university as `In progress`.
3. Collect professor rows from official faculty or department pages.
4. Run the enrichment script where possible for Scholar and ResearchGate links.
5. Verify citation counts manually when the profile pages are unclear.

## Honest Scope Note

A true all-university professor database is a long-running data project, not a single scrape.

This repository is now structured so you can build it safely and systematically.

