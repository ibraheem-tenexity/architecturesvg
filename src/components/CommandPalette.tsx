import { useState, useEffect, useCallback, useRef } from 'react'
import { useDiagramStore } from '../store/useDiagramStore'
import type { NodeType } from '../store/types'
import { announce } from '../utils/a11y'

interface Command {
  id: string
  label: string
  group: string
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onOpenTemplates: () => void
  onOpenExport: () => void
}

export default function CommandPalette({
  open,
  onClose,
  onOpenTemplates,
  onOpenExport,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { addNode, undo, redo } = useDiagramStore()

  const makeAddNodeCmd = (type: NodeType, label: string): Command => ({
    id: `add-${type}`,
    label: `Add ${label}`,
    group: 'Add Node',
    action: () => {
      addNode(type, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 })
      announce(`${label} node added`)
      onClose()
    },
  })

  const allCommands: Command[] = [
    makeAddNodeCmd('service', 'Service'),
    makeAddNodeCmd('database', 'Database'),
    makeAddNodeCmd('queue', 'Queue'),
    makeAddNodeCmd('gateway', 'Gateway'),
    makeAddNodeCmd('cache', 'Cache'),
    makeAddNodeCmd('external', 'External'),
    makeAddNodeCmd('cloud', 'Cloud'),
    makeAddNodeCmd('container', 'Container'),
    {
      id: 'open-templates',
      label: 'Open Templates',
      group: 'Templates',
      action: () => {
        onClose()
        onOpenTemplates()
      },
    },
    {
      id: 'export-svg',
      label: 'Export as SVG',
      group: 'Export',
      action: () => {
        onClose()
        onOpenExport()
      },
    },
    {
      id: 'export-png',
      label: 'Export as PNG',
      group: 'Export',
      action: () => {
        onClose()
        onOpenExport()
      },
    },
    {
      id: 'undo',
      label: 'Undo',
      group: 'History',
      action: () => {
        undo()
        announce('Undo')
        onClose()
      },
    },
    {
      id: 'redo',
      label: 'Redo',
      group: 'History',
      action: () => {
        redo()
        announce('Redo')
        onClose()
      },
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      group: 'View',
      action: () => {
        document.documentElement.classList.toggle('dark')
        announce('Theme toggled')
        onClose()
      },
    },
  ]

  const filtered = query.trim()
    ? allCommands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.group.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  // Reset when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Reset active index on filter change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filtered[activeIndex]
        if (cmd) cmd.action()
        return
      }
    },
    [filtered, activeIndex, onClose]
  )

  if (!open) return null

  // Group consecutive items
  const renderedItems: Array<{ type: 'header'; group: string } | { type: 'item'; cmd: Command; index: number }> = []
  let lastGroup = ''
  let globalIndex = 0
  for (const cmd of filtered) {
    if (cmd.group !== lastGroup) {
      renderedItems.push({ type: 'header', group: cmd.group })
      lastGroup = cmd.group
    }
    renderedItems.push({ type: 'item', cmd, index: globalIndex })
    globalIndex++
  }

  return (
    <div
      data-testid="command-palette"
      className="fixed inset-0 bg-ink/50 z-50 flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="bg-raised rounded-xl shadow-xl w-[540px] flex flex-col overflow-hidden max-h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <svg
            className="w-4 h-4 text-text-tertiary shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
            aria-label="Search commands"
          />
          <kbd className="text-xs text-text-tertiary bg-sunken px-1.5 py-0.5 rounded font-mono">esc</kbd>
        </div>

        {/* Command list */}
        <div
          className="overflow-y-auto py-1"
          role="listbox"
          aria-label="Commands"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-secondary">No commands found</div>
          ) : (
            renderedItems.map((item, i) => {
              if (item.type === 'header') {
                return (
                  <div key={`header-${item.group}-${i}`} className="px-4 pt-3 pb-1">
                    <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                      {item.group}
                    </span>
                  </div>
                )
              }
              const isActive = item.index === activeIndex
              return (
                <div
                  key={item.cmd.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => item.cmd.action()}
                  onMouseEnter={() => setActiveIndex(item.index)}
                  className={`mx-1 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-brand text-primary-foreground'
                      : 'text-text-primary hover:bg-sunken'
                  }`}
                >
                  {item.cmd.label}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
