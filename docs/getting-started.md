# Getting Started

This guide is for someone with no GitHub or repository experience.

## What This Repository Is For

You will use this project to manage:

- CSC scholarship requirements
- deadlines
- target universities
- departments
- professors
- research interests
- citation counts

## What To Open First

Start with these files:

1. `workbooks/required_documents.xlsx`
2. `workbooks/csc_deadlines.xlsx`
3. `workbooks/master_university_contacts.xlsx`

If you prefer plain text or GitHub editing, use the matching CSV files in `data/`.

## Suggested First Steps

1. Open `required_documents.xlsx` and mark what you already have.
2. Open `csc_deadlines.xlsx` and enter any known application dates.
3. Open `master_university_contacts.xlsx` and add one university at a time.
4. For each professor, add:
   - department
   - research area
   - faculty page
   - ResearchGate profile
   - Google Scholar profile
   - citation count
5. Save your changes back to the CSV or workbook files in this repo.

## If You Want One File Per University

Use:

- `workbooks/university_intake_template.xlsx`

Create a copy for each university inside:

- `data/universities/by-university/`

Suggested names:

- `tsinghua-university.csv`
- `zhejiang-university.csv`
- `fudan-university.csv`

## If You Want Automatic Help

Use the professor data collector:

```powershell
npm.cmd run collect:professors -- --input data/universities/professor_seed_template.csv --output data/universities/professor_enriched_output.csv
```

Read:

- `docs/automation-guide.md`

## If You Want To Publish To GitHub

You will need:

- a GitHub account
- a new empty repository on GitHub

Then run:

```powershell
git add .
git commit -m "Initial CSC scholarship repository"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

