# CreatorsCompanion for Claude, ChatGPT, Codex, Cursor and Gemini

![CreatorsCompanion](assets/cc-icon-256.png)

CreatorsCompanion writes social content in your own voice: Reels and TikTok scripts, LinkedIn posts,
X posts and threads, email newsletters, YouTube scripts and Instagram carousels. This repository
connects your CreatorsCompanion account to your AI app through the CreatorsCompanion MCP server, and
adds three skills that show the assistant how to use it well: check the cost first, ask before
spending credits, and save what you like to your library.

You need a CreatorsCompanion account. Sign up at https://www.creatorscompanion.app. Setup help for
every app is at https://www.creatorscompanion.app/connect.

One repository, several formats:

| File | Used by |
| - | - |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.mcp.json` | Claude Code, claude.ai and Cowork (plugin and marketplace) |
| `plugin.json`, `mcp.json` | Agent Plugins 1.0.0 clients such as ChatGPT, Codex and Cursor |
| `gemini-extension.json` | Gemini CLI |
| `registry/server.json` | The official MCP Registry listing |
| `skills/` | All of the above that support skills |

## Install

### Claude Code (plugin)

Inside Claude Code:

```
/plugin marketplace add Amine-Mhiri/creatorscompanion-plugin
/plugin install creatorscompanion@creatorscompanion
```

Or from your shell:

```
claude plugin marketplace add Amine-Mhiri/creatorscompanion-plugin
claude plugin install creatorscompanion@creatorscompanion
```

Then run `/mcp`, pick `creatorscompanion` and sign in to CreatorsCompanion in the browser window
that opens.

### claude.ai, Claude Desktop and Cowork (plugin)

Open **Customize**, then **Plugins**, then **Add**, choose **Add marketplace** and paste
`https://github.com/Amine-Mhiri/creatorscompanion-plugin`. Install CreatorsCompanion, open the
plugin's **Connectors** tab and connect it, then sign in and approve.

### Claude without the plugin (custom connector)

If you only want the tools, add a custom connector instead: open **Settings**, then **Connectors**,
click **Add custom connector**, name it CreatorsCompanion and paste
`https://www.creatorscompanion.app/mcp`. Or open this prefilled link:
https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=CreatorsCompanion&connectorUrl=https%3A%2F%2Fwww.creatorscompanion.app%2Fmcp

In Claude Code, the connector alone is:

```
claude mcp add --transport http creatorscompanion https://www.creatorscompanion.app/mcp
```

### Cursor

One click: https://cursor.com/link/mcp/install?name=creatorscompanion&config=eyJ1cmwiOiJodHRwczovL3d3dy5jcmVhdG9yc2NvbXBhbmlvbi5hcHAvbWNwIn0=

Or add this to your `mcp.json`:

```json
{ "mcpServers": { "creatorscompanion": { "url": "https://www.creatorscompanion.app/mcp" } } }
```

### VS Code

One click: https://insiders.vscode.dev/redirect/mcp/install?name=creatorscompanion&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fwww.creatorscompanion.app%2Fmcp%22%7D

Or add this to `.vscode/mcp.json`:

```json
{ "servers": { "creatorscompanion": { "type": "http", "url": "https://www.creatorscompanion.app/mcp" } } }
```

### Codex

```
codex mcp add creatorscompanion --url https://www.creatorscompanion.app/mcp
codex mcp login creatorscompanion
```

### Gemini CLI

As an extension (includes the skills):

```
gemini extensions install https://github.com/Amine-Mhiri/creatorscompanion-plugin
```

Or the server alone:

```
gemini mcp add --transport http -s user creatorscompanion https://www.creatorscompanion.app/mcp
```

Then run `/mcp auth creatorscompanion` inside Gemini CLI to sign in.

### ChatGPT

Search for CreatorsCompanion in the ChatGPT plugin directory once it is listed. Until then, follow
the custom server steps at https://www.creatorscompanion.app/connect.

## What the skills do

- **write-in-my-voice**: drafts a Reels or TikTok script, LinkedIn post, X post or thread,
  newsletter, YouTube script or carousel from your idea or a link. It checks the cost with
  `estimate_cost`, asks you before it writes, and offers to save the result to your library.
- **weekly-content-plan**: reads your profile and library, proposes a week of posts with a topic and
  angle for each, and writes the ones you pick after you confirm the cost.
- **research-then-write**: finds posts that are working in your niche, or looks at a creator's
  recent posts, then writes an original piece in your voice that borrows the structure, not the
  words. It asks before every step that uses credits.

The skills only orchestrate CreatorsCompanion tools. The ChatGPT package (built by
`scripts/build-openai-zip.mjs`) includes the first two skills and a smaller tool set without the
research tools.

## Credits

Paid actions, such as writing drafts or running a search, use the credits in your CreatorsCompanion
account, the same credits and prices as the website. The assistant can check a cost before it runs,
and work that fails gives its credits back. A connected app can never buy credits, change your plan
or touch your billing. How credits work: https://www.creatorscompanion.app/how-credits-work

## What this plugin connects to

This plugin runs no code on your machine. It points your AI app at one remote server,
`https://www.creatorscompanion.app/mcp` (the ChatGPT package uses
`https://www.creatorscompanion.app/mcp/chatgpt`), and you sign in with OAuth in your browser. No
password or API key is stored in these files.

When you use a tool, your AI app sends CreatorsCompanion only what that tool needs, such as your
idea, a link, the formats you chose or a library item id, and gets back the result. CreatorsCompanion
never receives your chat history. Public social data for research tools comes from ScrapeCreators and
Apify, and drafts are written with AI models from OpenAI, Anthropic and Google. Details are in the
privacy policy.

## For maintainers

The two scripts in `scripts/` are run by hand by the maintainers and never by the plugin:

- `node scripts/validate.mjs` checks every manifest (set `AJV_DIR` to a folder with ajv 8 installed
  to also check them against their published JSON Schemas).
- `node scripts/build-openai-zip.mjs` builds the ChatGPT and Codex package into `dist/`.

Submission steps for each directory are in [docs/SUBMISSION-NOTES.md](docs/SUBMISSION-NOTES.md),
and the documentation each file follows is in [docs/SOURCES.md](docs/SOURCES.md).

## Links

- Setup and tools: https://www.creatorscompanion.app/connect
- Privacy policy: https://www.creatorscompanion.app/privacy
- Terms of service: https://www.creatorscompanion.app/terms
- Support: support@creatorscompanion.app

## License

MIT. See [LICENSE](LICENSE).
