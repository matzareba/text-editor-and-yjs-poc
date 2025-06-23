import { usePartyProvider } from "../party/usePartyProvider";
import { BlockNoteEditor } from "./components/BlockNoteEditor";

const ROOM_ID = "blocknote-owncf";

export const BlockNoteSelfHostPage = () => {
  const provider = usePartyProvider({ room: ROOM_ID, type: "self-hosted" });

  return <BlockNoteEditor provider={provider} />;
};
