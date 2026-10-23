---
name: blog-writing
description: Draft, edit, or review a post for this site's blog (content/blog/). Covers voice, narrative shape, humour, metaphors, reflection, callbacks to earlier posts, endings that leave open questions, and an anti-slop pass. Use before writing or revising any blog post, and to review a draft.
---

# blog-writing

A post here is a personal look back: what I tried, what happened, what I understand now that I didn't then, and what I still don't. The reader should finish with a clearer picture and at least one question they want to chew on.

Figures: see the `blog-figures` skill.

## Before drafting

1. Pin down the one thing that changed in my head. If you can't say it in a sentence ("I thought caching was the slow part; it was the serializer"), the post isn't ready. Ask me instead of inventing it.
2. Collect the raw material: dates, numbers, tool names, error messages, the dumb thing I tried first. Facts come from me, the repo, or `content/` entries. Never invent an anecdote, a quote, a metric, or a feeling and present it as mine. If a scene needs a detail you don't have, leave `TODO(ask): ...` in the draft.
3. Read the earlier posts: `content/blog/*.md` (frontmatter and bodies). Note any that touch the same project, tool, mistake, or belief. See "Callbacks" below.
4. Check `content/projects/`, `content/technologies/`, `content/skills/` for entries to mention with `[[wikilinks]]`.

## Shape

A default arc, not a form to fill. Skip or reorder a beat when the story wants it.

1. **Open in a moment.** A concrete scene: the terminal at 2am, the review comment, the graph that went the wrong way. No preamble about the topic or the industry.
2. **What I expected.** The belief I walked in with, stated plainly enough that the reader could have held it too.
3. **What happened.** The story, with stakes and specifics. Show the wrong turns; they are the interesting part.
4. **The turn.** The point where the belief broke. Name what broke it.
5. **Looking back.** What I'd tell past me, what I still got wrong, what the experience cost. Honest about what I'm unsure of, without hedging every sentence.
6. **Open end.** One to three questions I don't know the answer to (see "Endings").

Headings: lowercase-friendly, short, and only when the post is long enough to need navigation. The site already prints `##` before them.

## Voice

- First person, past tense for the story, present tense for what I think now.
- Specific over general: "the build took 14 minutes" beats "the build was slow".
- Humour: dry and self-directed. One or two beats per section, never at the reader's expense, never a joke that needs the reader to share an in-joke. A good beat comes from the situation (the fix was a missing comma; I had already rewritten the parser). If a joke stalls the story, cut it.
- Talk to one reader who is smart and busy. "You" puts them in the scene; use it.
- Admit ignorance plainly once ("I still don't know why the second run was faster") instead of sprinkling "maybe" and "I think".

## Metaphors and comparisons

- One per idea. Don't stack them, don't mix them.
- Draw from everyday life the reader has lived: kitchens, commutes, moving flats, queues, IKEA instructions. Avoid war, sports, and anything that needs domain knowledge to land.
- It has to map structurally. Before keeping one, write (for yourself) what maps to what: "the queue = the bakery line; workers = cashiers; backpressure = the door staying shut". If a part doesn't map, either the metaphor or the explanation is wrong.
- If it needs a sentence of explanation, drop it.
- Extend a good metaphor once later in the post; that callback lands better than a new one.

## Callbacks to earlier posts

When an earlier post covers related ground, it's part of the story: the earlier post is a record of what I believed then.

- Call back only where it sharpens the reflection: "In [the futhark post](/blog/futhark-notes) I blamed the GPU. Three months later I'd blame my memory layout." Not a "related posts" list.
- Contradicting an older post is good material. Say what changed and why. Don't edit the old post to agree with the new one; at most suggest a one-line pointer to the new post and let me decide.
- Link with plain markdown, `[text](/blog/<slug>)`. `[[wikilinks]]` don't resolve to blog posts. The prerender crawl fails the build on a broken `/blog/` link, so a typo shows up there.
- Zero callbacks is fine when nothing relates. Don't force one.

