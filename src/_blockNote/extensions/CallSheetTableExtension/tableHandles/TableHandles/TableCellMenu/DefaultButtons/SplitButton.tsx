import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  getColspan,
  getRowspan,
  InlineContentSchema,
  isTableCell,
  StyleSchema,
} from "@blocknote/core";

import { useComponentsContext } from "@blocknote/react";
import { useBlockNoteEditor } from "@blocknote/react";
import { useDictionary } from "@blocknote/react";
import { TableCellMenuProps } from "../TableCellMenuProps";
import { getCallSheetTableHandlesExtension } from "../../../CallSheetTableHandlesPlugin";

export const SplitButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableCellMenuProps<I, S>
) => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();
  const editor = useBlockNoteEditor<
    { table: DefaultBlockSchema["table"] },
    I,
    S
  >();

  const currentCell =
    props.block.content.rows[props.rowIndex]?.cells?.[props.colIndex];

  if (
    !currentCell ||
    !isTableCell(currentCell) ||
    (getRowspan(currentCell) === 1 && getColspan(currentCell) === 1) ||
    !editor.settings.tables.splitCells
  ) {
    return null;
  }

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        getCallSheetTableHandlesExtension(editor)?.splitCell({
          row: props.rowIndex,
          col: props.colIndex,
        });
      }}
    >
      {dict.table_handle.split_cell_menuitem}
    </Components.Generic.Menu.Item>
  );
};
