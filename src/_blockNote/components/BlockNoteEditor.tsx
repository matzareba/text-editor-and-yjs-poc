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

export const BlockNoteEditor = ({ provider }: { provider: YProvider }) => {
  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    collaboration: {
      provider: provider,
      fragment: provider.doc.getXmlFragment(PARTY_FRAGMENT_ID),
      user: MY_USER,
    },
  });

  return (
    <BlockNoteView editor={editor} formattingToolbar={false}>
      <FormattingToolbarController
        formattingToolbar={() => (
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
        )}
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

          return filterSuggestionItems(defaultItems, query);
        }}
      />
    </BlockNoteView>
  );
};
