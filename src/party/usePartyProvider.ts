import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  PARTY_HOST_PARTYKIT_CLOUD_URL,
  PARTY_HOST_SELF_HOSTED_URL,
  PARTY_ID,
} from "./consts";
import useYProvider from "y-partyserver/react";

export const usePartyProvider = ({
  room,
  type,
}: {
  room: string;
  type: "self-hosted" | "partykit-cloud";
}) => {
  const provider = useYProvider({
    host:
      type === "self-hosted"
        ? PARTY_HOST_SELF_HOSTED_URL
        : PARTY_HOST_PARTYKIT_CLOUD_URL,
    party: type === "self-hosted" ? PARTY_ID : "main",
    room,
  });

  return provider;
};
