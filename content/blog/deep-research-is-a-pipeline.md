---
title: The outline did the research
summary: I opened the STORM paper expecting a better prompt. Its tables put most of the gain on an outline step, and its citations held up less well than they looked.
date: 2026-10-30
cover: cover.svg
---

I was going through recent papers on LLM research tools when I opened STORM [@shao2024storm], from Stanford's OVAL lab. It writes Wikipedia-style articles from scratch, with citations, and I expected the trick to be a clever prompt. Table 2 had a different story. Adding an outline step to plain retrieval nearly doubled how much of the real article's content the output covered. Taking the outline step out of STORM sent it back down to where plain retrieval started.

## what I expected

I thought deep research was a strong model told to search harder: more queries, more pages read, a longer answer at the end. A better report would come from a better model or a bigger search budget.

The paper spends almost none of its effort there. It spends it on what happens before anything gets written.

## how storm works

STORM behaves like a journalist preparing a long feature. Before writing, it decides whom to interview, interviews each of them, and plans the piece.

It finds its interviewees by asking a model for topics related to yours, pulling those topics' Wikipedia articles, and reading their tables of contents. From those it proposes a handful of perspectives (say, a historian, an engineer and a local resident), plus one that only cares about the basic facts. Each perspective then gets a simulated conversation. A writer agent asks questions in that perspective's voice, and an expert agent answers them from search results, with follow-ups when an answer opens something new. In [[projects/kvasir]], the defaults are three perspectives, three questions each, and three search results per query.

Only then does it write an outline, first from what the model already knows, then refined against the conversations. Each section is written from the sources collected for it, with citations, and a last pass adds a lead and trims repetition.

Co-STORM [@jiang2024costorm] is the same newsroom with you in the room. Several expert agents and a moderator hold a round table, the moderator brings up angles nobody asked about, and a shared mind map keeps track of what's been covered. In the authors' study, 70% of participants preferred it to a search engine and 78% to a RAG chatbot.

## the outline did the work

Entity recall in the paper counts how many of the named things in the real Wikipedia article (people, places, events) also show up in the generated one.

![Adding an outline to plain retrieval takes it most of the way to STORM. Removing STORM's outline step puts it back at plain retrieval's level.](ablation.svg)

Going from plain retrieval to outline-driven retrieval moved entity recall from 7.6% to 12.6%. Everything else STORM does, the perspectives and the simulated conversations, added 1.5 points on top. Then the ablation: STORM with its outline step removed scored 7.4%, below plain retrieval. The way I read it: the conversations still gathered the material, and without a plan the writer used little of it.

The conversations aren't dead weight. They matter most for the outline itself: without them, the outline's headings covered noticeably fewer of the real article's entities (39.3% against 45.9%). And when Wikipedia editors compared articles side by side, they rated STORM's as well organized 25 points more often than the outline-driven baseline's.

None of these gains came from a bigger model. They came from the order of the steps. The journalist's notebook matters less than the plan they make before writing.

## where it leaks

The same editors rated verifiability. STORM scored 3.80, the baseline 3.85. A better plan made a better-organized article, and it made it no easier to check.

The paper's own audit puts about 15% of STORM's sentences as unsupported by the citation next to them. The most common failure is what the authors call improper inferential linking. Their example: an article on Lahaina, Hawaii says religion "has remained the paramount aspect of Hawaiian life in Lahaina", citing a page about religion in Hawaiian life that never mentions Lahaina. Both facts are real. The link between them was invented. In journalist terms, two quotes from two interviews got spliced into one sentence, and the footnote points at only one of them. Seven of the ten editors also called the articles emotional or not neutral, which the authors put down to bias in the sources carrying through.

Commercial tools don't do much better. DeepTRACE [@narayananvenkit2025deeptrace] audited deep research agents in August 2025 and checked whether each cited source supports the statement it's attached to.

![GPT-5's deep research cites the most accurately and leaves the fewest unsupported claims. The others range from half to nearly all their statements lacking support.](citations.svg)

Citation accuracy ran from 50% for Gemini to 79% for GPT-5. Unsupported statements ran from 12.5% for GPT-5 to 97.5% for Perplexity. The judge was a model whose labels agreed only moderately with human ones (a correlation of 0.62), so I read these as rough positions, not scores. A separate study [@rao2026detecting] found that 3 to 13% of citation URLs from LLMs point at pages that likely never existed, with deep research agents fabricating at higher rates than plain search-augmented models.

A pipeline can also manufacture its own evidence. When I forked STORM's code, I found that a failed expert turn was replaced with a canned apology, which then went into the research notes as if the expert had said it. I wrote more about that fork in [the next post](/blog/self-hosted-deep-research).

## how I read a report now

I read the outline first. If the sections are the right questions, the report is probably useful, and the paper gives me a reason to start there: the outline is where most of the quality comes from. Then I open two or three citations, on the claims I'd act on.

The prose I trust least is the prose that sounds best, since the structure that makes it read well is the same structure that has no say in whether it's true.

If the outline does most of the work, should I be reviewing the outline and skipping the article? And is 79% citation accuracy a model problem that the next model fixes, or a pipeline problem that no model fixes?
