import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  // Keep content in sync if it changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="tiptap-editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
