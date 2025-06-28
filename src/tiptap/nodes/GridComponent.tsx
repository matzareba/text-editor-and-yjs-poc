import React, { useState } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
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
        editable: true,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <NodeViewWrapper>
              <NodeViewContent className="content is-editable" />
            </NodeViewWrapper>
          );
        },
        renderEditCell: (params: GridRenderCellParams) => {
          return (
            <NodeViewWrapper>
              <NodeViewContent className="content is-editable" />
            </NodeViewWrapper>
          );
        },
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
