---
name: blog-figures
description: Draw figures, diagrams, and charts for blog posts as hand-written inline SVG that follows the site's palette and dark mode, with a clean but scribbly look. Use whenever a blog post (content/blog/) needs a figure, or to fix or review one.
---

# blog-figures

Figures are hand-written SVG files, inlined into the page at build time so they pick up the current palette (paper, riso, amber, moss) and light/dark theme. You never pick a colour; you pick a role.

## When to draw

Draw only when the picture shows what prose can't: the shape of a system, a change over time, a before/after, where something sits relative to something else. If the figure would restate a sentence, don't draw it. One or two figures per post is typical; zero is fine.

## File and embed

- File: `content/blog/<slug>/<name>.svg`, `<name>` matching `[\w-]+`.
- Embed on its own line in the post:

  ```markdown
  ![The queue only drains when both workers are idle.](queue.svg)
  ```

- The alt text becomes the caption. Write it as a sentence that tells the reader what to notice, not "Diagram of X".
- An image inside a sentence is dropped. The build fails if the file is missing or the name isn't a bare `name.svg`.

## Cover

Optional `cover: cover.svg` in the post frontmatter. It shows as the thumbnail on `/blog`, under the post title, and in the post's OG image (`/blog/<slug>/og.png`, dark paper palette, JetBrains Mono).

- Canvas `viewBox="0 0 640 336"` (OG ratio). Same rules as any figure; prefix ids `<slug>-cover-`.
- It must read as a thumbnail at ~190px wide: few boxes, few labels, one `hl`. Draw the post's point, not its whole story.
- Don't also embed it in the body.
- Projects take the same `cover: cover.svg` (in `content/projects/<slug>/`), shown on project cards and the project page. Projects without one fall back to their `thumbnail:` image.

## Canvas rules

- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 H" role="img" aria-label="...">`. No `width`/`height`; CSS scales it to the column.
- No `<script>`, no `on*` attributes, no `<foreignObject>`, no external `href`, no `<style>` blocks, no `fill="#..."`/`stroke="#..."`. Colour comes from classes only.
- `id`s are global to the page. Prefix every `id` with `<slug>-<name>-` (markers, patterns, gradients).
- The root already sets `fill: none`, round caps/joins, stroke width 1.75. Override `stroke-width` per element only for emphasis (2.5) or hairlines (1).

## Classes (defined in `src/routes/layout.css`)

| Class | On shapes | On `<text>` |
|---|---|---|
| `ink` | stroke = foreground | (default text colour) |
| `dim` | stroke = muted | muted text |
| `hl` | stroke = accent | accent text |
| `paper` | fill = page background (to mask lines behind a label) | |
| `fill-ink` | 12% foreground tint | |
| `fill-hl` | 18% accent tint | |

Combine: `class="hl fill-hl"`.

## Style: clean but scribbly

- Draw paths yourself rather than using `<rect>`: let corners miss by 1–3 units and edges tilt slightly (`M22 62 L132 60 L134 118 L20 120 Z`). That reads as pen on paper without looking broken. No SVG filters for jitter: `feDisplacementMap` leaves 1px stair-steps on straight edges.
- Arrows: open chevron markers, not filled triangles. Curved arrows (`C` curves) for "goes back to" or annotations; straight for flow.
- Dashed `dim` strokes (`stroke-dasharray="5 6"`) for implied, optional, or "later" paths.
- Hatching for "this region matters" or "unknown": a `<pattern>` of diagonal `dim` lines.
- One accent (`hl`) per figure, on the thing the caption talks about.
- Labels: lowercase, short (1–3 words), `text-anchor="middle"` inside shapes. Longer explanation goes in the caption or the prose.
- Annotations: small `dim` text with a curved leader line to its target, like a margin note.

## Readability on phones

The figure scales with the column: at 360px wide a 640-unit canvas renders at about half size, so 13-unit text becomes ~7px.

- At most four boxes in a row. Stack vertically past that.
- Primary labels: `font-size="16"` or larger. Annotations no smaller than 13.
- Text-heavy figures: use a narrower canvas (`viewBox="0 0 480 H"`) so text scales down less.

## Snippets

Arrow marker (put in `<defs>`, reference with `marker-end`):

```svg
<marker id="SLUG-NAME-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
  <path class="ink" d="M1 1 L8 5 L1 9" />
</marker>
```

Hand-drawn box with label:

```svg
<g>
  <path class="ink" d="M182 61 L292 63 L290 119 L180 117 Z" />
</g>
<text x="236" y="95" text-anchor="middle" font-size="16">draft</text>
```

Annotation with curved leader:

```svg
<g>
  <path class="dim" d="M420 30 C 440 40, 450 50, 446 58" marker-end="url(#SLUG-NAME-tip)" />
</g>
<text x="410" y="26" text-anchor="end" class="dim">you are here</text>
```

Hatch pattern:

```svg
<pattern id="SLUG-NAME-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <path class="dim" d="M0 0 L0 8" stroke-width="1" />
</pattern>
<!-- use: <path class="ink" fill="url(#SLUG-NAME-hatch)" d="..." /> (a url() fill is fine; it holds no colour) -->
```

Line chart (axes in `dim`, the series that matters in `hl`, others `ink`):

```svg
<g>
  <path class="dim" d="M60 20 L60 220 L620 220" />
  <path class="ink" d="M60 200 C 200 190, 320 120, 620 110" />
  <path class="hl" stroke-width="2.5" d="M60 205 C 220 200, 300 60, 620 40" />
</g>
<text x="625" y="44" class="hl">after</text>
<text x="625" y="114">before</text>
```

Plot real data by computing coordinates (a short script is fine), never by eyeballing a curve that claims to be data. Hand-drawn curves are for illustrating a shape, and the caption should say so.

## Reference

`content/blog/hello-world/loop.svg` uses all of the above.

## Verify

1. `pnpm build`. A missing or misnamed figure fails here.
2. Screenshot the post in light and dark mode and one other palette, at desktop width and at 360px (headless chromium against the built site; theme and palette come from the `portfolio-theme` and `portfolio-palette` localStorage keys).
3. Check: colours follow the palette, nothing invisible in dark mode, labels readable at 360px, no overlap.
