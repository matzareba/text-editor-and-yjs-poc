import {
  BlockNoteSchema,
  BlockSpecs,
  defaultBlockSpecs,
} from "@blocknote/core";
import { BlockNoteLemonlightButton } from "./BlockNoteLemonlightButton/BlockNoteLemonlightButton";
import { CallSheetTable } from "../extensions/CallSheetTableExtension/CallSheetTableBlockContent";

const { table: _, ...selectedBlockSpecs } = defaultBlockSpecs;

export const blockSpecs: BlockSpecs = {
  ...selectedBlockSpecs,
  callSheetTable: CallSheetTable,
  lemonlightButton: BlockNoteLemonlightButton,
};

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs,
});

export type BlockNoteEditorType = typeof blockNoteSchema.BlockNoteEditor;
