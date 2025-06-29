import React, { useState } from "react";
import { NodeViewContent, NodeViewWrapper, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { MY_USER } from "../../party/consts";
import { useProvider } from "../../contexts/ProviderContext";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import "./GridNode.css";

// Define the row data structure
interface GridRow {
  id: string;
  name: string;
  startDate: Date | null;
  description: string;
}

function TipTapInlineEditor(props: { params: GridRenderCellParams }) {
  const { params } = props;
  const provider = useProvider();
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: provider.doc,
        field: `cell-${params.id}-${params.field}`,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: MY_USER,
      }),
    ],
    content: params.value || '', // Use the cell value as initial content
    editorProps: {
      attributes: {
        style: 'outline: none; border: none; padding: 4px; min-height: 20px;',
      },
    },
    onUpdate: ({ editor }) => {
      // Update the grid data when editor content changes
      const content = editor.getHTML();
      // You would typically call a callback here to update the grid data
      // For now, we'll just log the change
      console.log('Editor content updated:', content);
    },
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <EditorContent
        editor={editor}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '20px',
        }}
      />
    </div>
  );
}

const GridComponent = () => {
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
        editable: true,
      },
      // {
      //   field: "startDate",
      //   headerName: "Start Date",
      //   flex: 1,
      //   // editable: true,
      //   renderCell: (params) => (
      //     <LocalizationProvider dateAdapter={AdapterDateFns}>
      //       <DatePicker
      //         value={params.value}
      //         onChange={(newValue) => {
      //           const updatedRows = rows.map((row) =>
      //             row.id === params.id ? { ...row, startDate: newValue } : row,
      //           );
      //           setRows(updatedRows);
      //         }}
      //       />
      //     </LocalizationProvider>
      //   ),
      // },
      {
        field: "description",
        headerName: "Description",
        flex: 2,
        // editable: true,
        renderCell: (params: GridRenderCellParams) => (
          <TipTapInlineEditor params={params} />
        ),
      },
    ],
    [rows],
  );

  return (
    <NodeViewWrapper className="mui-grid-node">
      <div style={{ height: 400, width: "90%" }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          editMode="cell"
          disableRowSelectionOnClick
        />
      </div>
    </NodeViewWrapper>
  );
};

export default GridComponent;
