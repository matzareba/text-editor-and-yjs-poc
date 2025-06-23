import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MY_USER } from "../../party/consts";
import YProvider from "y-partyserver/provider";
import {
  TipTapLemonlightButton,
  TipTapLemonlightButtonIcon,
  tipTapLemonlightButtonType,
} from "./TipTapLemonlightButton/TipTapLemonlightButton";
import { TipTapSlashCommands } from "./TipTapSlashCommands";

interface TipTapEditorProps {
  provider: YProvider;
}

const TipTapToolbar = ({ editor }: { editor: any }) => {
  const insertLemonlightButton = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: tipTapLemonlightButtonType,
        })
        .run();
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
        onClick={insertLemonlightButton}
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
        title="Insert Lemonlight Button"
      >
        <TipTapLemonlightButtonIcon size={16} />
        Send Email
      </button>
    </div>
  );
};

export const TipTapEditor = ({ provider }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: provider.doc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: MY_USER,
      }),
      TipTapLemonlightButton,
      TipTapSlashCommands,
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <TipTapToolbar editor={editor} />
      <EditorContent
        style={{
          border: "1px solid #e9ecef",
          borderTop: "none",
          minHeight: "200px",
          padding: "1rem",
        }}
        editor={editor}
      />
    </div>
  );
};
