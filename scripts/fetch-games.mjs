#!/usr/bin/env node
// Fetches PlayStation Plus games data and writes it to stable JSON files.
//
// Each category is fetched from the public PlayStation "imagic" gameslist
// endpoint and written to data/<category>.json. Object keys are sorted
// recursively so that the committed files produce clean, meaningful diffs
// even if the upstream API reorders keys between requests.
//
// It also refreshes the "This month's games" table in the README, between the
// MONTHLY_GAMES markers, so the listing tracks the monthly catalog. No
// timestamp is written, so the README only changes when the line-up changes.
//
// Run with: node scripts/fetch-games.mjs

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const DATA_DIR = join(ROOT_DIR, "data");
const README_PATH = join(ROOT_DIR, "README.md");

const LOCALE = process.env.PS_LOCALE ?? "en-us";
const BASE_URL = "https://www.playstation.com/bin/imagic/gameslist";

// The categories we track. The key is used as the output filename.
const CATEGORIES = [
  "plus-monthly-games-list",
  "plus-classics-list",
  "plus-games-list",
];

// The category whose games are rendered into the README table.
const MONTHLY_CATEGORY = "plus-monthly-games-list";

const MONTHLY_MARKER_START = "<!-- BEGIN MONTHLY GAMES -->";
const MONTHLY_MARKER_END = "<!-- END MONTHLY GAMES -->";

const MAX_RETRIES = 4;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Recursively sort object keys so serialization is deterministic. Arrays keep
// their order (upstream ordering may be meaningful, e.g. featured first).
function sortKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeys(value[key])]),
    );
  }
  return value;
}

async function fetchCategory(category) {
  const url = `${BASE_URL}?locale=${encodeURIComponent(LOCALE)}&categoryList=${encodeURIComponent(category)}`;

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          // A browser-like UA avoids the endpoint rejecting the request.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Response was not valid JSON (first 200 chars): ${text.slice(0, 200)}`,
        );
      }
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        const backoff = 2 ** attempt * 1000;
        console.warn(
          `  attempt ${attempt} for ${category} failed: ${error.message} — retrying in ${backoff}ms`,
        );
        await sleep(backoff);
      }
    }
  }

  throw new Error(
    `Failed to fetch ${category} after ${MAX_RETRIES} attempts: ${lastError?.message}`,
  );
}

// Turn "ACTION" / "ROLE_PLAYING_GAMES" into "Action" / "Role Playing Games".
function titleCase(value) {
  return value
    .toLowerCase()
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeCell(value) {
  return value.replace(/\|/g, "\\|");
}

// The monthly payload is an array of alphabetical buckets, each with a
// `games` array. Flatten it into the games that are actually available.
function flattenGames(data) {
  if (!Array.isArray(data)) return [];
  return data.flatMap((bucket) => bucket?.games ?? []);
}

function renderMonthlyTable(data) {
  const games = flattenGames(data);

  if (games.length === 0) {
    return "_No monthly games are currently listed._";
  }

  const rows = games.map((game) => {
    const name = escapeCell(game.name ?? game.nameEn ?? "Unknown");
    const link = game.conceptUrl ? `[${name}](${game.conceptUrl})` : name;
    const platforms = Array.isArray(game.device) ? game.device.join(", ") : "";
    const genres = Array.isArray(game.genre)
      ? [...new Set(game.genre)].map(titleCase).join(", ")
      : "";
    return `| ${link} | ${escapeCell(platforms)} | ${escapeCell(genres)} |`;
  });

  return [
    "| Game | Platforms | Genre |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

async function updateReadme(monthlyData) {
  let readme;
  try {
    readme = await readFile(README_PATH, "utf8");
  } catch (error) {
    console.warn(`  skipping README update: ${error.message}`);
    return;
  }

  const startIdx = readme.indexOf(MONTHLY_MARKER_START);
  const endIdx = readme.indexOf(MONTHLY_MARKER_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.warn("  skipping README update: monthly-games markers not found");
    return;
  }

  const table = renderMonthlyTable(monthlyData);
  const before = readme.slice(0, startIdx + MONTHLY_MARKER_START.length);
  const after = readme.slice(endIdx);
  const updated = `${before}\n\n${table}\n\n${after}`;

  if (updated !== readme) {
    await writeFile(README_PATH, updated, "utf8");
    console.log("  updated README monthly games table");
  }
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  let failures = 0;
  let monthlyData;
  for (const category of CATEGORIES) {
    console.log(`Fetching ${category}...`);
    try {
      const data = await fetchCategory(category);
      const sorted = sortKeys(data);
      const outPath = join(DATA_DIR, `${category}.json`);
      await writeFile(outPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
      console.log(`  wrote ${outPath}`);
      if (category === MONTHLY_CATEGORY) {
        monthlyData = data;
      }
    } catch (error) {
      failures++;
      console.error(`  ${error.message}`);
    }
  }

  if (monthlyData !== undefined) {
    await updateReadme(monthlyData);
  }

  if (failures > 0) {
    console.error(`\n${failures} categor(y/ies) failed to update.`);
    process.exit(1);
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