## Endings

- End on questions I'm still holding, phrased so the reader can try to answer them in their own work: "Would this have held at 10x the data, or did I get lucky with the distribution?"
- Real questions only. Don't answer them, and don't use them as a rhetorical setup for a point.
- No tidy moral, no "in conclusion", no call to action, no "thanks for reading".

## Mechanics (anti-slop)

Adapted from [stop-slop](https://github.com/hardikpandya/stop-slop) by Hardik Pandya (MIT). Where these clash with the voice above, the voice wins only in the listed exceptions.

**Cut on sight**
- Throat-clearing: "Here's the thing", "here's what/why ...", "It turns out", "The truth is", "Let me be clear", "Can we talk about".
- Emphasis crutches: "Full stop.", "Let that sink in.", "This matters because", "Make no mistake".
- Meta-commentary: "In this post I'll...", "As we'll see", "Let me walk you through", "But that's another post", "Plot twist:".
- Jargon: navigate, unpack, lean into, landscape, game-changer, double down, deep dive, moving forward, leverage, utilize, robust, seamless.
- Filler: "At its core", "In today's ...", "It's worth noting", "At the end of the day", "When it comes to".
- Vague declaratives: "The implications are significant", "The reasons are structural". Name the implication.
- Adverbs by default (really, just, actually, genuinely, honestly, simply, literally, truly, fundamentally). Exception: keep one when it carries the joke or the spoken rhythm.

**Structures to break**
- Binary contrasts: "Not X. Y.", "X isn't the problem, Y is", "It's not this, it's that", "not just X but also Y". State Y.
- Negative listing: "It wasn't X. It wasn't Y. It was Z." State Z.
- Dramatic fragmentation: "Speed. Quality. Cost." stacks. Exception: one short fragment as a comic beat is fine; never two in a row.
- Rhetorical setups: "What if...?", "Think about it:", "And that's okay." Closing questions are exempt (they're real and unanswered).
- False agency: "the bug decided", "the data tells us", "the decision emerged". Name who did it, usually me.
- Narrator from a distance: "People tend to...", "Nobody designed this." Put the reader or me in the scene.
- Passive voice that hides the actor.
- Wh- sentence openers as a crutch ("What makes this hard is..."). Lead with the subject.
- Lazy extremes: every, always, never, nobody. Use the specific case.

**Rhythm**
- Mix sentence lengths; three same-shaped sentences in a row reads as generated.
- Two items usually beat three.
- Vary paragraph endings; not every paragraph closes on a punchline.
- No em dashes. Commas, periods, or parentheses.
- Cut anything that sounds like a pull-quote.

## Site specifics

```markdown
---
title: Short, concrete title
summary: One sentence for the /blog list. Says what happened, not "thoughts on X".
date: 2026-10-23
---
```

- File: `content/blog/<slug>.md`, slug in kebab-case. Figures in `content/blog/<slug>/`.
- `[[projects/x]]`, `[[technologies/x]]`, `[[skills/x]]` render as mentions with popovers.
- Code fences need a language tag.

## Final pass

Run before handing back a draft. Fix, don't just report.

- [ ] I can state the one-sentence change in belief, and the post delivers it.
- [ ] Opens in a concrete moment, not a topic intro.
- [ ] Every anecdote, number, and quote comes from me or the repo. `TODO(ask)` left where it doesn't.
- [ ] Earlier posts checked; callbacks only where they sharpen the reflection; `/blog/` links valid.
- [ ] Each metaphor maps structurally and needs no explanation.
- [ ] Humour beats come from the situation; none punch at the reader.
- [ ] Ends on real, unanswered questions. No moral, no CTA.
- [ ] No em dashes, no cut-on-sight phrases, no binary contrasts.
- [ ] Score 1–10 each: directness, rhythm, trust in the reader, sounds like a person, density. Below 35/50, revise and rescore.
- [ ] `pnpm build` passes.
