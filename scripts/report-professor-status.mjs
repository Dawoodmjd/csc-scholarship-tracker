import fs from "node:fs/promises";
import path from "node:path";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const [header = [], ...body] = rows;
  return body.map((cells) => {
    const entry = {};
    header.forEach((column, index) => {
      entry[column] = cells[index] ?? "";
    });
    return entry;
  });
}

function groupCount(rows, key) {
  const counts = new Map();
  for (const row of rows) {
    const value = row[key] || "Unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

async function main() {
  const root = process.cwd();
  const csvPath = path.join(root, "data/professors/professor_master.csv");
  const queuePath = path.join(root, "data/professors/professor_collection_queue.csv");
  const reportPath = path.join(root, "reports/professor_status_report.md");

  const professors = parseCsv(await fs.readFile(csvPath, "utf8"));
  const queue = parseCsv(await fs.readFile(queuePath, "utf8"));

  const missingScholar = professors.filter((row) => !row.google_scholar_url).length;
  const missingResearchGate = professors.filter((row) => !row.researchgate_url).length;
  const missingCitationCount = professors.filter((row) => !row.citation_count || !String(row.citation_count).trim()).length;
  const populatedEmails = professors.filter((row) => row.email).length;
  const byUniversity = groupCount(professors, "university_name");
  const byDepartment = groupCount(professors, "department_name").slice(0, 10);
  const pendingQueue = queue.filter((row) => row.status === "Not started").length;
  const c9Covered = new Set(professors.filter((row) => row.top_bucket === "C9").map((row) => row.university_name)).size;

  const lines = [
    "# Professor Status Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Total professor rows: ${professors.length}`,
    `- Universities represented in professor master: ${byUniversity.length}`,
    `- Rows with email populated: ${populatedEmails}`,
    `- Rows missing Google Scholar URL: ${missingScholar}`,
    `- Rows missing ResearchGate URL: ${missingResearchGate}`,
    `- Rows missing citation count: ${missingCitationCount}`,
    `- Universities still pending in collection queue: ${pendingQueue}`,
    `- C9 universities represented in professor master: ${c9Covered}`,
    "",
    "## Universities Covered",
    "",
    ...byUniversity.map(([name, count]) => `- ${name}: ${count}`),
    "",
    "## Top Departments Covered",
    "",
    ...byDepartment.map(([name, count]) => `- ${name}: ${count}`),
    "",
    "## Manual Review Needed",
    "",
    "- Verify Google Scholar links for all rows currently missing profile URLs.",
    "- Verify ResearchGate links for all rows currently missing profile URLs.",
    "- Verify citation counts before using them in application prioritization.",
    "- Extend from the current CS-related first pass into more departments and schools inside each C9 university.",
    ""
  ];

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
  process.stdout.write(`Wrote ${reportPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
