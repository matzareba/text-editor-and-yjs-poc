import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GridComponent from './GridComponent';

export const gridNodeName = 'muiGridPro';

export const GridNode = Node.create({
  name: gridNodeName,
  
  // This node is a block-level element
  group: 'block',
  
  // It can contain content (for the Description field)
  content: 'inline*',
  
  // Make it draggable in the editor
  draggable: true,

  atom:true,

  
  // Define how to parse the node from HTML
  parseHTML() {
    return [
      {
        tag: `div[data-type="${gridNodeName}"]`,
      },
    ];
  },
  
  // Define how to render the node to HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': gridNodeName }),
      0, // This is a placeholder for the content
    ];
  },
  
  // Connect the node to the React component
  addNodeView() {
    return ReactNodeViewRenderer(GridComponent);
  },
});

export default GridNode;