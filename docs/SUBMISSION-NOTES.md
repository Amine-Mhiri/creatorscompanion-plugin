# Submission notes

What to paste where, channel by channel, and who does it. Nothing here has been submitted. "Us" means
the engineering side (a Claude session or the founder at a terminal); "Founder" means it needs the
founder's own account, identity or payment.

## Before any submission

These must be live first, because every listing links to them:

1. The new `/connect` page with its `#support`, `#data-handling` and `#tools` sections (built in the
   app repository, not deployed when this was written).
2. `/how-credits-work` as a real, plain informational page with no buy buttons. Today the URL serves
   the app shell with `noindex`.
3. The privacy policy section `/privacy#connected-apps` (ScrapeCreators, Apify, AI providers,
   retention).
4. The `/mcp/chatgpt` endpoint with the reduced tool set (see the ChatGPT section), its own
   protected resource metadata, and neutral insufficient-credit messages.
5. The public GitHub repository `Amine-Mhiri/creatorscompanion-plugin` (Founder creates it and pushes
   this repository; nothing here was pushed).
6. The reviewer account `reviewer@creatorscompanion.app` (persona Maya Torres) seeded with
   `engine/.e2e/mk-reviewer-account.mjs`. Its password stays in `ops/.reviewer-account` and is
   entered only in each portal's private credentials form.

## Shared copy

Use these everywhere unless a channel section says otherwise.

- **Name:** CreatorsCompanion
- **Developer / publisher:** CreatorsCompanion
- **Server URL:** https://www.creatorscompanion.app/mcp
- **Documentation:** https://www.creatorscompanion.app/connect
- **Privacy policy:** https://www.creatorscompanion.app/privacy
- **Terms of service:** https://www.creatorscompanion.app/terms
- **Support:** support@creatorscompanion.app (page: https://www.creatorscompanion.app/connect#support)
- **Icon:** https://www.creatorscompanion.app/logo512.png (1024 x 1024 PNG; also `assets/logo512.png`,
  and a 256 x 256 version in `assets/cc-icon-256.png`)
- **Brand color:** #8B5CF6
- **Short description (83 chars):** Write Reels, TikTok, LinkedIn, X, YouTube and newsletter content
  in your own voice.
- **One-liner (146 chars):** Write Reels and TikTok scripts, LinkedIn posts, X posts, newsletters
  and YouTube scripts in your own voice, and research what works in your niche.
- **Long description (full server):**

  > CreatorsCompanion writes social content in your own voice, based on the profile you keep on
  > CreatorsCompanion: Reels and TikTok scripts, LinkedIn posts, X posts and threads, email
  > newsletters, YouTube scripts and Instagram carousels. Give it an idea or a link and it returns
  > drafts that follow your bio, niche, audience and the voice examples you saved.
  >
  > It can also research what is working: find posts that outperformed in your niche on Instagram,
  > TikTok and YouTube, pull a video's transcript, track creators and read their content pillars
  > and top posts, and find creators in your niche worth watching. Your saved library is available
  > too: list, read, save and delete items.
  >
  > Actions that use credits show their cost before they run, and you can estimate a request first.
  > A connected app can never buy credits, change your plan or touch your billing.
  >
  > For creators, coaches, consultants and small brands with a CreatorsCompanion account. Drafts are
  > suggestions to review before you post; it does not publish or schedule posts.

- **Example prompts:**
  1. Write a Reels script in my voice about why remote workers lose focus after lunch.
  2. Remake this viral Reel in my voice: <link to a Reel or TikTok>
  3. Find TikToks that went viral in my niche this month and tell me what made each one work.
  4. Plan five posts for this week from my profile and library, then draft the first one.
  5. Turn this YouTube video into a LinkedIn post and an X thread: <link>
- **Categories:** Productivity, Marketing (or the closest the portal offers; see each channel).

### Data handling statement

Paste as is (founder: confirm the vendor sentence matches the ScrapeCreators and Apify terms first).

