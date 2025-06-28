import React, { useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createGridNode, GridNode } from "../nodes/GridNode";
import { $createImageNode, ImageNode } from "../nodes/ImageNode";
import YProvider from "y-partyserver/provider";
import "./LexicalEditor.css";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { useSharedHistoryContext } from "../context/SharedHistoryContext";
import { createWebsocketProvider } from "../collaboration";

interface LexicalEditorProps {
  provider: YProvider;
}

const theme = {
  // Theme styling
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

// Error component
function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

// Toolbar component
const LexicalToolbar = () => {
  const [editor] = useLexicalComposerContext();

  const insertGridNode = () => {
    editor.update(() => {
      const gridNode = $createGridNode();
      $insertNodes([gridNode]);
    });
  };

  const insertImageNode = () => {
    editor.update(() => {
      const imageNode = $createImageNode({
        src: "https://cdn.vocabulary.com/articles/ll/meme-and-variation/memes_clip_image002.jpg?v=hupeqdgc",
        altText: "Placeholder image",
        width: 300,
        height: 200,
      });
      $insertNodes([imageNode]);
    });
  };

  return (
    <div
      style={{
        border: "1px solid #e9ecef",
        borderBottom: "none",
        padding: "0.5rem",
        backgroundColor: "#f8f9fa",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <button
        onClick={insertGridNode}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert MUI X Grid Pro"
      >
        Grid
      </button>
      <button
        onClick={insertImageNode}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
        title="Insert Image"
      >
        Image
      </button>
    </div>
  );
};

const excludedProperties = new Map([[GridNode, new Set(["__rows"])]]);

export const LexicalEditor = ({ provider }: LexicalEditorProps) => {
  const initialConfig = {
    editorState: null,
    namespace: "LexicalEditor",
    theme,
    onError(error: Error) {
      console.error(error);
    },
    nodes: [GridNode, ImageNode],
  };

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const doc = yjsDocMap.get(id) ?? new Y.Doc();
      yjsDocMap.set(id, doc);

      return new WebsocketProvider("ws://localhost:1234", id, doc, {
        connect: false,
      });
    },
    [],
  );

  const { historyState } = useSharedHistoryContext();

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalToolbar />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            style={{
              outline: "none",
              resize: "none",
            }}
          />
        }
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin externalHistoryState={historyState} />
      <CollaborationPlugin
        id="lexical/react-rich-collab"
        providerFactory={createWebsocketProvider}
        shouldBootstrap={true}
        // excludedProperties={excludedProperties}
      />
    </LexicalComposer>
  );
};
