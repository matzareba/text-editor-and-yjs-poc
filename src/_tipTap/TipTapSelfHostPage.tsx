import { usePartyProvider } from "../party/usePartyProvider";
import { TipTapEditor } from "./components/TipTapEditor";
import { YProviderWrapper } from "../contexts/ProviderContext";

const ROOM_ID = "tiptap-owncf";

export const TiptapSelfHostPage = () => {
  const provider = usePartyProvider({ room: ROOM_ID, type: "self-hosted" });

  return (
    <YProviderWrapper provider={provider}>
      <TipTapEditor />
    </YProviderWrapper>
  );
};
