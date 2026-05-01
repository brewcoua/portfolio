# @brewcoua/portfolio

Static personal site: fullstack / AI / grad-student work—projects, experience, education, CV link. No backend; content lives in YAML, site is SvelteKit with a static build.

## Repository

Canonical repo: **[Codeberg — brewcoua/portfolio](https://codeberg.org/brewcoua/portfolio)**. A [GitHub mirror](https://github.com/brewcoua/portfolio) exists mainly for GitHub Actions CI.

## Stack

- **SvelteKit** + **Vite**, **adapter-static** for deployable HTML/CSS/JS.
- **Tailwind CSS** + **shadcn-svelte** (bits-ui).
- **YAML** in `content/` loaded at build time; optional markdown in project fields (see `src/lib/server/markdown/`).

## Content

- Edit `content/**/*.yaml` — profile, site config, projects, experience, education, technologies, skills, roles.
- Relationships (project ↔ tech ↔ experience, etc.) enforced in build code; see [`SPECS.md`](SPECS.md) for intended shapes and rules.
- **CV**: `content/site.yaml` → `cv.cvPdfUrl` points at latest PDF (e.g. GitHub release asset from separate CV repo).

## Commands

```sh
pnpm install
pnpm dev              # local dev
pnpm build            # static output
pnpm preview          # serve production build
pnpm check            # type + Svelte check
pnpm run test:unit    # Vitest unit tests
```

## Deploy

Anything that serves static files from `build/` works (Pages, Netlify, S3, etc.). Set `baseUrl` in `content/site.yaml` to match production for SEO/Open Graph.
