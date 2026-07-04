---
title: "Framing Generative AI Governance in Online News"
subtitle: A timeline analysis from ChatGPT's launch to the EU AI Act (2022–2026)
authors:
  - Brewen Couaran
  - Yuvraj Singh Pathania
  - Arjun Rajesh Nair
abstract: |
  A framing analysis of how online news shaped public understanding of
  generative-AI governance from ChatGPT's November 2022 launch through June 2026,
  tracking six governance frames across over 1.1M multilingual articles.
venue: Web Science & Engineering, TU Delft
kind: coursework
date: 2026-06
links:
  - type: paper
    url: https://github.com/brewcoua/GenAI-GDELT/raw/master/paper/paper.pdf
    label: Paper (PDF)
  - type: github
    url: https://github.com/brewcoua/GenAI-GDELT
  - type: live
    url: https://brewcoua.github.io/GenAI-GDELT/
    label: Companion Site
  - type: package
    url: https://huggingface.co/datasets/brewcoua/genai-gdelt-framing
    label: Dataset
tech:
  - "[[technologies/python]]"
  - "[[technologies/bigquery]]"
  - "[[technologies/gcp]]"
  - "[[technologies/jupyter]]"
  - "[[technologies/pandas]]"
  - "[[technologies/pytorch]]"
  - "[[technologies/huggingface]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/data-science]]"
  - "[[skills/ai-engineering]]"
related:
  - "[[projects/genai-gdelt]]"
highlights:
  - Two-stage framing pipeline — multilingual keyword matching validated by LaBSE sentence embeddings
  - 1,116,091 articles from GDELT 2.0 across 100+ languages
  - Innovation framing peaked at 13.1% (Feb 2023), then Risk & Safety rose above 20% by 2024
  - Media response to governance events was asymmetric — summits reduced risk coverage, civil-society warnings increased it
  - Regional divergence — US outlets emphasized regulation alongside innovation; EU outlets highlighted risk
---

This study examines how online news shaped public understanding of generative-AI
governance in the four years following the public launch of ChatGPT. Using the
GDELT 2.0 Global Knowledge Graph as the article source, a two-stage method first
performs multilingual keyword matching and then validates candidate matches with
LaBSE sentence embeddings, yielding a corpus of 1,116,091 articles scored across
six governance frames: Innovation & Opportunity, Risk & Safety, Regulation &
Governance, Rights & Privacy, Economic Competition & Labour, and Misinformation &
Integrity.

The analysis reveals a clear discourse shift — from innovation-oriented framing in
2022–2023 toward risk- and regulation-focused framing in 2024–2026. An event study
of major policy milestones finds an asymmetric media response, and regional
comparison shows US and EU outlets emphasizing different frames.

The full pipeline, the scored dataset, and an interactive companion site are
released alongside the paper — see the companion project [[projects/genai-gdelt]]
for the code, dataset, and deployed site.
