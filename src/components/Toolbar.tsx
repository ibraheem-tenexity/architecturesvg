import { useDiagramStore } from '../store/useDiagramStore'

interface ToolbarProps {
  onExport: () => void
}

export default function Toolbar({ onExport }: ToolbarProps) {
  const theme = useDiagramStore((s) => s.document.meta.theme)
  const setTheme = useDiagramStore((s) => s.setTheme)
  const saveStatus = useDiagramStore((s) => s.saveStatus)

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <header
      data-testid="toolbar"
      className="h-14 flex items-center justify-between px-4 bg-raised border-b border-border-subtle shrink-0"
    >
      <span className="font-display text-base text-text-primary">
        ArchitectureSVG
      </span>

      <div className="flex items-center gap-3">
        {/* Save status indicator */}
        <span
          data-testid="save-status"
          className={`text-xs tabular transition-colors ${
            saveStatus === 'saved'
              ? 'text-success'
              : saveStatus === 'saving'
              ? 'text-text-tertiary'
              : saveStatus === 'error'
              ? 'text-danger'
              : 'text-text-tertiary'
          }`}
          aria-live="polite"
        >
          {saveStatus === 'saved' && '✓ Saved'}
          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'error' && 'Save failed'}
          {saveStatus === 'idle' && ''}
        </span>

        {/* Theme toggle */}
        <button
          data-testid="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light mode' : 'Dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-colors text-base"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Export button */}
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
