#!/usr/bin/env node
// Checks every manifest in this repository.
//
// Usage: node scripts/validate.mjs
//
// Always runs, with no dependencies: JSON parsing, required fields, the length limits each channel
// documents (see docs/SOURCES.md), skill front matter, and a scan for em dashes.
// When the ajv package (v8) can be loaded, it also validates server.json, plugin.json and mcp.json
// against their published JSON Schemas, downloaded at run time. Point AJV_DIR at a folder whose
// node_modules holds ajv (and optionally ajv-formats) if it is not installed here.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const ok = (msg) => notes.push(`ok  ${msg}`);

function json(file) {
  try {
    return JSON.parse(readFileSync(join(ROOT, file), "utf8"));
  } catch (e) {
    err(file, `invalid JSON (${e.message})`);
    return null;
  }
}
const len = (file, field, value, max, min = 1) => {
  if (typeof value !== "string") return err(file, `${field} must be a string`);
  if (value.length < min || value.length > max) err(file, `${field} is ${value.length} chars (allowed ${min} to ${max})`);
};
const https = (file, field, value) => {
  if (typeof value !== "string" || !/^https:\/\/[^\s]+$/.test(value)) err(file, `${field} must be an https URL`);
};

// 1. Every JSON file parses.
const jsonFiles = [
  ".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".mcp.json",
  "plugin.json", "mcp.json", "gemini-extension.json", "registry/server.json",
];
const doc = Object.fromEntries(jsonFiles.map((f) => [f, json(f)]));
ok(`${jsonFiles.length} JSON files parsed`);

// 2. Claude plugin and marketplace.
const cp = doc[".claude-plugin/plugin.json"];
const mk = doc[".claude-plugin/marketplace.json"];
const cm = doc[".mcp.json"];
if (cp) {
  if (!/^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/.test(cp.name ?? "")) err(".claude-plugin/plugin.json", "name must be lowercase letters, digits and hyphens");
  for (const k of ["documentationUrl", "supportUrl", "privacyPolicyUrl", "termsOfServiceUrl"]) https(".claude-plugin/plugin.json", k, cp[k]);
}
if (mk && cp) {
  const entry = (mk.plugins ?? []).find((p) => p.name === cp.name);
  if (!entry) err(".claude-plugin/marketplace.json", `no entry named "${cp.name}"`);
  if (!mk.owner?.name) err(".claude-plugin/marketplace.json", "owner.name is required");
}
if (cm) {
  for (const [k, s] of Object.entries(cm.mcpServers ?? {})) {
    if (!["http", "sse", "ws"].includes(s.type)) err(".mcp.json", `${k}.type must be http, sse or ws`);
    https(".mcp.json", `${k}.url`, s.url);
  }
}

// 3. Agent Plugins manifest with the OpenAI extension.
const ap = doc["plugin.json"];
const am = doc["mcp.json"];
const CATEGORIES = ["Productivity", "Creativity", "Developer Tools", "Business & Operations", "Data & Analytics",
  "Communication", "Education & Research", "Security", "Finance", "Healthcare", "Travel", "Entertainment", "Other"];
if (ap) {
  const f = "plugin.json";
  if (!/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(ap.name ?? "") || ap.name.length > 64) err(f, "name breaks the Agent Plugins pattern");
  const allowed = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];
  for (const k of Object.keys(ap)) if (!allowed.includes(k)) err(f, `unknown top-level field ${k} (the Agent Plugins manifest is closed)`);
  const oa = ap.extensions?.["com.openai"] ?? {};
  const i = oa.interface ?? {};
  len(f, "interface.displayName", i.displayName, 30);
  len(f, "interface.shortDescription", i.shortDescription, 30);
  len(f, "interface.longDescription", i.longDescription, 4000);
  len(f, "interface.developerName", i.developerName, 80);
  if (!CATEGORIES.includes(i.category)) err(f, `interface.category "${i.category}" is not an OpenAI category`);
  for (const k of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) https(f, `interface.${k}`, i[k]);
  const prompts = Array.isArray(i.defaultPrompt) ? i.defaultPrompt : [i.defaultPrompt];
  if (prompts.length > 3) err(f, "at most 3 defaultPrompt entries");
  prompts.forEach((p, n) => {
    len(f, `interface.defaultPrompt[${n}]`, p, 128);
    if (/@/.test(p ?? "")) err(f, `interface.defaultPrompt[${n}] must not contain an @mention`);
  });
  if (!/^#[0-9A-Fa-f]{6}$/.test(i.brandColor ?? "")) err(f, "interface.brandColor must be #RRGGBB");
  if (/pric|subscri|discount|free trial|promo/i.test(`${i.shortDescription} ${i.longDescription}`)) err(f, "listing text mentions pricing or promotions");
  const tc = oa.review?.test_cases ?? {};
  if ((tc.positive ?? []).length !== 5) err(f, "review.test_cases.positive needs exactly 5 cases");
  if ((tc.negative ?? []).length !== 3) err(f, "review.test_cases.negative needs exactly 3 cases");
  (tc.positive ?? []).forEach((c, n) => {
    for (const k of ["description", "prompt", "tools_triggered", "expected_behavior"]) if (!c[k]) err(f, `positive[${n}].${k} is required`);
  });
  (tc.negative ?? []).forEach((c, n) => {
    for (const k of ["description", "prompt"]) if (!c[k]) err(f, `negative[${n}].${k} is required`);
  });
  if (oa.review?.commerce !== false) err(f, "review.commerce must be false");
  for (const k of ["test_credentials", "reviewer_instructions"]) if (oa.review && k in oa.review) err(f, `review.${k} must not be in the package`);
}
if (am) {
  const list = Object.entries(am.mcpServers ?? {});
  if (list.length !== 1) err("mcp.json", "exactly one MCP server expected");
  for (const [k, s] of list) {
    if (s.type !== "streamable-http") err("mcp.json", `${k}.type must be streamable-http`);
    https("mcp.json", `${k}.url`, s.url);
  }
}

