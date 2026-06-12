import { useDiagramStore } from '../store/useDiagramStore'
import type { NodeType } from '../store/types'
import { announce } from '../utils/a11y'

const NODE_TYPES: Array<{ type: NodeType; label: string; icon: string; color: string }> = [
  { type: 'service',   label: 'Service',   icon: '⬡', color: 'hsl(var(--viz-1))' },
  { type: 'database',  label: 'Database',  icon: '🗄', color: 'hsl(var(--viz-3))' },
  { type: 'queue',     label: 'Queue',     icon: '⇄',  color: 'hsl(var(--viz-2))' },
  { type: 'gateway',   label: 'Gateway',   icon: '⬡',  color: 'hsl(var(--viz-5))' },
  { type: 'cache',     label: 'Cache',     icon: '⚡',  color: 'hsl(var(--viz-4))' },
  { type: 'external',  label: 'External',  icon: '◇',  color: 'hsl(var(--viz-7))' },
  { type: 'cloud',     label: 'Cloud',     icon: '☁',  color: 'hsl(var(--viz-1))' },
  { type: 'container', label: 'Container', icon: '▣',  color: 'hsl(var(--viz-3))' },
]

export default function NodePalette() {
  const addNode = useDiagramStore((s) => s.addNode)

  const handleAddNode = (type: NodeType) => {
    addNode(type, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 })
    announce(`${type} node added`)
  }

  return (
    <aside
      data-testid="node-palette"
      className="w-64 bg-raised border-r border-border-subtle flex flex-col overflow-y-auto shrink-0"
    >
      <div className="p-3 border-b border-border-subtle">
        <span className="category-label">SHAPES</span>
      </div>
      <div className="p-2 space-y-1">
        {NODE_TYPES.map(({ type, label, icon, color }) => (
          <div
            key={type}
            data-testid={`palette-item-${type}`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/architecturesvg-node', type)
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => handleAddNode(type)}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-sunken transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleAddNode(type)
              }
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-sm flex-shrink-0"
              style={{ color }}
              aria-hidden
            >
              {icon}
            </div>
            <span className="text-sm text-text-primary">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
