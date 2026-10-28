#!/usr/bin/env node
/**
 * Mechanical honesty checks (blueprint §7.6).
 *
 * These are the rules that are easy to break by accident and expensive to get
 * wrong in public. Run with `bun run check`, and before any publish.
 *
 *   1. The internal product library is internal. No file under src/routes or
 *      src/components may import src/lib/products.ts or src/lib/stages.ts.
 *   2. No product name may be written on the public site. The names are read out
 *      of src/lib/products.ts and searched for in routes and components.
 *   3. A stage name may only be written in the library files. That is what keeps
 *      the stage taxonomy off the site even if someone pastes a label in.
 *   4. No source file may read an environment variable. There are no server
 *      functions on this site, so a secret here would mean a mistake.
 *   5. No .env file may be committed.
 *
 * The site no longer has a product catalogue, a demonstration or a stage badge,
 * so the checks about those components are gone. What is left is the part that
 * still guards something real.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry) && entry !== "routeTree.gen.ts") out.push(full);
  }
  return out;
}

const files = walk(join(ROOT, "src"));
const publicFiles = files.filter((file) => {
  const path = relative(ROOT, file);
  return path.startsWith("src/routes/") || path.startsWith("src/components/");
});

// The two library files are the only place a stage name or a product name is
// allowed to be written. Everything else on the site must not know they exist.
const LIBRARY_FILES = ["src/lib/stages.ts", "src/lib/products.ts"];

const PRODUCT_SOURCE = readFileSync(join(ROOT, "src/lib/products.ts"), "utf8");
const PRODUCT_NAMES = [...PRODUCT_SOURCE.matchAll(/^\s*name: "([^"]+)",$/gm)].map((m) => m[1]);
if (PRODUCT_NAMES.length === 0) {
  failures.push("src/lib/products.ts: no product names found. The check cannot run, so fix the file.");
}

const STAGE_NAMES = ["Client Validated", "client-validated", "Implementation Ready", "implementation-ready"];

for (const file of files) {
  const path = relative(ROOT, file);
  const source = readFileSync(file, "utf8");

  // 1 — the internal library is not imported by anything public.
  if (!LIBRARY_FILES.includes(path) && /from\s+"~\/lib\/(products|stages)"/.test(source)) {
    failures.push(`${path}: imports the internal product library. Nothing public may read it.`);
  }

  // 2 — no product name on the public site.
  if (publicFiles.includes(file)) {
    for (const name of PRODUCT_NAMES) {
      if (source.includes(name)) {
        failures.push(`${path}: names the product "${name}". No product is advertised on the site.`);
      }
    }
  }

  // 3 — no stage name outside the library.
  if (!LIBRARY_FILES.includes(path)) {
    for (const phrase of STAGE_NAMES) {
      if (source.includes(phrase)) {
        failures.push(`${path}: stage name "${phrase}" outside the library files.`);
      }
    }
  }

  // 4 — no environment reads.
  if (/process\.env|import\.meta\.env/.test(source)) {
    failures.push(`${path}: reads an environment variable. This site has no server code that needs one.`);
  }

  // 5 — no credentials.
  if (/api[_-]?key|secret[_-]?key|password\s*[:=]\s*["']/i.test(source)) {
    failures.push(`${path}: looks like it contains a credential.`);
  }
}

for (const envFile of [".env", ".env.local", ".env.production"]) {
  if (existsSync(join(ROOT, envFile))) {
    failures.push(`${envFile}: environment files must never be committed.`);
  }
}

// No product may claim client validation while no client has used anything.
if (/stage:\s*"client-validated"/.test(PRODUCT_SOURCE)) {
  failures.push('src/lib/products.ts: a product holds the "client-validated" stage. No client has validated anything.');
}

if (failures.length > 0) {
  console.error("Honesty checks failed:\n");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `Honesty checks passed: ${files.length} source files, ${publicFiles.length} public, ${PRODUCT_NAMES.length} internal product names kept out of them.`,
);
