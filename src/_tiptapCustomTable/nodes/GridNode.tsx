import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import "./GridNode.css";
import { UndoManager } from "yjs";
import { createRoot } from "react-dom/client";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { ySyncPluginKey } from "y-prosemirror";
import { sharedHistoryExtension } from "../extensions/SharedHistoryExtension";
import { rowManagerOrigin } from "./consts";

// Grid data structures
interface GridRowEntry {
  id: string;
  name: string;
  startDate: Date | null;
}

// Custom types for TipTap
type CustomElement = {
  type: "paragraph" | "data_grid";
  tableId?: string;
  columns?: GridColDef[];
  initialRows?: GridRowEntry[];
};

// Hook to get or create Yjs XmlFragment for a cell
const useYXMLFragment = (
  yDoc: Y.Doc,
  tableId: string,
  rowId: string,
  field: string,
) => {
  return useMemo(() => {
    const tableArray = yDoc.getArray<Y.Map<any>>(tableId);

    let rowMap = tableArray.toArray().find((row) => row.get("id") === rowId);

    if (!rowMap) {
      rowMap = new Y.Map<any>();
      rowMap.set("id", rowId);
      tableArray.push([rowMap]);
    }

    // Get or create the field XML fragment
    let xmlFragment = rowMap.get(field);
    if (!xmlFragment || !(xmlFragment instanceof Y.XmlFragment)) {
      xmlFragment = new Y.XmlFragment();
      const paragraph = new Y.XmlElement("paragraph");
      xmlFragment.insert(0, [paragraph]);
      rowMap.set(field, xmlFragment);
    }

    return xmlFragment;
  }, [yDoc, tableId, rowId, field]);
};

type RowData = {
  id: string;
  date: string | undefined;
};

const useYRowsData = (yDoc: Y.Doc, tableId: string) => {
  const yRows = useMemo(() => {
    return yDoc.getArray<Y.Map<any>>(tableId);
  }, [yDoc, tableId]);

  const transformToRow = (row: Y.Map<any>): RowData => {
    return {
      id: row.get("id") as string,
      date: row.get("date") as string | undefined,
    };
  };

  const [rows, setRows] = useState<RowData[]>(
    yRows.toArray().map(transformToRow),
  );

  useEffect(() => {
    const handler = () => {
      setRows(yRows.toArray().map(transformToRow));
    };
    yRows.observeDeep(handler);
    return () => yRows.unobserveDeep(handler);
  }, [yRows]);

  const addRow = useCallback(() => {
    yDoc.transact(() => {
      const newRow = new Y.Map<any>();
      newRow.set("id", `row-${Date.now()}`);
      newRow.set("date", undefined);
      yRows.push([newRow]);
    }, rowManagerOrigin);
  }, [yRows]);

  const removeRow = useCallback(
    (rowId: string) => {
      const index = yRows.toArray().findIndex((row) => row.get("id") === rowId);
      if (index !== -1) {
        yRows.delete(index, 1);
      }
    },
    [yRows],
  );

  const setValue = useCallback(
    (rowId: string, field: string, value: string) => {
      const foundRow = yRows
        .toArray()
        .find((row) => row.get("id")?.toString() === rowId);
      if (foundRow) {
        foundRow.set(field, value);
      }
    },
    [yRows],
  );

  const reorderRows = useCallback(
    (change: { oldIndex: number; targetIndex: number }) => {
      const { oldIndex, targetIndex } = change;

      if (oldIndex === targetIndex) return;

      // Use Yjs move operation for efficient reordering
      if (oldIndex < targetIndex) {
        // Moving down: insert at target+1, then delete from old position
        const movedRow = yRows.get(oldIndex).clone();
        yRows.delete(oldIndex, 1);
        yRows.insert(targetIndex, [movedRow]);
      } else {
        // Moving up: delete from old position first, then insert at target
        const movedRow = yRows.get(oldIndex).clone();
        yRows.delete(oldIndex, 1);
        yRows.insert(targetIndex, [movedRow]);
      }
    },
    [yRows],
  );

  return { yRows, rows, addRow, removeRow, setValue, reorderRows };
};

