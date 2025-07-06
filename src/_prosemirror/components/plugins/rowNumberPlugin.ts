import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

/**
 * Plugin that adds automatic row numbering to tables using widget decorations.
 * Numbers are displayed in a read-only first column that doesn't affect the document model.
 * Numbering restarts for each table in the document.
 */
export const rowNumberPlugin = new Plugin({
  props: {
    decorations(state) {
      const { doc } = state;
      const decorations: Decoration[] = [];
      let rowIndex = 0; // will hold the current row number within a table

      // Iterate through all nodes in the document
      doc.nodesBetween(0, doc.nodeSize - 2, (node, pos) => {
        if (node.type.name === "table") {
          // Start counting at 0 for each new table (will increment to 1 on first row)
          rowIndex = 0;
        }
        if (node.type.name === "table_row") {
          rowIndex++;
          // Create a read-only number cell for this row
          const numberCell = document.createElement("td");
          numberCell.textContent = String(rowIndex);
          numberCell.contentEditable = "false"; // make the cell non-editable
          numberCell.className = "row-number-cell"; // for styling

          // Place the widget at the beginning of the row's content
          // `pos` is the position where the <tr> node starts in the document.
          // We anchor at pos+1 (right inside the <tr>, before any cell content).
          const widget = Decoration.widget(pos + 1, numberCell, {
            side: -1, // insert on the left side of the anchor (before any cells at this position)
            ignoreSelection: true, // ignore mouse/selection events on this decoration
          });
          decorations.push(widget);
        }
      });

      return DecorationSet.create(doc, decorations);
    },
  },
});