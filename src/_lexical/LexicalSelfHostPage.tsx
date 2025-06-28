import React from "react";
import YProvider from "y-partyserver/provider";
import { LexicalEditor } from "./components/LexicalEditor";
import { usePartyProvider } from "../party/usePartyProvider";
import { SharedHistoryContext } from "./context/SharedHistoryContext";

const ROOM_ID = "lexical-owncf";

export const LexicalSelfHostPage = () => {
  // Create Y.js provider for collaboration
  const provider = usePartyProvider({ room: ROOM_ID, type: "self-hosted" });

  React.useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>
        Lexical Editor with Y.js Collaboration
      </h1>
      <div style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem" }}>
        This is a Lexical editor with Y.js collaboration support and a custom
        Grid node. Multiple users can edit simultaneously.
      </div>
      <SharedHistoryContext>
        <LexicalEditor provider={provider} />
      </SharedHistoryContext>
    </div>
  );
};
