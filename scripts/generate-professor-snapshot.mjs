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

async function main() {
  const root = process.cwd();
  const csvPath = path.join(root, "data/professors/professor_master.csv");
  const snapshotDir = path.join(root, "snapshots/professors");
  const text = await fs.readFile(csvPath, "utf8");
  const professors = parseCsv(text);
  const generatedAt = new Date().toISOString();
  const dateTag = generatedAt.slice(0, 10);

  const payload = {
    generated_at: generatedAt,
    count: professors.length,
    professors
  };

  await fs.mkdir(snapshotDir, { recursive: true });
  await fs.writeFile(path.join(snapshotDir, "latest.json"), JSON.stringify(payload, null, 2), "utf8");
  await fs.writeFile(path.join(snapshotDir, `${dateTag}.json`), JSON.stringify(payload, null, 2), "utf8");
  process.stdout.write(`Wrote professor snapshots with ${professors.length} rows\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

