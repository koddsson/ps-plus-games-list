#!/usr/bin/env node
// Fetches PlayStation Plus games data and writes it to stable JSON files.
//
// Each category is fetched from the public PlayStation "imagic" gameslist
// endpoint and written to data/<category>.json. Object keys are sorted
// recursively so that the committed files produce clean, meaningful diffs
// even if the upstream API reorders keys between requests.
//
// Run with: node scripts/fetch-games.mjs

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

const LOCALE = process.env.PS_LOCALE ?? "en-us";
const BASE_URL = "https://www.playstation.com/bin/imagic/gameslist";

// The categories we track. The key is used as the output filename.
const CATEGORIES = [
  "plus-monthly-games-list",
  "plus-classics-list",
  "plus-games-list",
];

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

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  let failures = 0;
  for (const category of CATEGORIES) {
    console.log(`Fetching ${category}...`);
    try {
      const data = await fetchCategory(category);
      const sorted = sortKeys(data);
      const outPath = join(DATA_DIR, `${category}.json`);
      await writeFile(outPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
      console.log(`  wrote ${outPath}`);
    } catch (error) {
      failures++;
      console.error(`  ${error.message}`);
    }
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
