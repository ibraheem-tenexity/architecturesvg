import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'

export default function AppShell() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <CanvasArea hasNodes={false} />
        <PropertiesPanel />
      </div>
    </div>
  )
}
