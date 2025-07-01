import { BlockNoteEditorType } from "../blockNoteSchema";
import { Ri24HoursFill } from "react-icons/ri";
import { createReactInlineContentSpec } from "@blocknote/react";
import TalentSelect from "./TalentSelect";

export const talentSelectNodeType = "talentSelectNode";

export const talentSelectNodeConfig = {
  type: "Talent Select",
  defaultText: "talent select",
  style: {
    color: "#1976d2",
    backgroundColor: "#e3f2fd",
    borderRadius: "4px",
    padding: "2px 6px",
    border: "1px solid #bbdefb",
  },
} as const;

export const TalentSelectNode = createReactInlineContentSpec(
  {
    type: talentSelectNodeType,
    propSchema: {
      talent: {
        default: "" as string,
      },
    },
    content: "styled",
  },
  {
    render: TalentSelect,
  }
);

export const TalentSelectNodeIcon = Ri24HoursFill;

export const slashInserttalentSelectNode = (editor: BlockNoteEditorType) => ({
  title: "Talent Select",
  subtext: "Insert a talent select element",
  onItemClick: () => {
    editor.insertInlineContent([
      {
        type: talentSelectNodeType,
        props: {
          // @ts-ignore TODO FIX THIS
          talent: "",
        },
      },
    ]);
  },
  aliases: ["talent select", talentSelectNodeConfig.type],
  group: "Basic blocks",
  icon: <TalentSelectNodeIcon size={20} />,
});

export const createtalentSelectNode = (
  talent: string,
  nodeType: typeof talentSelectNodeType
) => ({
  type: talentSelectNodeType,
  props: {
    talent,
    nodeType,
  },
});
