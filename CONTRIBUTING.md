# Contributing & Development

This document covers the technical details of the codebase for contributors and anyone making deeper customisations.

## Repository

Canonical repo: **[Codeberg — brewcoua/portfolio](https://codeberg.org/brewcoua/portfolio)**. A [GitHub mirror](https://github.com/brewcoua/portfolio) exists mainly for GitHub Actions CI.

## Dev commands

```sh
pnpm install
pnpm dev              # local dev server
pnpm build            # static output → build/
pnpm preview          # serve the production build locally
pnpm check            # TypeScript + Svelte diagnostics
pnpm run test:unit    # Vitest unit tests
```

## Content structure

All content lives in `content/` as YAML files, loaded at build time. The main files and directories:

| Path | What it controls |
|---|---|
| `content/profile.yaml` | Name, headline, location, summary, links |
| `content/site.yaml` | Site name, base URL, SEO defaults, CV PDF URL, nav |
| `content/projects/` | One `.yaml` per project |
| `content/experience/` | One `.yaml` per job/internship |
| `content/education/` | One `.yaml` per degree |
| `content/technologies/` | Technology entries referenced by projects |
| `content/skills/` | Skill entries |
| `content/roles/` | Role tags used on the profile |

Relationships between entries (e.g. project ↔ technology ↔ experience) are validated at build time.

Project description fields support Markdown (processed via `src/lib/server/markdown/`).

## CV link

`content/site.yaml` → `cv.cvPdfUrl` should point to the latest PDF. The default setup uses a GitHub release asset from a separate CV repo (`brewcoua/cv`) so the PDF can be updated independently of the site.

## Deployment notes

`pnpm build` produces a fully static site in `build/`. Any host that serves static files works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, etc.

Set `baseUrl` in `content/site.yaml` to match your production domain — this is used for canonical URLs and Open Graph tags.
