import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { sanitizeHtml } from '../../lib/sanitize';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  required?: boolean;
  hint?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  required = false,
  hint,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const rawHtml = editor.getHTML();
      const cleanHtml = sanitizeHtml(rawHtml);
      onChange(cleanHtml);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#003DA5]/20 focus-within:border-[#003DA5] transition-all">
        {/* Toolbar */}
        <div className="bg-neutral-50 border-b border-neutral-200 p-1.5 flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('bold') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('italic') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('underline') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-neutral-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-neutral-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('blockquote') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-neutral-300 mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors ${
              editor.isActive('link') ? 'bg-[#003DA5] text-white hover:bg-[#003DA5]' : ''
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 transition-colors"
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content area */}
        <EditorContent
          editor={editor}
          className="p-3 min-h-[180px] text-sm text-neutral-800 prose prose-sm max-w-none focus:outline-none"
        />
      </div>

      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
