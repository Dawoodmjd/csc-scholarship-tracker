# French Universities Application Repository

This repository is a free GitHub-ready workspace for researching French universities and organizing your application process.

It helps you track:

- required application documents
- deadlines for each university and department
- one master list of universities, departments, and professors
- per-university research sheets
- ResearchGate and Google Scholar links
- citation counts and the date they were checked
- Excel workbooks generated from the CSV templates

## Repository Structure

```text
.
|-- data/
|   |-- documents/
|   |   `-- required_documents.csv
|   |-- deadlines/
|   |   `-- application_deadlines.csv
|   `-- universities/
|       |-- by-university/
|       |   |-- README.md
|       |   `-- example-french-university.csv
|       |-- french_university_master.csv
|       `-- university_intake_template.csv
|-- docs/
|   |-- getting-started.md
|   `-- research-collection-guide.md
|-- scripts/
|   `-- export-xlsx.ps1
|-- workbooks/
|   |-- application_deadlines.xlsx
|   |-- french_university_master.xlsx
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

Open these first:

1. [`docs/getting-started.md`](docs/getting-started.md)
2. [`workbooks/required_documents.xlsx`](workbooks/required_documents.xlsx)
3. [`workbooks/application_deadlines.xlsx`](workbooks/application_deadlines.xlsx)
4. [`workbooks/french_university_master.xlsx`](workbooks/french_university_master.xlsx)
5. [`workbooks/university_intake_template.xlsx`](workbooks/university_intake_template.xlsx)

## Main Files

### Required Documents
Use [`data/documents/required_documents.csv`](data/documents/required_documents.csv) to track the documents needed for Campus France, university portals, scholarship applications, and visa steps.

### Application Deadlines
Use [`data/deadlines/application_deadlines.csv`](data/deadlines/application_deadlines.csv) to record application openings, closing dates, interview rounds, scholarship deadlines, and professor contact milestones.

### Master University Research Sheet
Use [`data/universities/french_university_master.csv`](data/universities/french_university_master.csv) as the main database for:

- university name
- city
- department name
- program name
- professor name
- research area
- laboratory or faculty page
- ResearchGate profile
- Google Scholar profile
- citation count
- application deadline
- contact and shortlist status

### One File Per University
If you want one spreadsheet per university, copy [`data/universities/university_intake_template.csv`](data/universities/university_intake_template.csv) into [`data/universities/by-university/`](data/universities/by-university/) and rename it for each school.

## Build Excel Workbooks

To regenerate the `.xlsx` files from the CSV templates:

```powershell
npm run build:xlsx
```

## Suggested Workflow

1. Fill the document checklist first.
2. Add deadlines from official university pages.
3. Add universities and departments to the master sheet.
4. Add professors, research areas, and profile links.
5. Record citations and the date checked.
6. Copy the intake template when you want a dedicated sheet for one university.

## Publish To GitHub

```powershell
git add .
git commit -m "Initial French universities research repository"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Notes

- CSV files open in Excel, Google Sheets, and LibreOffice.
- Citation counts change over time, so always store the check date.
- Use only official university or scholar profile links when possible.
