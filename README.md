# CSC Scholarship Repository

This repository is a free, GitHub-ready workspace for organizing information related to the Chinese Government Scholarship (CSC).

It is designed to help applicants track:

- required application documents
- CSC and university deadlines
- university departments
- target professors and research areas
- ResearchGate and Google Scholar profiles
- citation counts and notes
- real Excel workbooks generated from the CSV templates

## Repository Structure

```text
.
|-- data/
|   |-- documents/
|   |   `-- required_documents.csv
|   |-- deadlines/
|   |   `-- csc_deadlines.csv
|   |-- programs/
|   |   |-- csc_program_catalog.csv
|   |   |-- csc_program_collection_queue.csv
|   |   `-- csc_program_requirements.csv
|   |-- professors/
|   |   |-- professor_collection_queue.csv
|   |   |-- professor_details.csv
|   |   |-- professor_outreach.csv
|   |   `-- professor_master.csv
|   `-- universities/
|       |-- by-university/
|       |   |-- README.md
|       |   `-- example-university.csv
|       |-- china_university_tiers.csv
|       |-- csc_host_universities.csv
|       |-- master_university_contacts.csv
|       |-- professor_seed_template.csv
|       `-- university_intake_template.csv
|-- docs/
|   |-- automation-guide.md
|   |-- database-build-guide.md
|   |-- professor-collection-guide.md
|   |-- collection-guide.md
|   |-- getting-started.md
|   `-- university-selection-guide.md
|-- exports/
|-- reports/
|-- scripts/
|   |-- build-program-database.mjs
|   |-- collect-professor-data.mjs
|   |-- generate-professor-snapshot.mjs
|   |-- report-professor-status.mjs
|   |-- seed-professor-queue.mjs
|   `-- export-xlsx.ps1
|-- schema/
|   `-- csc_program_database.sql
|-- snapshots/
|-- workbooks/
|   |-- csc_host_universities.xlsx
|   |-- csc_program_catalog.xlsx
|   |-- csc_program_collection_queue.xlsx
|   |-- csc_program_requirements.xlsx
|   |-- professor_collection_queue.xlsx
|   |-- professor_details.xlsx
|   |-- professor_outreach.xlsx
|   |-- professor_master.xlsx
|   |-- csc_deadlines.xlsx
|   |-- china_university_tiers.xlsx
|   |-- master_university_contacts.xlsx
|   |-- required_documents.xlsx
|   `-- university_intake_template.xlsx
|-- CONTRIBUTING.md
|-- .gitignore
|-- index.html
|-- LICENSE
|-- package.json
`-- README.md
```

## Start Here

If this is your first time using a repository, open these in order:

1. [`docs/getting-started.md`](docs/getting-started.md)
2. [`workbooks/required_documents.xlsx`](workbooks/required_documents.xlsx)
3. [`workbooks/csc_deadlines.xlsx`](workbooks/csc_deadlines.xlsx)
4. [`workbooks/master_university_contacts.xlsx`](workbooks/master_university_contacts.xlsx)
5. [`workbooks/china_university_tiers.xlsx`](workbooks/china_university_tiers.xlsx)
6. [`workbooks/csc_host_universities.xlsx`](workbooks/csc_host_universities.xlsx)
7. [`workbooks/csc_program_catalog.xlsx`](workbooks/csc_program_catalog.xlsx)
8. [`workbooks/professor_collection_queue.xlsx`](workbooks/professor_collection_queue.xlsx)
9. [`workbooks/professor_master.xlsx`](workbooks/professor_master.xlsx)
10. [`workbooks/professor_details.xlsx`](workbooks/professor_details.xlsx)
11. [`workbooks/professor_outreach.xlsx`](workbooks/professor_outreach.xlsx)

## What To Track

### 0. University Tier Reference
Use [`data/universities/china_university_tiers.csv`](data/universities/china_university_tiers.csv) to sort universities by:

- `C9`
- `985` non-`C9`
- `211` only

Read [`docs/university-selection-guide.md`](docs/university-selection-guide.md) before building your shortlist.

### 1. Required Documents
Use [`data/documents/required_documents.csv`](data/documents/required_documents.csv) to list each item needed for a CSC application.

Examples:

