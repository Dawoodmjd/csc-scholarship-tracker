# Contributing

This repository is designed to be simple enough for one person to manage, but structured well enough for others to help.

## Basic Rules

- Use official university and CSC sources whenever possible.
- Keep one professor or one lab per row.
- Do not guess citation counts, emails, or profile links.
- If information is uncertain, leave the field blank and add a note.
- Prefer `YYYY-MM-DD` for dates.

## Recommended Update Order

1. Update documents in `data/documents/`.
2. Update deadlines in `data/deadlines/`.
3. Update professor and university data in `data/universities/`.
4. Rebuild Excel workbooks with `npm.cmd run build:xlsx`.

## Before Publishing Changes

Check that:

- filenames are clear
- links open correctly
- citation dates are recorded
- duplicate professors are removed
- generated workbooks are refreshed

