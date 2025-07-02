import {
  InlineContent,
  isPartialTableCell,
  isTableCell,
  TableCell,
  StyleSchema,
  PartialTableCell,
  PartialInlineContent,
  InlineContentSchema,
} from "@blocknote/core";

/**
 * This will map a table cell to a TableCell object.
 * This is useful for when we want to get the full table cell object from a partial table cell.
 * It is guaranteed to return a new TableCell object.
 */
export function mapTableCell<
  T extends InlineContentSchema,
  S extends StyleSchema
>(
  content: PartialInlineContent<T, S> | PartialTableCell<T, S> | TableCell<T, S>
): TableCell<T, S> {
  return isTableCell(content)
    ? { ...content }
    : isPartialTableCell(content)
    ? {
        type: "tableCell",
        content: ([] as InlineContent<T, S>[]).concat(content.content as any),
        props: {
          backgroundColor: content.props?.backgroundColor ?? "default",
          textColor: content.props?.textColor ?? "default",
          textAlignment: content.props?.textAlignment ?? "left",
          colspan: content.props?.colspan ?? 1,
          rowspan: content.props?.rowspan ?? 1,
          // @ts-ignore TODO: fix this
          ...(content.props?.["data-type"]
            ? // @ts-ignore TODO: fix this
              { "data-type": content.props?.["data-type"] }
            : {}),
        },
      }
    : {
        type: "tableCell",
        content: ([] as InlineContent<T, S>[]).concat(content as any),
        props: {
          backgroundColor: "default",
          textColor: "default",
          textAlignment: "left",
          colspan: 1,
          rowspan: 1,
          // @ts-ignore TODO: fix this
          ...(content.props?.["data-type"]
            ? // @ts-ignore TODO: fix this
              { "data-type": content.props?.["data-type"] }
            : {}),
        },
      };
}
