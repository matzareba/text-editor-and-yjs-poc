import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableRow from "@tiptap/extension-table-row";
import {
  NodeView,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewProps,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import React, {
  ComponentType,
  createContext,
  useContext,
  useState,
} from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import {
  CounterContext,
  CounterContext as CounterContext1,
} from "./CounterContext";
import { Sortable } from "@shopify/draggable";

export const CustomWrapperWithContext = Node.create({
  name: "customWrapperWithContext",
  group: "block",
  content: "block*",

  parseHTML() {
    return [
      {
        tag: "react-context-wrapper",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-context-wrapper", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomWrapperWithContextComponent);
  },
});

const CustomWrapperWithContextComponent: React.FC<ReactNodeViewProps> = () => {
  const { counter } = useContext(CounterContext1);
  // const [counter, setCounter] = useState(1);
  return (
    <NodeViewWrapper className="custom-wrapper-with-context">
      {/*<button onClick={() => setCounter((c) => c + 1)}>add</button>*/}
      {/*<p>{counter}</p>*/}
      <div>
        {/*<CounterContext.Provider value={{ counter, setCounter }}>*/}
        <NodeViewContent className="content is-editable" />
        {/*</CounterContext.Provider>*/}
      </div>
    </NodeViewWrapper>
  );
};

export const CustomTable = Table.extend({
  name: "customTable",
  content: "customRow*",

  addAttributes() {
    return {
      ...this.parent?.(),

      borderStyle: {
        default: "2px solid #ced4da",
        parseHTML: (element) =>
          element.style.borderStyle || "2px solid #ced4da",
        renderHTML: (attributes) => {
          return {
            style: `border: ${attributes.borderStyle}`,
          };
        },
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      style: {
        default: "height: 28px; padding: 3px 5px",
      },
    };
  },
  // addNodeView() {
  //   return (props) => {
  //     console.log(props);
  //     // const dom = document.createElement("div");
  //
  //     const table = document.createElement("table");
  //     table.setAttribute("contenteditable", "false");
  //     table.classList.add("node-view");
  //
  //     const tbody = document.createElement("tbody");
  //     tbody.classList.add("content");
  //     // tbody.classList.add("is-editable");
  //     table.appendChild(tbody);
  //
  //     // new Sortable(tbody, {
  //     //   draggable: "tr", // the elements within the container to drag
  //     //   // You can add handles, e.g. `handle: '.handle'`, and event listeners as needed
  //     //   handle: "cell_handle",
  //     // });
  //
  //     // const dragDrop = createTableRowDragDrop(table, {
  //     //   onDrag: (fromIndex, toIndex) => {
  //     //     console.log(`Row moved from ${fromIndex} to ${toIndex}`);
  //     //     // Handle your data reordering here
  //     //   }
  //     // });
  //
  //     // ta.appendChild(table);
  //
  //     return {
  //       dom: table,
  //       contentDOM: tbody,
  //     };
  //   };
  // },
});

export const CustomTableRow = TableRow.extend({
  name: "customRow",
  content: "handleCell textCell dateCell customCell*",
  // draggable: true,
  selectable: true,
  // renderHTML({ HTMLAttributes }) {
  //   return ["tr", mergeAttributes(HTMLAttributes), ["td", { class: ".cell_handle" }], 0];
  // },
  // parseHTML() {
  //   return [
  //     {
  //       tag: "tr"
  //     }
  //   ];
  // }
});

export const CustomDateCell = TableCell.extend({
  name: "dateCell",
  group: "customCell",
  content: "dateNode",
});

export const CustomTextCell = TableCell.extend({
  name: "textCell",
  group: "customCell",
  content: "inline*",
});

export const CustomHandleCell = TableCell.extend({
  name: "handleCell",
  group: "customCell",
  content: "handleNode",
  draggable: false,
});

export const DateNode = Node.create({
  name: "dateNode",
  atom: true,
  // selectable: false,
  // draggable: true,

  parseHTML() {
    return [
      {
        tag: "date-node",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["date-node", mergeAttributes(HTMLAttributes)];
  },

  addAttributes() {
    return {
      value: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DateCellComponent);
  },
});

const DateCellComponent: ComponentType<ReactNodeViewProps<HTMLElement>> = (
  props,
) => {
  const { counter } = useContext(CounterContext);
  // console.log("counter", counter);
  return (
    <NodeViewWrapper className="date-cell">
      <input
        type="date"
        value={props.node.attrs.value}
        onChange={(e) => props.updateAttributes({ value: e.target.value })}
      />
    </NodeViewWrapper>
  );
};

export const HandleNode = Node.create({
  name: "handleNode",
  atom: true,
  draggable: false,

  parseHTML() {
    return [
      {
        tag: "handle-node",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["handle-node", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return () => {
      const element = document.createElement("span");
      element.classList.add("draggable-table-row", "node-view");
      element.setAttribute("contenteditable", "false");
      element.appendChild(document.createTextNode("X"));
      element.style.backgroundColor = "red";
      element.style.width = "30px";
      element.style.height = "30px";
      element.style.cursor = "grab";
      element.draggable = false;
      // element.addEventListener("dragstart", stopPropagation);
      // element.addEventListener("click", stopPropagation);
      return {
        dom: element,
      };
    };
  },
});
