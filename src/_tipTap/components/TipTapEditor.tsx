import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import HistoryExtension from "@tiptap/extension-history";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MY_USER } from "../../party/consts";
import { useProvider } from "../../contexts/ProviderContext";
import {
  TipTapLemonlightButton,
  TipTapLemonlightButtonIcon,
  tipTapLemonlightButtonType,
} from "./TipTapLemonlightButton/TipTapLemonlightButton";
import { TipTapSlashCommands } from "./TipTapSlashCommands";
import {
  CustomDateCell, CustomHandleCell,
  CustomTable,
  CustomTableRow,
  CustomTextCell,
  CustomWrapperWithContext,
  DateNode, HandleNode
} from "./TipTapCustomTable/TableNodes";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { CounterContext } from "./TipTapCustomTable/CounterContext";
import { useState } from "react";
import DragHandleExtension from '@tiptap/extension-drag-handle'
import { DragHandle } from "@tiptap/extension-drag-handle";
import DragHandleComponent from "@tiptap/extension-drag-handle-react"
import { TableDragManager } from "./TipTapCustomTable/TableDragManager";
import { TipTapToolbar } from "./TipTapToolbar";

export const TipTapEditor = () => {
  const provider = useProvider();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // history: false,
      }),
      // Collaboration.configure({
      //   document: provider.doc,
      //   field: "content",
      // }),
      // CollaborationCursor.configure({
      //   provider: provider,
      //   user: MY_USER,
      // }),
      TipTapLemonlightButton,
      TipTapSlashCommands,
      // Table.configure({
      //   resizable: true,
      // }),
      // TableRow,
      // TableCell,
      // TableHeader,
      DateNode,
      CustomTable.configure({
        resizable: true,
        lastColumnResizable: false,
        allowTableNodeSelection: true,
      }),
      CustomTableRow,
      CustomTextCell,
      CustomDateCell,
      CustomWrapperWithContext,
      // CustomHandleCell,
      // HandleNode,
      TableDragManager,
    ],
  });

  const [counter, setCounter] = useState(1);

  if (!editor) {
    return null;
  }

  return (
    <CounterContext.Provider value={{ counter, setCounter }}>
      <button onClick={() => setCounter((c) => c + 1)}>{counter} add</button>
      <div>
        <TipTapToolbar editor={editor} />
        {/*<DragHandleComponent editor={editor}>*/}
        {/*  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">*/}
        {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />*/}
        {/*  </svg>*/}
        {/*</DragHandleComponent>*/}
        <EditorContent
          style={{
            border: "1px solid #e9ecef",
            borderTop: "none",
            minHeight: "200px",
            padding: "1rem",
          }}
          editor={editor}
        />
      </div>
    </CounterContext.Provider>
  );
};
