// The CreatorsCompanion MCP tool catalog, as served on 2026-10-17 (connector v2, 41 tools).
// Source of truth: supabase/functions/mcp/server.ts (TOOLS) and supabase/functions/mcp/chatgpt.ts
// (CHATGPT_TOOLS) in the app repository. Update both lists here when the server changes.
//
// Used by build-openai-zip.mjs (the ZIP's skills may only name CHATGPT_TOOLS) and validate.mjs (the
// review test cases may only trigger CHATGPT_TOOLS, and every tool a skill names must exist).

/** Tools on /mcp/chatgpt, the server the ChatGPT and Codex package points at (24). */
export const CHATGPT_TOOLS = [
  "get_started", "get_account", "get_credit_history", "estimate_cost", "get_creator_profile",
  "update_creator_profile", "get_voice", "update_voice_examples",
  "add_brain_document", "build_creator_brain", "get_creator_brain", "activate_creator_brain",
  "list_architectures", "list_carousel_styles", "generate_content", "get_generation", "edit_carousel",
  "update_draft", "discard_draft",
  "list_library", "get_library_item", "save_to_library", "update_library_item", "delete_library_item",
];

/** Tools only on the full server /mcp: they read social platforms or research data (17). */
export const FULL_ONLY_TOOLS = [
  "list_my_posts", "import_voice_from_posts",
  "find_viral_posts", "get_viral_results", "load_more_viral", "get_transcript",
  "save_inspiration", "list_inspiration", "unsave_inspiration",
  "find_competitors", "get_competitor_results", "track_creator", "untrack_creator",
  "list_tracked_creators", "get_creator_report", "get_feed",
  "get_analytics",
];

/** Every tool on the full server /mcp (41). */
export const ALL_TOOLS = [...CHATGPT_TOOLS, ...FULL_ONLY_TOOLS];

/**
 * Skill text between these markers is for the full server only. build-openai-zip.mjs removes it
 * from the ZIP copy of a skill; in the repository copy it is an invisible HTML comment pair.
 */
export const FULL_START = "<!-- full-server -->";
export const FULL_END = "<!-- /full-server -->";

/** A skill's text with every full-server-only block removed, or an error message. */
export function chatgptText(text) {
  let out = "";
  let rest = text;
  for (;;) {
    const s = rest.indexOf(FULL_START);
    const e = rest.indexOf(FULL_END);
    if (s === -1 && e === -1) break;
    if (s === -1 || e === -1 || e < s) return { error: "unbalanced full-server markers" };
    out += rest.slice(0, s);
    rest = rest.slice(e + FULL_END.length);
    const next = rest.indexOf(FULL_START);
    if (rest.slice(0, next === -1 ? undefined : next).includes(FULL_END)) return { error: "nested or repeated full-server end marker" };
  }
  out += rest;
  return { text: out.replace(/\n{3,}/g, "\n\n") };
}
