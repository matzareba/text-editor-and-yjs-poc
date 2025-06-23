import { defaultProps, insertOrUpdateBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { blockNoteSchema } from "../blockNoteSchema";
import { CiLemon } from "react-icons/ci";
import "./blockNoteLemonlightButton.css";

export const blockNoteLemonlightButtonType = "lemonlightButton";

export const blockNoteLemonlightButtonConfig = {
  type: "Send Email",
  onClick: () => {
    console.log("Send Email");
  },
  style: {
    color: "#e69819",
    backgroundColor: "#fff6e6",
  },
} as const;

export const BlockNoteLemonlightButton = createReactBlockSpec(
  {
    type: blockNoteLemonlightButtonType,
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: blockNoteLemonlightButtonConfig.type,
        values: [blockNoteLemonlightButtonConfig.type],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const { type, ...buttonProps } = blockNoteLemonlightButtonConfig;

      return (
        <button className={blockNoteLemonlightButtonType} {...buttonProps}>
          <div className={"inline-content"} ref={props.contentRef} />
        </button>
      );
    },
  }
);

export const BlockNoteLemonlightButtonIcon = CiLemon;

export const slashInsertBlockNoteLemonlightButton = (
  editor: typeof blockNoteSchema.BlockNoteEditor
) => ({
  title: "Send Email",
  subtext: "Lemonlight Platform email action",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: blockNoteLemonlightButtonType,
      content: [
        {
          type: "text",
          text: blockNoteLemonlightButtonConfig.type,
          styles: {},
        },
      ],
    }),
  aliases: [
    "lemonlight",
    "lemonlight button",
    blockNoteLemonlightButtonConfig.type,
  ],
  group: "Basic blocks",
  icon: <CiLemon size={20} />,
});
