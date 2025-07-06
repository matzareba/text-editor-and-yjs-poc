import React from "react";
import { EditorView } from "prosemirror-view";
import { Fragment, Node } from "prosemirror-model";
import { CiLemon } from "react-icons/ci";
import { addRowAfter, addColumnAfter, deleteTable } from "prosemirror-tables";

interface ProseMirrorToolbarProps {
  view: EditorView | null;
}

export const ProseMirrorToolbar: React.FC<ProseMirrorToolbarProps> = ({ view }) => {
  const insertCustomTable = () => {
    if (!view) return;
    
    const { state, dispatch } = view;
    const { schema } = state;
    
    // Create table using prosemirror-tables nodes
    const rows = Array.from({ length: 3 }, (_, i) => {
      const cells = [
        schema.nodes.date_cell.create({}, schema.nodes.paragraph.create({}, schema.text(`DateCell1 ${i + 1}-1`))),
        schema.nodes.text_cell.create({}, schema.nodes.paragraph.create({}, schema.text(`Cell ${i + 1}-2`))),
        schema.nodes.date_cell.create({}, schema.nodes.paragraph.create({}, schema.text(`DateCell2 ${i + 1}-3`))),
      ];
      return schema.nodes.table_row.create({}, cells);
    });
    
    const table = schema.nodes.table.create({}, rows);
    
    const transaction = state.tr.replaceSelectionWith(table);
    dispatch(transaction);
    view.focus();
  };

  const clearEditor = () => {
    if (!view) return;
    
    const { state, dispatch } = view;
    const transaction = state.tr.delete(0, state.doc.content.size);
    dispatch(transaction);
    view.focus();
  };

  const insertNewRow = () => {
    if (!view) return;
    
    const { state, dispatch } = view;
    
    // Use prosemirror-tables command to add row
    if (addRowAfter(state, dispatch)) {
      view.focus();
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e9ecef",
        borderBottom: "none",
        padding: "0.5rem",
        backgroundColor: "#f8f9fa",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <button
        onClick={insertCustomTable}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert Custom Table"
      >
        Grid
      </button>
      <button
        onClick={clearEditor}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Clear Editor"
      >
        Clear
      </button>
      <button
        onClick={insertNewRow}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Add Row to Table"
      >
        Add Row
      </button>
    </div>
  );
};