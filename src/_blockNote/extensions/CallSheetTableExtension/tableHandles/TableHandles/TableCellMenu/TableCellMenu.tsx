import {
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { ReactNode } from "react";

import { useComponentsContext } from "@blocknote/react";
import { ColorPickerButton } from "./DefaultButtons/ColorPicker";
import { SplitButton } from "./DefaultButtons/SplitButton";
import { TableCellMenuProps } from "./TableCellMenuProps";

export const TableCellMenu = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableCellMenuProps<I, S> & { children?: ReactNode }
) => {
  const Components = useComponentsContext()!;

  return (
    <Components.Generic.Menu.Dropdown
      className={"bn-menu-dropdown bn-drag-handle-menu"}
    >
      {props.children || (
        <>
          <SplitButton
            block={props.block}
            rowIndex={props.rowIndex}
            colIndex={props.colIndex}
          />
          <ColorPickerButton
            block={props.block}
            rowIndex={props.rowIndex}
            colIndex={props.colIndex}
          />
        </>
      )}
    </Components.Generic.Menu.Dropdown>
  );
};
