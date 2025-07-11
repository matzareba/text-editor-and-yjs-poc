import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  isTableCell,
  StyleSchema,
} from "@blocknote/core";

import { useComponentsContext } from "@blocknote/react";
import { useBlockNoteEditor } from "@blocknote/react";
import { useDictionary } from "@blocknote/react";
import { ColorPicker } from "../../../TableHandles/ColorPicker/ColorPicker";
import { TableCellMenuProps } from "../TableCellMenuProps";
import { ReactNode } from "react";
import { callSheetTableBlockType } from "../../../../consts";
import { mapTableCell } from "../../../../../coreTableHelpers";

export const ColorPickerButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableCellMenuProps<I, S> & {
    children?: ReactNode;
  }
) => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();
  const editor = useBlockNoteEditor<
    { table: DefaultBlockSchema["table"] },
    I,
    S
  >();

  const updateColor = (color: string, type: "text" | "background") => {
    const newTable = props.block.content.rows.map((row) => {
      return {
        ...row,
        cells: row.cells.map((cell) => mapTableCell(cell)),
      };
    });

    if (type === "text") {
      newTable[props.rowIndex].cells[props.colIndex].props.textColor = color;
    } else {
      newTable[props.rowIndex].cells[props.colIndex].props.backgroundColor =
        color;
    }

    editor.updateBlock(props.block, {
      // @ts-ignore TODO: fix this
      type: callSheetTableBlockType,
      content: {
        ...props.block.content,
        rows: newTable,
      },
    });

    // Have to reset text cursor position to the block as `updateBlock`
    // moves the existing selection out of the block.
    editor.setTextCursorPosition(props.block);
  };

  const currentCell =
    props.block.content.rows[props.rowIndex]?.cells?.[props.colIndex];

  if (
    !currentCell ||
    (editor.settings.tables.cellTextColor === false &&
      editor.settings.tables.cellBackgroundColor === false)
  ) {
    return null;
  }

  return (
    <Components.Generic.Menu.Root position={"right"} sub={true}>
      <Components.Generic.Menu.Trigger sub={true}>
        <Components.Generic.Menu.Item
          className={"bn-menu-item"}
          subTrigger={true}
        >
          {props.children || dict.drag_handle.colors_menuitem}
        </Components.Generic.Menu.Item>
      </Components.Generic.Menu.Trigger>

      <Components.Generic.Menu.Dropdown
        sub={true}
        className={"bn-menu-dropdown bn-color-picker-dropdown"}
      >
        <ColorPicker
          iconSize={18}
          text={
            editor.settings.tables.cellTextColor
              ? {
                  color: isTableCell(currentCell)
                    ? currentCell.props.textColor
                    : "default",
                  setColor: (color) => updateColor(color, "text"),
                }
              : undefined
          }
          background={
            editor.settings.tables.cellBackgroundColor
              ? {
                  color: isTableCell(currentCell)
                    ? currentCell.props.backgroundColor
                    : "default",
                  setColor: (color) => updateColor(color, "background"),
                }
              : undefined
          }
        />
      </Components.Generic.Menu.Dropdown>
    </Components.Generic.Menu.Root>
  );
};