// Collaborative Cell Component using TipTap
const CollabCell: React.FC<{
  yDoc: Y.Doc;
  tableId: string;
  rowId: string;
  field: string;
  shareUndoManager: UndoManager;
}> = React.memo(({ yDoc, tableId, rowId, field, shareUndoManager }) => {
  const yFragment = useYXMLFragment(yDoc, tableId, rowId, field);

  useEffect(() => {
    shareUndoManager.addToScope(yFragment);
  }, [shareUndoManager, yFragment]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        document: false,
        paragraph: false,
        text: false,
        bold: false,
        italic: false,
      }),
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Collaboration.configure({
        fragment: yFragment,
      }),
      sharedHistoryExtension(shareUndoManager),
    ],
    content: "<paragraph></paragraph>",
    editorProps: {
      attributes: {
        style:
          "min-height: 40px; outline: none; border: none; width: 100%; padding: 8px;",
        placeholder: "Type here... (Ctrl+B for bold, Ctrl+I for italic)",
      },
    },
    onUpdate: ({ editor }) => {
      // Handle any update logic if needed
    },
  });

  if (!editor) {
    return <div style={{ padding: "8px", minHeight: "40px" }}>Loading...</div>;
  }

  if (!editor.storage.collaborationDocument) {
    editor.storage.collaborationDocument = yDoc;
    editor.storage.sharedUndoManager = shareUndoManager;
  }

  return (
    <div style={{ width: "100%", height: "100%", padding: "8px" }}>
      <EditorContent
        editor={editor}
        style={{
          minHeight: "40px",
          outline: "none",
          border: "none",
          width: "100%",
        }}
      />
    </div>
  );
});

const DateCell = React.memo(
  ({
    value,
    onChange,
  }: {
    value: string | undefined;
    onChange: (value: string) => unknown;
  }) => (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
);

// Main DataGrid component
const TipTapDataGridComponent: React.FC<{
  yDoc: Y.Doc;
  tableId: string;
  element: CustomElement;
  sharedUndoManager: UndoManager;
}> = ({ yDoc, tableId, element, sharedUndoManager }) => {
  const { yRows, rows, addRow, setValue, reorderRows } = useYRowsData(
    yDoc,
    tableId,
  );

  useEffect(() => {
    sharedUndoManager.addToScope(yRows);
  }, [sharedUndoManager, yRows]);

  // Define columns with collaborative editors
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "id",
        width: 100,
        renderCell: (params) => {
          return <>{params.id}</>;
        },
      },
      {
        field: "date",
        headerName: "date",
        width: 150,
        renderCell: (params) => (
          <DateCell
            onChange={(value) => setValue(params.id.toString(), "date", value)}
            value={params.value}
          />
        ),
      },
      {
        field: "description",
        headerName: "Description",
        width: 100,
        renderCell: (params) => (
          <CollabCell
            yDoc={yDoc}
            tableId={tableId}
            rowId={params.id.toString()}
            field="description"
            shareUndoManager={sharedUndoManager}
          />
        ),
      },
      ...Array.from({ length: 20 }).map((_, index) => ({
        field: `notes-${index}`,
        headerName: `Rich Notes ${index + 1}`,
        width: 100,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <CollabCell
              yDoc={yDoc}
              tableId={tableId}
              rowId={params.id.toString()}
              field={`notes-${index}`}
              shareUndoManager={sharedUndoManager}
            />
          );
        },
      })),
    ],
    [tableId, yDoc, sharedUndoManager],
  );

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        margin: "10px 0",
      }}
    >
      <button onClick={addRow}>+</button>
      <DataGridPro
        rows={rows}
        columns={columns}
        // disableRowSelectionOnClick
        rowReordering
        rowSelection
        disableVirtualization
        onRowOrderChange={(params) => {
          console.log("Row order changed:", params);
          reorderRows(params);
        }}
        sx={{
          maxHeight: "400px",
          "& .MuiDataGrid-cell:focus": {
            outline: "solid #1976d2 1px",
          },
          "& .MuiDataGrid-cell": {
            cursor: "text",
          },
        }}
      />
    </div>
  );
};

// TipTap DataGrid Element Component
const DataGridElement: React.FC<{
  attributes: any;
  children: any;
  element: CustomElement;
  yDoc: Y.Doc;
  sharedUndoManager: UndoManager;
}> = ({ attributes, children, element, yDoc, sharedUndoManager }) => {
  const tableId = element.tableId || "default-table";

  return (
    <div {...attributes} contentEditable={false} style={{ outline: "none" }}>
      <TipTapDataGridComponent
        yDoc={yDoc}
        tableId={tableId}
        element={element}
        sharedUndoManager={sharedUndoManager}
      />
      {children}
    </div>
  );
};

// Helper functions to create and check DataGrid nodes
export const createDataGridNode = (tableId?: string): CustomElement => {
  return {
    type: "data_grid",
    tableId: tableId || `table-${Date.now()}`,
  };
};

export const isDataGridNode = (node: any): node is CustomElement => {
  return node && node.type === "data_grid";
};

export { DataGridElement, TipTapDataGridComponent };
