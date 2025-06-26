import { insertOrUpdateBlock } from "@blocknote/core";
import { BlockNoteEditorType } from "../../components/blockNoteSchema";
import { BiSpreadsheet } from "react-icons/bi";
import { getDefaultCallsheetNode } from "./getDefaultCallsheetNode";

export const slashInsertCallSheetTableButton = (
  editor: BlockNoteEditorType
) => ({
  title: "Call Sheet Schedule",
  subtext: "Call Sheet Schedule table",

  onItemClick: async () => {
    insertOrUpdateBlock(
      editor,
      // @ts-ignore
      await getDefaultCallsheetNode(/*editor*/)
    );
  },
  aliases: ["call sheet", "table"],
  group: "Basic blocks",
  icon: <BiSpreadsheet size={20} />,
});
