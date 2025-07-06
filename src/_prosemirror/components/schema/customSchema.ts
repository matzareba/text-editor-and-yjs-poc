import { Attrs, NodeSpec, Schema, Node } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { MutableAttrs, tableNodes } from "prosemirror-tables";
import { options } from "linkifyjs";

function getCellAttrs(dom: HTMLElement | string, extraAttrs: Attrs): Attrs {
  if (typeof dom === "string") {
    return {};
  }

  const widthAttr = dom.getAttribute("data-colwidth");
  const widths =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(",").map((s) => Number(s))
      : null;
  const colspan = Number(dom.getAttribute("colspan") || 1);
  const result: MutableAttrs = {
    colspan,
    rowspan: Number(dom.getAttribute("rowspan") || 1),
    colwidth: widths && widths.length == colspan ? widths : null,
  };
  for (const prop in extraAttrs) {
    const getter = extraAttrs[prop].getFromDOM;
    const value = getter && getter(dom);
    if (value != null) {
      result[prop] = value;
    }
  }
  return result;
}

function setCellAttrs(node: Node, extraAttrs: Attrs): Attrs {
  const attrs: MutableAttrs = {};
  if ((node as any).attrs.colspan != 1)
    attrs.colspan = (node as any).attrs.colspan;
  if ((node as any).attrs.rowspan != 1)
    attrs.rowspan = (node as any).attrs.rowspan;
  if ((node as any).attrs.colwidth)
    attrs["data-colwidth"] = (node as any).attrs.colwidth.join(",");
  for (const prop in extraAttrs) {
    attrs[prop] = extraAttrs[prop];
  }
  return attrs;
}

export function createCustomSchema(): Schema {
  // Start with basic schema and add list nodes
  const basicWithLists = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks,
  });

  const tableNodesCreated = tableNodes({
    cellContent: "block*",
    tableGroup: "block",
    cellAttributes: {},
  });

  const textCellNode: NodeSpec = {
    ...tableNodesCreated.table_cell,
    toDOM: (node) => {
      return ["td", setCellAttrs(node, { "data-type": "text-cell" }), 0];
    },
    parseDOM: [
      {
        tag: "td[data-type='text-cell']",
        getAttrs: (dom) => getCellAttrs(dom, { "data-type": "date-cell" }),
      },
    ],
  };

  const dateCellNode: NodeSpec = {
    ...tableNodesCreated.table_cell,
    toDOM: (node) => {
      return ["td", setCellAttrs(node, { "data-type": "date-cell" }), 0];
    },
    parseDOM: [
      {
        tag: "td[data-type='date-cell']",
        getAttrs: (dom) => getCellAttrs(dom, {}),
      },
    ],
  };

  const tableRowNode: NodeSpec = {
    ...tableNodesCreated.table_row,
    content: "date_cell text_cell date_cell",
  };

  const withTables = new Schema({
    nodes: basicWithLists.spec.nodes.append({
      table: tableNodesCreated.table,
      table_row: tableRowNode,
      table_header: tableNodesCreated.table_header,
      date_cell: dateCellNode,
      text_cell: textCellNode,
    }),
    marks: basicWithLists.spec.marks,
  });

  // Add our custom nodes
  const customNodes = withTables.spec.nodes;

  return new Schema({
    nodes: customNodes,
    marks: withTables.spec.marks,
  });
}
