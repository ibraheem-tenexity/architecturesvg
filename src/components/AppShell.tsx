import { useState, useEffect, useCallback } from 'react'
import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'
import ExportDialog from './ExportDialog'
import TemplatesGallery from './TemplatesGallery'
import CommandPalette from './CommandPalette'

export default function AppShell() {
  const [exportOpen, setExportOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Global keyboard shortcut: Cmd/Ctrl+K → command palette
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCommandPaletteOpen((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <Toolbar
        onExport={() => setExportOpen(true)}
        onOpenTemplates={() => setTemplatesOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <CanvasArea />
        <PropertiesPanel />
      </div>
      <div
        data-testid="a11y-live"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live"
      />
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
      <TemplatesGallery
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
      />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onOpenExport={() => setExportOpen(true)}
      />
    </div>
  )
}
