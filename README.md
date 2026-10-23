# brewcoua/portfolio

My portfolio and blog, live at **[brewen.dev](https://brewen.dev)**.

Everything on the site starts as a Markdown file in `content/`: projects, experience, education, publications, blog posts, and the skills and technologies that tie them together. SvelteKit reads those files at build time, checks every `[[wikilink]]` between them, and writes out static HTML. The relationship graph and the CV PDF come from the same files, so when I fix a date in one place it changes everywhere.

> Want to use this as a template? See [Fork and deploy](#fork-and-deploy).

## Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit + Vite, `adapter-static` |
| Styling | Tailwind CSS, bits-ui, JetBrains Mono, four palettes with light and dark modes (`src/routes/layout.css`) |
| Content | Markdown + YAML frontmatter, validated with zod (`src/lib/content/schema.ts`) |
| CV | Typst, compiled in-process at build time |
| Hosting | Any static host |

## Fork and deploy

1. Fork the repo and clone it.
2. Replace my content with yours in `content/`:
   - `content/profile.md`: name, headline, links; the body becomes the About summary
   - `content/site.yaml`: site name, base URL, SEO defaults, navigation
   - `content/projects/`, `content/experience/`, `content/education/`, `content/publications/`: one file per entry
   - `content/blog/`: one file per post
   - `content/cv/`: which entries the CV shows and in what order, plus tailored variants
3. Install and build:

   ```sh
   pnpm install
   pnpm build
   ```

   The site lands in `build/`. A broken wikilink or a frontmatter typo fails the build and names the file.
4. Upload `build/` to any static host.

With [just](https://just.systems) (pinned in `mise.toml`), `just setup` installs dependencies and the pre-commit hook, and `just --list` shows the other recipes. [CONTRIBUTING.md](CONTRIBUTING.md) covers the content format in detail, adding fields, and running tests.

## Blog

Posts live in `content/blog/<slug>.md` with a `title`, `summary`, and `date`. A post can mention projects and technologies with `[[wikilinks]]`, but posts stay out of the graph.

Figures are hand-written SVG files next to the post, in `content/blog/<slug>/`, embedded with `![caption](name.svg)`. The build inlines them into the page, so they follow the reader's palette and dark mode instead of carrying their own colours.

Two agent skills in `.agents/skills/` (linked from `.claude/skills/`) describe how I want posts written and drawn:

- `blog-writing`: voice, narrative shape, callbacks to earlier posts, ending on open questions, and an anti-slop pass adapted from [stop-slop](https://github.com/hardikpandya/stop-slop).
- `blog-figures`: the SVG conventions, class names, and how to check a figure in every theme.

## CV

A [Typst](https://typst.app) template (`src/lib/server/cv/cv.typ`) renders `content/cv/main.yaml` to `/cv.pdf`. It compiles in-process through `@myriaddreamin/typst-ts-node-compiler`, so you don't need Typst installed. Tailored variants in `content/cv/<name>.yaml` render to `/cv/<name>.pdf` and aren't linked from the site. `just cv <name>` copies one to `out/`.

## License

Licensed under either of the following, at your option:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this project by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
