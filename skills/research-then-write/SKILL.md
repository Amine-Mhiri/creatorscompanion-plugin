---
name: research-then-write
description: Find posts that are working in the user's niche on Instagram, TikTok or YouTube, or look at a creator's recent posts, save the best ones as inspiration, then remake one as an original piece in the user's voice that borrows the structure, not the words. Use when the user asks what is going viral, wants ideas from a competitor or creator, or wants to remake a successful post their own way. Research and writing use credits, so it confirms before each paid step.
---

# Research, then write

Research what works, then write something original in the user's voice. Borrow the structure (hook
type, pacing, format, angle), never the wording, jokes or personal stories of the original.

## 1. Choose the research path

- **Viral posts in the niche:** `find_viral_posts` with a `platform` (`instagram`, `tiktok` or
  `youtube`). Leave `niche` out to use the niche from the user's profile, or set it, plus `who`,
  `keywords` (up to 5), `window` (such as `30d`) and `language`, when the user is specific.
  `load_more_viral` with the same `job_id` gets more results.
- **What tracked creators posted lately:** `get_feed` (free), best first, optionally for one
  `platform`.
- **One tracked creator in depth:** `list_tracked_creators`, then `get_creator_report` with the
  `creator_id` for their content pillars and top posts (add a `post_id` from the report for one
  post's full script and analysis). Both are free.
- **New creators to track:** `track_creator` with one `creator` (an @handle or profile link, plus
  `platform` for a bare handle) or up to 5 at once in `creators`. `untrack_creator` frees a slot.
- **Creators to watch:** `find_competitors` with a `platform` (plus `focus`, such as "real estate
  agents in Dubai", and `language` when the user is specific), then `get_competitor_results` with the
  `job_id` if it is still running.
- **Posts saved earlier:** `list_inspiration` (free), optionally by `status`: `saved` (To remake),
  `used` or `archived`.

`find_viral_posts`, `load_more_viral`, `track_creator` (a new scan costs credits per creator; one
scanned recently costs nothing), `find_competitors` and `get_transcript` (when the transcript is not
stored yet) use credits. Their prices are in `get_account`. **Before any of them, tell the user the
cost and ask.** Reading results (`get_viral_results`, `get_competitor_results`, `get_creator_report`,
`list_tracked_creators`, `get_feed`, `list_inspiration`) is free.

If a search returns a `job_id`, it is still running: read it later with `get_viral_results` or
`get_competitor_results`. A first creator scan takes a few minutes.

## 2. Pick what to learn from

Show the user the three to five most relevant results: a link, the hook, and in one line what made
it work. Ask which one to build on.

- To keep a post for later, `save_inspiration` (free) with `job_id` and `post_key` (a viral search
  result) or `post_id` (a tracked creator's post), and a `note` such as "copy the cold open". It
  returns a `saved_key`. `unsave_inspiration` removes one.
- For a video, `get_transcript` gives the spoken words when the structure matters: pass `job_id` and
  `post_key`, or a `saved_key`. Confirm the cost first if it is not free.

## 3. Remake it as an original piece

1. Write a short brief in your own words: the structure to borrow, the user's own topic and angle,
   and what to leave behind.
2. Call `estimate_cost` for the formats the user wants. Tell them the cost and ask before writing.
   **Do not call `generate_content` until the user confirms.**
3. Call `generate_content` with `remix` pointing at the post: `{ "saved_key": ... }`,
   `{ "job_id": ..., "post_key": ... }` or `{ "post_id": ... }`. A remix keeps that post's structure,
   writes new words in the user's voice and has no link fee. Put the user's angle and what to leave
   behind in `instructions`. For a post found elsewhere, pass its link as `source_url` instead, or
   pass the brief as `idea`.
4. If you get a `job_id`, use `get_generation` until it is done.
5. Once the remake is written, `save_inspiration` with the `saved_key` and `status: "used"` moves the
   original off the To remake list.

## 4. Present and save

Present the draft as the write-in-my-voice skill does (summarize when the app shows a drafts card),
with one line on which post inspired it and what was borrowed. Remind the user to make it their own
before posting. Offer to save it with `save_to_library` (free) with the `draft_id` and the `hook` they
picked.
