---
title: RevFlōw
subtitle: "Transaction categorisation and money coaching, built in 24 hours for Revolut"
abstract: "Built in 24 hours at HackDelft 2026 for the Revolut challenge. RevFlōw fixes vague merchant labels with keyword rules and a classifier on sentence embeddings, groups users by life stage, surfaces hidden subscriptions, and has Claude Haiku turn each insight into short advice with one-tap actions."
tldr: |
  - 24-hour build for Revolut's challenge at HackDelft 2026, with Team YUBRE.
  - 18 Dutch keyword rules, then a calibrated linear SVM on MiniLM embeddings across 12 categories: 75% accuracy on confident predictions, under 50 ms. Uncertain merchants fall back to Miscellaneous instead of a wrong label.
  - Isolation Forest surfaces hidden recurring costs, and Claude Haiku writes the advice.
status: completed
kind: hackathon
complexity: 4
value: 3
date: 2026-06
duration: 24 hours
thumbnail: /thumbnails/revflow.png
role: "[[roles/fullstack-developer]]"
tech:
  - "[[technologies/python]]"
  - "[[technologies/fastapi]]"
  - "[[technologies/scikit-learn]]"
  - "[[technologies/react]]"
  - "[[technologies/typescript]]"
  - "[[technologies/docker]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/ai-engineering]]"
  - "[[skills/api-development]]"
  - "[[skills/web-development]]"
related:
  - "[[education/tud-msc-cs]]"
links:
  - type: github
    url: https://github.com/brewcoua/RevFlow
  - type: demo
    url: https://revflow.brewen.dev
references:
  - dong2025transaction
  - aluffi2025categorising
  - desmoraes2024zero
  - fan2025enhancing
  - busson2023hierarchical
  - maree2021clustering
  - braithwaite2025spending
  - polleti2025open
  - capozzi2025flowseries
  - bakumenko2024advancing
  - park2024enhancing
  - maddanu2025anomaly
  - theerthala2025synthesizing
  - wang2026conv
  - nie2024survey
highlights:
  - Built a four-stage financial intelligence pipeline in 24 hours at HackDelft 2026 for the Revolut challenge
  - Designed a hybrid categoriser combining 18 Dutch keyword rules with CalibratedLinearSVC on MiniLM-L6 sentence embeddings across 12 categories
  - Achieved 75% ML accuracy and <50 ms inference with a confidence-gated fallback to prevent mislabelling
  - Implemented KMeans life-stage personalisation (Student, Family, Professional, Senior) with Bayesian re-weighting
  - Built a subscription forensic engine using Isolation Forest and cohort comparison to surface hidden recurring costs
  - Integrated Claude Haiku as an AI Money Coach generating concise per-insight advice with 1-tap action cards
cv:
  title: "RevFlow"
  context: "HackDelft 2026, Revolut challenge (24 h)"
  stack: ["Python", "FastAPI", "React", "scikit-learn"]
  bullets:
    - "Built a two-stage transaction categoriser (merchant rules, then a calibrated linear SVM on MiniLM sentence embeddings) reaching **75% accuracy on high-confidence predictions** with **under 50 ms** end-to-end inference."
    - "Added KMeans life-stage personalisation, six insight detectors (incl. Isolation Forest), and a Claude Haiku money coach."
---

RevFlōw is a financial intelligence platform built in 24 hours for the **Revolut challenge at HackDelft 2026** with Team YUBRE. It categorises Revolut transactions, personalises the results per user, and surfaces subscription and spending insights through a four-stage pipeline.

1. **Categorisation**
   - Keyword pre-pass with 18 Dutch merchant rules; a confidence of 1.0 short-circuits the ML stage
   - CalibratedLinearSVC trained on MiniLM-L6 384-d sentence embeddings plus one-hot features (entry method, merchant domain, amount) across 12 spending categories
   - 75% accuracy on high-confidence predictions (≥0.45); uncertain merchants fall back to Miscellaneous instead of a wrong label
   - Under 50 ms end-to-end inference latency

2. **Personalisation**
   - KMeans clustering segments users into four life-stage cohorts: Student, Family, Professional, Senior
   - Per-category spend share re-weights the global model probabilities (`P' ∝ P_global × f_user`) to fit each user's life stage
   - Every categorised transaction carries a human-readable explanation grounded in the user's history

3. **Subscription insight engine**
   - Six parallel detectors: 4-week z-score anomalies, CV and cadence subscription detection, new-merchant bursts, fraud flags (velocity, smurfing), cohort-versus-peers comparison, and Isolation Forest user profiling
   - Flags forgotten, overlapping, or creeping recurring charges before they add up
   - Emits structured insight objects (type, severity, metrics) that drive both the deterministic action cards and the AI coach

4. **AI money coach and command centre**
   - Insights feed Claude Haiku for concise two-sentence advice, with a supplier-agnostic self-hosted path in production
   - Deterministic action cards for one-tap interventions: spending limits, recurring-charge cancellation, analytics drills
   - Revolut-styled React command centre with a transaction timeline, monthly budget ring, live insight cards, and voice query input
   - Deployed to Railway; live at [revflow.brewen.dev](https://revflow.brewen.dev)
