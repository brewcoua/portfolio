---
title: mise.ai
subtitle: "Restaurant analytics to cut food waste"
abstract: "Team project for TU Delft's Software Architecture course: a restaurant analytics platform that predicts waste and suggests orders with Random Forest models, turns results into insights with an LLM, and scales its ML workers on Kubernetes by queue depth."
tldr: |
  - Team project for CS4505 Software Architecture at TU Delft.
  - Random Forest models predict wastage and per-item orders; an LLM (OpenAI, with Vertex AI as fallback) turns the results into insights.
  - Jobs run asynchronously over RabbitMQ, and KEDA scales the ML and LLM workers from 0 to 10 replicas on queue depth.
status: completed
kind: coursework
complexity: 3
value: 3
date:
  - 2025-09
  - 2025-11
duration: 2 months
cover: cover.svg
role: "[[roles/fullstack-developer]]"
tech:
  - "[[technologies/react]]"
  - "[[technologies/typescript]]"
  - "[[technologies/python]]"
  - "[[technologies/fastapi]]"
  - "[[technologies/postgresql]]"
  - "[[technologies/rabbitmq]]"
  - "[[technologies/redis]]"
  - "[[technologies/docker]]"
  - "[[technologies/kubernetes]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/ai-engineering]]"
  - "[[skills/api-development]]"
  - "[[skills/cloud-computing]]"
  - "[[skills/web-development]]"
related:
  - "[[education/tud-msc-cs]]"
links:
  - type: github
    url: https://github.com/batman004/mise.ai
  - type: demo
    url: https://miseaifood.lovable.app
highlights:
  - Designed microservices architecture with separate core and ML servers
  - Built async prediction/LLM pipelines with RabbitMQ workers and Redis result caching
  - Deployed on Kubernetes with KEDA queue-based auto-scaling (0–10 replicas)
  - Implemented Random Forest models for wastage and per-item order recommendations
  - Integrated dual-provider LLM stack (OpenAI primary, Vertex AI regional fallback)
  - Delivered interactive dashboards with drag-and-drop data ingestion (CSV/Excel/OCR)
cv:
  context: "TU Delft team project"
  stack: ["Python", "FastAPI", "React", "Kubernetes"]
  bullets:
    - "Built an AI restaurant-analytics platform as **microservices**: React frontend, FastAPI core over REST with PostgreSQL, and a separate ML/LLM server fed by **RabbitMQ** task queues with Redis result passing."
    - "Wrote the **Kubernetes** deployment with **KEDA autoscaling ML and LLM workers from 0 to 10 replicas** on queue depth; integrated the async prediction and LLM insight pipelines."
---

mise.ai is a restaurant analytics platform developed as a team project for **CS4505 Software Architecture** during my [[education/tud-msc-cs|M.Sc. in Computer Science at TU Delft]]. The system helps restaurants reduce food waste, optimize ordering, and make data-driven decisions.

1. **Product & architecture**
   - React frontend communicates with a FastAPI core server over REST
   - Core server persists data in PostgreSQL and delegates ML/LLM work to a dedicated ML server
   - Async tasks (predictions, insight generation) are enqueued via RabbitMQ
   - Workers process jobs and write results back through Redis and result queues
   - Kubernetes deployment with KEDA auto-scales ML and LLM workers from 0–10 replicas based on queue depth

2. **Key features**
   - Interactive dashboards with sales metrics, wastage analysis, and weather impact charts
   - Drag-and-drop CSV/Excel/image (OCR) data ingestion with duplicate detection
   - Random Forest models for food wastage and per-item order quantity predictions
   - LLM-powered natural-language Q&A and auto-generated insight reports
   - Asynchronous PDF report generation and email delivery

3. **Team contribution**
   - Full-stack development across the React/TypeScript frontend and FastAPI backend services
   - Service integration for async prediction and LLM pipelines
   - Kubernetes deployment configuration and microservices orchestration
