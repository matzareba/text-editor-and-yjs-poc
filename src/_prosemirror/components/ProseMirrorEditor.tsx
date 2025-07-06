import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { goToNextCell, tableEditing } from "prosemirror-tables";
import { ProseMirrorToolbar } from "./ProseMirrorToolbar";
import { createCustomSchema } from "./schema/customSchema";
import { rowNumberPlugin } from "./plugins/rowNumberPlugin";

// Import CSS
import "../prosemirror.css";

export const ProseMirrorEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create custom schema with our extensions
    const customSchema = createCustomSchema();

    // Create editor state with plugins
    const state = EditorState.create({
      schema: customSchema,
      plugins: [
        // Basic ProseMirror plugins
        keymap({
          Tab: goToNextCell(1),
          "Shift-Tab": goToNextCell(-1),
        }),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),

        // Table plugins
        // columnResizing(),
        tableEditing(),
        rowNumberPlugin,

        // Custom plugins
        // createSlashCommands(customSchema),
        // createTableDragManager(),
      ],
    });

    // Create editor view
    const view = new EditorView(editorRef.current, {
      state,
      // dispatchTransaction: (transaction) => {
      //   const newState = view.state.apply(transaction);
      //   view.updateState(newState);
      // },
    });

    setView(view);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div>
      <ProseMirrorToolbar view={view} />
      <div
        ref={editorRef}
        style={{
          border: "1px solid #e9ecef",
          borderTop: "none",
          minHeight: "200px",
          padding: "1rem",
        }}
        className="ProseMirror-editor"
      />
    </div>
  );
};
