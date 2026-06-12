import { useState } from 'react'
import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'
import ExportDialog from './ExportDialog'

export default function AppShell() {
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <Toolbar onExport={() => setExportOpen(true)} />
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
    </div>
  )
}
