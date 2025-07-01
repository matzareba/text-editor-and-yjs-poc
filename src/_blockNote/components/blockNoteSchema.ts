import {
  BlockNoteSchema,
  BlockSpecs,
  defaultBlockSpecs,
  InlineContentSpecs,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import { BlockNoteLemonlightButton } from "./BlockNoteLemonlightButton/BlockNoteLemonlightButton";
import { CallSheetTable } from "../extensions/CallSheetTableExtension/CallSheetTableBlockContent";
import { TalentSelectNode } from "./TalentSelectNode/TalentSelectNode";

const { table: _, ...selectedBlockSpecs } = defaultBlockSpecs;

export const blockSpecs: BlockSpecs = {
  ...selectedBlockSpecs,
  lemonlightButton: BlockNoteLemonlightButton,
  callSheetTable: CallSheetTable,
};

export const inlineContentSpecs: InlineContentSpecs = {
  ...defaultInlineContentSpecs,
  talentSelectNode: TalentSelectNode,
};

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs,
  inlineContentSpecs,
});

export type BlockNoteEditorType = typeof blockNoteSchema.BlockNoteEditor;