- passport
- degree certificates
- transcripts
- study plan or research proposal
- recommendation letters
- physical examination form
- language proficiency certificate
- acceptance letter, if required

### 2. Deadlines
Use [`data/deadlines/csc_deadlines.csv`](data/deadlines/csc_deadlines.csv) to track:

- CSC application windows
- embassy deadlines
- university portal deadlines
- professor contact deadlines
- recommendation letter deadlines

### 3. University and Professor Research Tracking
Use [`data/universities/master_university_contacts.csv`](data/universities/master_university_contacts.csv) as the main spreadsheet for:

- university name
- department name
- professor name
- research area
- email
- laboratory or faculty profile
- ResearchGate profile
- Google Scholar profile
- citation count
- application status

If you want to create one file per university, duplicate [`data/universities/university_intake_template.csv`](data/universities/university_intake_template.csv) into the `data/universities/by-university/` folder.

### 4. Full Master and PhD Program Database
Use these files to build the full CSC-oriented program database:

- [`data/universities/csc_host_universities.csv`](data/universities/csc_host_universities.csv)
- [`data/programs/csc_program_catalog.csv`](data/programs/csc_program_catalog.csv)
- [`data/programs/csc_program_requirements.csv`](data/programs/csc_program_requirements.csv)
- [`data/programs/csc_program_collection_queue.csv`](data/programs/csc_program_collection_queue.csv)

Read [`docs/database-build-guide.md`](docs/database-build-guide.md) for the collection workflow.

### 5. Full Professor Database
Use these files for professor-level collection:

- [`data/professors/professor_master.csv`](data/professors/professor_master.csv)
- [`data/professors/professor_collection_queue.csv`](data/professors/professor_collection_queue.csv)
- [`data/professors/professor_details.csv`](data/professors/professor_details.csv)
- [`data/professors/professor_outreach.csv`](data/professors/professor_outreach.csv)

Read [`docs/professor-collection-guide.md`](docs/professor-collection-guide.md) before collecting faculty data.

## Excel Workbooks

This repository now supports actual `.xlsx` workbooks under `workbooks/`.

To regenerate them from the CSV source files:

```powershell
npm run build:xlsx
```

The generated workbooks are:

- `workbooks/required_documents.xlsx`
- `workbooks/csc_deadlines.xlsx`
- `workbooks/china_university_tiers.xlsx`
- `workbooks/csc_host_universities.xlsx`
- `workbooks/csc_program_catalog.xlsx`
- `workbooks/csc_program_requirements.xlsx`
- `workbooks/csc_program_collection_queue.xlsx`
- `workbooks/professor_master.xlsx`
- `workbooks/professor_collection_queue.xlsx`
- `workbooks/professor_details.xlsx`
- `workbooks/professor_outreach.xlsx`
- `workbooks/master_university_contacts.xlsx`
- `workbooks/university_intake_template.xlsx`

## Professor Data Automation

Use the seed file [`data/universities/professor_seed_template.csv`](data/universities/professor_seed_template.csv) with the automation guide in [`docs/automation-guide.md`](docs/automation-guide.md).

To run the enrichment script:

```powershell
npm run collect:professors -- --input data/universities/professor_seed_template.csv --output data/universities/professor_enriched_output.csv
```

## Database Export

To build a single JSON export of the structured university and program database:

```powershell
npm run build:database
```

To seed the professor-collection queue from the university tier file:

```powershell
npm run seed:professor-queue
```

To generate a professor snapshot and a review report:

```powershell
npm run snapshot:professors
npm run report:professors
```

## Suggested Workflow

1. Fill the required documents file first.
2. Add all known deadlines.
3. Create one row per professor in the master university file.
4. Sort and filter by research fit, citations, and response status.
5. Keep this repository updated as you contact universities and supervisors.

## GitHub Setup

To publish this repository on GitHub:

```powershell
git add .
git commit -m "Initial CSC scholarship repository scaffold"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Notes

- CSV files open cleanly in Excel, Google Sheets, and LibreOffice.
- If you want, this repository can later be expanded with scripts to automatically collect professor profiles and citation data.
- Citation counts change over time, so include the date when the count was checked.
- The local landing page is available at `index.html`.
