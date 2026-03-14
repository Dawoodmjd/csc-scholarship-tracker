import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function readCsvRows(filePath) {
  const fullPath = path.resolve(root, filePath);
  const text = await fs.readFile(fullPath, "utf8");
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    return row;
  });
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

async function main() {
  const universities = await readCsvRows("data/universities/csc_host_universities.csv");
  const programs = await readCsvRows("data/programs/csc_program_catalog.csv");
  const requirements = await readCsvRows("data/programs/csc_program_requirements.csv");
  const queue = await readCsvRows("data/programs/csc_program_collection_queue.csv");

  const summary = {
    generated_at: new Date().toISOString(),
    counts: {
      universities: universities.length,
      programs: programs.length,
      requirements: requirements.length,
      collection_queue: queue.length
    },
    universities,
    programs,
    requirements,
    collection_queue: queue
  };

  await fs.mkdir(path.resolve(root, "exports"), { recursive: true });
  await fs.writeFile(
    path.resolve(root, "exports/csc_program_database.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );

  process.stdout.write("Wrote exports/csc_program_database.json\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

