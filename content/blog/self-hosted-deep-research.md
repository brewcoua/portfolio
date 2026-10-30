---
title: The bugs that wrote articles
summary: I wanted deep research I could host myself, so I forked Stanford's STORM into a service. The bugs I found didn't raise errors. They wrote worse articles.
date: 2026-11-06
cover: cover.svg
references:
  - title: Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models
    authors:
      - Shao, Y.
      - Jiang, Y.
      - Kanell, T. A.
      - Xu, P.
      - Khattab, O.
      - Lam, M. S.
    year: "2024"
    journal: arXiv preprint arXiv:2402.14207
    doi: 10.48550/arXiv.2402.14207
    url: https://arxiv.org/abs/2402.14207
  - title: "Into the Unknown Unknowns: Engaged Human Learning through Participation in Language Model Agent Conversations"
    authors:
      - Jiang, Y.
      - Shao, Y.
      - Ma, D.
      - Semnani, S. J.
      - Lam, M. S.
    year: "2024"
    journal: arXiv preprint arXiv:2408.15232
    doi: 10.48550/arXiv.2408.15232
    url: https://arxiv.org/abs/2408.15232
---

A restored Co-STORM session in Stanford's code reads its saved state, throws away the model configuration it saved, and rebuilds one from defaults: OpenAI's API, called directly, and Bing for search. Nothing logs it, and nothing fails. The round table carries on, on someone else's account and someone else's search engine. That bug set the tone for the whole fork.

## why I wanted my own

I wanted deep research I could run on my own infrastructure. A hosted tool like Perplexity sees every question I ask and every document I paste in, and I couldn't find a self-hostable option I was happy with.

[GPT Researcher](https://github.com/assafelovic/gpt-researcher) came closest. Its interface looked heavily vibe coded, and using it was miserable. Its API wasn't what I wanted either. I already did my chatting in [[technologies/open-webui]], and I wanted research to show up there, not in a second app.

Then, going through recent papers, I found [STORM](https://arxiv.org/abs/2402.14207). [The last post](/blog/deep-research-is-a-pipeline) covers what it does and why its outline step matters. What mattered here: it was a pipeline I could read, with a paper explaining each stage, and building on it looked more interesting than bending someone else's product into shape.

## the missing middle

Upstream ships a Python library and a Streamlit demo labelled for local development. No server, no container image, and no commits of substance since January 2025. [[projects/kvasir]] is the part in between: a [[technologies/fastapi]] service that streams a run's progress, a hardened image, and an Open WebUI pipe that shows STORM and Co-STORM as two models in the chat list. Model calls go to an OpenAI-compatible gateway, search goes to my own [[technologies/searxng]] instance, and no paid search key is involved.

![Open WebUI talks to kvasir, which sends model calls to a gateway and searches through my own SearXNG.](architecture.svg)

The privacy has a limit, and it sits at the gateway. For my tests I pointed it at Ollama Cloud, with DeepSeek's flash model doing most of the work, so my questions still left the cluster. That was a choice about what I was testing: how the pipeline behaved, not which model suited it best, since [the structure around the model does most of the work](/blog/deep-research-is-a-pipeline). Search, orchestration and the stored sessions stay on my side. Where the model calls go is one line of configuration.

The first commit is from August 16 and the 0.3.0 release from August 17, 42 commits in all. The service was the quick part.

## failures that look like output

I expected the hard part to be serving it: long runs, streaming, timeouts, an image that runs read-only. The hard part was that upstream's bugs didn't crash. They produced an article, and the article was worse.

The [fork notes](https://github.com/brewcoua/kvasir/blob/master/docs/fork-notes.md) open with that warning, because most entries exist for it:

- When an expert agent's turn failed, the code put a canned apology into the research corpus. The rest of the pipeline then treated it as something the expert had said.
- Search ran its queries in parallel through `executor.map`, which raises the first failure and drops every other query's results with it. A single bad query cost a whole batch of sources.
- Expert names came back from the model as `Name: description` and were split on `:`. A description with a colon of its own raised, and the turn failed.
- Pipeline stages in Co-STORM were wrapped in a handler that caught every exception, printed it, and carried on, so a failed stage looked like a successful one.
- Every serialised Co-STORM session held the gateway API key, once per agent role, for as long as the file was kept.

None of these shows up as a red line in a log. Each shows up, at best, as an article with fewer sources or an expert who said something odd. The last post ended on whether citation accuracy is a model problem or a pipeline problem. Reading this code, I found pipeline problems that no model would ever see.

## what came out

After the fixes, I cut what kvasir didn't use. Eleven retrievers became one, SearXNG; nine of the ten removed needed a paid credential. Plain STORM had loaded a local `sentence-transformers` model, so `torch` and the HuggingFace weights shipped in the image; embeddings now go through the gateway like everything else. The lockfile went from 114 packages to 77.

I also moved the fork from dspy 2.4.9 to 3.3.0. Upstream parsed structure out of prose with regexes, picking numbered lists of personas and `"Best placement: [1]"` out of whatever the model wrote, with an `"Undefined"` path for when it phrased things differently. In dspy 3 each output field declares its type and the adapter parses it, so that whole class of quiet misparse went with the regexes.

It runs on [[projects/futhark]], the Talos cluster from [an earlier post](/blog/from-compose-to-talos). That post ended on whether one machine I run is safer than a service I don't. Here I picked my own machine again, for privacy this time, and the session-file key is a reminder of what that costs: I now own every secret the code decides to write down.

As I write this, nothing is running: I'm restructuring the homelab, and kvasir comes back when the cluster does.

## looking back

I found the bugs above partly by reading the code and partly from runs that came out wrong. The ones I found by reading had never shown up in a run as anything but a slightly worse article, which makes me wonder what's still in there. The fixes are pinned by tests, and a rebase that reverts one fails loudly, but the tests only cover what I already knew to look for.

How many failures of this kind are still in the fork, writing slightly worse articles without a trace? And how would I find the next one, when its only symptom is an article that reads fine?
