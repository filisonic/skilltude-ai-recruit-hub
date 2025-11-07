# How to Use the Blog Editors - Quick Guide

## Understanding the Two Editors

### Rich Text Editor (WYSIWYG)
- **For**: Writing from scratch with visual formatting
- **NOT for**: Pasting pre-formatted content from other sources
- **How it works**: You type and use toolbar buttons to format

### Markdown Editor
- **For**: Pasting markdown content OR writing in markdown
- **Best for**: Content from external markdown editors
- **How it works**: Write markdown, see live preview

## Common Mistake ❌

**DON'T**: Paste formatted text into Rich Text Editor expecting it to keep formatting
- When you paste into Rich Text, it pastes as PLAIN TEXT
- You then need to manually format it with toolbar buttons

## Correct Workflows ✅

### Workflow 1: Writing Fresh Content
1. Use **Rich Text Editor**
2. Type your content
3. Select text and click toolbar buttons to format:
   - Select text → Click **B** for bold
   - Select text → Click **I** for italic
   - Click **H1**, **H2**, **H3** for headers
   - Click list buttons for bullets/numbers

### Workflow 2: Pasting from Markdown Editor
1. Copy markdown from your external editor
2. Switch to **Markdown** mode
3. Paste the markdown
4. Check the live preview on the right
5. Save

### Workflow 3: Converting Existing Content
If you have plain text and want to format it:

**Option A - Use Markdown:**
1. Ask ChatGPT/Claude: "Convert this to markdown format"
2. Copy the markdown output
3. Paste into **Markdown Editor**
4. Check preview
5. Save

**Option B - Use Rich Text:**
1. Paste plain text into **Rich Text Editor**
2. Manually select and format each section:
   - Select heading → Click H1/H2/H3
   - Select text → Click B for bold
   - Select text → Click I for italic
   - Highlight list items → Click list button

## Example: Your LinkedIn Article

### What You Did (Didn't Work):
1. Got markdown from website ❌
2. Pasted into Rich Text Editor ❌
3. Expected automatic formatting ❌

### What You Should Do:
1. Get markdown from website ✅
2. Switch to **Markdown** mode ✅
3. Paste into Markdown Editor ✅
4. Check live preview ✅
5. Adjust spacing if needed ✅
6. Save ✅

## Quick Reference

| Task | Use This Editor | Steps |
|------|----------------|-------|
| Write new article | Rich Text | Type → Select → Format with buttons |
| Paste markdown | Markdown | Paste → Check preview → Save |
| Paste plain text | Either | Markdown: Add syntax manually<br>Rich Text: Format with buttons |
| Copy from Word/Docs | Markdown | Convert to markdown first, then paste |

## Spacing Issues?

If paragraphs are too close together in markdown:
- Add **blank lines** between paragraphs in the markdown editor
- One blank line = paragraph break

Example:
```markdown
This is paragraph one.

This is paragraph two.

This is paragraph three.
```

## Pro Tips

1. **For markdown users**: Always use Markdown mode - it's faster
2. **For visual users**: Use Rich Text and format as you type
3. **For pasting**: Use Markdown mode with markdown content
4. **Test first**: Use preview before publishing
5. **Spacing**: Add blank lines in markdown for better spacing

## Still Having Issues?

### Rich Text looks plain after pasting?
- That's normal! Rich Text doesn't auto-format pasted content
- Solution: Use Markdown mode instead

### Markdown preview looks wrong?
- Check your markdown syntax
- Make sure there are blank lines between paragraphs
- Rebuild and upload: `npm run build`

### Want to switch mid-edit?
- You can switch between modes anytime
- Content is preserved
- Just click the mode button

## Bottom Line

- **Got markdown?** → Use Markdown Editor
- **Writing fresh?** → Use Rich Text Editor  
- **Pasting plain text?** → Use Markdown (easier) or Rich Text (more work)
