import { Facet } from "@codemirror/state"
import { EditorView, Decoration, ViewPlugin } from "@codemirror/view"
import { RangeSetBuilder } from "@codemirror/rangeset"

const stripe = Decoration.line({
  attributes: { class: "cm-zebraStripe" }
})

function stripeDeco(view) {
  let step = view.state.facet(stepSize)
  let builder = new RangeSetBuilder()
  for (let { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      let line = view.state.doc.lineAt(pos)
      if (line.number % step == 0) builder.add(line.from, line.from, stripe)
      pos = line.to + 1
    }
  }
  return builder.finish()
}

const showStripes = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = stripeDeco(view)
    }

    update(update) {
      if (update.docChanged || update.viewportChanged)
        this.decorations = stripeDeco(update.view)
    }
  },
  {
    decorations: v => v.decorations
  }
)

const stepSize = Facet.define({
  combine: values => (values.length ? Math.min(...values) : 2)
})

const baseTheme = EditorView.baseTheme({
  "&light .cm-zebraStripe": { backgroundColor: "#f5f5f5" },
  "&dark .cm-zebraStripe": { backgroundColor: "#1a2727" }
})

export default function zebraStripes(options = {}) {
  return [
    baseTheme,
    options.step == null ? [] : stepSize.of(options.step),
    showStripes
  ]
}
