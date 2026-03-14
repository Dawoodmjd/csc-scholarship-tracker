import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "data/universities/professor_seed_template.csv";
const DEFAULT_OUTPUT = "data/universities/professor_enriched_output.csv";
const USER_AGENT = "Mozilla/5.0 (compatible; CSC-Research-Collector/1.0)";

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    delayMs: 1200,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--input") {
      args.input = argv[i + 1];
      i += 1;
    } else if (current === "--output") {
      args.output = argv[i + 1];
      i += 1;
    } else if (current === "--delay-ms") {
      args.delayMs = Number(argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

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
    const line = headers
      .map((header) => {
        const raw = row[header] ?? "";
        const escaped = String(raw).replace(/"/g, '""');
        return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
      })
      .join(",");
    lines.push(line);
  }
  return `${lines.join("\n")}\n`;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absolutizeUrl(candidate, baseUrl) {
  if (!candidate) {
    return "";
  }

  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return "";
  }
}

function extractFirstMatch(pattern, input) {
  const match = input.match(pattern);
  return match ? match[1] || match[0] : "";
}

function extractEmail(text) {
  return extractFirstMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, text);
}

function extractResearchGateLink(html, baseUrl) {
  return absolutizeUrl(
    extractFirstMatch(/href=["']([^"']*researchgate\.net\/profile\/[^"']+)["']/i, html),
    baseUrl,
  );
}

function extractScholarLink(html, baseUrl) {
  return absolutizeUrl(
    extractFirstMatch(/href=["']([^"']*scholar\.google\.[^"']*\/citations\?[^"']+)["']/i, html),
    baseUrl,
  );
}

function extractResearchArea(text) {
  const patterns = [
    /research (?:interests|areas?)[:\s]+(.+?)(?:\s{2,}|$)/i,
    /areas of interest[:\s]+(.+?)(?:\s{2,}|$)/i,
    /keywords?[:\s]+(.+?)(?:\s{2,}|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return "";
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

async function extractCitationCount(scholarUrl) {
  if (!scholarUrl) {
    return "";
  }

  try {
    const html = await fetchHtml(scholarUrl);
    const text = stripTags(html);
    const direct = text.match(/Cited by\s+([0-9,]+)/i);
    if (direct) {
      return direct[1].replace(/,/g, "");
    }

    const tableBased = html.match(/<td[^>]*class=["'][^"']*gsc_rsb_std[^"']*["'][^>]*>\s*([0-9,]+)\s*<\/td>/i);
    return tableBased ? tableBased[1].replace(/,/g, "") : "";
  } catch {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enrichRow(row, delayMs) {
  const facultyPageUrl = row.faculty_page_url || row.university_profile_url || "";
  let pageHtml = "";
  let pageText = "";

  if (facultyPageUrl) {
    try {
      pageHtml = await fetchHtml(facultyPageUrl);
      pageText = stripTags(pageHtml);
      await sleep(delayMs);
    } catch (error) {
      row.fetch_error = error.message;
    }
  }

  const scholarUrl = row.google_scholar_url || extractScholarLink(pageHtml, facultyPageUrl);
  const citations = row.citation_count || (await extractCitationCount(scholarUrl));

  return {
    ...row,
    email: row.email || extractEmail(pageText),
    research_area: row.research_area || extractResearchArea(pageText),
    researchgate_url: row.researchgate_url || extractResearchGateLink(pageHtml, facultyPageUrl),
    google_scholar_url: scholarUrl,
    citation_count: citations,
    citations_checked_on: citations ? new Date().toISOString().slice(0, 10) : row.citations_checked_on || "",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output);

  const csvText = await fs.readFile(inputPath, "utf8");
  const rows = parseCsv(csvText);

  if (rows.length === 0) {
    throw new Error(`No data rows found in ${inputPath}`);
  }

  const results = [];
  for (const row of rows) {
    results.push(await enrichRow(row, args.delayMs));
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, toCsv(results), "utf8");
  process.stdout.write(`Wrote ${results.length} rows to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

