import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { CiLemon } from "react-icons/ci";
import { tipTapLemonlightButtonConfig } from "./TipTapLemonlightButton/TipTapLemonlightButton";

interface SlashCommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: any) => void;
}

const SlashCommandList = ({
  items,
  command,
}: {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "0.5rem 0",
        maxHeight: "200px",
        overflow: "auto",
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => command(item)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.5rem 1rem",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "0.875rem",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {item.icon}
          <div>
            <div style={{ fontWeight: "500" }}>{item.title}</div>
            <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
              {item.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export const TipTapSlashCommands = Extension.create({
  name: "slashCommands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const items: SlashCommandItem[] = [
            {
              title: tipTapLemonlightButtonConfig.type,
              description: "Lemonlight Platform email action",
              icon: <CiLemon size={16} />,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertContent({
                    type: "lemonlightButton",
                  })
                  .run();
              },
            },
          ];

          return items.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: any;
          let popup: any;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });

              popup = document.createElement("div");
              popup.style.position = "absolute";
              popup.style.zIndex = "1000";
              popup.appendChild(component.element);
              document.body.appendChild(popup);
            },
            onUpdate: (props: any) => {
              component.updateProps(props);
            },
            onKeyDown: (props: any) => {
              if (props.event.key === "Escape") {
                popup.remove();
                return true;
              }
              return component.onKeyDown(props);
            },
            onExit: () => {
              popup.remove();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
