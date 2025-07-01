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
      // Handle events to prevent them from bubbling to the outer editor
      handleDOMEvents: {
        // mousedown: (view, event) => {
        //   // Prevent the event from bubbling to avoid outer editor selection
        //   event.stopPropagation();
        //   return false;
        // },
        // keydown: (view, event) => {
        //   // Get the current cursor position
        //   const { from, to } = view.state.selection;
        //   const isAtStart = from === 1; // At the start of the editor content
        //   const isAtEnd = to === view.state.doc.content.size; // At the end of the editor content
        //
        //   // Handle Tab key for cell navigation
        //   if (event.key === "Tab") {
        //     // Let the DataGrid handle tab navigation
        //     // We don't prevent default here so the browser's default tab behavior works
        //     return false;
        //   }
        //
        //   // Handle Enter key
        //   if (event.key === "Enter" && !event.shiftKey) {
        //     if (isAtEnd && !event.altKey) {
        //       // At the end of content, move to the cell below (same column)
        //       // Let the default behavior happen (create a new line) if Shift is pressed
        //       // This would require coordination with the DataGrid API
        //       // For now, we just let the editor handle it
        //       return false;
        //     }
        //   }
        //
        //   // Handle arrow keys at boundaries for cell-to-cell navigation
        //   if (event.key === "ArrowLeft" && isAtStart) {
        //     // At the start of content, pressing Left could move to the previous cell
        //     // This would require coordination with the DataGrid API
        //     // For now, we just let the editor handle it
        //     return false;
        //   }
        //
        //   if (event.key === "ArrowRight" && isAtEnd) {
        //     // At the end of content, pressing Right could move to the next cell
        //     // This would require coordination with the DataGrid API
        //     // For now, we just let the editor handle it
        //     return false;
        //   }
        //
        //   if (event.key === "ArrowUp" && isAtStart) {
        //     // At the start of content, pressing Up could move to the cell above
        //     // This would require coordination with the DataGrid API
        //     // For now, we just let the editor handle it
        //     return false;
        //   }
        //
        //   if (event.key === "ArrowDown" && isAtEnd) {
        //     // At the end of content, pressing Down could move to the cell below
        //     // This would require coordination with the DataGrid API
        //     // For now, we just let the editor handle it
        //     return false;
        //   }
        //
        //   // Let the editor handle other keys
        //   return false;
        // },
      },
    },
    autofocus: false, // Don't autofocus on mount, let the DataGrid control focus
  });

  // Focus the editor when the cell is clicked or enters edit mode
  // useEffect(() => {
  //   const focusEditor = () => {
  //     if (editor && !editor.isFocused) {
  //       editor.commands.focus();
  //     }
  //   };
  //
  //   // Add click handler to focus the editor
  //   const editorElement = editorRef.current;
  //   if (editorElement) {
  //     editorElement.addEventListener('click', focusEditor);
  //
  //     return () => {
  //       editorElement.removeEventListener('click', focusEditor);
  //     };
  //   }
  // }, [editor]);

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={editorRef}
      style={{
        // width: "100%",
        // height: "100%",
        lineHeight: 0,
        cursor: "text", // Show text cursor on hover
      }}
      onClick={(e) => {
        // Prevent click from bubbling to avoid outer editor selection
        // e.stopPropagation();
      }}
    >
      <EditorContent
        editor={editor}
        // style={{
        //   width: "100%",
        //   height: "100%",
        //   minHeight: "20px",
        // }}
      />
    </div>
  );
}

const GridComponent = () => {
  // Grid API reference for programmatic control
  const apiRef = useGridApiRef();

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
    <NodeViewWrapper
      className="mui-grid-node"
      // onKeyDown={stopEvent}
      // onClick={stopEvent}
    >
      <div
        // onKeyDown={stopEvent}
        // onClick={stopEvent}
        // onPointerDown={stopEvent}
        // onMouseDown={stopEvent}
        style={{ height: 400, width: "90%" }}
      >
        <DataGrid
          apiRef={apiRef}
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
