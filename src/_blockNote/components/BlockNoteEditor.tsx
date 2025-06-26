import {
  BlockTypeSelectItem,
  blockTypeSelectItems,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MY_USER, PARTY_FRAGMENT_ID } from "../../party/consts";
import YProvider from "y-partyserver/provider";
import { blockNoteSchema } from "./blockNoteSchema";
import {
  blockNoteLemonlightButtonConfig,
  BlockNoteLemonlightButtonIcon,
  blockNoteLemonlightButtonType,
  slashInsertBlockNoteLemonlightButton,
} from "./BlockNoteLemonlightButton/BlockNoteLemonlightButton";
import { filterSuggestionItems } from "@blocknote/core";

import {
  DefaultThreadStoreAuth,
  YjsThreadStore,
} from "@blocknote/core/comments";
import { memo, useEffect, useMemo, useState, useRef } from "react";
import { BlockNoteInsertCallSheetButton } from "./BlockNoteCallSheetButtons/BlockNoteInsertCallSheetButton";
import { BlockNoteUpdateCallSheetButton } from "./BlockNoteCallSheetButtons/BlockNoteUpdateCallSheetButton";
import { CallSheetTableExtension } from "../extensions/CallSheetTableExtension/CallSheetTableExtension";
import { slashInsertCallSheetTableButton } from "../extensions/CallSheetTableExtension/slashCommandIntegration";
import { CallSheetTableHandlesProsemirrorPlugin } from "../extensions/CallSheetTableExtension/tableHandles/CallSheetTableHandlesPlugin";
import { CallSheetTableHandlesController } from "../extensions/CallSheetTableExtension/tableHandles/CallSheetTableHandlesController";
import {
  getCallSheetTableHeaderSlashMenuItems,
  isInCallSheetTableHeader,
} from "../extensions/CallSheetTableExtension/tableHeaderSlashCommandIntegration";
import { CallSheetHeaderHeaderFormattingToolbar } from "../extensions/CallSheetTableExtension/CallSheetHeaderHeaderFormattingToolbar";
import { getCallSheetDbDataModel } from "../extensions/CallSheetTableExtension/callSheetTableToDbDataModel";
import { allExpanded, defaultStyles, JsonView } from "react-json-view-lite";

const resolveUsers = async (userIds: string[]) => {
  return userIds.map((userId) => ({
    id: userId,
    username: userId,
    avatarUrl: "",
  }));
};

export const BlockNoteEditor = memo(
  ({
    provider,
    initialHtmlContent,
    config,
  }: {
    provider: YProvider;
    initialHtmlContent?: string;
    config?: {
      enableCallSheet?: boolean;
    };
  }) => {
    const threadStore = useMemo(() => {
      const userId = MY_USER.name;
      const store = new YjsThreadStore(
        userId,
        provider.doc.getMap("threads"),
        new DefaultThreadStoreAuth(userId, "editor")
      );

      return store;
    }, [provider.doc]);

    const editor = useCreateBlockNote({
      schema: blockNoteSchema,
      collaboration: {
        provider: provider,
        fragment: provider.doc.getXmlFragment(PARTY_FRAGMENT_ID),
        user: MY_USER,
      },
      comments: {
        threadStore,
      },
      tables: {
        cellBackgroundColor: true,
        cellTextColor: true,
        headers: true,
        splitCells: true,
      },
      disableExtensions: ["BlockNoteTableExtension"],
      extensions: config?.enableCallSheet
        ? [(editor) => new CallSheetTableHandlesProsemirrorPlugin(editor)]
        : undefined,
      _tiptapOptions: config?.enableCallSheet
        ? {
            extensions: [CallSheetTableExtension],
            // TODO: add this for handling pasting call sheet table. note: blockeditor overrides this
            // editorProps: {
            //   transformPasted: callSheetTransformPasted,
            // },
          }
        : {},
      resolveUsers,
    });

    // wait for yjs to connect before setting initial state
    useEffect(() => {
      const setDefault = async () => {
        if (!editor) {
          return;
        }
        if (
          editor.document.length === 1 &&
          typeof initialHtmlContent === "string"
        ) {
          const parsedDoc = await editor.tryParseHTMLToBlocks(
            initialHtmlContent
          );
          editor.replaceBlocks(editor.document, parsedDoc);
        }
      };
      // TODO: check that this is correct
      if (provider.bcconnected) {
        setDefault();
      }
      provider.on("sync", setDefault);
      return () => provider.off("sync", setDefault);
    }, [provider, editor]);

    // used for logging document state
    const [debugState, setDebugState] = useState<typeof editor.document>([]);
    useEffect(() => {
      console.log("editor.document", editor.document);
      setDebugState(editor.document);
    }, [JSON.stringify(editor.document)]);

    useEffect(() => {
      async function logState() {
        console.log(
          "state",
          debugState,
          await editor.blocksToFullHTML(debugState)
        );
      }

      logState();
    }, [debugState]);

    return (
      <div>
        <BlockNoteView
          editor={editor}
          formattingToolbar={false}
          slashMenu={false}
          onChange={(e) => {
            setDebugState(e.document);
          }}
        >
          {config?.enableCallSheet && <BlockNoteUpdateCallSheetButton />}
          {config?.enableCallSheet && <BlockNoteInsertCallSheetButton />}

          <FormattingToolbarController
            formattingToolbar={() => {
              if (config?.enableCallSheet && isInCallSheetTableHeader(editor)) {
                return <CallSheetHeaderHeaderFormattingToolbar />;
              }

              return (
                <FormattingToolbar
                  blockTypeSelectItems={[
                    {
                      name: blockNoteLemonlightButtonConfig.type,
                      type: blockNoteLemonlightButtonType,
                      icon: BlockNoteLemonlightButtonIcon,
                      isSelected: (block) =>
                        block.type === blockNoteLemonlightButtonType,
                    } satisfies BlockTypeSelectItem,
                    ...blockTypeSelectItems(editor.dictionary),
                  ]}
                />
              );
            }}
          />
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query: string) => {
              const defaultItems = getDefaultReactSlashMenuItems(editor);
              const firstBasicBlockIndex = defaultItems.findIndex(
                (item) => item.group === "Basic blocks"
              );

              defaultItems.splice(
                firstBasicBlockIndex,
                0,
                slashInsertBlockNoteLemonlightButton(editor)
              );

              if (config?.enableCallSheet) {
                if (isInCallSheetTableHeader(editor)) {
                  return filterSuggestionItems(
                    getCallSheetTableHeaderSlashMenuItems(editor),
                    query
                  );
                }

                defaultItems.splice(
                  firstBasicBlockIndex,
                  0,
                  slashInsertCallSheetTableButton(editor)
                );
              }

              return filterSuggestionItems(defaultItems, query);
            }}
          />

          {config?.enableCallSheet && <CallSheetTableHandlesController />}
        </BlockNoteView>

        {config?.enableCallSheet && (
          <div>
            <br />
            Call sheet data model:
            <br />
            <JsonView
              data={getCallSheetDbDataModel(editor.document) ?? []}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </div>
        )}
      </div>
    );
  }
);
