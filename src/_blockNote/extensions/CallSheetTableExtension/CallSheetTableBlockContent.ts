// https://github.com/TypeCellOS/BlockNote/blob/6418d47f52229dc1514a33459a1d099c9cad5846/packages/core/src/blocks/TableBlockContent/TableBlockContent.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { TableCell, TableCellOptions } from "@tiptap/extension-table-cell";
import { TableHeaderOptions } from "@tiptap/extension-table-header";
import { DOMParser, Fragment, Node as PMNode, Schema } from "prosemirror-model";
import { TableView } from "prosemirror-tables";
import { NodeView } from "prosemirror-view";
import {
  EMPTY_CELL_WIDTH,
  CallSheetTableExtension,
} from "./CallSheetTableExtension";
import {
  defaultProps,
  mergeCSSClasses,
  createDefaultBlockDOMOutputSpec,
  createBlockSpecFromStronglyTypedTiptapNode,
  createStronglyTypedTiptapNode,
} from "@blocknote/core";
import { callSheetTableBlockType } from "./consts";
import TalentSelect from "../../components/TalentSelectNode/TalentSelect";
import { createRoot } from "react-dom/client";
import React from "react";

export const callSheetTablePropSchema = {
  textColor: defaultProps.textColor,
};

export const CallSheetTableBlockContent = createStronglyTypedTiptapNode({
  name: callSheetTableBlockType,
  content: "tableRow+",
  group: "blockContent",
  tableRole: "table",

  marks: "deletion insertion modification",
  isolating: true,

  parseHTML() {
    return [
      {
        tag: "table",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return createDefaultBlockDOMOutputSpec(
      this.name,
      "table",
      {
        ...(this.options.domAttributes?.blockContent || {}),
        ...HTMLAttributes,
      },
      this.options.domAttributes?.inlineContent || {}
    );
  },

  // This node view is needed for the `columnResizing` plugin. By default, the
  // plugin adds its own node view, which overrides how the node is rendered vs
  // `renderHTML`. This means that the wrapping `blockContent` HTML element is
  // no longer rendered. The `columnResizing` plugin uses the `TableView` as its
  // default node view. `BlockNoteTableView` extends it by wrapping it in a
  // `blockContent` element, so the DOM structure is consistent with other block
  // types.
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      class BlockNoteTableView extends TableView {
        constructor(
          public node: PMNode,
          public cellMinWidth: number,
          public blockContentHTMLAttributes: Record<string, string>
        ) {
          super(node, cellMinWidth);

          const blockContent = document.createElement("div");
          blockContent.className = mergeCSSClasses(
            "bn-block-content",
            blockContentHTMLAttributes.class
          );
          blockContent.setAttribute("data-content-type", "table");
          blockContent.setAttribute("data-table-type", "callSheetTable");
          for (const [attribute, value] of Object.entries(
            blockContentHTMLAttributes
          )) {
            if (attribute !== "class") {
              blockContent.setAttribute(attribute, value);
            }
          }

          const tableWrapper = this.dom;

          const tableWrapperInner = document.createElement("div");
          tableWrapperInner.className = "tableWrapper-inner";
          tableWrapperInner.appendChild(tableWrapper.firstChild!);

          tableWrapper.appendChild(tableWrapperInner);

          blockContent.appendChild(tableWrapper);
          const floatingContainer = document.createElement("div");
          floatingContainer.className = "table-widgets-container";
          floatingContainer.style.position = "relative";
          tableWrapper.appendChild(floatingContainer);

          this.dom = blockContent;
        }

        ignoreMutation(record: MutationRecord): boolean {
          return (
            !(record.target as HTMLElement).closest(".tableWrapper-inner") ||
            super.ignoreMutation(record)
          );
        }
      }

      return new BlockNoteTableView(node, EMPTY_CELL_WIDTH, {
        ...(this.options.domAttributes?.blockContent || {}),
        ...HTMLAttributes,
      }) as NodeView; // needs cast, tiptap types (wrongly) doesn't support return tableview here
    };
  },
});

