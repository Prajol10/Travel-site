'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
]

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        border: 'none',
        borderRadius: '6px',
        background: active ? 'var(--navy, #1B2B4B)' : 'transparent',
        color: active ? '#fff' : '#334155',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      ImageExt,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  if (!editor) return null

  const currentHeading = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
    ? 'h3'
    : 'paragraph'

  function setHeading(v: string) {
    if (v === 'paragraph') {
      editor!.chain().focus().setParagraph().run()
    } else {
      editor!
        .chain()
        .focus()
        .toggleHeading({ level: Number(v.replace('h', '')) as 1 | 2 | 3 })
        .run()
    }
  }

  function addLink() {
    const url = window.prompt('Enter URL')
    if (url) editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('Enter image URL')
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  const wrapStyle = { border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }
  const toolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.15rem',
    flexWrap: 'wrap' as const,
    padding: '0.4rem 0.5rem',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  }
  const dividerStyle = { width: '1px', height: '22px', background: '#E2E8F0', margin: '0 0.3rem' }
  const selectStyle = {
    padding: '0.3rem 0.4rem',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    fontSize: '0.8rem',
    marginRight: '0.3rem',
    background: '#fff',
    cursor: 'pointer',
  }

  return (
    <div style={wrapStyle}>
      <div style={toolbarStyle}>
        <select value={currentHeading} onChange={(e) => setHeading(e.target.value)} style={selectStyle}>
          {HEADING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div style={dividerStyle} />

        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          Tx
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}>
          ��
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}>
          🖼
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •≡
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.≡
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ⟸
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ≡
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          ⟹
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          "
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  )
}
