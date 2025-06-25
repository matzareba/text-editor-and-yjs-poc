import { useBlockNoteEditor } from "@blocknote/react";
import { defaultCallSheetHtml } from "../../../callSheet/defaultCallSheetHtml";

export const BlockNoteUpdateCallSheetButton = () => {
  const editor = useBlockNoteEditor();
  const callSheetTable = editor.document.find((node) => node.type === "table");

  const handleUpdateCallSheet = async () => {
    const id = callSheetTable?.id!;
    const content = callSheetTable?.content!;

    const updatedContent = {
      ...content,
      rows: content.rows.map((row, rowIndex) => {
        return {
          cells: row.cells.map((c) => {
            const cell = c as any;
            if (
              !JSON.stringify(cell.content).includes("Set") ||
              rowIndex === 0
            ) {
              return cell;
            }

            return {
              ...cell,
              content: [{ ...cell.content[0], text: getRandomSet() }],
            };
          }),
        };
      }),
    } as any;

    editor.updateBlock(
      { id },
      {
        content: updatedContent,
      }
    );
  };

  return (
    <button
      onClick={handleUpdateCallSheet}
      disabled={!callSheetTable?.id}
      style={{ marginRight: 10 }}
    >
      Update Call Sheet
    </button>
  );
};

const getRandomSet = (): string => {
  return `Set ${getRandomInt()}`;
};

const getRandomInt = (): number => {
  return Math.floor(Math.random() * 100) + 1;
};
