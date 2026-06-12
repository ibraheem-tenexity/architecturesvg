interface ToolbarProps {
  onExport: () => void
}

export default function Toolbar({ onExport }: ToolbarProps) {
  return (
    <header
      data-testid="toolbar"
      className="h-14 flex items-center justify-between px-4 bg-raised border-b border-border-subtle shrink-0"
    >
      <span className="font-display text-base text-text-primary">
        ArchitectureSVG
      </span>
      <button
        data-testid="export-button"
        onClick={onExport}
        className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-brand-deep transition-colors"
      >
        Export
      </button>
    </header>
  )
}
