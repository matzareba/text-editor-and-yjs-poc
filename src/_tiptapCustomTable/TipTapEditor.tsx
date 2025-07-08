import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Collaboration from "@tiptap/extension-collaboration";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import DataGridExtension from "./extensions/DataGridExtension";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { ySyncPluginKey } from "y-prosemirror";
import { sharedHistoryExtension } from "./extensions/SharedHistoryExtension";
import { rowManagerOrigin } from "./nodes/consts";

// Define custom types
type CustomElement = {
  type: "paragraph" | "heading" | "data_grid";
  level?: number;
  tableId?: string;
};

// Collaborative Editor Component
const CollaborativeEditor: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [sharedUndoManager, setSharedUndoManager] =
    useState<Y.UndoManager | null>(null);

  // Set up Yjs provider and document
  useEffect(() => {
    const doc = new Y.Doc();

    // Set up WebSocket provider
    const yProvider = new WebsocketProvider(
      "ws://localhost:1234",
      "tiptap-main-document",
      doc,
    );

    yProvider.on("status", (event: any) => {
      if (event.status === "connected") {
        setConnected(true);
      } else {
        setConnected(false);
      }
    });

    setYDoc(doc);
    setProvider(yProvider);

    // Create shared undo manager for all editors
    const undoManager = new Y.UndoManager([], {
      trackedOrigins: new Set([ySyncPluginKey, rowManagerOrigin]),
      captureTimeout: 200,
      doc,
    });

    // doc.on("afterTransaction", (tr) => {
    //   console.log(
    //     "tracked:",
    //     undoManager.trackedOrigins.has(tr.origin),
    //     tr.origin,
    //   );
    // });

    const handle = setInterval(() => {
      console.log(doc.toJSON());
    }, 10000);

    setSharedUndoManager(undoManager);

    return () => {
      doc?.destroy();
      yProvider?.destroy();
      clearInterval(handle);
    };
  }, []);

  if (!connected || !yDoc || !provider || !sharedUndoManager) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>Loading collaborative editor...</Typography>
      </Box>
    );
  }

  return (
    <TipTapEditor
      yDoc={yDoc}
      provider={provider}
      sharedUndoManager={sharedUndoManager}
    />
  );
};

// Props interface
interface TipTapEditorProps {
  yDoc: Y.Doc;
  provider: WebsocketProvider;
  sharedUndoManager: Y.UndoManager;
}

// Main TipTapEditor component
const TipTapEditor: React.FC<TipTapEditorProps> = ({
  yDoc,
  provider,
  sharedUndoManager,
}) => {
  const xmlFragment = useMemo(() => yDoc.getXmlFragment("body"), [yDoc]);

  useEffect(() => {
    sharedUndoManager.addToScope(xmlFragment);
  }, [sharedUndoManager, xmlFragment]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable built-in history since we use Yjs UndoManager
        bold: false,
        italic: false,
      }),
      Bold,
      Italic,
      Collaboration.configure({ fragment: xmlFragment }),
      sharedHistoryExtension(sharedUndoManager),
      DataGridExtension,
    ],
    content: `
      <p>Welcome to the TipTap Collaborative Grid Editor!</p>
      <p>Click the "Insert Grid" button to add a collaborative data grid.</p>
    `,
    editorProps: {
      attributes: {
        style: "min-height: 250px; outline: none; padding: 16px;",
      },
    },
  });

  const insertGrid = useCallback(() => {
    if (editor) {
      const tableId = `table-${Date.now()}`;
      editor.chain().focus().insertDataGrid({ tableId }).run();
    }
  }, [editor]);

  const toggleFormat = useCallback(
    (format: "bold" | "italic") => {
      if (editor) {
        if (format === "bold") {
          editor.chain().focus().toggleBold().run();
        } else if (format === "italic") {
          editor.chain().focus().toggleItalic().run();
        }
      }
    },
    [editor],
  );

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  if (!editor.storage.collaborationDocument) {
    editor.storage.collaborationDocument = yDoc;
    editor.storage.sharedUndoManager = sharedUndoManager;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        TipTap Collaborative Grid Editor
      </Typography>

      <Toolbar sx={{ mb: 2, p: 0, minHeight: "auto" }}>
        <Button variant="outlined" onClick={insertGrid} sx={{ mr: 2 }}>
          Insert Grid
        </Button>
        <Button
          variant={editor.isActive("bold") ? "contained" : "outlined"}
          onClick={() => toggleFormat("bold")}
          sx={{ mr: 1 }}
        >
          Bold
        </Button>
        <Button
          variant={editor.isActive("italic") ? "contained" : "outlined"}
          onClick={() => toggleFormat("italic")}
          sx={{ mr: 1 }}
        >
          Italic
        </Button>
        <Button
          variant="outlined"
          onClick={() => sharedUndoManager.undo()}
          sx={{ mr: 1 }}
          disabled={!sharedUndoManager.canUndo()}
        >
          Undo
        </Button>
        <Button
          variant="outlined"
          onClick={() => sharedUndoManager.redo()}
          sx={{ mr: 1 }}
          disabled={!sharedUndoManager.canRedo()}
        >
          Redo
        </Button>
      </Toolbar>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 2,
          minHeight: 300,
          bgcolor: "background.paper",
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default CollaborativeEditor;
