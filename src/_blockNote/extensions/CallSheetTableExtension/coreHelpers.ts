import {
  Block,
  BlockSchema,
  InlineContent,
  InlineContentSchema,
  isStyledTextInlineContent,
  StyleSchema,
  TableCell,
  TableContent,
} from "@blocknote/core";
import { Mark, Node, Schema, Slice } from "@tiptap/pm/model";
import {
  getBlockCache,
  getBlockInfoWithManualOffset,
  getBlockSchema,
  getInlineContentSchema,
  getStyleSchema,
} from "@blocknote/core";
import { UniqueID } from "@blocknote/core";
import { contentNodeToInlineContent } from "@blocknote/core";
import { UnreachableCaseError } from "@blocknote/core";

export function nodeToBlock<
  BSchema extends BlockSchema,
  I extends InlineContentSchema,
  S extends StyleSchema
>(
  node: Node,
  schema: Schema,
  blockSchema: BSchema = getBlockSchema(schema) as BSchema,
  inlineContentSchema: I = getInlineContentSchema(schema) as I,
  styleSchema: S = getStyleSchema(schema) as S,
  blockCache = getBlockCache(schema)
): Block<BSchema, I, S> {
  if (!node.type.isInGroup("bnBlock")) {
    throw Error("Node should be a bnBlock, but is instead: " + node.type.name);
  }
  const blockInfo = getBlockInfoWithManualOffset(node, 0);

  let id = blockInfo.bnBlock.node.attrs.id;

  // Only used for blocks converted from other formats.
  if (id === null) {
    id = UniqueID.options.generateID();
  }

  const blockSpec = blockSchema[blockInfo.blockNoteType];

  if (!blockSpec) {
    throw Error("Block is of an unrecognized type: " + blockInfo.blockNoteType);
  }

  const props: any = {};
  for (const [attr, value] of Object.entries({
    ...node.attrs,
    ...(blockInfo.isBlockContainer ? blockInfo.blockContent.node.attrs : {}),
  })) {
    const propSchema = blockSpec.propSchema;

    if (
      attr in propSchema &&
      !(propSchema[attr].default === undefined && value === undefined)
    ) {
      props[attr] = value;
    }
  }

  const blockConfig = blockSchema[blockInfo.blockNoteType];

  const children: Block<BSchema, I, S>[] = [];
  blockInfo.childContainer?.node.forEach((child) => {
    children.push(
      nodeToBlock(
        child,
        schema,
        blockSchema,
        inlineContentSchema,
        styleSchema,
        blockCache
      )
    );
  });

  let content: Block<any, any, any>["content"];

  if (blockConfig.content === "inline") {
    if (!blockInfo.isBlockContainer) {
      throw new Error("impossible");
    }
    content = contentNodeToInlineContent(
      blockInfo.blockContent.node,
      inlineContentSchema,
      styleSchema
    );
  } else if (blockConfig.content === "table") {
    if (!blockInfo.isBlockContainer) {
      throw new Error("impossible");
    }
    content = contentNodeToTableContent(
      blockInfo.blockContent.node,
      inlineContentSchema,
      styleSchema
    );
  } else if (blockConfig.content === "none") {
    content = undefined;
  } else {
    throw new UnreachableCaseError(blockConfig.content);
  }

  const block = {
    id,
    type: blockConfig.type,
    props,
    content,
    children,
  } as Block<BSchema, I, S>;

  debugger;

  return block;
}

export function contentNodeToTableContent<
  I extends InlineContentSchema,
  S extends StyleSchema
>(contentNode: Node, inlineContentSchema: I, styleSchema: S) {
  const ret: TableContent<I, S> = {
    type: "tableContent",
    columnWidths: [],
    headerRows: undefined,
    headerCols: undefined,
    rows: [],
  };

  /**
   * A matrix of boolean values indicating whether a cell is a header.
   * The first index is the row index, the second index is the cell index.
   */
  const headerMatrix: boolean[][] = [];

  contentNode.content.forEach((rowNode, _offset, rowIndex) => {
    const row: TableContent<I, S>["rows"][0] = {
      cells: [],
    };

    if (rowIndex === 0) {
      rowNode.content.forEach((cellNode) => {
        let colWidth = cellNode.attrs.colwidth as null | undefined | number[];
        if (colWidth === undefined || colWidth === null) {
          colWidth = new Array(cellNode.attrs.colspan ?? 1).fill(undefined);
        }
        ret.columnWidths.push(...colWidth);
      });
    }

    row.cells = rowNode.content.content.map((cellNode, cellIndex) => {
      if (!headerMatrix[rowIndex]) {
        headerMatrix[rowIndex] = [];
      }
      // Mark the cell as a header if it is a tableHeader node.
      headerMatrix[rowIndex][cellIndex] = cellNode.type.name === "tableHeader";
      // Convert cell content to inline content and merge adjacent styled text nodes
      const content = cellNode.content.content
        .map((child) =>
          contentNodeToInlineContent(child, inlineContentSchema, styleSchema)
        )
        // The reason that we merge this content is that we allow table cells to contain multiple tableParagraph nodes
        // So that we can leverage prosemirror-tables native merging
        // If the schema only allowed a single tableParagraph node, then the merging would not work and cause prosemirror to fit the content into a new cell
        .reduce((acc, contentPartial) => {
          if (!acc.length) {
            return contentPartial;
          }

          const last = acc[acc.length - 1];
          const first = contentPartial[0];

          // Only merge if the last and first content are both styled text nodes and have the same styles
          if (
            first &&
            isStyledTextInlineContent(last) &&
            isStyledTextInlineContent(first) &&
            JSON.stringify(last.styles) === JSON.stringify(first.styles)
          ) {
            // Join them together if they have the same styles
            last.text += "\n" + first.text;
            acc.push(...contentPartial.slice(1));
            return acc;
          }
          acc.push(...contentPartial);
          return acc;
        }, [] as InlineContent<I, S>[]);

      return {
        type: "tableCell",
        content,
        props: {
          colspan: cellNode.attrs.colspan,
          rowspan: cellNode.attrs.rowspan,
          backgroundColor: cellNode.attrs.backgroundColor,
          textColor: cellNode.attrs.textColor,
          textAlignment: cellNode.attrs.textAlignment,
          ...(cellNode.attrs["data-type"]
            ? { "data-type": cellNode.attrs["data-type"] }
            : {}),
        },
      } satisfies TableCell<I, S>;
    });

    ret.rows.push(row);
  });

  for (let i = 0; i < headerMatrix.length; i++) {
    if (headerMatrix[i]?.every((isHeader) => isHeader)) {
      ret.headerRows = (ret.headerRows ?? 0) + 1;
    }
  }

  for (let i = 0; i < headerMatrix[0]?.length; i++) {
    if (headerMatrix?.every((row) => row[i])) {
      ret.headerCols = (ret.headerCols ?? 0) + 1;
    }
  }

  return ret;
}
