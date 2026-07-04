---
title: GenAI-GDELT
subtitle: Data pipeline, dataset, and companion site for the generative-AI governance framing study
abstract: |
  End-to-end data-science pipeline that mines GDELT 2.0 via BigQuery, scores ~1.1M
  multilingual articles across six governance frames with a LaBSE-validated matcher,
  and ships the dataset plus an interactive companion site.
status: completed
kind: research
date: 2026-06
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
---

The engineering side of the [[publications/genai-gdelt]] study: a reproducible
data-science pipeline that extracts generative-AI governance coverage from GDELT
2.0 via BigQuery, applies a two-stage multilingual matcher (keyword pass + LaBSE
embedding validation), and scores each article across six governance frames.

The project ships three artifacts — the code, a Hugging Face dataset of ~1.1M
scored articles, and a deployed companion site that visualizes the frame trends
and the policy-milestone event study.
