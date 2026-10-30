---
title: Research Intern
organization: Laboratoire Bordelais de Recherche en Informatique
organizationShort: LaBRI
website: https://www.labri.fr
logo: /logos/labri.jpg
location: Bordeaux, France
employmentType: internship
date:
  - 2024-05
  - 2024-07
summary: "Built WebWisp, a GPT-4o agent that runs website tests from plain-language tasks, and web-som, the Set-of-Marks script it sees the page through."
tldr: |
  - The question: can a multimodal LLM carry out a website task written in plain language, so end-to-end tests stop breaking on every selector change?
  - Built WebWisp, a distributed agent, and web-som, which marks interactive elements on its screenshots [@yang2023set].
  - Shown at JFTL 2024, and scored 2–3 points above the then state of the art on VisualWebArena [@koh2024visualwebarena].
tech:
  - "[[technologies/react]]"
  - "[[technologies/nestjs]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/web-automation]]"
  - "[[skills/ai-engineering]]"
related:
  - "[[projects/webwisp]]"
details:
  - "Designed and built **WebWisp** ([github.com/brewcoua/webwisp](https://github.com/brewcoua/webwisp)), a distributed autonomous agent for end-to-end website testing: NestJS orchestrator dispatching tasks via **RabbitMQ** to scalable Playwright/Chromium workers driven by **GPT-4o**, with a React client for real-time task monitoring and a MongoDB + GCS persistence layer."
  - "Authored **web-som** ([github.com/brewcoua/web-som](https://github.com/brewcoua/web-som)), a Set-of-Marks grounding script using R-tree spatial indexing, Intersection Observer, and per-pixel OffscreenCanvas visibility scoring to annotate interactive DOM elements for multimodal LLMs, powering the agent's **Multimodal Chain-of-Thought** decision loop."
  - "Benchmarked on the VisualWebArena dataset, scoring **2–3 points above the then state-of-the-art**; collaborated with industry partner **Smartesting** on web grounding integration; prototype presented at **[JFTL 2024](https://cftl.fr/jftl-archives-2-2/jftl-2024/)**, the French software testing conference."
cv:
  org: "LaBRI (Laboratoire Bordelais de Recherche en Informatique), Progress team"
---

Two months in the Progress team (programming, networks and systems) at LaBRI, supervised by Xavier Blanc, then director of the lab. The question: can an agent driven by a multimodal LLM run a website task described in plain language, so end-to-end tests stop breaking every time a button's text or a CSS selector changes? Smartesting, a company building testing tools, followed the work and advised on the grounding side.

The timing helped: GPT-4o, OpenAI's first natively multimodal model, was announced on 13 May 2024, the day I started. A model that could read a screenshot as well as text, quickly and cheaply, made a vision-driven agent practical, and the scope grew from text-only experiments to a full distributed agent with visual grounding.

## The agent

[[projects/webwisp|WebWisp]] splits into an orchestrator and a pool of workers. The orchestrator is a NestJS server that publishes tasks to RabbitMQ, consumes the events workers send back, and serves a React client for launching tasks, running datasets and watching runs live. Users and tasks live in MongoDB; traces and screenshots go to a Google Cloud Storage bucket.

Each worker has four parts:

- **Mind** builds the prompt, calls GPT-4o, and parses the action it returns along with its reasoning.
- **Browser** drives Chromium through Playwright: clicks, typing, scrolling, and the screenshot after each action.
- **Execution** runs the cycle (observe, ask the Mind, act), caps the number of cycles, and catches obvious loops and hallucinations such as endless scrolling.
- **Evaluation** scores finished tasks with URL and HTML matchers (include, exclude, and a fuzzy match judged by a second model).

![Each worker loops observe, think, act until the task ends or Execution stops it; only then does Evaluation score the run.](cycle.svg)

## Grounding

Grounding (getting from "click the search button" to one specific element) was the main obstacle. I compared five approaches from the literature: element attributes, ranked textual choices (which needs a pretrained ranker such as DeBERTa [@he2020deberta]), image annotation, pixel coordinates, and the raw HTML or accessibility tree. I settled on image annotation with Set-of-Marks [@yang2023set]: every interactive element gets a coloured box and a label on the screenshot, and the model answers with a label.

![The model never names a selector: it reads the numbered boxes on the screenshot and answers with one. The striped box is an editable field.](marks.svg)

[web-som](https://github.com/brewcoua/web-som) is the script that draws those marks, injected before each screenshot:

1. **Collect candidates.** Elements that are interactive by definition (`button`, `a`, …) come from CSS selectors; elements that are only interactive by style (the cursor changes on hover) come from computed styles.
2. **Keep what is visible.** An Intersection Observer drops elements outside the viewport. A TreeWalker loads every visible element into an R-tree to find what overlaps each candidate, and stacking order decides what sits on top. Finally each candidate is drawn on an OffscreenCanvas with its covering elements over it, rounded corners and clip paths included, and anything under 60% visible is dropped.
3. **Untangle nesting.** For elements that are only interactive by style, a parent and child are kept apart only when they differ by more than 10% in size and position, and a parent with more than three such children is dropped.
4. **Draw the marks.** Box colours contrast with their surroundings, within lightness and saturation bounds. Labels are placed so they don't overlap, editable fields get a striped pattern, and the overlay ignores pointer events and uses its own tags so page styles can't leak in.

## Prompting

I compared few-shot [@brown2020language], Chain-of-Thought [@wei2022chain], Tree of Thoughts [@yao2023tree] and ReAct [@yao2022react] prompting, then used **Multimodal Chain-of-Thought** [@zhang2023multimodal]. Each step, the model gets the list of possible actions (click, type, scroll, select, …), the annotated screenshot, the page URL and title, and its previous actions. It writes out its reasoning before returning one or more valid actions.

## Looking back

It was my first research setting after a startup internship the year before, and a useful contrast. A month in, the prototype was shown at [JFTL 2024](https://cftl.fr/jftl-archives-2-2/jftl-2024/), the French software testing conference, in Paris on 11 June. The VisualWebArena [@koh2024visualwebarena] evaluation took longer than planned: the dataset is large and needed a lot of tuning. web-som would also gain from splitting element discovery from rendering. Both projects are open source.
