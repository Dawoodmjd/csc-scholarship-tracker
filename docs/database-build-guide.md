# CSC Master and PhD Database Guide

This repository now includes a database layer for collecting all Master and PhD programs by university.

## What "Full Database" Means Here

The goal is to store, for each university:

- whether it appears in the official CSC host list
- university tier (`C9`, `985`, `211`)
- agency number
- official international admissions page
- every relevant Master and PhD program
- discipline and major name
- school or college
- department
- teaching language
- duration
- tuition and fee fields if published
- application deadline
- official source URLs
- program-specific requirements

## Files To Fill

### University master table

- `data/universities/csc_host_universities.csv`

### Program catalog

- `data/programs/csc_program_catalog.csv`

One row should represent one official program.

### Program requirements

- `data/programs/csc_program_requirements.csv`

One row should represent one requirement tied to one program.

### Collection queue

- `data/programs/csc_program_collection_queue.csv`

Use this to track which universities are still waiting to be collected.

## Recommended Collection Order

1. Fill all universities from the official CSC host university list.
2. Add agency numbers from each official university admissions page or CSC application page.
3. Add official international admissions URLs.
4. Add every Master program.
5. Add every PhD program.
6. Add requirements and deadlines.
7. Link professors later for research-fit filtering.

## Important Data Rules

- Use official university pages as the main source.
- Use CampusChina only for host-university verification and application-system field references.
- Do not guess agency numbers.
- Do not guess whether a program accepts CSC applicants unless the source says so.
- Keep `source_last_checked` for every row.

## Useful Official CSC Fields

The CampusChina applicant guide confirms that CSC applications rely on:

- `Agency No.`
- `Discipline Applying for`
- `Major Applying for`
- `Preferred Teaching Language`

That is why these fields are included in the database structure.

## Current Official Sources

- CampusChina host university list:
  [Appendix 2 Chinese Host University List](https://www.campuschina.org/Upload/file/20240408/20240408111834_0971.pdf)
- CampusChina applicant guide:
  [Online Application Guide for Applicants](https://www.campuschina.org/Upload/file/20240408/20240408111909_5912.pdf)

## Reality Check

Building a true full database of all Master and PhD programs across all CSC host universities is a large ongoing data-collection project.

This repository is now structured so you can do it systematically and safely, instead of keeping disconnected spreadsheets.

