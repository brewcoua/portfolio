# Contributing & Development

This document covers the technical details of the codebase for contributors and anyone making deeper customisations.

## Repository

Canonical repo: **[Codeberg — brewcoua/portfolio](https://codeberg.org/brewcoua/portfolio)**. A [GitHub mirror](https://github.com/brewcoua/portfolio) exists mainly for GitHub Actions CI.

## Dev commands

```sh
just setup            # pnpm install + enable the pre-commit hook (.githooks/)
just dev              # local dev server
just build            # static output → build/ (includes the CV PDFs)
just preview          # serve the production build locally
just check            # svelte-check + Vitest; what the pre-commit hook runs
just cv prosus        # build, then copy a CV variant to out/prosus.pdf
```

The recipes wrap the `pnpm` scripts in `package.json`; `mise install` provides node, pnpm and just.

## Content structure

All content lives in `content/` as Markdown files with YAML frontmatter (plus `site.yaml`), loaded at build time. The main files and directories:

| Path | What it controls |
|---|---|
| `content/profile.md` | Name, headline, location, links; body is the summary |
| `content/site.yaml` | Site name, base URL, SEO defaults, CV PDF URL, nav |
| `content/projects/` | One `.md` per project |
| `content/experience/` | One `.md` per job/internship |
| `content/education/` | One `.md` per degree |
| `content/technologies/` | Technology entries referenced by projects |
| `content/skills/` | Skill entries |
| `content/roles/` | Role tags used on the profile |
| `content/cv/` | CV variants: entry order, skills groups, overrides |

Relationships between entries (e.g. project ↔ technology ↔ experience) are validated at build time.

Project description fields support Markdown (processed via `src/lib/server/markdown/`).

**Education** (`content/education/`): Optional `grade` — exactly one of:

- `grade: { fraction: "14/20" }` or `"3.9/4.0"` style `N/Nmax`
- `grade: { honors: high-honors }` — key must match the allowed honors list (`high-honors`, `cum-laude`, `summa-cum-laude`, …)
- `grade: { label: "Custom honours text" }` if not covered above

Separate from `highlights`: `activities` and `societies` are string lists with the same inline Markdown as bullets elsewhere. Nested `subEducation` entries support `grade`, `activities`, and `societies` too.

## CV

`content/site.yaml` → `cvUrl` points at `/cv.pdf`, which is built from content (`src/routes/cv.pdf/+server.ts`, prerendered).

- **Per-entry text:** projects, experience and education take an optional `cv:` block. `bullets` use `**bold**` and `[text](url)`; `title`, `org`, `date`, `location`, `context`, `stack`, `link`, `linkNote` override what is derived from the entry. Experience bullets default to its `details` (the short list on the site); the Markdown body is the longer write-up on its page.
- **Variants:** `content/cv/main.yaml` sets the header, the `[[folder/slug]]` order of `education`, `experience` and `projects`, and the `skills` groups (items are `[[technologies/x]]` or plain strings). Spoken languages come from `profile.md`. Another file, e.g. `content/cv/acme.yaml`, can `extends: main`, replace any of those lists, and add `overrides` keyed by `[[folder/slug]]` with a partial `cv:` block. It is served at `/cv/acme.pdf` (disallowed in `robots.txt`).
- **Tailoring:** the resume skills in `.agents/skills/` (from Paramchoudhary/ResumeSkills, locked in `skills-lock.json`) help with that: run `job-description-analyzer` on the posting, then `resume-tailor` / `resume-bullet-writer` to draft the variant, and `just cv acme` to review the PDF (keep it to one page).

## Deployment notes

`pnpm build` produces a fully static site in `build/`. Any host that serves static files works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, etc.

Set `baseUrl` in `content/site.yaml` to match your production domain — this is used for canonical URLs and Open Graph tags.