// 4. Gemini CLI extension.
const ge = doc["gemini-extension.json"];
if (ge) {
  if (!/^[a-z0-9-]+$/.test(ge.name ?? "")) err("gemini-extension.json", "name must be lowercase letters, digits and dashes");
  if (!ge.version) err("gemini-extension.json", "version is required");
  for (const [k, s] of Object.entries(ge.mcpServers ?? {})) https("gemini-extension.json", `mcpServers.${k}.httpUrl`, s.httpUrl);
}

// 5. MCP Registry server.json (manual checks; the schema check below is stricter).
const sj = doc["registry/server.json"];
if (sj) {
  const f = "registry/server.json";
  if (!/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/.test(sj.name ?? "") || sj.name.length < 3 || sj.name.length > 200) err(f, "name pattern");
  if (!sj.name?.startsWith("app.creatorscompanion/")) err(f, "name must use the app.creatorscompanion namespace");
  len(f, "description", sj.description, 100);
  if (sj.title !== undefined) len(f, "title", sj.title, 100);
  if (!sj.version || /[\^~><*x]/.test(sj.version)) err(f, "version must be a fixed version");
  if (sj.repository && (!sj.repository.url || !sj.repository.source)) err(f, "repository needs url and source");
  for (const [n, ic] of (sj.icons ?? []).entries()) {
    https(f, `icons[${n}].src`, ic.src);
    if ((ic.src ?? "").length > 255) err(f, `icons[${n}].src is longer than 255`);
  }
  for (const [n, r] of (sj.remotes ?? []).entries()) {
    if (r.type !== "streamable-http") err(f, `remotes[${n}].type must be streamable-http`);
    https(f, `remotes[${n}].url`, r.url);
  }
}

// 6. Skills: front matter per the Agent Skills spec.
for (const dir of readdirSync(join(ROOT, "skills"))) {
  const p = `skills/${dir}/SKILL.md`;
  let text;
  try {
    text = readFileSync(join(ROOT, p), "utf8");
  } catch {
    err(p, "missing");
    continue;
  }
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    err(p, "no YAML front matter");
    continue;
  }
  const fm = Object.fromEntries(m[1].split(/\r?\n/).map((l) => l.match(/^([a-z-]+):\s*(.*)$/)).filter(Boolean).map((x) => [x[1], x[2]]));
  if (fm.name !== dir) err(p, `name "${fm.name}" must match the folder "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? "") || fm.name.length > 64) err(p, "name must be lowercase letters, digits and single hyphens, 64 max");
  len(p, "description", fm.description, 1024);
  if (!m[2].trim()) err(p, "empty body");
  if (`${ap?.name}:${fm.name}`.length > 64) err(p, "plugin-name:skill-name is longer than 64 (OpenAI limit)");
}
ok("skills front matter checked");

// 7. No em dashes anywhere (house rule), and no file over 256 KiB except images.
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if ([".git", "dist", "node_modules"].includes(n)) return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
for (const p of walk(ROOT)) {
  const rel = relative(ROOT, p).replaceAll("\\", "/");
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(rel);
  if (!isImage && statSync(p).size > 256 * 1024) err(rel, "over 256 KiB");
  if (isImage) continue;
  if (readFileSync(p, "utf8").includes(String.fromCharCode(0x2014))) err(rel, "contains an em dash");
}
ok("em dash scan and file size check done");

// 8. Full JSON Schema validation when ajv is available.
async function schemaCheck() {
  const bases = [process.env.AJV_DIR, ROOT].filter(Boolean);
  let Ajv2020, Ajv07, addFormats;
  for (const b of bases) {
    try {
      const req = createRequire(join(resolve(b), "noop.js"));
      Ajv2020 = req("ajv/dist/2020.js");
      Ajv07 = req("ajv");
      try {
        addFormats = req("ajv-formats");
      } catch {
        addFormats = null;
      }
      break;
    } catch {
      /* try the next base */
    }
  }
  if (!Ajv2020) {
    notes.push("--  ajv v8 not found: JSON Schema validation skipped, manual checks only (set AJV_DIR)");
    return;
  }
  const pick = (m) => m.default ?? m;
  const targets = [
    ["registry/server.json", "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json", Ajv07],
    ["plugin.json", "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", Ajv2020],
    ["mcp.json", "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", Ajv2020],
  ];
  for (const [file, url, AjvMod] of targets) {
    let schema;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      schema = await res.json();
    } catch (e) {
      notes.push(`--  could not download ${url} (${e.message}); schema check for ${file} skipped`);
      continue;
    }
    const Ajv = pick(AjvMod);
    const ajv = new Ajv({ allErrors: true, strict: false });
    if (addFormats) pick(addFormats)(ajv);
    const validate = ajv.compile(schema);
    if (validate(doc[file])) ok(`${file} matches ${url}${addFormats ? "" : " (formats not checked)"}`);
    else for (const e of validate.errors) err(file, `schema: ${e.instancePath || "/"} ${e.message}`);
  }
}
await schemaCheck();

for (const n of notes) console.log(n);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log("\nAll checks passed.");
