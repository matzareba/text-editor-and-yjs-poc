import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MY_USER, PARTY_FRAGMENT_ID } from "../../party/consts";
import YProvider from "y-partyserver/provider";

export const BlockNoteEditor = ({ provider }: { provider: YProvider }) => {
  const editor = useCreateBlockNote({
    collaboration: {
      provider: provider,
      fragment: provider.doc.getXmlFragment(PARTY_FRAGMENT_ID),
      user: MY_USER,
    },
  });

  return <BlockNoteView editor={editor} />;
};
