import { useBlockNoteEditor } from "@blocknote/react";
import { defaultCallSheetHtml } from "../../../callSheet/defaultCallSheetHtml";

export const BlockNoteInsertCallSheetButton = () => {
  const editor = useBlockNoteEditor();

  const handleInsertCallSheet = async () => {
    const parsedDoc = await editor.tryParseHTMLToBlocks(defaultCallSheetHtml);

    const lastBlock = editor.document[editor.document.length - 1];
    editor.insertBlocks(parsedDoc, lastBlock, "after");
  };

  return <button onClick={handleInsertCallSheet}>Insert Call Sheet</button>;
};
