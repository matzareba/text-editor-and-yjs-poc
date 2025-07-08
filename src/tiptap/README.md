# Tiptap Extensions

This directory contains custom Tiptap extensions for the project.

## Nodes

### MUI X Grid Pro Node

A Tiptap node that displays an MUI X Grid Pro with specific column requirements:

- **Name**: String type column
- **Start Date**: Date type column with datepicker
- **Description**: Editable content column with contentEditable functionality

#### Usage

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { GridNode } from '../tiptap/nodes/GridNode';

const editor = useEditor({
  extensions: [
    StarterKit,
    GridNode,
    // other extensions...
  ],
  // other options...
});

// To programmatically insert the grid:
editor.chain().focus().insertContent({
  type: 'muiGridPro',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Editable description goes here',
        },
      ],
    },
  ],
}).run();
```

#### Implementation Details

The grid node consists of:

1. **GridNode.ts**: Defines the Tiptap node
2. **GridComponent.tsx**: React component that renders the MUI X Grid Pro
3. **GridNode.css**: Styling for the grid node

The grid is implemented as a block-level node with three columns, including a description column that provides editable content functionality.
