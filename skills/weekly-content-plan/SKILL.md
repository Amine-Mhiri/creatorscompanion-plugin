---
name: weekly-content-plan
description: Plan a week of social content from the user's CreatorsCompanion profile and saved library, then write the pieces they pick. Use when the user asks for a content plan, a content calendar, what to post this week, or a batch of posts. Planning is free; it confirms the credit cost before writing anything.
---

# Weekly content plan

Build a realistic plan from what the user already has, then write only what they choose.

## 1. Gather context (free)

- Call `get_creator_profile` for the niche, audience, language and voice.
- Call `list_library` to see what they have saved and drafted recently. Open a few items with
  `get_library_item` when you need the full text, for example to avoid repeating an angle.

If the library is empty, plan from the profile alone and say so.

## 2. Propose the plan

Ask how many posts and which platforms if the user has not said. Default to five posts across the
platforms their library uses most.

Present a short table, one row per post: day, platform, topic, angle or hook idea, and whether it
builds on an existing library item (name it) or is new. Mix the angles: a how-to, a story, an
opinion, a quick tip, a question. Do not repeat a topic they posted about recently unless it is a
deliberate follow-up.

Ask which posts to write now.

## 3. Write the picked posts

For the posts the user picks:

1. Map each to a format key: `tiktok` (Reels and TikTok script), `linkedin`, `twitter`,
   `newsletter`, `youtube`, `instagram_carousel`.
2. Call `estimate_cost` for the whole batch. Tell the user the total and their balance, and ask
   before writing. **Do not call `generate_content` until the user confirms.**
3. Call `generate_content`. Posts on different topics need separate calls, one per topic, each with
   its own `idea` and `instructions` (the angle from the plan). Posts on the same topic can share
   one call with several formats.
4. If a call returns a `job_id`, use `get_generation` until the drafts are done.

If credits run short, write the most important posts first and say which ones are left.

## 4. Wrap up

Show the drafts under their day in the plan, with the total cost and credits left. Offer to save
them with `save_to_library` (free), one call per draft.
