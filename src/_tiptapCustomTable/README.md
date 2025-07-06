# TipTap Collaborative Grid Editor

This directory contains a TipTap-based implementation of the collaborative grid editor, converted from the original Slate.js implementation.

## Key Features

- **TipTap Editor**: Rich text editing with collaborative features
- **Yjs Integration**: Real-time collaboration using Y.XmlFragment
- **DataGrid Component**: Collaborative data grid with rich text cells
- **Undo/Redo**: Shared undo manager across all collaborative components
- **WebSocket Support**: Real-time synchronization between clients
- **Liveblocks Support**: Alternative collaboration backend

## File Structure

```
src/_tiptap/
├── nodes/
│   ├── GridNode.tsx          # DataGrid component with TipTap cells
│   └── GridNode.css          # Styles for the grid component
├── extensions/
│   └── DataGridExtension.tsx # TipTap node extension for DataGrid
├── collaboration/
│   ├── websocket-server.js   # WebSocket server for collaboration
│   └── simple-server.js      # Simple WebSocket server
├── TipTapEditor.tsx          # Main TipTap editor with WebSocket
├── LiveblocksTipTapEditor.tsx # TipTap editor with Liveblocks
├── index.ts                  # Export file
└── README.md                 # This file
```

## Key Differences from Slate Implementation

### 1. Editor Framework
- **Slate**: Uses Slate.js with slate-react
- **TipTap**: Uses TipTap with ProseMirror under the hood

### 2. Collaboration Setup
- **Slate**: Uses `@slate-yjs/core` with `Y.XmlText`
- **TipTap**: Uses `@tiptap/extension-collaboration` with `Y.XmlFragment`

### 3. Node Extensions
- **Slate**: Custom elements with `withDataGrid` plugin
- **TipTap**: Custom node extension with `ReactNodeViewRenderer`

### 4. Rich Text Cells
- **Slate**: Each cell has its own Slate editor instance
- **TipTap**: Each cell has its own TipTap editor instance with Y.XmlFragment

## Usage

### Basic TipTap Editor
```tsx
import { TipTapEditor } from './src/_tiptap/TipTapEditor';

function App() {
  return <TipTapEditor />;
}
```

### Liveblocks TipTap Editor
```tsx
import { LiveblocksTipTapEditor } from './src/_tiptap/LiveblocksTipTapEditor';

function App() {
  return <LiveblocksTipTapEditor />;
}
```

## Collaboration Configuration

The TipTap implementation uses Y.XmlFragment for collaboration as requested:

```tsx
Collaboration.configure({
  fragment: yDoc.getXmlFragment('body'),
})
```

Each collaborative cell in the DataGrid uses its own Y.XmlFragment:

```tsx
const yFragment = useYXMLFragment(yDoc, tableId, rowId, field);

const editor = useEditor({
  extensions: [
    // ... other extensions
    Collaboration.configure({
      fragment: yFragment,
    }),
  ],
});
```

## Running the Collaboration Server

### WebSocket Server (Port 3001)
```bash
node src/_tiptap/collaboration/websocket-server.js
```

### Simple Server (Port 1234)
```bash
node src/_tiptap/collaboration/simple-server.js
```

## Dependencies

The TipTap implementation requires these additional packages:
- `@tiptap/react`
- `@tiptap/core`
- `@tiptap/starter-kit`
- `@tiptap/extension-bold`
- `@tiptap/extension-italic`
- `@tiptap/extension-collaboration`
- `yjs`
- `y-websocket`

For Liveblocks support:
- `@liveblocks/react`
- `@liveblocks/yjs`

## Features

### Rich Text Editing
- Bold and italic formatting
- Keyboard shortcuts (Ctrl+B, Ctrl+I)
- Collaborative cursors and selections

### DataGrid
- Collaborative data grid with rich text cells
- Add/remove rows
- Date picker cells
- Real-time synchronization

### Undo/Redo
- Shared undo manager across all editors
- Global undo/redo with Ctrl+Z/Ctrl+Y
- Collaborative undo history

## Architecture Notes

The TipTap implementation maintains the same collaborative architecture as the Slate version but adapts it to TipTap's extension system and ProseMirror's document model. The key insight is using Y.XmlFragment instead of Y.XmlText for TipTap's collaboration extension, which provides better integration with ProseMirror's document structure.