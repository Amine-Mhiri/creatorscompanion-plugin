#!/usr/bin/env node
// Builds the ChatGPT / Codex plugin ZIP (Agent Plugins 1.0.0 layout) into dist/.
//
// Usage: node scripts/build-openai-zip.mjs
//
// The ZIP holds the plugin root directly (plugin.json at the top of the archive), with only the
// files that package needs: the Agent Plugins manifest, an MCP config pointing at the reduced
// /mcp/chatgpt server (the repository root mcp.json points at the full /mcp server for Cursor and
// other installs; the ZIP gets its own copy), the skills that work with that tool set (with their
// full-server-only blocks removed, see tools.mjs), the icons the manifest references and the license.
// No dependencies: the archive is written with node:zlib, with forward slash paths and a fixed
// timestamp so the same sources always give the same bytes.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";
import { chatgptText, FULL_ONLY_TOOLS } from "./tools.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHATGPT_URL = "https://www.creatorscompanion.app/mcp/chatgpt";

// research-then-write is left out on purpose: it is built on research tools that /mcp/chatgpt does
// not offer. The other skills mark their full-server-only parts, which are removed from the ZIP copy.
const SKILLS = ["setup", "write-in-my-voice", "weekly-content-plan"];

function fail(msg) {
  console.error(`build-openai-zip: ${msg}`);
  process.exit(1);
}

const read = (p) => readFileSync(join(ROOT, p));
const readJson = (p) => {
  try {
    return JSON.parse(read(p).toString("utf8"));
  } catch (e) {
    fail(`${p} is not valid JSON (${e.message})`);
  }
};

// 1. Check the package before writing it.
const manifest = readJson("plugin.json");
const mcp = readJson("mcp.json");
if (manifest.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") fail("plugin.json $schema is not Agent Plugins 1.0.0");
if (mcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") fail("mcp.json $schema is not Agent Plugins 1.0.0");
const servers = Object.values(mcp.mcpServers ?? {});
if (servers.length !== 1) fail("mcp.json must declare exactly one MCP server (plugin-level review test cases need one)");
if (servers[0].type !== "streamable-http" || !/^https:\/\//.test(servers[0].url)) fail("the MCP server must be streamable-http over https");

// The ZIP's mcp.json: the root config with the server switched to the ChatGPT endpoint.
const zipMcp = structuredClone(mcp);
for (const s of Object.values(zipMcp.mcpServers)) s.url = CHATGPT_URL;
const overrides = new Map([["mcp.json", Buffer.from(JSON.stringify(zipMcp, null, 2) + "\n", "utf8")]]);

const iface = manifest.extensions?.["com.openai"]?.interface ?? {};
const files = new Set(["plugin.json", "mcp.json", "LICENSE"]);
for (const field of ["logo", "composerIcon", "logoDark", "composerIconDark"]) {
  if (!iface[field]) continue;
  const p = iface[field].replace(/^\.\//, "");
  if (!existsSync(join(ROOT, p))) fail(`interface.${field} points at a missing file: ${iface[field]}`);
  files.add(p);
}
for (const s of SKILLS) {
  const p = `skills/${s}/SKILL.md`;
  if (!existsSync(join(ROOT, p))) fail(`missing skill ${p}`);
  const source = read(p).toString("utf8");
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) fail(`${p} has no YAML front matter`);
  const r = chatgptText(source);
  if (r.error) fail(`${p}: ${r.error}`);
  const used = FULL_ONLY_TOOLS.filter((t) => new RegExp(`\\b${t}\\b`).test(r.text));
  if (used.length) fail(`${p} names tools that /mcp/chatgpt does not offer, outside a full-server block: ${used.join(", ")}`);
  // generate_content refuses the remix argument on /mcp/chatgpt.
  if (r.text.includes("`remix`")) fail(`${p} names the remix argument outside a full-server block`);
  overrides.set(p, Buffer.from(r.text, "utf8"));
  files.add(p);
}
const onboarding = manifest.extensions?.["com.openai"]?.onboardingSkill;
if (onboarding !== undefined && !files.has(String(onboarding).replace(/^\.\//, ""))) {
  fail(`extensions.com.openai.onboardingSkill ${onboarding} is not a skill in the ZIP`);
}

// 2. Write the ZIP.
const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Fixed DOS timestamp: 2026-01-01 00:00:00.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
const UTF8_FLAG = 0x0800;

const locals = [];
const centrals = [];
let offset = 0;
for (const name of [...files].sort()) {
  if (name.includes("\\") || name.startsWith("/") || name.split("/").includes("..")) fail(`bad archive path ${name}`);
  const data = overrides.get(name) ?? read(name);
  const packed = deflateRawSync(data, { level: 9 });
  const nameBuf = Buffer.from(name, "utf8");
  const crc = crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(UTF8_FLAG, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(DOS_TIME, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(packed.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);
  locals.push(local, nameBuf, packed);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(UTF8_FLAG, 8);
  central.writeUInt16LE(8, 10);
  central.writeUInt16LE(DOS_TIME, 12);
  central.writeUInt16LE(DOS_DATE, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(packed.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(offset, 42);
  centrals.push(central, nameBuf);

  offset += local.length + nameBuf.length + packed.length;
}
const centralBuf = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.size, 8);
end.writeUInt16LE(files.size, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

const outDir = join(ROOT, "dist");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${manifest.name}-openai-${manifest.version ?? "0.0.0"}.zip`);
writeFileSync(out, Buffer.concat([...locals, centralBuf, end]));

console.log(`MCP server in the ZIP: ${CHATGPT_URL}`);
console.log(`Built ${out} (${statSync(out).size} bytes, ${files.size} files):`);
for (const f of [...files].sort()) console.log(`  ${f}`);
