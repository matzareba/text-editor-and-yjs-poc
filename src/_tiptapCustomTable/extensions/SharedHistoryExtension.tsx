import { Extension } from "@tiptap/core";
import * as Y from "yjs";

export const sharedHistoryExtension = (undoManager: Y.UndoManager) =>
  Extension.create({
    name: "sharedHistory",
    priority: 1000,
    addKeyboardShortcuts() {
      return {
        "Mod-z": (e) => {
          console.log(
            "undo - before:",
            "undoStack length:",
            undoManager.undoStack.length,
            "redoStack length:",
            undoManager.redoStack.length,
            "can undo:",
            undoManager.canUndo(),
            "ydoc:",
            e.editor.storage.collaborationDocument.toJSON(),
          );
          undoManager.undo();
          console.log(
            "undo - after:",
            "undoStack length:",
            undoManager.undoStack.length,
            "redoStack length:",
            undoManager.redoStack.length,
            "can undo:",
            undoManager.canUndo(),
            "ydoc:",
            e.editor.storage.collaborationDocument.toJSON(),
          );
          return true;
        },
        "Shift-Mod-z": () => {
          undoManager.redo();
          return true;
        },
        "Mod-y": () => {
          undoManager.redo();
          return true;
        },
      };
    },
  });
