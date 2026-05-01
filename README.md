# brewcoua/portfolio

Personal portfolio site — live at **[brewen.dev](https://brewen.dev)**.

Built with SvelteKit (static output), Tailwind CSS, and shadcn-svelte. All content — projects, experience, education, skills — lives in YAML files under `content/`. No backend, no CMS, no database.

> Want to use this as a template? See [**Fork & Deploy**](#fork--deploy) below.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit + Vite (`adapter-static`) |
| Styling | Tailwind CSS + shadcn-svelte (bits-ui) |
| Content | YAML files, loaded at build time |
| Hosting | Any static host (GitHub Pages, Netlify, Vercel, S3…) |

## Fork & Deploy

1. **Fork** this repo and clone it locally.
2. **Edit content** — all your data lives in `content/`:
   - `content/profile.yaml` — name, headline, links
   - `content/site.yaml` — site name, base URL, CV PDF link
   - `content/projects/`, `content/experience/`, `content/education/` — one YAML file per entry
3. **Install and build:**
   ```sh
   pnpm install
   pnpm build        # outputs to build/
   ```
4. **Deploy** the `build/` folder to any static host.

That's it. For deeper customisation (adding fields, changing layouts, running tests), see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Licensed under either of the following, at your option:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this project by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.