import { usePartyProvider } from "../party/usePartyProvider";
import { TipTapEditor } from "./components/TipTapEditor";

const ROOM_ID = "tiptap-owncf";

export const TiptapSelfHostPage = () => {
  const provider = usePartyProvider({ room: ROOM_ID, type: "self-hosted" });

  return <TipTapEditor provider={provider} />;
};