const TableParagraph = createStronglyTypedTiptapNode({
  name: "tableParagraph",
  group: "tableContent",
  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (element) => {
          if (typeof element === "string" || !element.textContent) {
            return false;
          }

          // Only parse in internal HTML.
          if (!element.closest("[data-content-type]")) {
            return false;
          }

          const parent = element.parentElement;

          if (parent === null) {
            return false;
          }

          if (parent.tagName === "TD" || parent.tagName === "TH") {
            return {};
          }

          return false;
        },
        node: "tableParagraph",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", HTMLAttributes, 0];
  },
});

/**
 * This extension allows you to create table rows.
 * @see https://www.tiptap.dev/api/nodes/table-row
 */
export const CallSheetTableRow = Node.create<{
  HTMLAttributes: Record<string, any>;
}>({
  name: "tableRow",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "(tableCell | tableHeader)+",

  tableRole: "row",
  marks: "deletion insertion modification",
  parseHTML() {
    return [{ tag: "tr" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "tr",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

/*
 * This will flatten a node's content to fit into a table cell's paragraph.
 */
function parseTableContent(node: HTMLElement, schema: Schema) {
  const parser = DOMParser.fromSchema(schema);

  // This will parse the content of the table paragraph as though it were a blockGroup.
  // Resulting in a structure like:
  // <blockGroup>
  //   <blockContainer>
  //     <p>Hello</p>
  //   </blockContainer>
  //   <blockContainer>
  //     <p>Hello</p>
  //   </blockContainer>
  // </blockGroup>
  const parsedContent = parser.parse(node, {
    topNode: schema.nodes.blockGroup.create(),
  });
  const extractedContent: PMNode[] = [];

  // Try to extract any content within the blockContainer.
  parsedContent.content.descendants((child) => {
    // As long as the child is an inline node, we can append it to the fragment.
    if (child.isInline) {
      // And append it to the fragment
      extractedContent.push(child);
      return false;
    }

    return undefined;
  });

  return Fragment.fromArray(extractedContent);
}

export const CallSheetTableHeader = Node.create<TableHeaderOptions>({
  name: "tableHeader",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth
            ? colwidth.split(",").map((width) => parseInt(width, 10))
            : null;

          return value;
        },
      },
      "data-type": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes["data-type"]) {
            return {};
          }
          return { "data-type": attributes["data-type"] };
        },
      },
    };
  },

  tableRole: "header_cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "th" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "th",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  // attributes added beyond tiptap table header
  content: "tableContent+",

  // parseHTML() {
  //   return [
  //     {
  //       tag: "th",
  //       // As `th` elements can contain multiple paragraphs, we need to merge their contents
  //       // into a single one so that ProseMirror can parse everything correctly.
  //       getContent: (node, schema) =>
  //         parseTableContent(node as HTMLElement, schema),
  //     },
  //   ];
  // },

  addNodeView() {
    return ({ HTMLAttributes, node }) => {
      const dom = document.createElement("th");
      dom.style.position = "relative";

      for (const [attribute, value] of Object.entries(HTMLAttributes)) {
        dom.setAttribute(attribute, value);
      }

      let contentDOM: HTMLElement | null = null;

      if (node.attrs["data-type"] === "duration") {
        // read only column header
        const element = document.createElement("div");
        element.textContent = "Duration";

        // TODO: add updating state

        // const option10 = document.createElement("option");
        // option10.value = "10:00";
        // option10.textContent = "10:00";
        // selectElement.appendChild(option10);

        // const option30 = document.createElement("option");
        // option30.value = "30:00";
        // option30.textContent = "30:00";
        // selectElement.appendChild(option30);

        dom.appendChild(element);
        contentDOM = null;
      } else {
        contentDOM = document.createElement("div");
        contentDOM.className = "content-editable";
        dom.appendChild(contentDOM);
      }

      // TODO: adding parseTableContent here is most likely needed?

      return {
        dom,
        contentDOM,
        ignoreMutation: () => false,
      };
    };
  },
});

