---
name: write-in-my-voice
description: Draft a Reels or TikTok script, LinkedIn post, X post or thread, email newsletter, YouTube script or Instagram carousel in the user's own voice with CreatorsCompanion, from an idea or from a link. Use when the user asks to write, draft, rewrite or repurpose social content or a newsletter. Checks the credit cost first and asks before spending credits, then offers to save the result to the library.
---

# Write in my voice

Use the CreatorsCompanion tools to write drafts that sound like the user. The voice comes from their
CreatorsCompanion profile, so do not imitate it yourself: pass the request to `generate_content`.

## 1. Pin down the request

Work out three things, and ask one short question only if something is missing:

- **Format.** Map the request to a format key:
  `tiktok` (Reels and TikTok script), `linkedin`, `twitter` (X post or thread), `newsletter`,
  `youtube`, `instagram_carousel`. Several formats can go in one request.
- **Source.** Either an `idea` in the user's words, or a `source_url` (a Reel, TikTok, YouTube video,
  post or article). Exactly one of the two.
- **Extras.** Angle, call to action or anything else goes in `instructions`.

If the user wants several versions of one format, set `variants` (up to 4 per format). If they ask
for a specific structure, call `list_architectures` for that format and pass the chosen keys in
`architectures`; otherwise leave it out and CreatorsCompanion picks one.

If you are unsure of the user's niche or content language, call `get_creator_profile` (it is free).

## 2. Check the cost and ask

Call `estimate_cost` with the same `formats` (and `source_url` if there is one). Tell the user, in one
or two lines, the total credits, their balance, and whether today's limit covers it. Then ask:
"Shall I write it?"

**Do not call `generate_content` until the user says yes.** If they change the request, estimate again.

If the balance or the daily limit does not cover it, say so plainly and suggest a smaller request.
For how credits work, point to https://www.creatorscompanion.app/how-credits-work. Do not push the
user to buy anything.

## 3. Write

Call `generate_content` with the confirmed `formats`, the `idea` or `source_url`, and `instructions`.

- If drafts come back, show them.
- If you get a `job_id` instead, the drafts are still being written. Tell the user, then call
  `get_generation` with that `job_id` until the status is done.
- Failed drafts give their credits back automatically. Mention it if it happens.

## 4. Present

Show each draft cleanly, with its parts labeled (for a Reels or TikTok script: hooks, on-screen
text, script and caption). Keep the user's wording; do not rewrite the drafts unless asked. End with
the cost and the credits left, as reported by the tool.

## 5. Offer to save

Ask whether to save any draft to their CreatorsCompanion library. On yes, call `save_to_library` with
the draft's `draft_id`. If the user edited a draft in the chat, save their version instead with
`title`, `text` and `platform` (`instagram_tiktok`, `linkedin`, `twitter`, `email`, `youtube` or
`carousel`). Saving is free.
