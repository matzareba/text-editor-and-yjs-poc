# ProseMirror Implementation

This directory contains a pure ProseMirror implementation that replaces the TipTap-based editor. The conversion maintains all the functionality from the original TipTap implementation while using ProseMirror's core APIs directly.

## Architecture

### Core Components

- **ProseMirrorSelfHostPage.tsx** - Main page component that sets up the Y.js provider
- **ProseMirrorEditor.tsx** - Core editor component with collaboration support
- **ProseMirrorToolbar.tsx** - Toolbar with buttons for inserting content
- **schema/customSchema.ts** - Custom ProseMirror schema definition

### Features Converted from TipTap

1. **Collaboration Support**
   - Y.js integration with cursor synchronization
   - Real-time collaborative editing
   - Undo/redo with collaboration awareness

2. **Custom Nodes**
   - Lemonlight Button (custom action button)
   - Date Node (interactive date picker)
   - Custom Table with specialized cells
   - Custom Wrapper with Context

3. **Table Features**
   - Custom table with date cells and text cells
   - Drag and drop row reordering
   - Dynamic row insertion
   - Custom styling and behavior

4. **Slash Commands**
   - Type "/" to trigger command menu
   - Insert buttons and tables via commands
   - Extensible command system

5. **Custom Styling**
   - Maintains visual consistency with TipTap version
   - Drag overlays and visual feedback
   - Responsive table design

## Key Differences from TipTap

### Schema Definition
- Direct ProseMirror schema creation instead of TipTap extensions
- More granular control over node specifications
- Custom table roles and content models

### Plugin System
- Native ProseMirror plugins instead of TipTap extensions
- Direct access to ProseMirror's transaction system
- Custom event handling and decorations

### Node Views
- Pure ProseMirror node views for interactive components
- Direct DOM manipulation and event handling
- Better performance and control

## Usage

```tsx
import { ProseMirrorSelfHostPage } from './src/_prosemirror/ProseMirrorSelfHostPage';

// Use in your app
<ProseMirrorSelfHostPage />
```

## Dependencies

- prosemirror-state
- prosemirror-view
- prosemirror-model
- prosemirror-schema-basic
- prosemirror-schema-list
- prosemirror-keymap
- prosemirror-history
- prosemirror-commands
- prosemirror-dropcursor
- prosemirror-gapcursor
- y-prosemirror (for collaboration)

## Migration Notes

This implementation provides the same functionality as the TipTap version but with:
- Better performance due to direct ProseMirror usage
- More control over editor behavior
- Easier customization of node types and behaviors
- Reduced bundle size (no TipTap overhead)

The API surface is similar to maintain compatibility, but the internal implementation is completely rewritten using pure ProseMirror.