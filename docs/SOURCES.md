# Sources

Every manifest in this repository was checked against these pages on 2026-10-17. Where a page left a
question open, the question is written down in [SUBMISSION-NOTES.md](SUBMISSION-NOTES.md) under
"Open questions".

## Claude Code plugins and marketplaces

| File | Source | What it confirmed |
| - | - | - |
| `.claude-plugin/plugin.json` | https://code.claude.com/docs/en/plugins-reference | Only `name` is required; `displayName`, `version`, `description`, `author` (`name` required), `homepage`, `repository`, `license`, `keywords`; directory listing fields `icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl` (read by Anthropic's directory, accepted by `claude plugin validate` from v2.1.281); `.mcp.json` at the plugin root is loaded by default; reserved name rules. |
| `.claude-plugin/marketplace.json` | https://code.claude.com/docs/en/plugins/marketplace-reference | Required `name`, `owner` (`name` required), `plugins[]` with `name` and `source`; a relative source starts with `./` and `"."` means the marketplace root itself; entry `category` and `tags`; reserved marketplace names. |
| Install commands | https://code.claude.com/docs/en/plugin-marketplaces | `claude plugin marketplace add <owner>/<repo>`, `claude plugin install <plugin>@<marketplace>`, the in-session `/plugin` equivalents, `claude plugin validate`. |
| `.mcp.json` | https://code.claude.com/docs/en/mcp | Plugin MCP servers live in `.mcp.json` at the plugin root; remote servers use `type` `http`; OAuth servers are signed in to with `/mcp`. |
| Skills front matter | https://code.claude.com/docs/en/skills | `name`, `description` and the 1,536 character listing cap. |
| Directory checks | https://claude.com/docs/plugins/pre-submission-checklist | README of 40+ words, LICENSE or `license`, files under 256 KiB except images, no `.DS_Store` / `Thumbs.db` / `desktop.ini`, remote server `type` `http` with an absolute `https://` URL, no secrets, reserved names. |
| Directory submission | https://claude.com/docs/plugins/submit | Portal steps (Source, Listing details, Data handling, Compliance with four acknowledgements, Review and submit), public repository before go-live, 10 submissions per 24 hours. |

## Agent Plugins 1.0.0 and OpenAI (ChatGPT and Codex)

| File | Source | What it confirmed |
| - | - | - |
| `plugin.json` | https://agent-plugins.org/schemas/1.0.0/plugin.schema.json | Closed manifest: `$schema` and `name` required; `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, `extensions` optional; name pattern. |
| `mcp.json` | https://agent-plugins.org/schemas/1.0.0/mcp.schema.json | `$schema` and `mcpServers` required; remote server `type` `streamable-http` with `url`. |
| Layout | https://agent-plugins.org/specification | `plugin.json` and `mcp.json` at the plugin root, skills discovered in `skills/<name>/SKILL.md`, reverse-domain `extensions`, HTTPS required for non-loopback URLs, no ZIP packaging rules. |
| `extensions.com.openai` | https://developers.openai.com/plugins/deploy/submission | Every `interface` field and limit (`displayName` 30, `shortDescription` 30, `longDescription` 4000, `developerName` 80, `defaultPrompt` up to 3 of 128, `brandColor` `#RRGGBB` with 2:1 contrast, `logo`, `composerIcon`, four HTTPS URLs), `review.test_cases` (exactly 5 positive and 3 negative, case fields), `demo_recording_url`, `commerce`, `commerce_description`, `publication.release_notes`; no `test_credentials` or `reviewer_instructions` in the ZIP. |
| ZIP and category checks | https://developers.openai.com/plugins/deploy/submission-errors | Allowed categories, archive rules (forward slashes, one plugin root at the archive root or one top-level folder, 100 MB), skill front matter rules, `plugin-name:skill-name` up to 64 characters. |
| Content rules | https://developers.openai.com/plugins/plugin-guidelines | No pricing or promotions in listing text, no selling credits, informational pages only, explicit tool annotations. |
| Packaging | https://developers.openai.com/plugins/build/plugins | `extensions.com.openai` in the root `plugin.json` replaces `.codex-plugin/plugin.json` settings; asset paths are `./`-relative. |
| `extensions.com.openai.onboardingSkill` | https://developers.openai.com/plugins/build/plugins ("Add an onboarding skill") and the field reference in https://developers.openai.com/plugins/deploy/submission | Optional string, a `./`-relative path to an included skill's `SKILL.md` (the docs use `./skills/setup/SKILL.md`), directly under `extensions.com.openai`, not inside `interface`; setup runs it in a new conversation or in the one where the plugin was installed. |
| Claude plugin conversion | https://developers.openai.com/plugins/guides/submit-claude-plugin | `.claude-plugin/plugin.json` is converted on upload when no Agent Plugins manifest is present. |
| Skill format | https://agentskills.io/specification | `name` up to 64 lowercase characters and single hyphens, must match the folder; `description` up to 1024 characters. |

## Gemini CLI

| File | Source | What it confirmed |
| - | - | - |
| `gemini-extension.json` | https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/reference.md | `name` (lowercase, dashes, expected to match the extension directory), `version`, `description`, `mcpServers`; extensions bundle skills from `skills/`. |
| `httpUrl` | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md | `httpUrl` selects Streamable HTTP (`url` is SSE); OAuth is discovered from a 401 with dynamic client registration. |
| Gallery | https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/releasing.md | Public GitHub repository, `gemini-extension.json` at the repository root, `gemini-cli-extension` topic, `gemini extensions install <repo-url>`. |

## Official MCP Registry

| File | Source | What it confirmed |
| - | - | - |
| `registry/server.json` | https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json | Required `name`, `description` (1 to 100), `version`; `title` up to 100; `repository` needs `url` and `source`; `icons[].src` HTTPS up to 255 with `sizes` as `WxH`; `remotes[]` `type` `streamable-http` and `url`. `scripts/validate.mjs` checks the file against this schema with ajv. |
| Namespace and publishing | https://github.com/modelcontextprotocol/registry/tree/main/docs/modelcontextprotocol-io | `creatorscompanion.app` maps to `app.creatorscompanion/*`; DNS TXT authentication at the apex; `mcp-publisher publish`. |

## Product facts

| Fact | Source |
| - | - |
| Tool names, inputs and what each tool does | `supabase/functions/mcp/tools/*.ts` in the CreatorsCompanion app repository |
| The 41 tools of `/mcp` and the 24 of `/mcp/chatgpt` (copied into `scripts/tools.mjs`) | `supabase/functions/mcp/server.ts` (`TOOLS`) and `supabase/functions/mcp/chatgpt.ts` (`CHATGPT_TOOLS`) |
| Install one-liners and data handling wording | `src/pages/ConnectPage.tsx` (the /connect page) |
| Reviewer persona (Maya Torres) and seeded library | `engine/.e2e/mk-reviewer-account.mjs` |
| Distribution plan and channel requirements | `docs/v2/research/2026-10-17-mcp-distribution.md` |
