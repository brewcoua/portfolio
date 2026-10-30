---
title: WebWisp
subtitle: "A GPT-4o agent that runs website tests written in plain language"
abstract: "Built during my LaBRI internship: describe a website task in plain language and a GPT-4o agent carries it out in a real browser, reading screenshots annotated with Set-of-Marks. An orchestrator dispatches tasks over RabbitMQ to a pool of Playwright workers."
tldr: |
  - End-to-end tests written as plain-language tasks, so they stop breaking when a button's text or a CSS selector changes.
  - GPT-4o picks elements from numbered boxes that web-som draws on each screenshot [@yang2023set].
  - A NestJS orchestrator and scalable Playwright workers; scored 2–3 points above the then state of the art on VisualWebArena [@koh2024visualwebarena].
status: completed
kind: research
complexity: 4
value: 4
date:
  - 2024-05
  - 2024-07
cover: cover.svg
role: "[[roles/fullstack-developer]]"
tech:
  - "[[technologies/docker]]"
  - "[[technologies/nestjs]]"
  - "[[technologies/typescript]]"
  - "[[technologies/playwright]]"
  - "[[technologies/rabbitmq]]"
  - "[[technologies/mongodb]]"
  - "[[technologies/react]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/web-automation]]"
  - "[[skills/ai-engineering]]"
  - "[[skills/api-development]]"
  - "[[skills/authentication-security]]"
related:
  - "[[experience/labri]]"
links:
  - type: github
    url: https://github.com/brewcoua/webwisp
  - type: custom
    label: Set-of-Marks
    icon: circle-dot
    url: https://github.com/brewcoua/web-som
highlights:
  - Designed and implemented a distributed orchestrator-worker architecture
  - Built Docker-based deployment and configurable worker pools
  - Integrated RabbitMQ for reliable asynchronous task dispatch
  - Implemented browser automation and WebSOM-guided element targeting
  - Added secure JWT authentication and persistent storage integration
---

WebWisp is an autonomous web agent developed during my [[experience/labri|internship at LaBRI]].
It uses a distributed architecture for scalable web testing and automation:

1. **Orchestrator**
   - Dispatches tasks to worker pools
   - Exposes a monitoring interface for runs and outcomes
   - Handles authentication and user session control

2. **Workers**
   - Execute browser tasks reliably at scale
   - Support horizontal scaling across multiple containers
   - Use Playwright for deterministic browser automation
   - Integrate [WebSOM](https://github.com/brewcoua/web-som) for precise element grounding

3. **Message broker (RabbitMQ)**
   - Guarantees asynchronous communication between services
   - Decouples orchestration from execution for scalability

The system is containerized with Docker and includes JWT-based auth, persistent storage,
configurable worker pools, and LLM-assisted testing flows.

This implementation is informed by advances in in-context language modeling [@brown2020language]
and visual grounding for web interfaces [@yang2023set].

For how it was built (the worker internals, the grounding and prompting choices, and what was left unfinished), see the [[experience/labri|internship write-up]].