> CreatorsCompanion is our own service. The MCP server at https://www.creatorscompanion.app/mcp calls
> only our own API and database, and every request runs as the signed-in user, on their own profile,
> library and credits. A tool receives only the arguments it needs, such as an idea, a link, the
> formats chosen or a library item id. We never receive the conversation history, memory or files of
> the AI app.
>
> For the research tools (viral post search, transcripts, creator tracking, competitor search) and
> for reading a link the user pastes, our servers fetch public posts and public profiles on
> Instagram, TikTok and YouTube, and the public page at that link, through ScrapeCreators and Apify,
> licensed third-party data APIs that we call server-side under our own accounts. Results are
> returned as text and links. Drafts and post analysis are produced by AI models from OpenAI,
> Anthropic and Google, which receive only the text needed for that step.
>
> For each tool call we log the tool name, the OAuth client id, whether it worked, its credit cost
> and its duration, kept for up to 12 months. Generated and saved content stays in the user's
> account like content made on the website. Users disconnect an app at any time from Connected apps
> in their account, and access ends immediately. Privacy policy:
> https://www.creatorscompanion.app/privacy#connected-apps

### Test account note

> A fully populated reviewer account (persona Maya Torres, a productivity coach for remote workers,
> with voice examples, saved library items, tracked creators and enough credits) is ready.
> Credentials provided separately in the secure credentials field. Sign in with email and password on
> the CreatorsCompanion consent page; no MFA, email code or magic link is needed.

## 1. Official MCP Registry

**Who:** Founder adds one DNS record; we publish.

- **File:** `registry/server.json` (validated against the 2025-12-11 schema by `scripts/validate.mjs`).
- **Name:** `app.creatorscompanion/creatorscompanion` (reverse DNS of creatorscompanion.app; not
  `com.creatorscompanion`).
- **Steps (Git Bash):**
  1. Us: `openssl genpkey -algorithm Ed25519 -out key.pem` (stays out of git, `*.pem` is ignored;
     store it with the other secrets), then print the TXT value:
     `echo "v=MCPv1; k=ed25519; p=$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"`.
  2. Founder: add that TXT record at the apex `creatorscompanion.app` in Hostinger DNS.
  3. Us: `mcp-publisher login dns --domain creatorscompanion.app --private-key "$(openssl pkey -in key.pem -noout -text | grep -A3 priv: | tail -n +2 | tr -d ' :\n')"`
  4. Us: `cd registry && mcp-publisher publish` (it writes `.mcpregistry_*` token files, ignored by git).
  5. Check: `curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=app.creatorscompanion/creatorscompanion"`.
- **Updates:** bump `version` on every metadata change (published versions are immutable).
- **Do not** publish `/mcp/chatgpt` under this name: one remote URL per server name.

## 2. Claude directory: MCP connector

**Who:** Founder submits from his paid claude.ai account at https://claude.ai/directory/manage,
**Submit new > MCP connector**. Submit this before the plugin bundle and pair them.

- **Connection:** https://www.creatorscompanion.app/mcp, auth type OAuth (DCR).
- **Name:** CreatorsCompanion. **Slug:** `creatorscompanion` (permanent).
- **One-liner (200 max):** the shared one-liner.
- **Description (2,000 max):** the shared long description.
- **Categories (1 to 5):** Productivity, Marketing, Writing (pick from the portal list).
- **Documentation / privacy / support:** shared URLs; support contact support@creatorscompanion.app.
- **Use cases:** the five shared example prompts (at least three required).
- **Data handling:** choose "own API" for the service, and declare ScrapeCreators and Apify as
  third-party data sources; paste the data handling statement.
- **Test & launch:** confirm every tool was run as a custom connector or in MCP Inspector.
- **Compliance:** the seven acknowledgements are Founder's call.
- **Authentication:** test account note; credentials in the private field.

## 3. Claude directory: plugin bundle

