'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  RemoveFormatting,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Undo2,
  Redo2,
  Code,
  Table as TableIcon,
  Minus,
} from 'lucide-react'

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
]

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault()
        if (!disabled) onClick()
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        border: 'none',
        borderRadius: '6px',
        background: active ? 'var(--navy, #1B2B4B)' : 'transparent',
        color: active ? '#fff' : disabled ? '#CBD5E1' : '#334155',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

function ColorSwatchButton({
  title,
  value,
  onChange,
  icon,
}: {
  title: string
  value: string
  onChange: (color: string) => void
  icon: React.ReactNode
}) {
  return (
    <label
      title={title}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#334155',
      }}
    >
      {icon}
      <div style={{ position: 'absolute', bottom: '3px', left: '7px', width: '18px', height: '3px', borderRadius: '2px', background: value || '#C9A84C' }} />
      <input
        type="color"
        value={value || '#C9A84C'}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
      />
    </label>
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
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
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

  function insertTable() {
    editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
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
        <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>

        <div style={dividerStyle} />

        <select value={currentHeading} onChange={(e) => setHeading(e.target.value)} style={selectStyle}>
          {HEADING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div style={dividerStyle} />

        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <RemoveFormatting size={16} />
        </ToolbarButton>

        <div style={dividerStyle} />

        <ColorSwatchButton
          title="Text color"
          value={editor.getAttributes('textStyle').color}
          onChange={(color) => editor.chain().focus().setColor(color).run()}
          icon={<span style={{ fontWeight: 700, fontSize: '0.85rem' }}>A</span>}
        />
        <ColorSwatchButton
          title="Highlight"
          value={editor.getAttributes('highlight').color}
          onChange={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
          icon={<span style={{ fontWeight: 700, fontSize: '0.85rem' }}>H</span>}
        />

        <div style={dividerStyle} />

        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}>
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Table" onClick={insertTable}>
          <TableIcon size={16} />
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={16} />
        </ToolbarButton>

        <div style={dividerStyle} />

        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  )
}
