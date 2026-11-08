---
name: setup
description: Set up the user's CreatorsCompanion account from the chat in about a minute, so drafts sound like them. Checks what is already set up, asks at most 3 questions in one message (niche and who they help, content language, a few of their own posts), saves the profile and voice examples, then offers a first draft. Use right after install, when the user says get started or set me up, or when drafts come back with a tip about a thin profile. Setup itself is free; it never spends credits without a yes.
---

# Set up CreatorsCompanion

Get the user from a fresh account to a first draft in their own voice, with as few messages as
possible. Every draft is written from the profile and voice examples saved here, so a minute spent on
setup is what makes the drafts sound like them.

## 1. See what is set up (free)

Call `get_started`. It returns, in one call: the credits and what is left of today's limit, the profile
fields present and `missing`, the creator's own voice examples per format, the Creator Brain status,
library and draft counts, and `next_steps`.

- **Everything is set** (no missing fields, own voice examples saved): say so in one line, show the
  suggested `next_steps`, and skip to step 4.
- **Something is missing:** go to step 2 and ask only about what is missing.

## 2. Ask once, at most 3 questions

Ask in a single message, and only for what `get_started` says is missing. At most these three:

1. **Niche and who they help:** "What do you post about, and who do you help (and with what result)?"
2. **Content language:** "Which language do you post in?" Skip it when the profile already has one
   or the user is clearly writing in it; then confirm it in one line instead of asking.
3. **Their own posts:** "Paste 1 to 3 posts or scripts you wrote, the ones that sound most like you."
<!-- full-server -->
   Or offer the shortcut: "Or give me your Instagram, TikTok, YouTube, LinkedIn or X handle and I
   can pull your recent posts."
<!-- /full-server -->

Do not ask for anything else, such as their name or audience, unless the user offers it; ask nothing that
`get_started` already answered. If the user answers only part, save that part and continue.

## 3. Save what they told you (free)

1. **Profile:** call `update_creator_profile` with the fields the answer gives: `bio` (one or two lines
   on who they help and how, in their words), `niche`, `audience`, `language` (a code or name, such as
   `en`, `fr` or `es`), and `name` or `social_handles` if they mentioned them. Only the fields you send
   change. Read back the fields it changed and the ones still `missing`.
2. **Voice from pasted posts:** call `update_voice_examples` with the `format` the posts were written
   for (`tiktok` for Reels and TikTok scripts, `linkedin`, `twitter` for X, `youtube` or `newsletter`)
   and the posts as `examples`, best first, one post per item. Calls to action they use go in `ctas`.
   If `get_started` showed that the user already saved their own examples for that format, say these
   will replace example 1 onward and ask first. Posts for different formats need one call per format.
<!-- full-server -->
3. **Voice from a handle:** call `list_my_posts` with the `platform` (`instagram`, `tiktok`,
   `youtube`, `linkedin` or `x`) and the `handle`; it is free. Show the posts briefly and let the user
   pick up to 5. Then tell the user, before anything runs: "Importing them costs 100 credits and
   replaces the voice examples saved for that format (example 1 onward)." Only after a yes, call
   `import_voice_from_posts` with the same `platform` and `handle` and `posts` as a list of `url` and
   `text` items copied from `list_my_posts`, best first. If the user says no, offer to paste the posts
   instead, which is free.
<!-- /full-server -->

Then confirm in two or three lines what was saved: the profile fields, and how many voice examples for
which format.

## 4. Offer a first draft

Offer one concrete first draft from their niche, for example: "Want me to write your first Reel? Give
me a topic, or I can use: <one idea from their niche>." When they pick a topic, follow the
write-in-my-voice skill: check the cost with `estimate_cost`, tell them, and call `generate_content`
only after they say yes.

Mention once, without pushing, that a Creator Brain can come later: they paste their offers, story
and proof with `add_brain_document`, and `build_creator_brain` (it uses credits, shown before it runs)
turns them into a brief every draft follows.

## Rules

- **Never spend credits without a yes.** Profile and voice saves are free.
  `generate_content` and `build_creator_brain` use credits, and so does any other paid tool:
  state the cost and wait for the user to agree before calling it.
- Ask the questions in one message, never one at a time.
- Use the user's own words for the bio and niche; do not polish them into marketing copy.
- If a save fails, say what did not save and offer to try again. Do not send the user to the website
  for something a tool here can do.