export const CallSheetTableCell = Node.create<TableCellOptions>({
  name: "tableCell",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  // content: "block+",

  // addAttributes() {
  //   return {
  //     colspan: {
  //       default: 1,
  //     },
  //     rowspan: {
  //       default: 1,
  //     },
  //     colwidth: {
  //       default: null,
  //       parseHTML: (element) => {
  //         const colwidth = element.getAttribute("colwidth");
  //         const value = colwidth
  //           ? colwidth.split(",").map((width) => parseInt(width, 10))
  //           : null;

  //         return value;
  //       },
  //     },
  //   };
  // },

  tableRole: "cell",

  isolating: true,

  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  content: "tableContent+",
  parseHTML() {
    return [
      {
        tag: "td",
        // As `td` elements can contain multiple paragraphs, we need to merge their contents
        // into a single one so that ProseMirror can parse everything correctly.
        getContent: (node, schema) =>
          parseTableContent(node as HTMLElement, schema),
      },
    ];
  },
  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth
            ? colwidth.split(",").map((width) => parseInt(width, 10))
            : null;

          return value;
        },
      },
      "data-type": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes["data-type"]) {
            return {};
          }
          return { "data-type": attributes["data-type"] };
        },
      },
    };
  },
  addNodeView() {
    return ({ HTMLAttributes, node, getPos, view }) => {
      const dom = document.createElement("td");
      dom.style.position = "relative";

      for (const [attribute, value] of Object.entries(HTMLAttributes)) {
        dom.setAttribute(attribute, value);
      }

      let contentDOM: HTMLElement | null = null;
      let reactRoot: any = null;

      if (node.attrs["data-type"] === "person") {
        const talentContainer = document.createElement("div");
        talentContainer.className = "talent-select-container";
        dom.appendChild(talentContainer);

        reactRoot = createRoot(talentContainer);

        let currentTalent = "";
        if (node.content.size > 0) {
          const firstChild = node.content.firstChild;
          if (firstChild && firstChild.textContent) {
            currentTalent = firstChild.textContent.trim();
          }
        }

        const inlineContent = {
          type: "talentSelectNode",
          props: {
            talent: currentTalent,
          },
        };

        const updateInlineContent = (newContent: any) => {
          if (typeof getPos === "function") {
            const pos = getPos();
            if (pos !== undefined) {
              const tr = view.state.tr;
              const textNode = view.state.schema.text(newContent.props.talent);
              const paragraphNode =
                view.state.schema.nodes.tableParagraph.create({}, textNode);
              tr.replaceWith(pos + 1, pos + node.nodeSize - 1, paragraphNode);
              view.dispatch(tr);
            }
          }
        };

        reactRoot.render(
          React.createElement(TalentSelect, {
            inlineContent,
            updateInlineContent,
            contentRef: null,
          })
        );

        contentDOM = null;
      } else {
        contentDOM = document.createElement("div");
        contentDOM.className = "content-editable";
        dom.appendChild(contentDOM);
      }

      return {
        dom,
        contentDOM,
        ignoreMutation: (mutation) => {
          if (node.attrs["data-type"] === "person") {
            const target = mutation.target as HTMLElement;
            return target.closest(".talent-select-container") !== null;
          }
          return false;
        },

        destroy: () => {
          if (reactRoot) {
            reactRoot.unmount();
            reactRoot = null;
          }
        },
      };
    };
  },
});

export const CallSheetTable = createBlockSpecFromStronglyTypedTiptapNode(
  CallSheetTableBlockContent,
  callSheetTablePropSchema,
  [
    CallSheetTableExtension,
    TableParagraph,
    CallSheetTableHeader,
    CallSheetTableCell,
    CallSheetTableRow,
  ]
);
