// https://github.com/TypeCellOS/BlockNote/blob/3e94d1a38f0a15f86d894461d7dc908ea4cc7802/packages/react/src/components/TableHandles/TableHandlesController.tsx
import {
  BlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { FC, useCallback, useMemo, useState } from "react";

import { FloatingPortal } from "@floating-ui/react";
import { useBlockNoteEditor, useUIPluginState } from "@blocknote/react";
import { ExtendButton } from "./TableHandles/ExtendButton/ExtendButton";
import { ExtendButtonProps } from "./TableHandles/ExtendButton/ExtendButtonProps";
import { TableHandle } from "./TableHandles/TableHandle";
import { TableHandleProps } from "./TableHandles/TableHandleProps";
import { useExtendButtonsPositioning } from "./TableHandles/hooks/useExtendButtonsPositioning";
import { useTableHandlesPositioning } from "./TableHandles/hooks/useTableHandlesPositioning";
import { TableCellButton } from "./TableHandles/TableCellButton";
import { TableCellButtonProps } from "./TableHandles/TableCellButtonProps";
import { getCallSheetTableHandlesExtension } from "./CallSheetTableHandlesPlugin";

export const CallSheetTableHandlesController = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(props: {
  tableCellHandle?: FC<TableCellButtonProps<I, S>>;
  tableHandle?: FC<TableHandleProps<I, S>>;
  extendButton?: FC<ExtendButtonProps<I, S>>;
}) => {
  const editor = useBlockNoteEditor<BlockSchema, I, S>();

  const [menuContainerRef, setMenuContainerRef] =
    useState<HTMLDivElement | null>(null);

  const callSheetTableHandlesExtension =
    getCallSheetTableHandlesExtension(editor);

  if (!callSheetTableHandlesExtension) {
    throw new Error(
      "CallSheetTableHandlesController can only be used when BlockNote editor schema contains callSheetTable extension"
    );
  }

  const callbacks = {
    rowDragStart: callSheetTableHandlesExtension.rowDragStart,
    colDragStart: callSheetTableHandlesExtension.colDragStart,
    dragEnd: callSheetTableHandlesExtension.dragEnd,
    freezeHandles: callSheetTableHandlesExtension.freezeHandles,
    unfreezeHandles: callSheetTableHandlesExtension.unfreezeHandles,
  };

  const { freezeHandles, unfreezeHandles } = callbacks;

  const onStartExtend = useCallback(() => {
    freezeHandles();
    setHideCol(true);
    setHideRow(true);
  }, [freezeHandles]);

  const onEndExtend = useCallback(() => {
    unfreezeHandles();
    setHideCol(false);
    setHideRow(false);
  }, [unfreezeHandles]);

  // TODO: fix this - remove any
  const state: any = useUIPluginState(
    callSheetTableHandlesExtension.onUpdate.bind(callSheetTableHandlesExtension)
  );

  const draggingState = useMemo(() => {
    return state?.draggingState
      ? {
          draggedCellOrientation: state?.draggingState?.draggedCellOrientation,
          mousePos: state?.draggingState?.mousePos,
        }
      : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state?.draggingState,
    state?.draggingState?.draggedCellOrientation,
    state?.draggingState?.mousePos,
  ]);

  const { rowHandle, colHandle, cellHandle } = useTableHandlesPositioning(
    state?.show || false,
    state?.referencePosCell || null,
    state?.referencePosTable || null,
    draggingState
  );

  const { addOrRemoveColumnsButton, addOrRemoveRowsButton } =
    useExtendButtonsPositioning(
      state?.showAddOrRemoveColumnsButton || false,
      state?.showAddOrRemoveRowsButton || false,
      state?.referencePosTable || null
    );

  const [hideRow, setHideRow] = useState<boolean>(false);
  const [hideCol, setHideCol] = useState<boolean>(false);

  if (!state) {
    return null;
  }

  const TableHandleComponent = props.tableHandle || TableHandle;
  const ExtendButtonComponent = props.extendButton || ExtendButton;
  const TableCellHandleComponent = props.tableCellHandle || TableCellButton;

  return (
    <>
      <div ref={setMenuContainerRef}></div>
      {/* we want to make sure the elements are clipped by the .tableWrapper element (so that we scroll the table, widgets also dissappear)
      we do this by rendering in a portal into the table's widget container (defined in TableBlockContent.ts)
      */}
      <FloatingPortal root={state.widgetContainer}>
        {!hideRow &&
          menuContainerRef &&
          rowHandle.isMounted &&
          state.rowIndex !== undefined && (
            <div ref={rowHandle.ref} style={rowHandle.style}>
              <TableHandleComponent
                // This "as any" unfortunately seems complicated to fix
                editor={editor as any}
                orientation={"row"}
                showOtherSide={() => setHideCol(false)}
                hideOtherSide={() => setHideCol(true)}
                index={state.rowIndex}
                block={state.block}
                dragStart={callbacks.rowDragStart}
                dragEnd={callbacks.dragEnd}
                freezeHandles={callbacks.freezeHandles}
                unfreezeHandles={callbacks.unfreezeHandles}
                menuContainer={menuContainerRef}
              />
            </div>
          )}
        {!hideCol &&
          menuContainerRef &&
          colHandle.isMounted &&
          state.colIndex !== undefined && (
            <div ref={colHandle.ref} style={colHandle.style}>
              <TableHandleComponent
                editor={editor as any}
                orientation={"column"}
                showOtherSide={() => setHideRow(false)}
                hideOtherSide={() => setHideRow(true)}
                index={state.colIndex}
                block={state.block}
                dragStart={callbacks.colDragStart}
                dragEnd={callbacks.dragEnd}
                freezeHandles={callbacks.freezeHandles}
                unfreezeHandles={callbacks.unfreezeHandles}
                menuContainer={menuContainerRef}
              />
            </div>
          )}

        {menuContainerRef &&
          cellHandle.isMounted &&
          state.colIndex !== undefined &&
          state.rowIndex !== undefined && (
            <div ref={cellHandle.ref} style={cellHandle.style}>
              <TableCellHandleComponent
                editor={editor as any}
                block={state.block}
                rowIndex={state.rowIndex}
                colIndex={state.colIndex}
                menuContainer={menuContainerRef}
                freezeHandles={callbacks.freezeHandles}
                unfreezeHandles={callbacks.unfreezeHandles}
              />
            </div>
          )}

        {/* note that the extend buttons are always shown (we don't look at isMounted etc,
        because otherwise the table slightly shifts when they unmount  */}
        <div
          ref={addOrRemoveRowsButton.ref}
          style={addOrRemoveRowsButton.style}
        >
          <ExtendButtonComponent
            editor={editor as any}
            orientation={"addOrRemoveRows"}
            block={state.block}
            onMouseDown={onStartExtend}
            onMouseUp={onEndExtend}
          />
        </div>
        <div
          ref={addOrRemoveColumnsButton.ref}
          style={addOrRemoveColumnsButton.style}
        >
          <ExtendButtonComponent
            editor={editor as any}
            orientation={"addOrRemoveColumns"}
            block={state.block}
            onMouseDown={onStartExtend}
            onMouseUp={onEndExtend}
          />
        </div>
      </FloatingPortal>
    </>
  );
};
