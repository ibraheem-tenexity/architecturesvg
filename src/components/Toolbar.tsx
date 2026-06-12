import { useDiagramStore } from '../store/useDiagramStore'
import { announce } from '../utils/a11y'

interface ToolbarProps {
  onExport: () => void
  onOpenTemplates: () => void
}

export default function Toolbar({ onExport, onOpenTemplates }: ToolbarProps) {
  const { undo, redo, historyIndex, history } = useDiagramStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleUndo = () => {
    undo()
    announce('Undo')
  }

  const handleRedo = () => {
    redo()
    announce('Redo')
  }

  return (
    <header
      data-testid="toolbar"
      className="h-14 flex items-center justify-between px-4 bg-raised border-b border-border-subtle shrink-0"
    >
      <span className="font-display text-base text-text-primary">
        ArchitectureSVG
      </span>

      <div className="flex items-center gap-2">
        {/* Undo */}
        <button
          data-testid="undo-button"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Cmd+Z)"
          aria-label="Undo"
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-sunken transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 7l3-3M3 7l3 3M3 7h7a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Redo */}
        <button
          data-testid="redo-button"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Cmd+Shift+Z)"
          aria-label="Redo"
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-sunken transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 7l-3-3M13 7l-3 3M13 7H6a3 3 0 000 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="w-px h-5 bg-border-subtle mx-1" aria-hidden="true" />

        {/* Templates */}
        <button
          data-testid="templates-button"
          onClick={onOpenTemplates}
          className="px-3 py-1.5 text-sm font-medium rounded-md text-text-primary hover:bg-sunken transition-colors"
        >
          Templates
        </button>

        {/* Export */}
        <button
          data-testid="export-button"
          onClick={onExport}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-brand-deep transition-colors"
        >
          Export
        </button>
      </div>
    </header>
  )
}
