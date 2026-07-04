---
title: Yuyabre
subtitle: AI flatmate agent for shared living
abstract: |
  An AI-powered "smart roommate" built in 24 hours at the Prosus AI Hackathon 2025. It handles natural-language commands, tracks pantry inventory, coordinates group grocery orders, and logs shared expenses to Splitwise, all through a chat interface backed by a tool-calling LLM agent.
status: completed
kind: hackathon
featured: false
date: 2025-11
duration: 24 hours
role: "[[roles/fullstack-developer]]"
tech:
  - "[[technologies/python]]"
  - "[[technologies/fastapi]]"
  - "[[technologies/react]]"
  - "[[technologies/typescript]]"
  - "[[technologies/mongodb]]"
  - "[[technologies/docker]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/ai-engineering]]"
  - "[[skills/api-development]]"
  - "[[skills/web-development]]"
links:
  - type: github
    url: https://github.com/Yuyabre/Yuyabre
highlights:
  - Built a full-stack AI agent platform in 24 hours at Prosus AI Hackathon 2025
  - Designed a tool-calling LLM architecture with ~15 domain-specific tools
  - Implemented real-time agent streaming via WebSocket in the React chat UI
  - Integrated Splitwise OAuth, Discord webhooks, and Twilio WhatsApp for household coordination
  - Built shared and per-user inventory with async caching and MongoDB persistence
  - Shipped Docker Compose deployment and a standalone Rich CLI demo mode
---

Yuyabre is a prototype AI roommate for shared flats, built with a friend during the **Prosus AI Hackathon 2025** in 24 hours. Users interact with a chat interface to manage household life through natural language.

1. **LLM agent**
   - `POST /agent/command` for synchronous replies; `WS /agent/command/stream` for streamed tokens in the React UI
   - Tool-calling architecture: the model can invoke ~15 backend tools covering inventory, orders, housemate coordination, Splitwise, Discord, and WhatsApp
   - Tools include inventory snapshots, low-stock checks, grocery order placement, group-order coordination with housemate responses, and expense logging

2. **Household features**
   - Per-user and shared inventory with categories, thresholds, expiration dates, and restock alerts
   - Grocery ordering bridge (Thuisbezorgd-oriented, mocked for demo) with order history and simulated delivery ETA
   - Splitwise OAuth integration for automatic shared-expense logging after group orders
   - Discord webhook for group-order notifications and yes/no response polling; Twilio WhatsApp as fallback

3. **Tech stack**
   - FastAPI backend with Beanie/MongoDB; async LRU cache with write-through invalidation
   - React + Vite frontend with TanStack Query, markdown rendering, and PWA support
   - Docker Compose for local deployment (API + MongoDB + Mongo Express)
   - Interactive Rich CLI for agent demos without a browser
