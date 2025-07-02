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
    // Get or create the table map: {tableId-wysiwyg: {rowId: {field: XML}}}
    let tableMap = yDoc.getMap<Y.Map<Y.XmlFragment>>(`${tableId}-wysiwyg`);

    // Get or create the row map
    let rowMap = tableMap.get(rowId);
    if (!rowMap) {
      rowMap = new Y.Map<Y.XmlFragment>();
      tableMap.set(rowId, rowMap);
    }

    // Get or create the field XML fragment
    let xmlFragment = rowMap.get(field);
    if (!xmlFragment) {
      xmlFragment = new Y.XmlFragment();
      rowMap.set(field, xmlFragment);
    }

    return xmlFragment;
  }, [yDoc, tableId, rowId, field]);
};

const useYValue = (
  yDoc: Y.Doc,
  tableId: string,
  rowId: string,
  field: string,
) => {
  const yValue = useMemo(() => {
    // Get or create the table map
    let tableArray = yDoc.getArray<Y.Map<any>>(tableId);
    const result = tableArray
      .toArray()
      .find((item) => item.get("id")?.toString() === rowId);

    if (result) {
      const result2: Y.Map<{ value: any }> | undefined = result.get(field);
      if (!result2) {
        const yText = new Y.Map<{ value: any }>();
        result.set(field, yText);
        return result.get(field) as Y.Map<{ value: any }>;
      }
      return result2;
    } else {
      const newValue = new Y.Map<{ value: any }>([["value", null]]);

      const newRow = new Y.Map();
      newRow.set("id", rowId);
      newRow.set(field, newValue);
      tableArray.push([newRow]);
      return newValue;
    }
  }, [yDoc, tableId, rowId, field]);
  const [value, setValue] = useState(
    () => yValue.get("value") as string | undefined,
  );

  useEffect(() => {
    const handler = () => {
      setValue(yValue.get("value") as string | undefined);
    };
    yValue.observe(handler);
    return () => yValue.unobserve(handler);
  }, [yValue]);
  const setYjsValue = useCallback((value: string) => {
    yValue.set("value", value as any);
  }, []);
  return [value, setYjsValue] as const;
};

const useYRowsData = (yDoc: Y.Doc, tableId: string) => {
  const yRows = useMemo(() => {
    return yDoc.getArray<Y.Map<any>>(tableId);
  }, [yDoc, tableId]);

  const transformToRow = (row: Y.Map<any>) => {
    return {
      id: row.get("id") as string,
      date: row.get("date")?.get("value") as string | undefined,
    };
  };

  const [rows, setRows] = useState(yRows.toArray().map(transformToRow));

  useEffect(() => {
    const handler = () => {
      setRows(yRows.toArray().map(transformToRow));
    };
    yRows.observeDeep(handler);
    return () => yRows.unobserveDeep(handler);
  }, [yRows]);

  const addRow = useCallback(() => {
    yRows.push([new Y.Map<any>([["id", `row-${Date.now()}`]])]);
  }, [yRows]);

  const removeRow = useCallback(
    (rowId: string) => {
      yRows.delete(yRows.toArray().findIndex((row) => row.get("id") === rowId));
    },
    [yRows],
  );

  const setValue = useCallback(
    (rowId: string, field: string, value: string) => {
      const foundRow = yRows
        .toArray()
        .find((row) => row.get("id")?.toString() === rowId);
      if (!foundRow) return;
      const foundField = foundRow.get(field);
      if (foundField) {
        foundField?.set("value", value);
      } else {
        foundRow.set(field, new Y.Map<any>([["value", value]]));
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

  return { rows, addRow, removeRow, setValue, reorderRows };
};

// Collaborative Cell Component using TipTap
const CollabCell: React.FC<{
  yDoc: Y.Doc;
  tableId: string;
  rowId: string;
  field: string;
  shareUndoManager: UndoManager;
}> = ({ yDoc, tableId, rowId, field, shareUndoManager }) => {
  const yFragment = useYXMLFragment(yDoc, tableId, rowId, field);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Collaboration.configure({
        fragment: yFragment,
      }),
    ],
    content: "",
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

  // useEffect(() => {
  //   if (editor) {
  //     shareUndoManager.addToScope(yFragment);
  //   }
  // }, [editor, yFragment, shareUndoManager]);

  // Handle keyboard shortcuts for undo/redo
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z" && !event.shiftKey) {
          event.preventDefault();
          console.log(
            "Global undo triggered, canUndo:",
            shareUndoManager.canUndo(),
            "stackSize:",
            shareUndoManager.undoStack.length,
          );
          if (shareUndoManager.canUndo()) {
            shareUndoManager.undo();
          }
        } else if (event.key === "y" || (event.key === "z" && event.shiftKey)) {
          event.preventDefault();
          console.log(
            "Global redo triggered, canRedo:",
            shareUndoManager.canRedo(),
            "stackSize:",
            shareUndoManager.redoStack.length,
          );
          if (shareUndoManager.canRedo()) {
            shareUndoManager.redo();
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("keydown", handleKeyDown);

    return () => {
      editorElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, shareUndoManager]);

  if (!editor) {
    return <div style={{ padding: "8px", minHeight: "40px" }}>Loading...</div>;
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
};


function DateCell({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => unknown;
}) {
  return (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Main DataGrid component
const TipTapDataGridComponent: React.FC<{
  yDoc: Y.Doc;
  tableId: string;
  element: CustomElement;
  sharedUndoManager: UndoManager;
}> = ({ yDoc, tableId, element, sharedUndoManager }) => {
  const { rows, addRow, setValue, reorderRows } = useYRowsData(yDoc, tableId);

  // Define columns with collaborative editors
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "id",
        flex: 1,
        renderCell: (params) => {
          return <>{params.id}</>;
        },
      },
      {
        field: "date",
        headerName: "date",
        flex: 1,
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
        flex: 2,
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
        flex: 2,
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
