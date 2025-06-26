import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";

import { useComponentsContext } from "@blocknote/react";
import { useBlockNoteEditor } from "@blocknote/react";
import { useDictionary } from "@blocknote/react";
import { TableHandleMenuProps } from "../TableHandleMenuProps";
import { getCallSheetTableHandlesExtension } from "../../../CallSheetTableHandlesPlugin";

export const DeleteButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> & { orientation: "row" | "column" }
) => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();
  const editor = useBlockNoteEditor<
    { table: DefaultBlockSchema["table"] },
    I,
    S
  >();

  const tableHandles = getCallSheetTableHandlesExtension(editor);

  if (!tableHandles) {
    return null;
  }

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        tableHandles.removeRowOrColumn(props.index, props.orientation);
      }}
    >
      {props.orientation === "row"
        ? dict.table_handle.delete_row_menuitem
        : dict.table_handle.delete_column_menuitem}
    </Components.Generic.Menu.Item>
  );
};
