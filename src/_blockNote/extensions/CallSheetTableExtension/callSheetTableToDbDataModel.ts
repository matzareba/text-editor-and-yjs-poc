import {
  Block,
  BlockNoteEditor,
  BlockSchemaFromSpecs,
  InlineContentSchemaFromSpecs,
} from "@blocknote/core";
import { defaultCallSheetNode } from "../../../callSheet/defaultCallSheetNode";
import { blockSpecs } from "../../components/blockNoteSchema";

export type CallSheetDbDataModel = Record<string, string>[];

const extractCellText = (cell: any): string => {
  if (!cell.content || cell.content.length === 0) {
    return "";
  }

  return cell.content
    .map((contentItem: any) => contentItem.text || "")
    .join("")
    .trim();
};

export const callSheetTableToDbDataModel = (
  tableNode: typeof defaultCallSheetNode
): CallSheetDbDataModel => {
  const { content } = tableNode;

  if (!content || !content.rows || content.rows.length === 0) {
    return [];
  }

  const rows = content.rows;
  const headerRowIndex = 0;

  const headers: string[] = rows[headerRowIndex].cells.map((cell: any) =>
    extractCellText(cell)
  );

  const dataRows = rows.slice(headerRowIndex + 1);

  const result: CallSheetDbDataModel = [];

  for (const row of dataRows) {
    const rowData: Record<string, string> = {};
    let hasContent = false;

    row.cells.forEach((cell: any, index: number) => {
      const headerKey = headers[index] || `Column_${index + 1}`;
      const cellValue = extractCellText(cell);

      rowData[headerKey] = cellValue;

      if (cellValue) {
        hasContent = true;
      }
    });

    if (hasContent) {
      result.push(rowData);
    }
  }

  return result;
};

export const getCallSheetDbDataModel = (
  doc: Block<BlockSchemaFromSpecs<typeof blockSpecs>, any>[]
) => {
  const callsheetTableNode = doc.find((node) => node.type === "callSheetTable");

  return callsheetTableNode
    ? callSheetTableToDbDataModel(callsheetTableNode as any)
    : null;
};
