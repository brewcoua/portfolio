---
title: GenAI-GDELT
subtitle: "Pipeline and dataset behind a study of how news frames generative-AI governance"
abstract: "Pulls generative-AI governance coverage out of GDELT 2.0 with BigQuery, scores about 1.1M articles in 100+ languages across six governance frames, and publishes the dataset on Hugging Face with an interactive companion site."
tldr: |
  - About 1.1M news articles in 100+ languages, extracted from GDELT 2.0 through BigQuery.
  - A multilingual keyword pass, checked by LaBSE sentence embeddings, flags each article for six governance frames.
  - Ships the code, a Hugging Face dataset with the frame flags and embeddings, and a site showing the frame trends and policy event study.
status: completed
kind: research
complexity: 4
value: 5
date: 2026-06
cover: cover.svg
role: "[[roles/ai-engineer]]"
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
  - "[[publications/genai-gdelt]]"
links:
  - type: github
    url: https://github.com/brewcoua/GenAI-GDELT
  - type: live
    url: https://brewcoua.github.io/GenAI-GDELT/
    label: Companion Site
  - type: package
    url: https://huggingface.co/datasets/brewcoua/genai-gdelt-framing
    label: Dataset
highlights:
  - BigQuery extraction over GDELT 2.0 at 1.1M-article, 100+-language scale
  - Two-stage matcher — multilingual keywords validated by LaBSE sentence embeddings
  - Published dataset of scored articles (with frame flags & embeddings) on Hugging Face
  - Interactive companion site presenting the frame trends and event study
cv:
  context: "TU Delft research report"
  stack: ["Python", "BigQuery", "Hugging Face"]
  bullets:
    - "Built a pipeline mining GDELT 2.0 via BigQuery, scoring **1.1M articles in 100+ languages** across six governance frames with a keyword + LaBSE embedding matcher; released as a Hugging Face dataset."
---

The engineering side of the [[publications/genai-gdelt]] study: a reproducible
data-science pipeline that extracts generative-AI governance coverage from GDELT
2.0 via BigQuery, applies a two-stage multilingual matcher (keyword pass + LaBSE
embedding validation), and scores each article across six governance frames.

The project ships three artifacts — the code, a Hugging Face dataset of ~1.1M
scored articles, and a deployed companion site that visualizes the frame trends
and the policy-milestone event study.
