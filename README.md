# CreatorsCompanion for Claude, ChatGPT, Codex, Cursor and Gemini

![CreatorsCompanion](assets/cc-icon-256.png)

CreatorsCompanion writes social content in your own voice: Reels and TikTok scripts, LinkedIn posts,
X posts and threads, email newsletters, YouTube scripts and Instagram carousels. This repository
connects your CreatorsCompanion account to your AI app through the CreatorsCompanion MCP server, and
adds four skills that show the assistant how to use it well: set you up in the chat, check the cost
first, ask before spending credits, and save what you like to your library.

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

## What it can do

Version 1.1 (connector v2) puts most of the CreatorsCompanion studio inside the chat. The full server
has 41 tools; the ChatGPT package uses the 24 that do not read social platforms.

- **Setup in the chat.** Tell the assistant your niche, who you help and your language, and paste a
  few of your posts. It saves your profile and voice examples without a trip to the website.
  `get_started` shows in one call what is set up and what to do next.
- **Voice import.** On the full server, list your recent posts on Instagram, TikTok, YouTube,
  LinkedIn or X and import the ones that sound most like you as voice examples (100 credits, and it
  replaces the examples saved for that format; the assistant asks first).
- **Creator Brain.** Paste your offers, story, proof and FAQ, then build a Creator Brain: a checked
  brief of who you are, your content pillars and voice rules that every draft follows.
- **Drafts as a card.** In Claude and ChatGPT, drafts show inline as a card with hooks, on-screen
  text, caption, script and carousel slides, with a Save button. Ask for changes and the assistant
  edits the draft or the carousel slides in place, then saves it with the hook you picked.
- **Library.** List (by platform, status, content pillar, funnel stage or title words), read, edit,
  tag and delete your saved content.
- **Research** (full server only). Find posts that outperformed in your niche, pull a video's
  transcript, track creators and read their content pillars and top posts, see what your tracked
  creators posted lately, find creators worth watching, keep posts as inspiration and remake one in
  your voice with its structure kept. Your own connected accounts' numbers are there too.

The full tool list is at https://www.creatorscompanion.app/connect#tools.

## What the skills do

- **setup**: the onboarding skill. It calls `get_started`, asks at most three questions in one
  message (your niche and who you help, your language, one to three of your posts or a handle), saves
  your profile and voice examples, then offers a first draft. It never spends credits without a yes.
- **write-in-my-voice**: drafts a Reels or TikTok script, LinkedIn post, X post or thread,
  newsletter, YouTube script or carousel from your idea, a link or a saved post to remake. It checks
  the cost with `estimate_cost`, asks you before it writes, edits the draft when you ask, and offers to
  save it with the hook you picked.
- **weekly-content-plan**: reads your profile, Creator Brain pillars and library (and, on the full
  server, your analytics and your tracked creators' feed), proposes a week of posts across pillars and
  funnel stages, and writes the ones you pick after you confirm the cost.
- **research-then-write**: finds posts that are working in your niche, or looks at a creator's
  recent posts, saves the best as inspiration, then remakes one as an original piece in your voice
  that borrows the structure, not the words. It asks before every step that uses credits.

The skills only orchestrate CreatorsCompanion tools. The ChatGPT package (built by
`scripts/build-openai-zip.mjs`) includes setup, write-in-my-voice and weekly-content-plan with their
full-server-only steps removed, makes setup its onboarding skill, and leaves out research-then-write.

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

The scripts in `scripts/` are run by hand by the maintainers and never by the plugin:

- `node scripts/validate.mjs` checks every manifest (set `AJV_DIR` to a folder with ajv 8 installed
  to also check them against their published JSON Schemas).
- `node scripts/build-openai-zip.mjs` builds the ChatGPT and Codex package into `dist/`. It removes
  the parts of a skill between `<!-- full-server -->` and `<!-- /full-server -->`, and fails if a
  packaged skill still names a tool that `/mcp/chatgpt` does not serve.
- `scripts/tools.mjs` holds the tool lists both scripts check against (41 on `/mcp`, 24 on
  `/mcp/chatgpt`). Update it when the server's tools change.

Submission steps for each directory are in [docs/SUBMISSION-NOTES.md](docs/SUBMISSION-NOTES.md),
and the documentation each file follows is in [docs/SOURCES.md](docs/SOURCES.md).

## Links

- Setup and tools: https://www.creatorscompanion.app/connect
- Privacy policy: https://www.creatorscompanion.app/privacy
- Terms of service: https://www.creatorscompanion.app/terms
- Support: support@creatorscompanion.app

## License

MIT. See [LICENSE](LICENSE).
