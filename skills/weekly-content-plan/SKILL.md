---
name: weekly-content-plan
description: Plan a week of social content from the user's CreatorsCompanion profile, Creator Brain pillars and saved library, then write the pieces they pick. Use when the user asks for a content plan, a content calendar, what to post this week, or a batch of posts. Planning is free; it confirms the credit cost before writing anything.
---

# Weekly content plan

Build a realistic plan from what the user already has, then write only what they choose.

## 1. Gather context (free)

- `get_started` for the setup in one call: niche, language, voice examples per format, Creator Brain
  status, library counts and credits. If the profile is empty, run the setup skill first.
- `get_creator_brain` when the Brain is active: its content pillars (with the pillar ids library tags
  use), offers and voice rules. Plan the week across those pillars.
- `list_library` to see what is saved and drafted. Its filters help you plan a mix:
  - `kind`: `library` (saved items), `drafts` (delivered drafts not saved yet) or `all`.
  - `platform`: `instagram_tiktok`, `linkedin`, `twitter`, `email`, `youtube` or `carousel`.
  - `status`: `draft`, `scheduled`, `published` or `archived`.
  - `pillar_id` (an id from the Brain, or `none` for untagged) and `funnel_stage` (`tof` for reach,
    `mof` for trust, `bof` for sales, or `none`).
  - `text`: words in the title, to check whether an angle was already covered.
  For example, `list_library` with `status: "published"` and `funnel_stage: "bof"` shows how many
  sales posts went out lately. Open an item with `get_library_item` when you need the full text.
<!-- full-server -->
- `get_analytics` for the user's own connected accounts: followers, views and their strongest and
  weakest recent posts. Lean the plan toward the topics and formats that already work for them.
- `get_feed` for what the creators they track posted lately, best first (it is free). Use it for
  angles that are working in the niche right now, never to copy wording. If they track nobody, skip it.
<!-- /full-server -->

If the library is empty, plan from the profile and Brain alone and say so.

## 2. Propose the plan

Ask how many posts and which platforms if the user has not said. Default to five posts across the
platforms their library uses most.

Present a short table, one row per post: day, platform, pillar, funnel stage (mostly `tof` and `mof`,
with one `bof` that points at an offer from the Brain), topic, and the hook idea. Note when a post
builds on an existing library item (name it) or on a strong post you found. Mix the angles: a how-to,
a story, an opinion, a quick tip, a question. Do not repeat a topic they posted about recently unless
it is a deliberate follow-up.

Ask which posts to write now.

## 3. Write the picked posts

For the posts the user picks:

1. Map each to a format key: `tiktok` (Reels and TikTok script), `linkedin`, `twitter`,
   `newsletter`, `youtube`, `instagram_carousel`.
2. Call `estimate_cost` for the whole batch (`formats` as a list of `{ "format": ... }` entries).
   Tell the user the total and their balance, and ask before writing. **Do not call
   `generate_content` until the user confirms.**
3. Call `generate_content`. Posts on different topics need separate calls, one per topic, each with
   its own `idea` and `instructions` (the angle, pillar and funnel stage from the plan). Posts on the
   same topic can share one call with several formats.
4. If a call returns a `job_id`, use `get_generation` until the drafts are done.

If credits run short, write the most important posts first and say which ones are left.

## 4. Wrap up

Show the drafts under their day in the plan (when the app shows a drafts card, summarize instead of
pasting them again), with the total cost and credits left. Offer to save them with `save_to_library`
(free), one call per draft with its `draft_id` and the `hook` the user picked. To mark a saved item
for a day, `update_library_item` can set its `status` to `scheduled` and `notes` such as "Tuesday";
CreatorsCompanion does not publish or schedule posts on the networks itself.
