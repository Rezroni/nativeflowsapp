'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TableOfContents from '@tiptap/extension-table-of-contents'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRef, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface BlogEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

interface TOCConfig {
  title: string
  toggleShowHide: boolean
  minHeadings: number
  depth: number
  hierarchical: boolean
}

export function BlogEditor({ content, onChange, placeholder }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tocConfig, setTocConfig] = useState<TOCConfig>({
    title: 'Table Of Contents',
    toggleShowHide: true,
    minHeadings: 2,
    depth: 6,
    hierarchical: true,
  })

  const editor = useEditor({
    immediatelyRender: false,
    content,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'heading-element',
          },
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        }
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your blog post...'
      }),
      TableOfContents.configure({
        getIndex: () => 0,
        onUpdate: () => {},
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
        style: 'outline: none;',
      },
      handleDOMEvents: {
        focus: () => {
          return false
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    autofocus: 'end',
    editable: true,
  })

  if (!editor) {
    return null
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB')
      return
    }

    // Convert image to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      if (base64) {
        editor.chain().focus().setImage({ src: base64 }).run()
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addImage = () => {
    fileInputRef.current?.click()
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertTableOfContents = () => {
    const tocHTML = `
      <div class="table-of-contents" data-toc-config='${JSON.stringify(tocConfig)}'>
        <div class="toc-header">
          <h3>${tocConfig.title}</h3>
          ${tocConfig.toggleShowHide ? '<button class="toc-toggle" onclick="this.closest(\'.table-of-contents\\').classList.toggle(\'collapsed\')">Toggle</button>' : ''}
        </div>
        <div class="toc-content">
          <!-- Table of contents will be generated from headings -->
        </div>
      </div>
    `
    editor.chain().focus().insertContent(tocHTML).run()
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="bg-muted/30 border-b border-border p-2 flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-muted' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Table of Contents Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Customize Table of Contents</h4>

              <div className="space-y-2">
                <Label htmlFor="toc-title">Title</Label>
                <Input
                  id="toc-title"
                  value={tocConfig.title}
                  onChange={(e) => setTocConfig({ ...tocConfig, title: e.target.value })}
                  placeholder="Table Of Contents"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="toggle-show-hide">Toggle Show/Hide</Label>
                <Switch
                  id="toggle-show-hide"
                  checked={tocConfig.toggleShowHide}
                  onCheckedChange={(checked) => setTocConfig({ ...tocConfig, toggleShowHide: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-headings">Minimal Count of Headings</Label>
                <Input
                  id="min-headings"
                  type="number"
                  min="1"
                  max="10"
                  value={tocConfig.minHeadings}
                  onChange={(e) => setTocConfig({ ...tocConfig, minHeadings: parseInt(e.target.value) || 2 })}
                />
                <p className="text-xs text-muted-foreground">
                  If count of headings is less, TOC is not displayed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth">Depth</Label>
                <Input
                  id="depth"
                  type="number"
                  min="1"
                  max="6"
                  value={tocConfig.depth}
                  onChange={(e) => setTocConfig({ ...tocConfig, depth: parseInt(e.target.value) || 6 })}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum heading level to include (1-6)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hierarchical">Hierarchical View</Label>
                <Switch
                  id="hierarchical"
                  checked={tocConfig.hierarchical}
                  onCheckedChange={(checked) => setTocConfig({ ...tocConfig, hierarchical: checked })}
                />
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={insertTableOfContents}
              >
                Insert Table of Contents
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-background" />

      {/* Custom Styles for Editor */}
      <style jsx global>{`
        /* Heading Styles - Make them visible in editor */
        .ProseMirror h1 {
          font-size: 2.25em;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        .ProseMirror h2 {
          font-size: 1.875em;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          color: #2563eb;
        }

        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1em;
          margin-bottom: 1em;
          color: #3b82f6;
        }

        .ProseMirror h4 {
          font-size: 1.25em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }

        .ProseMirror h5 {
          font-size: 1.125em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
        }

        .ProseMirror h6 {
          font-size: 1em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
        }

        /* Make editor editable and focusable */
        .ProseMirror {
          outline: none !important;
        }

        .ProseMirror:focus {
          outline: none !important;
        }

        /* Table of Contents Styles */
        .table-of-contents {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          background: #f9fafb;
        }

        .table-of-contents.collapsed .toc-content {
          display: none;
        }

        .toc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .toc-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .toc-toggle {
          padding: 0.25rem 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .toc-toggle:hover {
          background: #2563eb;
        }

        .toc-content {
          padding-left: 0;
        }

        /* Placeholder text styling */
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
