import {
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { ReactNode } from "react";

import { useComponentsContext } from "@blocknote/react";
import { AddButton } from "./DefaultButtons/AddButton";
import { DeleteButton } from "./DefaultButtons/DeleteButton";
import { TableHandleMenuProps } from "./TableHandleMenuProps";
import { ColorPickerButton } from "./DefaultButtons/ColorPicker";
import { TableHeaderColumnButton } from "./DefaultButtons/TableHeaderButton";
import { TableHeaderRowButton } from "./DefaultButtons/TableHeaderButton";
import { useEnableDeleteButton } from "../../../hooks/useEnableDeleteButton";

export const TableHandleMenu = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> & { children?: ReactNode }
) => {
  const Components = useComponentsContext()!;
  const isDeleteEnabled = useEnableDeleteButton(props);

  return (
    <Components.Generic.Menu.Dropdown className={"bn-table-handle-menu"}>
      {props.children || (
        <>
          {isDeleteEnabled && (
            <DeleteButton
              orientation={props.orientation}
              block={props.block}
              index={props.index}
            />
          )}
          <AddButton
            orientation={props.orientation}
            block={props.block}
            index={props.index}
            side={props.orientation === "row" ? "above" : ("left" as any)}
          />
          <AddButton
            orientation={props.orientation}
            block={props.block}
            index={props.index}
            side={props.orientation === "row" ? "below" : ("right" as any)}
          />
          <TableHeaderRowButton
            orientation={props.orientation}
            block={props.block}
            index={props.index}
          />
          <TableHeaderColumnButton
            orientation={props.orientation}
            block={props.block}
            index={props.index}
          />
          <ColorPickerButton
            orientation={props.orientation}
            block={props.block}
            index={props.index}
          />
        </>
      )}
    </Components.Generic.Menu.Dropdown>
  );
};
