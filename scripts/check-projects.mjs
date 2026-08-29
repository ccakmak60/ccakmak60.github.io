#!/usr/bin/env node
// Drift-check: verifies src/lib/projects.json reflects real local checkouts and GitHub repos.
// See dev/dev-workspace-and-kb-reorg-plan.md step 12 for behavior spec.

import { readdirSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const DEV_ROOT = process.env.DEV_ROOT ?? "C:\\Users\\Administrator\\dev";
// The portfolio site never lists itself as one of "its projects".
const SELF_DIR_NAME = "portfolio";
const SELF_REPO_NAME = "ccakmak60.github.io";

async function main() {
  const { default: entries } = await import(
    new URL("../src/lib/projects.json", import.meta.url),
    { with: { type: "json" } }
  );

  const localDirs = new Set();
  for (const category of ["active", "work", "tools"]) {
    let names;
    try {
      names = readdirSync(`${DEV_ROOT}\\${category}`, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      names = [];
    }
    for (const name of names) localDirs.add(name);
  }
  localDirs.delete(SELF_DIR_NAME);

  let githubRepos = null;
  let ghWarning = null;
  try {
    const { stdout } = await execFileAsync("gh", [
      "repo",
      "list",
      "ccakmak60",
      "--limit",
      "100",
      "--json",
      "name,description,url,isPrivate,isFork,isArchived",
    ]);
    githubRepos = JSON.parse(stdout);
  } catch {
    ghWarning = "warning: gh unavailable, skipped GitHub checks";
  }
  const githubNames = new Set((githubRepos ?? []).map((r) => r.name));

  const entryNames = new Set(entries.map((e) => e.name));

  const missing = [...localDirs]
    .filter((name) => !entryNames.has(name))
    .sort();

  const unpublished = (githubRepos ?? [])
    .filter(
      (r) =>
        !r.isPrivate &&
        !r.isFork &&
        !r.isArchived &&
        r.name !== SELF_REPO_NAME &&
        r.name.toLowerCase() !== "ccakmak60" &&
        !entryNames.has(r.name)
    )
    .map((r) => r.name)
    .sort();

  const withUrl = entries.filter((e) => e.url);
  const deadResults = await Promise.all(
    withUrl.map(async (e) => {
      try {
        const res = await fetch(e.url, {
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        if (res.status >= 400) return { name: e.name, reason: `HTTP ${res.status}` };
        return null;
      } catch (err) {
        return { name: e.name, reason: err.message ?? String(err) };
      }
    })
  );
  const dead = deadResults.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  const orphan = [...entryNames]
    .filter((name) => !localDirs.has(name) && !githubNames.has(name))
    .sort();

  if (ghWarning) console.log(ghWarning);

  let hasError = false;

  function printSection(title, items, format) {
    if (items.length === 0) return;
    console.log(`${title}`);
    for (const item of items) {
      console.log(`  + ${format(item)}`);
    }
  }

  if (missing.length) {
    hasError = true;
    printSection("MISSING", missing, (name) => `${name} — local checkout has no projects.json entry`);
  }
  if (unpublished.length) {
    hasError = true;
    printSection(
      "UNPUBLISHED",
      unpublished,
      (name) => `${name} — public GitHub repo has no projects.json entry`
    );
  }
  if (dead.length) {
    hasError = true;
    printSection("DEAD", dead, (d) => `${d.name} — ${d.reason}`);
  }
  if (orphan.length) {
    printSection(
      "ORPHAN",
      orphan,
      (name) => `${name} — matches neither a local directory nor a GitHub repo name`
    );
  }

  if (!missing.length && !unpublished.length && !dead.length && !orphan.length) {
    console.log(`projects.json OK — ${entries.length} entries, ${withUrl.length} URLs checked`);
  }

  process.exit(hasError ? 1 : 0);
}

main();
