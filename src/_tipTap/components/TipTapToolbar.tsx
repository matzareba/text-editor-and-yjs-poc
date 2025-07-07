import {
  TipTapLemonlightButtonIcon,
  tipTapLemonlightButtonType,
} from "./TipTapLemonlightButton/TipTapLemonlightButton";
import {
  CustomDateCell,
  CustomHandleCell,
  CustomTable,
  CustomTableRow,
  CustomTextCell,
  CustomWrapperWithContext,
  DateNode,
  HandleNode,
} from "./TipTapCustomTable/TableNodes";
import { Editor } from "@tiptap/react";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";

const newTableWithDate = {
  type: CustomWrapperWithContext.name,
  content: [
    {
      type: CustomTable.name,
      content: Array.from({ length: 10 }).map((_, i) => ({
        type: CustomTableRow.name,
        content: [
          // {
          //   type: CustomHandleCell.name,
          //   content: [
          //     {
          //       type: HandleNode.name,
          //     },
          //   ],
          // },
          // {
          //   type: CustomTextCell.name,
          //   content: [
          //     {
          //       type: "text",
          //       text: `Column 1 - ${i + 1}`
          //     }
          //   ]
          // },
          // {
          //   type: CustomTextCell.name,
          //   content: [
          //     {
          //       type: "text",
          //       text: `Column 2 - ${i + 1}`
          //     }
          //   ]
          // },
          {
            type: CustomDateCell.name,
            content: [
              {
                type: DateNode.name,
                attrs: {
                  value: "2024-01-01",
                },
              },
            ],
          },
          // {
          //   type: CustomDateCell.name,
          //   content: [
          //     {
          //       type: "paragraph",
          //       content: [
          //         {
          //           type: "text",
          //           text: `custom date 2025`,
          //         },
          //       ],
          //     },
          //   ],
          // },
          {
            type: CustomTextCell.name,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: `Column 2 - ${i + 1}`,
                  },
                ],
              },
            ],
          },
          {
            type: CustomDateCell.name,
            content: [
              {
                type: DateNode.name,
                attrs: {
                  value: "2024-01-01",
                },
              },
            ],
          },
        ],
      })),
    },
  ],
};

const newTiptapTableWithDate = {
  type: Table.name,
  content: Array.from({ length: 10 }).map((_, i) => ({
    type: TableRow.name,
    content: [
      {
        type: TableCell.name,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `Column 1 - ${i + 1}`,
              },
            ],
          },
        ],
      },
      {
        type: TableCell.name,
        content: [
          {
            type: DateNode.name,
            attrs: {
              value: "2024-01-01",
            },
          },
        ],
      },
    ],
  })),
};

const newTableWithThreeTextCells = {
  type: CustomWrapperWithContext.name,
  content: [
    {
      type: CustomTable.name,
      content: Array.from({ length: 10 }).map((_, i) => ({
        type: CustomTableRow.name,
        content: [
          {
            type: CustomTextCell.name,
            content: [
              {
                type: "text",
                text: `Column 1 - ${i + 1}`,
              },
            ],
          },
          {
            type: CustomTextCell.name,
            content: [
              {
                type: "text",
                text: `Column 2 - ${i + 1}`,
              },
            ],
          },
          {
            type: CustomTextCell.name,
            content: [
              {
                type: "text",
                text: `Column 3 - ${i + 1}`,
              },
            ],
          },
        ],
      })),
    },
  ],
};

export const TipTapToolbar = ({ editor }: { editor: Editor }) => {
  const insertLemonlightButton = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: tipTapLemonlightButtonType,
        })
        .run();
    }
  };

  const insertCustomTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        // .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
        .insertContent(newTableWithDate)
        .run();
    }
  };

  const insertTiptapTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        // .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
        .insertContent(newTiptapTableWithDate)
        .run();
    }
  };

  const insertThreeTextCellsTable = () => {
    if (editor) {
      editor.chain().focus().insertContent(newTableWithThreeTextCells).run();
    }
  };

  const clearEditor = () => {
    if (editor) {
      editor.chain().focus().clearContent().run();
    }
  };

  const insertNewRow = () => {
    if (editor) {
      // Find the current position and check if we're in a table
      const { selection } = editor.state;
      const { $from } = selection;

      // Try to find the table node
      let tableNode = null;
      let tablePos = null;

      for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type.name === "customTable") {
          tableNode = node;
          tablePos = $from.before(depth);
          break;
        }
      }

      if (tableNode && tablePos !== null) {
        // Create a new row with the same structure as existing rows
        const newRowContent = {
          type: CustomTableRow.name,
          content: [],
        };

        // Insert the new row at the end of the table
        const tableEndPos = tablePos + tableNode.nodeSize;
        editor
          .chain()
          .focus()
          // .insertContentAt(tableEndPos - 1, newRowContent)
          .addRowAfter()
          .run();
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e9ecef",
        borderBottom: "none",
        padding: "0.5rem",
        backgroundColor: "#f8f9fa",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <button
        onClick={insertLemonlightButton}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert Lemonlight Button"
      >
        <TipTapLemonlightButtonIcon size={16} />
        Send Email
      </button>
      <button
        onClick={insertCustomTable}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert MUI X Grid Pro"
      >
        Grid
      </button>
      <button
        onClick={insertThreeTextCellsTable}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert Table with Three Text Columns"
      >
        Text Table
      </button>
      <button
        onClick={insertTiptapTable}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert Table with Three Text Columns"
      >
        Tiptap Table
      </button>
      <button
        onClick={clearEditor}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Clear Editor"
      >
        Clear
      </button>
      <button
        onClick={insertNewRow}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Add Row to Table"
      >
        Add Row
      </button>
    </div>
  );
};
