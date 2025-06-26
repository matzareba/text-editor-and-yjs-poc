import {
  FormattingToolbar,
  useComponentsContext,
  useBlockNoteEditor,
  BasicTextStyleButton,
} from "@blocknote/react";
import { insertOrUpdateBlock } from "@blocknote/core";
import { BlockNoteEditorType } from "../../components/blockNoteSchema";
import {
  blockNoteLemonlightButtonConfig,
  BlockNoteLemonlightButtonIcon,
  blockNoteLemonlightButtonType,
} from "../../components/BlockNoteLemonlightButton/BlockNoteLemonlightButton";

const CallSheetHeaderActionButton = () => {
  const Components = useComponentsContext()!;
  const editor = useBlockNoteEditor() as BlockNoteEditorType;

  const handleClick = () => {
    editor.focus();

    insertOrUpdateBlock(editor, {
      type: blockNoteLemonlightButtonType,
      content: [
        {
          type: "text",
          text: blockNoteLemonlightButtonConfig.type,
          styles: {},
        },
      ],
    });
  };

  return (
    <Components.FormattingToolbar.Button
      className={"bn-button"}
      onClick={handleClick}
    >
      <BlockNoteLemonlightButtonIcon size={16} />
    </Components.FormattingToolbar.Button>
  );
};

export const CallSheetHeaderHeaderFormattingToolbar = () => {
  return (
    <FormattingToolbar
      children={[
        <BasicTextStyleButton
          basicTextStyle={"bold"}
          key={"boldStyleButton"}
        />,
        <BasicTextStyleButton
          basicTextStyle={"italic"}
          key={"italicStyleButton"}
        />,
        <BasicTextStyleButton
          basicTextStyle={"underline"}
          key={"underlineStyleButton"}
        />,
        <CallSheetHeaderActionButton />,
      ]}
    />
  );
};
