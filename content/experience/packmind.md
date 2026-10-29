---
title: Developer Intern
organization: Packmind
organizationFormerly: Promyze
website: https://packmind.com
logo: /logos/packmind.jpg
location: Bordeaux, France (Hybrid)
employmentType: internship
date:
  - 2023-06
  - 2023-08
summary: Built code-review intelligence and repository integration capabilities.
tech:
  - "[[technologies/typescript]]"
  - "[[technologies/react]]"
  - "[[technologies/llm]]"
skills:
  - "[[skills/software-architecture]]"
  - "[[skills/software-testing]]"
details:
  - "Designed and shipped a **role-management system** (TypeScript + React) across four VCS platforms (GitHub, GitLab, Bitbucket, Azure DevOps), SaaS and self-hosted, unlocking enterprise integration tiers requested by customers."
  - "Reduced false-positive review requests by building a **Git diff aggregation engine** with a custom heuristic-weighting algorithm that filters whitespace and trivial refactors to surface high-signal code changes."
  - "Integrated OpenAI APIs on top of the diff engine to ship **one-click semantic code review** of any code segment."
---

Summer 2023 at Promyze (now Packmind), a Bordeaux startup whose product helps development teams write down their coding best practices and spot them in code. Until then it lived in the IDE and in a browser extension. My internship pushed it in three directions: roles for the people most invested in those practices, the repositories themselves, and reviews for the people leading the teams.

## Roles

Not everyone engages with best practices the same way. Some people want to do more: propose practices, discuss them, keep the catalogue in shape. I implemented the full role system that gives them that room, from the React interface down to the TypeScript backend and its permissions.

## Repository integrations

Promyze could only see code inside an editor or a browser tab. I added full integration with the four main platforms (GitHub, GitLab, Bitbucket and Azure DevOps) and their self-hosted editions, which enterprise customers needed before they could adopt it. Practices could now be detected on the code that actually lands in a repository.

## Reviews for team leads

Tech leads and other team leaders need to keep up with what their teams change, and bring it up in meetings without wading through every commit. I built recaps and reviews that show clear diffs, sorted by relevance. The relevance score is a weighted mix of ratios over each change, with outliers trimmed and known low-signal changes (whitespace, trivial refactors and the like) pushed down.

On top of that, OpenAI models add insight on a reviewed change and help turn it into a new best practice in one step.

![The relevance score sorts changes first and sinks whitespace and refactors; the model adds insight on top of that ranking, not instead of it.](review.svg)

## How we worked

The codebase followed a hexagonal (ports and adapters) architecture, and work was test-driven, with unit tests and automated test suites around each change.

## Looking back

It was my first time on a product team, shipping features that customers had asked for, under enterprise constraints like self-hosting. It was also mid-2023: the models of the time could summarise a diff and suggest a practice, but their insight was shallow and needed a human to check it, which is why the AI sat on top of the relevance algorithm rather than replacing it. Packmind has since moved to governing AI coding agents themselves, which says a lot about how fast that changed. A year later, the research internship at [[experience/labri|LaBRI]] gave me the other side of the picture.
