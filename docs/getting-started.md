# Getting Started

This repository is designed for building your own research database for French universities.

## What To Open First

Start with these files:

1. `workbooks/required_documents.xlsx`
2. `workbooks/application_deadlines.xlsx`
3. `workbooks/french_university_master.xlsx`

If you prefer editing on GitHub, use the matching CSV files inside `data/`.

## Suggested First Steps

1. Open `required_documents.xlsx` and mark what is already prepared.
2. Open `application_deadlines.xlsx` and enter dates from official university pages.
3. Open `french_university_master.xlsx` and add one university at a time.
4. For each professor, record:
   - department name
   - program name
   - research area
   - faculty profile
   - ResearchGate profile
   - Google Scholar profile
   - citation count
   - citation check date

## If You Want One File Per University

Copy:

- `workbooks/university_intake_template.xlsx`

into your own university-specific files inside:

- `data/universities/by-university/`

Suggested names:

- `sorbonne-universite.csv`
- `universite-paris-saclay.csv`
- `aix-marseille-universite.csv`

## Publishing To GitHub

Create an empty GitHub repository, then run:

```powershell
git add .
git commit -m "Initial French universities repository"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
