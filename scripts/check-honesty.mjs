#!/usr/bin/env node
/**
 * Mechanical honesty checks (blueprint §7.6).
 *
 * These are the rules that are easy to break by accident and expensive to get
 * wrong in public. Run with `bun run check`, and before any publish.
 *
 *   1. A stage name may only be written in lib/stages.ts and lib/products.ts.
 *      Everywhere else the label comes from <StageBadge>, which reads the union.
 *   2. "client-validated" must not appear in any product record: nothing has been
 *      validated by a client yet.
 *   3. No source file may read an environment variable. There are no server
 *      functions on this site, so a secret here would mean a mistake.
 *   4. No .env file may be committed.
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

const ALLOWED_STAGE_FILES = [
  "src/lib/stages.ts", // the union and the definitions live here
  "src/lib/products.ts", // the only place a stage is assigned to a product
  // The badge maps a stage to a style. Its keys are typed Record<Stage, string>,
  // so TypeScript enforces that it cannot invent or skip one.
  "src/components/stage-badge.tsx",
];

for (const file of files) {
  const path = relative(ROOT, file);
  const source = readFileSync(file, "utf8");

  if (!ALLOWED_STAGE_FILES.includes(path)) {
    for (const phrase of ["Client Validated", "client-validated", "Implementation Ready", "implementation-ready"]) {
      if (source.includes(phrase)) {
        failures.push(`${path}: stage name "${phrase}" outside lib/stages.ts and lib/products.ts.`);
      }
    }
  }

  if (/process\.env|import\.meta\.env/.test(source)) {
    failures.push(`${path}: reads an environment variable. This site has no server code that needs one.`);
  }

  if (/api[_-]?key|secret[_-]?key|password\s*[:=]\s*["']/i.test(source)) {
    failures.push(`${path}: looks like it contains a credential.`);
  }
}

for (const envFile of [".env", ".env.local", ".env.production"]) {
  if (existsSync(join(ROOT, envFile))) {
    failures.push(`${envFile}: environment files must never be committed.`);
  }
}

// No product may claim client validation while the only evidence is a demo.
const products = readFileSync(join(ROOT, "src/lib/products.ts"), "utf8");
if (/stage:\s*"client-validated"/.test(products)) {
  failures.push('src/lib/products.ts: a product holds the "client-validated" stage. No client has validated anything.');
}

if (failures.length > 0) {
  console.error("Honesty checks failed:\n");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Honesty checks passed across ${files.length} source files.`);
