import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { Extension } from "@tiptap/core";
import { ySyncPluginKey } from "y-prosemirror";

const sharedHistory = (undoManager: Y.UndoManager) => {
  return Extension.create({
    name: "sharedHistory",
    addKeyboardShortcuts() {
      return {
        "Mod-z": () => (undoManager.undo(), true),
        "Shift-Mod-z": () => (undoManager.redo(), true),
        "Mod-y": () => (undoManager.redo(), true),
      };
    },
  });
};

interface EditorWrapperProps {
  fragment: Y.XmlFragment;
  title: string;
  undoManager: Y.UndoManager;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({
  fragment,
  title,
  undoManager,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ fragment }),
      sharedHistory(undoManager),
    ],
  });

  return (
    <div>
      <h2>{title}</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 150 }}>
        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );
};

export const SharedHistoryEditors: React.FC = () => {
  const [fragments, setFragments] = useState<{
    A: Y.XmlFragment;
    B: Y.XmlFragment;
  } | null>(null);
  const [undoManager, setUndoManager] = useState<Y.UndoManager | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "tiptap-custom-fragment",
      doc,
    );

    const fragA = doc.getXmlFragment("contentA");
    const fragB = doc.getXmlFragment("contentB");

    const manager = new Y.UndoManager([fragA, fragB], {
      trackedOrigins: new Set([ySyncPluginKey]),
      captureTimeout: 500,
    });

    setFragments({ A: fragA, B: fragB });
    setUndoManager(manager);

    return () => {
      manager.destroy();
      provider.destroy();
      doc.destroy();
    };
  }, []);

  if (!fragments || !undoManager) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <EditorWrapper
        fragment={fragments.A}
        title="Editor A (fragment)"
        undoManager={undoManager}
      />
      <EditorWrapper
        fragment={fragments.B}
        title="Editor B (fragment)"
        undoManager={undoManager}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            console.log(
              "undo stack:",
              undoManager.undoStack.length,
              undoManager.undoStack,
            );
            undoManager.undo();
          }}
        >
          Undo
        </button>
        <button onClick={() => undoManager.redo()} style={{ marginLeft: 10 }}>
          Redo
        </button>
      </div>
    </div>
  );
};
