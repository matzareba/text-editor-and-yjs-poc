import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MY_USER } from "../party/consts";
import { usePartyProvider } from "../party/usePartyProvider";

const ROOM_ID = "tiptap-owncf";

export const TiptapSelfHostPage = () => {
  const provider = usePartyProvider({ room: ROOM_ID, type: "self-hosted" });

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
    ],
  });

  return (
    <div>
      <EditorContent style={{ border: "1px solid" }} editor={editor} />
    </div>
  );
};
