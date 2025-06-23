import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteLemonlightButton } from "./BlockNoteLemonlightButton/BlockNoteLemonlightButton";

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    lemonlightButton: BlockNoteLemonlightButton,
  },
});
