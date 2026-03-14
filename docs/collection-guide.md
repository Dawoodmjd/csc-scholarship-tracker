# CSC Data Collection Guide

This guide helps you keep the repository consistent while collecting scholarship and university information.

## Recommended Collection Order

1. Identify target universities that offer CSC-supported programs.
2. List departments relevant to your field.
3. Find professors whose research areas match your interests.
4. Save official faculty page links first.
5. Add ResearchGate and Google Scholar links.
6. Record citation counts and the date checked.
7. Track whether you contacted the professor and whether they replied.

## Column Guidance

### Documents File

- `document_name`: name of the required file
- `required_for`: CSC, university, embassy, or multiple
- `mandatory`: use `Yes`, `No`, or `Depends`
- `status`: use values like `Not started`, `In progress`, `Ready`, `Submitted`
- `deadline`: date related to that document
- `source_link`: official page describing the requirement
- `notes`: translation, notarization, or special conditions

### Deadlines File

- `organization`: CSC, embassy, university, professor, or referee
- `application_type`: scholarship, admission, interview, nomination, or document submission
- `deadline_date`: prefer `YYYY-MM-DD`
- `status`: use `Planned`, `Open`, `Submitted`, `Closed`
- `official_link`: official source for the deadline

### University Contacts File

- `university_csc_category`: often category `A`, `B`, or `C` if you use that system
- `keywords_match`: short keywords matching your research plan
- `contact_status`: `Not contacted`, `Draft ready`, `Sent`, `Follow-up sent`
- `response_status`: `No response`, `Interested`, `Rejected`, `Meeting scheduled`
- `priority`: `High`, `Medium`, or `Low`

## Good Practices

- Prefer official university or department pages over third-party websites.
- Treat citation counts as time-sensitive data.
- Keep one professor per row.
- Use notes for funding conditions, language requirements, and supervisor preferences.
- If a professor has no Google Scholar profile, leave the field blank instead of guessing.
