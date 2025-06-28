import { RouteObject } from "react-router-dom";
import { BlockNotePartyKitCloudPage } from "./_blockNote/BlockNotePartyKitCloudPage";
import { Layout } from "./components/Layout";
import { BlockNoteSelfHostPage } from "./_blockNote/BlockNoteSelfHostPage";
import { TiptapSelfHostPage } from "./_tipTap/TipTapSelfHostPage";
import { BlockNoteCallSheetPage } from "./_blockNote/BlockNoteCallSheetPage";
import { LexicalSelfHostPage } from "./_lexical/LexicalSelfHostPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "/blocknote-callsheet",
        element: <BlockNoteCallSheetPage />,
      },
      {
        path: "/blocknote-partykit",
        element: <BlockNotePartyKitCloudPage />,
      },
      {
        path: "/blocknote-owncf",
        element: <BlockNoteSelfHostPage />,
      },
      {
        path: "/tiptap-owncf",
        element: <TiptapSelfHostPage />,
      },
      {
        path: "/lexical-owncf",
        element: <LexicalSelfHostPage />,
      },
    ],
  },
];
