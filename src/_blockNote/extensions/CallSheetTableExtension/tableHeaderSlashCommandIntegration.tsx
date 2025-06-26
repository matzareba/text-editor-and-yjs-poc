import { BlockNoteEditorType } from "../../components/blockNoteSchema";

export const getCallSheetTableHeaderSlashMenuItems = (
  editor: BlockNoteEditorType
) => {
  const selection = editor._tiptapEditor.state.selection;
  const { $from } = selection;

  for (let depth = $from.depth; depth > 0; depth--) {
    const nodeAtDepth = $from.node(depth);
    if (
      nodeAtDepth.type.name === "tableHeader" &&
      nodeAtDepth.attrs["data-type"] === "date"
    ) {
      return [
        {
          title: "Add Time Slot",
          subtext: "Insert a time slot in the header",
          onItemClick: () => {
            editor.insertInlineContent([
              {
                type: "text",
                text: "9:00 AM",
                styles: { bold: true },
              },
            ]);
          },
          aliases: ["time", "slot", "schedule"],
          group: "CallSheet Actions",
          icon: "🕐",
        },
      ];
    }
  }

  return [
    {
      title: "Add Scene Number",
      subtext: "Insert scene number in the header",
      onItemClick: () => {
        editor.insertInlineContent([
          { type: "text", text: "Scene #", styles: { bold: true } },
        ]);
      },
      aliases: ["scene", "number", "#"],
      group: "CallSheet Actions",
      icon: "🎬",
    },
    {
      title: "Add Location",
      subtext: "Insert location in the header",
      onItemClick: () => {
        editor.insertInlineContent([
          { type: "text", text: "Location: ", styles: { bold: true } },
        ]);
      },
      aliases: ["location", "place", "loc"],
      group: "CallSheet Actions",
      icon: "📍",
    },
    {
      title: "Add Cast Member",
      subtext: "Insert cast member role",
      onItemClick: () => {
        editor.insertInlineContent([
          { type: "text", text: "Cast: ", styles: { bold: true } },
        ]);
      },
      aliases: ["cast", "actor", "member"],
      group: "CallSheet Actions",
      icon: "🎭",
    },
  ];
};

export const isInCallSheetTableHeader = (editor: BlockNoteEditorType) => {
  const selection = editor._tiptapEditor.state.selection;
  const { $from } = selection;

  for (let depth = $from.depth; depth > 0; depth--) {
    const nodeAtDepth = $from.node(depth);
    if (nodeAtDepth.type.name === "tableHeader") {
      return true;
    }
  }
  return false;
};
