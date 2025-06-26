import { useBlockNoteEditor } from "@blocknote/react";
import { getDefaultCallsheetNode } from "../../extensions/CallSheetTableExtension/getDefaultCallsheetNode";
import { BlockNoteEditorType } from "../blockNoteSchema";

export const BlockNoteInsertCallSheetButton = () => {
  const editor = useBlockNoteEditor() as BlockNoteEditorType;

  const handleInsertCallSheet = async () => {
    const lastBlock = editor.document[editor.document.length - 1];
    editor.insertBlocks(
      // @ts-ignore
      [await getDefaultCallsheetNode(/*editor*/)],
      lastBlock,
      "after"
    );
  };

  return <button onClick={handleInsertCallSheet}>Insert Call Sheet</button>;
};
