import { defaultCallSheetHtml } from "../callSheet/defaultCallSheetHtml";
import { usePartyProvider } from "../party/usePartyProvider";
import { BlockNoteEditor } from "./components/BlockNoteEditor";
const ROOM_ID = "blocknote-partykit-cloud";

const config = {
  enableCallSheetEdits: true,
};

export const BlockNoteCallSheetPage = () => {
  const provider = usePartyProvider({
    room: ROOM_ID,
    type: "partykit-cloud",
  });

  return (
    <BlockNoteEditor
      provider={provider}
      initialHtmlContent={defaultCallSheetHtml}
      config={config}
    />
  );
};
