"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
  content: string;
  onContentChange: (data: { html: string; json: any }) => void;
}

export function TipTapEditor({ content, onContentChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Paste your content from Word or Google Docs here...'
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange({
        html: editor.getHTML(),
        json: editor.getJSON()
      });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4'
      }
    }
  });

  return (
    <div className="border rounded-lg bg-white">
      <div className="border-b p-2 bg-gray-50">
        <p className="text-sm text-gray-600">
          💡 Tip: Paste directly from Word or Google Docs to preserve formatting
        </p>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
