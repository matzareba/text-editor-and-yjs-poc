import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { CiLemon } from "react-icons/ci";
import "./tipTapLemonlightButton.css";

export const tipTapLemonlightButtonType = "lemonlightButton";

export const tipTapLemonlightButtonConfig = {
  type: "Send Email",
  onClick: () => {
    console.log("Send Email");
  },
  style: {
    color: "#e69819",
    backgroundColor: "#fff6e6",
  },
} as const;

const TipTapLemonlightButtonComponent = () => {
  const { type, onClick, style } = tipTapLemonlightButtonConfig;

  return (
    <NodeViewWrapper>
      <button
        className={tipTapLemonlightButtonType}
        onClick={onClick}
        style={style}
      >
        {type}
      </button>
    </NodeViewWrapper>
  );
};

export const TipTapLemonlightButton = Node.create({
  name: tipTapLemonlightButtonType,
  group: "block",
  atom: true,
  addAttributes() {
    return {
      type: {
        default: tipTapLemonlightButtonConfig.type,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${tipTapLemonlightButtonType}"]`,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": tipTapLemonlightButtonType,
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TipTapLemonlightButtonComponent);
  },
});

export const TipTapLemonlightButtonIcon = CiLemon;
