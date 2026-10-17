---
name: research-then-write
description: Find posts that are working in the user's niche on Instagram, TikTok or YouTube, or look at a creator's recent posts, then write an original piece in the user's voice that borrows the structure, not the words. Use when the user asks what is going viral, wants ideas from a competitor or creator, or wants to remake a successful post their own way. Research and writing use credits, so it confirms before each paid step.
---

# Research, then write

Research what works, then write something original in the user's voice. Borrow the structure (hook
type, pacing, format, angle), never the wording, jokes or personal stories of the original.

## 1. Choose the research path

- **Viral posts in the niche:** `find_viral_posts` with a `platform` (`instagram`, `tiktok` or
  `youtube`). Leave `niche` out to use the niche from the user's profile, or set it, plus `keywords`
  and `window`, when the user is specific.
- **A creator the user already tracks:** `list_tracked_creators`, then `get_creator_report` for
  their content pillars and top posts. Both are free.
- **A new creator:** `track_creator` with their handle or profile link.
- **Creators to watch:** `find_competitors` for the user's niche.

`find_viral_posts`, `load_more_viral`, `track_creator` (when a new scan is needed),
`find_competitors` and `get_transcript` (when the transcript is not stored yet) use credits. Their
prices are in `get_account`. **Before any of them, tell the user the cost and ask.** Reading results
(`get_viral_results`, `get_competitor_results`, `get_creator_report`, `list_tracked_creators`) is free.

If a search returns a `job_id`, it is still running: read it later with `get_viral_results` or
`get_competitor_results`. A first creator scan takes a few minutes.

## 2. Pick what to learn from

Show the user the three to five most relevant results: a link, the hook, and in one line what made
it work. Ask which one to build on. For a video, `get_transcript` gives the spoken words when the
structure matters (confirm the cost first if it is not free).

## 3. Write an original piece

1. Write a short brief in your own words: the structure to borrow, the user's own topic and angle,
   and what to leave behind.
2. Call `estimate_cost` for the formats the user wants. Tell them the cost and ask before writing.
   **Do not call `generate_content` until the user confirms.**
3. Call `generate_content` with the brief as `idea` and the structure notes in `instructions`.
   To remake a single post the user is allowed to adapt, you can pass its link as `source_url`
   instead; CreatorsCompanion then keeps the structure and writes new words in the user's voice.
4. If you get a `job_id`, use `get_generation` until it is done.

## 4. Present and save

Show the draft next to one line on which post inspired it and what was borrowed. Remind the user
to make it their own before posting. Offer to save it with `save_to_library` (free).
