import {
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { ReactNode } from "react";
import { TableHandleMenuProps } from "../tableHandles/TableHandles/TableHandleMenu/TableHandleMenuProps";

const nonRemovableColumnHeaders = ["Start Time", "Duration"];

export const useEnableDeleteButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> & { children?: ReactNode }
) => {
  if (
    props.orientation === "column" &&
    nonRemovableColumnHeaders.includes(
      // @ts-ignore TODO: fix this
      props.block?.content.rows[0].cells[props.index].content[0]?.text
    )
  ) {
    return false;
  }

  return true;
};
