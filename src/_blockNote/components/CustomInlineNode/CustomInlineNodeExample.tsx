import React from "react";
import { useBlockNoteEditor } from "@blocknote/react";
import { BlockNoteEditorType } from "../blockNoteSchema";
import {
  createCustomInlineNode,
  customInlineNodeType,
} from "./CustomInlineNode";

export const CustomInlineNodeExample = () => {
  return (
    <div
      style={{
        margin: "10px 0",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
        Custom Inline Node Examples
      </h3>
      <p style={{ margin: "0 0 12px 0", color: "#666" }}>
        To use the custom inline node, you can:
      </p>
      <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px", color: "#666" }}>
        <li>
          Type <code>/</code> in the editor to open the slash menu
        </li>
        <li>Search for "Custom Inline Node" to insert it</li>
        <li>
          The inline node supports different types: mention, tag, and custom
        </li>
      </ul>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            border: "1px solid #bbdefb",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          @mention example
        </div>

        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#f3e5f5",
            color: "#7b1fa2",
            border: "1px solid #ce93d8",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          #tag example
        </div>

        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#e8f5e8",
            color: "#2e7d32",
            border: "1px solid #a5d6a7",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          custom example
        </div>
      </div>
    </div>
  );
};

// Example of programmatically creating content with inline nodes
export const createDocumentWithInlineNodes = () => {
  return [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Welcome to our team, ",
          styles: {},
        },
        createCustomInlineNode("@new_user", "mention", "user456"),
        {
          type: "text",
          text: "! This project is marked as ",
          styles: {},
        },
        createCustomInlineNode("#high-priority", "tag"),
        {
          type: "text",
          text: " so please review it carefully.",
          styles: {},
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "You can also add ",
          styles: {},
        },
        createCustomInlineNode("Custom Elements", "custom"),
        {
          type: "text",
          text: " to enhance your content.",
          styles: {},
        },
      ],
    },
  ];
};
