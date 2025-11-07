import { marked } from 'marked';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MarkdownEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

const MarkdownEditor = ({ content, onChange }: MarkdownEditorProps) => {
  const [showPreview, setShowPreview] = useState(true);

  // Strip frontmatter from markdown for preview and fix spacing
  const stripFrontmatter = (markdown: string) => {
    // Remove YAML frontmatter (--- at start and end)
    let cleaned = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
    
    // Remove trailing tags section
    cleaned = cleaned.replace(/\n---\s*\n\*\*Tags:\*\*[\s\S]*$/, '');
    
    // Fix spacing: Convert double-space line breaks to actual paragraph breaks
    cleaned = cleaned.replace(/  \n/g, '\n\n');
    
    // More aggressive fix: Add blank lines between paragraphs that don't have them
    // Split by lines, and add blank line after any line that doesn't end with punctuation
    // indicating it's a continuation
    const lines = cleaned.split('\n');
    const fixed: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      
      fixed.push(line);
      
      // Add blank line if:
      // - Current line has content
      // - Next line exists and has content
      // - Next line doesn't start with # (header) or - or * (list)
      // - We're not already followed by a blank line
      if (line.trim() && nextLine && nextLine.trim() && 
          !nextLine.startsWith('#') && !nextLine.startsWith('-') && 
          !nextLine.startsWith('*') && !nextLine.startsWith('>')) {
        fixed.push(''); // Add blank line
      }
    }
    
    return fixed.join('\n').trim();
  };

  const previewContent = stripFrontmatter(content);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Write in Markdown format. Use ** for bold, * for italic, # for headers, - for lists.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {/* Markdown Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Markdown Editor
          </label>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Write your article content here..."
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Live Preview
            </label>
            <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[500px] overflow-auto">
              <article 
                className="prose prose-base max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 
                  prose-p:text-gray-700 prose-p:mb-8 prose-p:leading-relaxed 
                  prose-li:text-gray-700 prose-li:mb-2 
                  prose-ul:mb-8 prose-ol:mb-8
                  prose-strong:font-bold prose-strong:text-gray-900 
                  prose-em:italic prose-em:text-gray-700
                  prose-a:text-blue-600 prose-a:underline
                  prose-img:rounded-lg prose-img:my-6"
                dangerouslySetInnerHTML={{ 
                  __html: marked.parse(previewContent || '*Preview will appear here...*', {
                    breaks: true,
                    gfm: true
                  })
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
