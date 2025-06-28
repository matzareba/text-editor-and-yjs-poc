import React, { useEffect, useState } from "react";
import {
  $applyNodeReplacement,
  createEditor,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  LineBreakNode,
  NodeKey,
  ParagraphNode,
  RootNode,
  SerializedEditor,
  SerializedLexicalNode,
  TextNode,
} from "lexical";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { mapValues } from "lodash-es";
import { useSharedHistoryContext } from "../context/SharedHistoryContext";
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { createWebsocketProvider } from "../collaboration";
import LexicalContentEditable from "../ui/ContentEditable";
import "./ImageNode.css";
// Define the row data structure
type GridRow = Record<string, LexicalEditor>;
type SerializedGridRow = Record<string, SerializedEditor>;

interface GridRowEntry {
  id: string;
  name: string;
  startDate: Date | null;
}

interface SerializedGridNode extends SerializedLexicalNode {
  type: "grid";
  rows: SerializedGridRow;
  caption: SerializedEditor;
}

export class GridNode extends DecoratorNode<React.JSX.Element> {
  __rows: GridRow;
  __caption: LexicalEditor;

  static getType(): string {
    return "grid";
  }

  static clone(node: GridNode): GridNode {
    return new GridNode(node.__rows, node.__caption, node.__key);
  }

  constructor(rows?: GridRow, caption?: LexicalEditor, key?: NodeKey) {
    super(key);
    this.__rows = rows ?? {
      "1": createEditor({
        namespace: "Playground/GridNoderow",
        nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
      }),
      // "2": createEditor({
      //   namespace: "Playground/GridNoderow",
      //   nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
      // }),
    };
    this.__caption =
      caption ||
      createEditor({
        namespace: "Playground/ImageNodeCaption",
        nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
      });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "block";
    div.style.width = "100%";
    div.style.margin = "10px 0";
    div.setAttribute("data-lexical-grid", "true");
    return div;
  }

  updateDOM(): false {
    return false;
  }

  setRows(rows: GridRow): void {
    const writableNode = this.getWritable();
    writableNode.__rows = rows;
  }

  getRows(): GridRow {
    return this.getLatest().__rows;
  }

  static importJSON(serializedNode: SerializedGridNode): GridNode {
    const { rows } = serializedNode;

    const gridNode = $createGridNode(
      mapValues(rows, (row) => {
        const editor = createEditor({
          nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
        });
        editor.setEditorState(editor.parseEditorState(row.editorState));
        return editor;
      }),
    );
    return gridNode;
  }

  // updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedGridNode>): this {
  //   const { rows } = serializedNode;
  //   const node = super.updateFromJSON(serializedNode);
  //   this.__rows = mapValues(rows, (row) => {
  //     const editor = createEditor({
  //       nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
  //     });
  //     editor.setEditorState(
  //       editor.parseEditorState(row.description.editorState),
  //     );
  //     // todo update existing editors
  //     return {
  //       ...row,
  //       description: editor,
  //     };
  //   });
  //   return node;
  // }

  exportJSON(): SerializedGridNode {
    return {
      ...super.exportJSON(),
      type: "grid",
      version: 1,
      rows: mapValues(this.__rows, (row) => row.toJSON()),
      caption: this.__caption.toJSON(),
    };
  }

  decorate(editor: LexicalEditor, config: EditorConfig): React.JSX.Element {
    return <GridComponent node={this} editor={editor} />;
  }

  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): boolean {
    return false;
  }
}

interface GridComponentProps {
  node: GridNode;
  editor: LexicalEditor;
}

const GridComponent: React.FC<GridComponentProps> = ({ node, editor }) => {
  const [rows, setRows] = useState<GridRow>(node.__rows);

  // Initialize rows within editor context
  useEffect(() => {
    editor.read(() => {
      const nodeRows = node.getRows();
      setRows(nodeRows);
    });
  }, [node, editor]);

  const handleRowUpdate = (newRows: GridRow) => {
    setRows(newRows);
    editor.update(() => {
      node.setRows(newRows);
    });
  };

  const { historyState } = useSharedHistoryContext();

  const { isCollabActive } = useCollaborationContext();
  console.log("isCollabActive", isCollabActive);

  // Define the columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      // editable: true,
      renderCell: (params: GridRenderCellParams) => {
        let editor = node.__rows[params.id];
        if (!editor) {
          return <span>Bb</span>;
        }
        return (
          <div style={{ height: "100%", width: "100%" }}>
            <LexicalNestedComposer initialEditor={editor}>
              <RichTextPlugin
                contentEditable={
                  <LexicalContentEditable
                    placeholder="Enter a caption..."
                    placeholderClassName="ImageNode__placeholder"
                    className="ImageNode__contentEditable"
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              {isCollabActive ? (
                <CollaborationPlugin
                  id={`editor-${params.id}`}
                  providerFactory={createWebsocketProvider}
                  shouldBootstrap={true}
                />
              ) : (
                <HistoryPlugin externalHistoryState={historyState} />
              )}
            </LexicalNestedComposer>
          </div>
        );
      },
    },
  ];
  const processRowUpdate = ({ id, description }: GridRow & { id: string }) => {
    // const updatedRows = { ...rows, [id!.toString()]: { description } };
    // handleRowUpdate(updatedRows);
    // return updatedRows;
  };

  const [gridRows, setGridRows] = useState<GridRowEntry[]>([
    {
      id: "1",
      name: "Task 1",
      startDate: new Date(),
    },
    {
      id: "2",
      name: "Task 2",
      startDate: new Date(),
    },
  ]);

  // useEffect(() => {
  //   console.log("use effect");
  //   const lexicals = Object.fromEntries(
  //     gridRows.map((row) => [
  //       row.id,
  //       {
  //         description: createEditor({
  //           nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode],
  //         }),
  //       },
  //     ]),
  //   );
  //   handleRowUpdate({ ...lexicals, ...rows });
  // }, [gridRows]);

  // console.log(rows)

  return (
    <div
      style={{
        height: 400,
        width: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        margin: "10px 0",
      }}
    >
      <DataGridPro
        rows={gridRows}
        columns={columns}
        editMode="cell"
        processRowUpdate={processRowUpdate}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "solid #1976d2 1px",
          },
        }}
      />
      <div>
        <p>asd</p>
        <div className="image-caption-container">
          <LexicalNestedComposer initialEditor={node.__caption}>
            {/*<AutoFocusPlugin />*/}
            {/*<LinkPlugin />*/}
            <RichTextPlugin
              contentEditable={
                <LexicalContentEditable
                  placeholder="Enter a caption..."
                  placeholderClassName="ImageNode__placeholder"
                  className="ImageNode__contentEditable"
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {isCollabActive ? (
              <CollaborationPlugin
                id={`editor-test`}
                providerFactory={createWebsocketProvider}
                shouldBootstrap={true}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
          </LexicalNestedComposer>
        </div>
      </div>
    </div>
  );
};

export function $createGridNode(rows?: GridRow): GridNode {
  return $applyNodeReplacement(new GridNode(rows));
}

export function $isGridNode(
  node: LexicalNode | null | undefined,
): node is GridNode {
  return node instanceof GridNode;
}
