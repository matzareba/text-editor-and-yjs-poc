import React, { useState, useRef, useEffect } from "react";
import {
  NodeViewContent,
  NodeViewWrapper,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { MY_USER } from "../../party/consts";
import { useProvider } from "../../contexts/ProviderContext";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridCellModes,
  GridApi,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid-pro";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import "./GridNode.css";
import { DataGrid } from "@mui/x-data-grid";

// Define the row data structure
interface GridRow {
  id: string;
  name: string;
  startDate: Date | null;
  description: string;
}

interface TipTapInlineEditorProps {
  params: GridRenderCellParams;
}

function TipTapInlineEditor(props: TipTapInlineEditorProps) {
  const { params } = props;
  const provider = useProvider();
  const editorRef = useRef<HTMLDivElement>(null);

  // Create a unique field name for this cell in the Yjs document
  const fieldName = `cell-${params.id}-${params.field}`;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable history as Collaboration has its own
      }),
      Collaboration.configure({
        document: provider.doc,
        field: fieldName,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: MY_USER,
      }),
    ],
    content: params.value || "", // Use the cell value as initial content
    editorProps: {
      attributes: {
        style: "outline: none; border: none; padding: 4px; min-height: 20px;",
      },
    },
    autofocus: false, // Don't autofocus on mount, let the DataGrid control focus
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={editorRef}
      style={{
        lineHeight: 0,
        cursor: "text", // Show text cursor on hover
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

const GridComponent = () => {
  // Grid API reference for programmatic control

  // Sample initial data
  const [rows, setRows] = useState<GridRow[]>([
    {
      id: "1",
      name: "Task 1",
      startDate: new Date(),
      description: "Description for Task 1",
    },
    {
      id: "2",
      name: "Task 2",
      startDate: new Date(),
      description: "Description for Task 2",
    },
  ]);

  // Define the columns
  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        editable: false, // We'll use our custom editor instead
        renderCell: (params: GridRenderCellParams) => (
          <TipTapInlineEditor params={params} />
        ),
      },
      {
        field: "description",
        headerName: "Description",
        flex: 2,
        editable: false, // We'll use our custom editor instead
        renderCell: (params: GridRenderCellParams) => (
          <TipTapInlineEditor params={params} />
        ),
      },
    ],
    [],
  );

  // Stop events from bubbling to the outer editor
  const stopEvent = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <NodeViewWrapper className="mui-grid-node">
      <div style={{ height: 400, width: "90%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="cell"
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          sx={{
            // Remove default focus outline to avoid double highlighting
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            // Custom styling for the grid
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            "& .MuiDataGrid-cell": {
              padding: "8px",
            },
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default GridComponent;
