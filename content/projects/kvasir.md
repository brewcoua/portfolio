---
title: Kvasir
subtitle: Self-hosted STORM and Co-STORM research API
abstract: |
  A self-hostable HTTP service for Stanford STORM and Co-STORM that turns a topic into a cited, Wikipedia-style article or runs an interactive research round table, with an Open WebUI client.
status: active
kind: personal
complexity: 4
value: 4
date:
  - 2026-08
  - present
cover: cover.svg
role: "[[roles/solo-developer]]"
tech:
  - "[[technologies/python]]"
  - "[[technologies/fastapi]]"
  - "[[technologies/dspy]]"
  - "[[technologies/llm]]"
  - "[[technologies/searxng]]"
  - "[[technologies/open-webui]]"
  - "[[technologies/docker]]"
skills:
  - "[[skills/ai-engineering]]"
  - "[[skills/api-development]]"
  - "[[skills/software-architecture]]"
related:
  - "[[projects/futhark]]"
links:
  - type: github
    url: https://github.com/brewcoua/kvasir
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
highlights:
  - Vendored and forked knowledge_storm, porting it to dspy 3.3.0 with typed signatures in place of regex-parsed prose
  - Built a FastAPI service streaming research progress over SSE, with a run registry tracking stage timings and token cost per role and model
  - Stored Co-STORM sessions as atomically written JSON files, with no database, cache or queue
  - Shipped a hardened image (read-only root, non-root user, digest pinning, no moving latest tag) released with release-please
  - Wrote an Open WebUI pipe that streams runs into chat and routes title and tag generation off the research slot
---

[STORM](https://github.com/stanford-oval/storm) turns a topic into a Wikipedia-style article with
citations by simulating multi-perspective research conversations. Co-STORM is its interactive
sibling: a turn-based round table between you and several agents that builds a shared mind map.

Upstream ships a Python library and a Streamlit demo, but no server and no container image.
Kvasir supplies the missing middle:

1. **API service**
   - `POST /v1/research` streams a run through its research, outline, article and polish stages
   - Co-STORM sessions keyed by the client's own conversation id
   - Returns 429 on saturation rather than queueing runs that would outlast any client timeout

2. **Observability**
   - A self-contained runs page showing what is running, stage timings and spend
   - Structured JSON logs carrying `run_id` and `stage`, even from inside thread pools

3. **Open WebUI pipe**
   - Exposes STORM and Co-STORM as two models, with sources turned into citations

All model traffic goes through an OpenAI-compatible gateway and search through a self-hosted
SearXNG instance, so no paid search credential is needed. It runs on my
[[projects/futhark|Talos cluster]].

The vendored `knowledge_storm` is modified rather than depended on; the repository's
[fork notes](https://github.com/brewcoua/kvasir/blob/master/docs/fork-notes.md) record every
divergence and why.
