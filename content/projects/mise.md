---
title: mise.ai
subtitle: AI-powered restaurant analytics platform
abstract: |
  An AI-powered restaurant analytics platform that helps reduce food waste, optimize ordering, and make data-driven decisions through ML predictions, LLM-powered insights, and interactive dashboards.
status: completed
featured: false
date:
  - 2025-09
  - 2025-11
duration: ~2 months
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

The project demonstrates end-to-end software architecture design; from domain modeling and API contracts through distributed async processing and cloud-native deployment.
