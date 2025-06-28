import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

/**
 * TipTap extension that adds handle decorations to table rows.
 * Similar to the ProseMirror rowNumberPlugin but adds drag handles instead of numbers.
 * Handles are displayed as widget decorations that don't affect the document model.
 */
export const RowHandlePlugin = Extension.create({
  name: 'rowHandlePlugin',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('row-handle-plugin'),
        
        props: {
          decorations(state) {
            const { doc } = state
            const decorations: Decoration[] = []
            let rowIndex = 0 // will hold the current row number within a table

            // Iterate through all nodes in the document
            doc.nodesBetween(0, doc.nodeSize - 2, (node, pos) => {
              if (node.type.name === "tableRow") {
                // Start counting at 0 for each new table (will increment to 1 on first row)
                rowIndex = 0
              }
              if (node.type.name === "tableRow") {
                rowIndex++
                // Create a handle element for this row
                const handleElement = document.createElement("td")
                handleElement.className = "row-handle-cell"
                handleElement.contentEditable = "false" // make the cell non-editable
                handleElement.style.cssText = `
                  width: 30px;
                  height: 28px;
                  padding: 3px 5px;
                  background-color: #f8f9fa;
                  border: 1px solid #dee2e6;
                  cursor: grab;
                  user-select: none;
                  text-align: center;
                  vertical-align: middle;
                `
                
                // Add the handle icon/content
                const handleIcon = document.createElement("span")
                handleIcon.textContent = "⋮⋮" // vertical dots as handle
                handleIcon.classList.add('draggable-table-row');
                handleIcon.style.cssText = `
                  font-size: 12px;
                  color: #6c757d;
                  line-height: 1;
                `
                handleElement.appendChild(handleIcon)

                // Place the widget at the beginning of the row's content
                // `pos` is the position where the <tr> node starts in the document.
                // We anchor at pos+1 (right inside the <tr>, before any cell content).
                const widget = Decoration.widget(pos + 1, handleElement, {
                  side: -1, // insert on the left side of the anchor (before any cells at this position)
                  ignoreSelection: true, // ignore mouse/selection events on this decoration
                })
                decorations.push(widget)
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})