import {
  BlockNoteSchema,
  BlockSpecs,
  defaultBlockSpecs,
} from "@blocknote/core";
import { BlockNoteLemonlightButton } from "./BlockNoteLemonlightButton/BlockNoteLemonlightButton";

export const blockSpecs: BlockSpecs = {
  ...defaultBlockSpecs,
  lemonlightButton: BlockNoteLemonlightButton,
};

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs,
});
