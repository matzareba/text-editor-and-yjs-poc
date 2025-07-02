import React from "react";
import { Node as TipTapNode } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { TipTapDataGridComponent } from "../nodes/GridNode";
import * as Y from "yjs";
import { UndoManager } from "yjs";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dataGrid: {
      /**
       * Insert a collaborative data grid
       */
      insertDataGrid: (attributes?: { tableId?: string }) => ReturnType
    }
  }
}



// React component that will be rendered in the node view
const DataGridNodeView = ({ node, updateAttributes, editor }: any) => {
  // Get the Yjs document and undo manager from editor storage
  const yDoc = editor.storage.collaborationDocument as Y.Doc;
  const sharedUndoManager = editor.storage.sharedUndoManager as UndoManager;

  if (!yDoc || !sharedUndoManager) {
    return (
      <NodeViewWrapper>
        <div style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
          <p>Loading collaborative grid...</p>
        </div>
      </NodeViewWrapper>
    );
  }

  const element = {
    type: "data_grid" as const,
    tableId: node.attrs.tableId || `table-${Date.now()}`,
  };

  return (
    <NodeViewWrapper>
      <TipTapDataGridComponent
        yDoc={yDoc}
        tableId={element.tableId}
        element={element}
        sharedUndoManager={sharedUndoManager}
      />
    </NodeViewWrapper>
  );
};

// TipTap node extension
export const DataGridExtension = TipTapNode.create({
  name: "dataGrid",
  group: "block",
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      tableId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-table-id"),
        renderHTML: (attributes) => {
          if (!attributes.tableId) {
            return {};
          }
          return {
            "data-table-id": attributes.tableId,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='data-grid']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "data-grid", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DataGridNodeView);
  },

  addCommands() {
    return {
      insertDataGrid:
        (attributes = {}) =>
        ({ commands }) => {
          const tableId = attributes.tableId || `table-${Date.now()}`;
          return commands.insertContent({
            type: this.name,
            attrs: { tableId },
          });
        },
    };
  },
});

export default DataGridExtension;