**Who:** Founder (needs GitHub connected on claude.ai with push access to the repository).

- **Portal:** https://claude.ai/directory/manage, **Submit new > Plugin bundle**.
- **Repository:** `Amine-Mhiri/creatorscompanion-plugin`. **Plugin path:** leave empty (the plugin
  is the repository root). **Branch:** `main`.
- **Validate**, then fix anything marked Blocking. Locally: `claude plugin validate .` and
  `claude plugin validate .claude-plugin/plugin.json --strict` (needs Claude Code 2.1.281 or later).
- **Listing details:** read from `.claude-plugin/plugin.json` and `README.md` (no extra fields).
- **Data handling answers:**
  - Reads or stores personal data: the plugin itself stores nothing; its connector reads and writes
    the user's own CreatorsCompanion profile and library (data handling statement above).
  - Sends data to services other than its declared connectors: No.
  - Retention: none in the plugin; connector tool call logs up to 12 months.
  - Intended for people under 18: No.
- **Compliance:** the four acknowledgements are Founder's call.
- **Updates:** keep "GitHub push webhook"; bump `version` in `.claude-plugin/plugin.json` with
  every release.

## 4. ChatGPT and Codex plugin directory (ZIP)

**Who:** Founder (OpenAI identity verification, upload, credentials, video, attestations); we build.

- **Build:** `node scripts/build-openai-zip.mjs` writes `dist/creatorscompanion-openai-1.0.0.zip`
  with `plugin.json`, `mcp.json`, `LICENSE`, the two icons and the skills `write-in-my-voice` and
  `weekly-content-plan`. `research-then-write` is left out because `/mcp/chatgpt` has no research
  tools; the script fails if an included skill names one.
- **Server in the ZIP:** https://www.creatorscompanion.app/mcp/chatgpt
- **Tool set assumed for `/mcp/chatgpt`:** `get_account` (without plan upsell fields),
  `estimate_cost`, `get_creator_profile`, `list_architectures`, `generate_content`,
  `get_generation`, `list_library`, `get_library_item`, `save_to_library`, `delete_library_item`.
  The test cases in `plugin.json` only use these. Recheck them against the deployed endpoint.
- **Listing fields (already in `plugin.json`, imported on upload):**
  - displayName: CreatorsCompanion
  - shortDescription (26): Social posts in your voice
  - longDescription: in `plugin.json` (no pricing, plans or promotions; it says drafts use the
    account's credits and that the assistant asks first)
  - developerName: CreatorsCompanion (the portal overrides it with the verified identity name)
  - category: Creativity
  - websiteURL https://www.creatorscompanion.app/connect, supportURL
    https://www.creatorscompanion.app/connect#support, privacyPolicyURL, termsOfServiceURL
  - defaultPrompt: the three in `plugin.json`
  - logo `./assets/logo512.png`, composerIcon `./assets/cc-icon-256.png`, brandColor #8B5CF6
- **Review fields (in `plugin.json`):** 5 positive and 3 negative test cases for the reviewer
  account, `commerce: false`, `commerce_description`, release notes. `demo_recording_url` is
  `TODO`: Founder records the walkthrough (sign in, the five positive cases), uploads it, and puts the
  URL in `plugin.json` before building the final ZIP.
- **Steps:**
  1. Founder: identity verification at https://platform.openai.com/settings/organization/general
     (global data residency project).
  2. Founder: https://platform.openai.com/plugins > **Upload new or existing plugin** > choose the
     verified identity > upload the ZIP.
  3. Us: serve the challenge token as plain text at
     `https://www.creatorscompanion.app/.well-known/openai-apps-challenge` (a static file, not the
     SPA), then Founder: **MCPs > Connect**, sign in with the reviewer or own account, fix scan findings.
  4. Founder: **Review details**: enter the reviewer credentials (credentials provided separately,
     never in the ZIP), check the imported test cases, add the video URL.
  5. Founder: **Submit for review**, accept attestations, choose countries (`publication.countries`
     is not set in the package on purpose).
  6. After approval, Founder publishes manually.

## 5. Glama

**Who:** Us (claim needs a DNS record or a file on the site).

- First check whether the registry entry synced: https://glama.ai/mcp/connectors (registry names are
  used as slugs).
