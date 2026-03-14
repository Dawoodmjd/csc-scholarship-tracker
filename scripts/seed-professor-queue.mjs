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

function toCsv(rows) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => {
      const raw = String(row[header] ?? "");
      const escaped = raw.replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    }).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function rankPriority(bucket) {
  if (bucket === "C9") {
    return "High";
  }
  if (bucket === "985_non_C9") {
    return "Medium";
  }
  return "Low";
}

async function main() {
  const root = process.cwd();
  const inputPath = path.join(root, "data/universities/china_university_tiers.csv");
  const outputPath = path.join(root, "data/professors/professor_collection_queue.csv");
  const text = await fs.readFile(inputPath, "utf8");
  const universities = parseCsv(text);

  const rows = universities.map((university, index) => ({
    queue_id: `PROF-${String(index + 1).padStart(3, "0")}`,
    university_name: university.university_name,
    top_bucket: university.top_bucket,
    priority: rankPriority(university.top_bucket),
    status: "Not started",
    target_scope: "All departments and professors",
    official_source_url: "",
    last_attempted_on: "",
    notes: university.selection_note || ""
  }));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, toCsv(rows), "utf8");
  process.stdout.write(`Wrote ${rows.length} queue rows to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

