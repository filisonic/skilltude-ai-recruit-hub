# Blog Editor Guide - Dual Mode Editor

## Overview
Your blog editor now has TWO modes to give you maximum flexibility:

### 1. Rich Text Editor (WYSIWYG)
- **What it is**: A visual editor like Medium or Notion
- **Best for**: Quick writing, visual formatting, seeing exactly what you get
- **Features**:
  - Toolbar with formatting buttons (Bold, Italic, Headers, Lists)
  - Click to format - no syntax needed
  - Add links and images with prompts
  - Undo/Redo support
  - Saves as HTML

### 2. Markdown Editor with Live Preview
- **What it is**: Write in markdown, see live preview side-by-side
- **Best for**: Writers who prefer markdown, technical content, copy-pasting from markdown editors
- **Features**:
  - Markdown syntax support
  - Live preview panel (toggle on/off)
  - Familiar markdown shortcuts
  - Saves as markdown (converted to HTML on display)

## How to Use

### Switching Between Modes
1. Go to Admin Dashboard → Create/Edit Article
2. In the Content section, you'll see two buttons:
   - **Rich Text** - Visual editor
   - **Markdown** - Markdown with preview
3. Click to switch modes anytime

### Rich Text Editor Tips
- **Bold**: Click the B button or select text and click
- **Headers**: Use H1, H2, H3 buttons for different heading sizes
- **Lists**: Click bullet or numbered list buttons
- **Links**: Click link icon, enter URL
- **Images**: Click image icon, enter image URL
- **Undo/Redo**: Use the arrow buttons if you make a mistake

### Markdown Editor Tips
- **Bold**: `**text**`
- **Italic**: `*text*` or `_text_`
- **Headers**: 
  - `# Heading 1`
  - `## Heading 2`
  - `### Heading 3`
- **Lists**: 
  - `- Item` for bullets
  - `1. Item` for numbered
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Toggle Preview**: Click "Show/Hide Preview" to see formatted output

## Workflow Recommendations

### For Quick Posts
1. Use **Rich Text Editor**
2. Write and format directly
3. Save and publish

### For Markdown Users
1. Use **Markdown Editor**
2. Write in markdown (or paste from external editor)
3. Check live preview
4. Save and publish

### For Copy-Paste from External Editors
1. If copying HTML → Use **Rich Text Editor**
2. If copying Markdown → Use **Markdown Editor**
3. Check preview before publishing

## Storage
- **Rich Text**: Stores HTML in database
- **Markdown**: Stores markdown in database, converts to HTML on display
- Both display correctly on the blog

## Paragraph Spacing
The editor now has proper spacing between paragraphs for better readability:
- Paragraphs have 1.5em spacing
- Headers have proper top/bottom margins
- Lists are properly spaced

## Next Steps
1. Build the project: `npm run build`
2. Upload `dist` folder to Hostinger
3. Test both editor modes in admin panel
4. Choose your preferred mode or switch as needed!

## Benefits
✅ Flexibility - Choose what works for you
✅ No external tools needed
✅ Live preview for markdown
✅ Professional WYSIWYG editor
✅ Both modes save correctly
✅ Clean, readable output