- If not, **Add MCP Server > Connector**: name CreatorsCompanion, description = shared short
  description, URL https://www.creatorscompanion.app/mcp (streamable HTTP, OAuth with DCR, no test
  credentials needed).
- **Claim ownership:** Glama gives a `glama_claim_...` value. Either a TXT record at
  `_glama-claim.creatorscompanion.app` (Founder adds it in Hostinger), or us serving
  `https://www.creatorscompanion.app/.well-known/glama.json` with
  `{"$schema":"https://glama.ai/mcp/schemas/connector.json","claim":"glama_claim_..."}` (no redirect).

## 6. Smithery

**Who:** Us, with a Smithery account (Founder's GitHub login).

- https://smithery.ai/new, paste https://www.creatorscompanion.app/mcp, or
  `smithery mcp publish "https://www.creatorscompanion.app/mcp" -n @creatorscompanion/creatorscompanion`.
- Display name CreatorsCompanion; description = shared short description; homepage = documentation
  URL; icon = shared icon.
- Smithery documents client registration through CIMD only. If its scan cannot sign in, serve
  `/.well-known/mcp/server-card.json`, then **Settings > Verification**.

## 7. mcp.so

**Who:** Founder (form, and the optional paid fast track).

- https://mcp.so/submit, type **Remote Server**.
- Name: CreatorsCompanion. URL: https://www.creatorscompanion.app/mcp. Repository:
  https://github.com/Amine-Mhiri/creatorscompanion-plugin (required, so the repo must be public).
- Description: the shared one-liner. Tags: content, social-media, creator, copywriting.
- Optional: $39 to skip review (Founder's decision).

## 8. Docker MCP Catalog (pull request)

**Who:** Us open the PR from a fork of `docker/mcp-registry`; Founder shares the test credentials
through the form linked in its CONTRIBUTING.md.

- Run `task remote-wizard` in the fork and answer with the values below, then commit
  `servers/creatorscompanion/server.yaml`, `tools.json` (`[]`, tools are dynamic) and `readme.md`.
- Expected `server.yaml` (follow the wizard output if it differs):

  ```yaml
  name: creatorscompanion
  type: remote
  dynamic:
    tools: true
  meta:
    category: productivity
    tags: [content, social-media, remote]
  about:
    title: CreatorsCompanion
    description: Write social content in your own voice and research what works in your niche
    icon: https://www.creatorscompanion.app/logo512.png
  remote:
    transport_type: streamable-http
    url: https://www.creatorscompanion.app/mcp
  ```

- `readme.md`: link to https://www.creatorscompanion.app/connect and this repository.
- PR title: `Add CreatorsCompanion (remote)`. PR body: the shared one-liner, the server URL, "OAuth 2.1
  with dynamic client registration", and "Test credentials provided separately through the form".

## 9. GitHub MCP Registry and VS Code gallery

**Who:** Founder sends the email after the official registry entry is live (onboarding is manual).

Draft to partnerships@github.com:

> Subject: MCP Registry onboarding request: CreatorsCompanion (app.creatorscompanion/creatorscompanion)
>
> Hello GitHub partnerships team,
>
> We would like CreatorsCompanion to be considered for the GitHub MCP Registry and the VS Code MCP
> gallery.
>
> CreatorsCompanion writes social content in a creator's own voice (Reels and TikTok scripts,
> LinkedIn posts, X posts, newsletters and YouTube scripts) and helps them research what works in
> their niche. It is a remote MCP server over Streamable HTTP with OAuth 2.1 and dynamic client
> registration, and it works in VS Code today.
>
> - Official MCP Registry name: app.creatorscompanion/creatorscompanion
> - Server URL: https://www.creatorscompanion.app/mcp
> - Documentation: https://www.creatorscompanion.app/connect
> - Repository: https://github.com/Amine-Mhiri/creatorscompanion-plugin
> - Privacy policy: https://www.creatorscompanion.app/privacy
> - Support: support@creatorscompanion.app
>
> Every tool carries title and read only or destructive annotations. We can provide a populated test
> account on request.
>
> Thank you,
> Amine Mhiri, CreatorsCompanion

## 10. Gemini CLI extensions gallery

**Who:** Founder (repository settings).

- `gemini-extension.json` is already at the repository root, with the full server and the three
  skills.
- After the repository is public, add the topic `gemini-cli-extension` in the repository's
  **About** settings. The gallery at https://geminicli.com/extensions crawls tagged repositories daily.
- Repository description (also used by the gallery): the shared one-liner.
- Test first: `gemini extensions install https://github.com/Amine-Mhiri/creatorscompanion-plugin`,
  then `/mcp auth creatorscompanion`.

## Open questions

Places where the docs were ambiguous or where a choice was made; nothing below was guessed silently.

1. **OpenAI `supportURL`** must be an HTTPS page per the field reference, so a `mailto:` link was not
   used. It points at `/connect#support`, which only exists once the new /connect page is deployed.
2. **OpenAI category:** `Creativity` was chosen over `Productivity` (both are valid values). Change
   it in `plugin.json` if the founder prefers Productivity.
3. **Credits in OpenAI listing text:** the long description says drafts use the account's credits
   and that the assistant asks first. The guidelines ban advertising pricing and selling credits,
   not stating that an existing account's credits are used; if a reviewer objects, drop that
   sentence.
4. **ZIP contents:** the Agent Plugins spec defines no ZIP layout. OpenAI accepts one plugin root at
   the archive root or in a single top-level folder. The ZIP leaves out `.claude-plugin/`,
   `.mcp.json` and `gemini-extension.json` so only one manifest format is present.
5. **Negative test cases:** the docs require only `description` and `prompt`; `expected_behavior`
   was added for the reviewer's benefit (the field is documented for all cases).
6. **Positive case 5** lists `get_generation`, which only runs when a draft is still being written
   after the first call. The reviewer may not see it.
7. **Cursor and other Agent Plugins clients** installing from this repository read the root
   `plugin.json` and `mcp.json`, which point at `/mcp/chatgpt` with the reduced tool set (as
   requested for the OpenAI package). Cursor users who want research tools can add the full server
   with the one-click link in the README. If Cursor gets its own listing, build it with
   `/mcp` instead.
8. **Claude listing fields:** `displayName`, `icon`, `documentationUrl`, `supportUrl`,
   `privacyPolicyUrl` and `termsOfServiceUrl` in `.claude-plugin/plugin.json` pass
   `claude plugin validate` on Claude Code 2.1.302, but Claude Code 2.1.133 rejects them as
   unrecognized keys. Current docs say unknown top-level keys are stripped at load time; very old
   Claude Code versions were not tested for loading.
9. **Marketplace source:** the docs say `"."` means the marketplace root; `"./"` was used and passes
   validation and a local install on Claude Code 2.1.302.
10. **Gemini extension name** is expected to match the extension directory name. Installing from a
    git URL stores the extension under its manifest name, so `creatorscompanion` should work;
    confirm with a real `gemini extensions install` once the repository is public.
11. **Plugin MCP sign-in in Claude Code:** the docs do not say in so many words that `/mcp` signs in
    to an OAuth server that came from a plugin; the README tells users to do that. Confirm on a
    real install.
12. **Registry icon:** `logo512.png` is actually 1024 x 1024, so `sizes` says `1024x1024`.
13. **Vendor terms:** the data handling statement calls ScrapeCreators and Apify licensed
    third-party data APIs. The founder must confirm both vendors' terms allow this use inside AI
    clients before submitting.
