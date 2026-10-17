---
name: write-in-my-voice
description: Draft a Reels or TikTok script, LinkedIn post, X post or thread, email newsletter, YouTube script or Instagram carousel in the user's own voice with CreatorsCompanion, from an idea, a link, or a post to remake. Use when the user asks to write, draft, rewrite, remake or repurpose social content or a newsletter. Checks the credit cost first and asks before spending credits, edits the draft on request, then offers to save it to the library with the hook the user picked.
---

# Write in my voice

Use the CreatorsCompanion tools to write drafts that sound like the user. The voice comes from their
saved profile, voice examples and Creator Brain, so do not imitate it yourself: pass the request to
`generate_content`.

If you do not know yet whether the account is set up, call `get_started` (free). When the profile is
empty, follow the setup skill first: one message with at most 3 questions, then save.

## 1. Pin down the request

Work out these, and ask one short question only if something is missing:

- **Formats.** `formats` is a list with one entry per format, such as
  `[{ "format": "tiktok" }, { "format": "linkedin", "variants": 2 }]`. Format keys: `tiktok` (Reels
  and TikTok script), `linkedin`, `twitter` (X post or thread), `newsletter`, `youtube`,
  `instagram_carousel`. `variants` (1 to 4) asks for several drafts of one format.
- **Structure (optional).** If the user asks for a specific structure, call `list_architectures` with
  the `format` and put the chosen keys in that entry's `architectures`. Otherwise leave it out and
  CreatorsCompanion picks one.
- **Carousel look (optional).** For `instagram_carousel`, `list_carousel_styles` lists the styles;
  pass the chosen slug as `carousel_style`. Leave it out for the house style.
- **Source, exactly one of:**
  - `idea`: the topic in the user's words.
  - `source_url`: a Reel, TikTok, YouTube video, post or article to write from (adds a small link fee).
<!-- full-server -->
  - `remix`: a post the user already found, to remake in their voice with its structure kept and no
    link fee. Pass `{ "saved_key": ... }` for a post from `list_inspiration`, `{ "job_id": ...,
    "post_key": ... }` for a post from a `find_viral_posts` search, or `{ "post_id": ... }` for a
    tracked creator's post from `get_creator_report` or `get_feed`.
<!-- /full-server -->
- **Extras.** Angle, call to action, length or anything else goes in `instructions`.

## 2. Check the cost and ask

Call `estimate_cost` with the same `formats` (and `source_url` if there is one). Tell the user, in one
or two lines, the total credits, their balance, and whether today's limit covers it. Then ask:
"Shall I write it?"

**Do not call `generate_content` until the user says yes.** If they change the request, estimate again.

If the balance or today's limit does not cover it, say so plainly and suggest a smaller request. For
how credits work, point to https://www.creatorscompanion.app/how-credits-work. Do not push the user to
buy anything.

## 3. Write

Call `generate_content` with the confirmed `formats`, the one source, and `instructions` (plus
`carousel_style` when set).

- If drafts come back, present them (step 4).
- If you get a `job_id` instead, the drafts are still being written. Tell the user, then call
  `get_generation` with that `job_id` until the status is `done`. Never call `generate_content` again
  for the same request while it runs.
- An identical request made in the last few minutes is handed back at no cost (`replayed`). When the
  user wants new versions of the same request, confirm the cost again and pass `fresh: true`.
- Failed drafts give their credits back automatically. Mention it if it happens.
- A `tip` line means the profile or voice is thin: pass it on in one sentence and offer the setup skill.

## 4. Present

Some apps (Claude and ChatGPT) show the drafts as a card under the tool call, with hooks, on-screen
text, caption, script and a Save button. When the card is shown, do not paste the drafts again in
full: give a one or two line summary per draft and the cost. When there is no card, show each draft
cleanly with its parts labeled (for a Reels or TikTok script: hooks, on-screen text, script and
caption). Keep the wording as written; do not rewrite drafts unless asked. End with the cost and the
credits left, as reported by the tool.

## 5. Edit on request (free)

- Text changes to a draft: `update_draft` with the `draft_id` and only what changes: `title`, `body`,
  `hooks`, `ctas`, `onscreen_hooks`, `caption` (LinkedIn and X drafts have options; pass `option` to
  edit one other than the first). Lists replace the whole list, in order.
- Carousel slides: `edit_carousel` with the `draft_id` and `slides` (each by `number`, with the new
  `headline`, `subheadline`, `body`, `cta_action` or `cta_reward`), a new `caption` or a new
  `carousel_style`. It re-renders the slides; if it returns a `job_id`, use `get_generation`.
- A draft the user does not want: `discard_draft` with its `draft_id`, after they confirm.

## 6. Offer to save (free)

Ask whether to save any draft to their library, and which hook they want if there are several. On yes,
call `save_to_library` with the `draft_id` and `hook` (its number, 1 for the first, or its text). The
library tags its content pillar and funnel stage on its own. To save text the user wrote in the chat
instead, pass `title`, `text` and `platform` (`instagram_tiktok`, `linkedin`, `twitter`, `email`,
`youtube` or `carousel`). Changes to an item already saved go through `update_library_item`.
