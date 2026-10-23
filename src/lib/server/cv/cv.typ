// CV layout after Jake Gutierrez's resume template (MIT). All text fields in
// `data` are Typst markup produced by `toTypst()`; see resolve.ts for the shape.
#let data = json(bytes(sys.inputs.data))
#let md(s) = eval(s, mode: "markup")

#set document(title: data.name + " - CV", author: data.name, date: none)
#set page(paper: "a4", margin: (x: 0.5in, top: 0.45in, bottom: 0.4in))
#set text(font: "New Computer Modern", size: 10pt, lang: "en")
#set par(leading: 0.5em, spacing: 0.5em)
#set list(indent: 12pt, body-indent: 1.5pt, spacing: 0.65em, marker: move(dy: -0.4pt, text(size: 11pt)[•]))
#show link: underline.with(offset: 1.8pt)

#let section(title) = {
  v(12pt, weak: true)
  block(width: 100%, stroke: (bottom: 0.4pt), inset: (bottom: 3pt), text(size: 12pt, smallcaps(title)))
  v(6pt, weak: true)
}

#let entry(e) = {
  // One-line (project) headings are \small in Jake's template.
  let head = if e.bl == none { 9pt } else { 10pt }
  pad(left: 0.15in, {
    grid(
      columns: (1fr, auto),
      align: (left, right),
      row-gutter: 0.5em,
      text(size: head, md(e.tl)), text(size: head, md(e.tr)),
      ..if e.bl != none { (text(size: 9pt, emph(md(e.bl))), text(size: 9pt, emph(md(e.br)))) } else { () },
    )
    if e.bullets.len() > 0 {
      v(0.5em, weak: true)
      set text(size: 9pt)
      list(..e.bullets.map(md))
    }
  })
  v(7pt, weak: true)
}

#align(center, {
  text(size: 24.88pt, smallcaps(data.name))
  v(10pt, weak: true)
  set text(size: 9pt)
  set par(leading: 0.75em)
  data.contact.map(line => line.map(md).join[ | ]).join(linebreak())
})
#v(4pt)

#for s in data.sections {
  section(s.title)
  for e in s.entries { entry(e) }
}

#section("Skills")
#pad(left: 0.15in, text(size: 9pt, data.skills.map(g => [#strong(md(g.label)): #md(g.items)]).join(linebreak())))
