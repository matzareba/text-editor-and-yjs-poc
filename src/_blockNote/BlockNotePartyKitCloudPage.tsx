import { usePartyProvider } from "../party/usePartyProvider";
import { BlockNoteEditor } from "./components/BlockNoteEditor";

const ROOM_ID = "blocknote-partykit-cloud";

export const BlockNotePartyKitCloudPage = () => {
  const provider = usePartyProvider({
    room: ROOM_ID,
    type: "partykit-cloud",
  });

  return <BlockNoteEditor provider={provider} />;
};
