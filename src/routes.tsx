import { RouteObject } from "react-router-dom";
import { BlockNotePartyKitCloudPage } from "./_blockNote/BlockNotePartyKitCloudPage";
import { Layout } from "./components/Layout";
import { BlockNoteSelfHostPage } from "./_blockNote/BlockNoteSelfHostPage";
import { TiptapSelfHostPage } from "./_tipTap/TipTapSelfHostPage";

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
    ],
  },
];
