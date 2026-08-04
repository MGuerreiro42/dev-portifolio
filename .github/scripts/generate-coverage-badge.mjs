#!/usr/bin/env node
// Reads coverage/coverage-summary.json (produced by `pnpm test:coverage`)
// and writes a shields.io "endpoint" badge JSON to .github/badges/coverage.json.
// No external badge service — the README badge just points at this file's
// raw GitHub URL via https://img.shields.io/endpoint.
import { readFileSync, writeFileSync } from "node:fs";

const summary = JSON.parse(readFileSync("coverage/coverage-summary.json", "utf-8"));
const pct = summary.total.statements.pct;

function colorFor(pct) {
  if (pct >= 90) return "brightgreen";
  if (pct >= 75) return "green";
  if (pct >= 50) return "yellow";
  return "red";
}

const badge = {
  schemaVersion: 1,
  label: "coverage",
  message: `${Math.round(pct)}%`,
  color: colorFor(pct),
};

writeFileSync(".github/badges/coverage.json", JSON.stringify(badge, null, 2) + "\n");
console.log("Wrote .github/badges/coverage.json:", badge);
