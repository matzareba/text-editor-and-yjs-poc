// import { defaultCallSheetHtml } from "../../../callSheet/defaultCallSheetHtml";
import { defaultCallSheetNode } from "../../../callSheet/defaultCallSheetNode";
// import { BlockNoteEditorType } from "../../components/blockNoteSchema";

// TO-DO call sheet extension should make it possible to parse defaultCallSheetHtml so defaultCallSheetNode would not be needed
const parsedTable = defaultCallSheetNode;

export const getDefaultCallsheetNode =
  async (/*editor: BlockNoteEditorType*/) => {
    // TO-DO this is how parseTable can be defined after call sheet table is parseable from html
    // const parsedTable = (
    //   await editor.tryParseHTMLToBlocks(defaultCallSheetHtml)
    // )[0];

    const tableNode = {
      ...parsedTable,
    };

    return tableNode;
  };
