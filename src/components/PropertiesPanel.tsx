import { useDiagramStore } from '../store/useDiagramStore'
import type { MarkerType } from '../store/types'

// Token-based fill color options
const FILL_OPTIONS: { label: string; value: string }[] = [
  { label: 'Card (default)', value: 'hsl(var(--card))' },
  { label: 'Brand', value: 'hsl(var(--brand))' },
  { label: 'Brand Soft', value: 'hsl(var(--brand-soft))' },
  { label: 'Raised', value: 'hsl(var(--raised))' },
  { label: 'Success', value: 'hsl(var(--success))' },
  { label: 'Warning', value: 'hsl(var(--warning))' },
  { label: 'Danger', value: 'hsl(var(--danger))' },
  { label: 'Viz 1 (blue)', value: 'hsl(var(--viz-1))' },
  { label: 'Viz 2 (orange)', value: 'hsl(var(--viz-2))' },
  { label: 'Viz 3 (green)', value: 'hsl(var(--viz-3))' },
  { label: 'Viz 4 (yellow)', value: 'hsl(var(--viz-4))' },
  { label: 'Viz 5 (blue alt)', value: 'hsl(var(--viz-5))' },
]

const STROKE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default', value: 'hsl(var(--border-default))' },
  { label: 'Subtle', value: 'hsl(var(--border-subtle))' },
  { label: 'Brand', value: 'hsl(var(--brand))' },
  { label: 'Success', value: 'hsl(var(--success))' },
  { label: 'Warning', value: 'hsl(var(--warning))' },
  { label: 'Danger', value: 'hsl(var(--danger))' },
]

const MARKER_OPTIONS: { label: string; value: MarkerType }[] = [
  { label: 'Arrow (filled)', value: 'arrow' },
  { label: 'Arrow (open)', value: 'arrow-open' },
  { label: 'None', value: 'none' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="category-label mb-2">{children}</p>
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs text-text-secondary font-medium">{label}</label>
      {children}
    </div>
  )
}

export default function PropertiesPanel() {
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId)
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId)
  const nodes = useDiagramStore((s) => s.document.nodes)
  const edges = useDiagramStore((s) => s.document.edges)
  const updateNode = useDiagramStore((s) => s.updateNode)
  const updateEdge = useDiagramStore((s) => s.updateEdge)

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null

  return (
    <aside
      data-testid="properties-panel"
      className="w-80 bg-raised border-l border-border-subtle flex flex-col shrink-0 overflow-y-auto"
    >
      <div className="px-3 pt-4 pb-2">
        <span className="category-label">Properties</span>
      </div>

      {/* No selection */}
      {!selectedNode && !selectedEdge && (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-text-tertiary text-center select-none">
            Select a node or edge to inspect it
          </p>
        </div>
      )}

      {/* Node properties */}
      {selectedNode && (
        <div className="px-3 pb-4 flex flex-col gap-1">
          <SectionLabel>Node</SectionLabel>

          <FieldRow label="Label">
            <input
              data-testid="prop-node-label"
              type="text"
              value={selectedNode.label}
              onChange={(e) =>
                updateNode(selectedNode.id, { label: e.target.value })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="Node label"
            />
          </FieldRow>

          <FieldRow label="Fill color">
            <select
              data-testid="prop-node-fill"
              value={selectedNode.style.fill ?? 'hsl(var(--card))'}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  style: { ...selectedNode.style, fill: e.target.value },
                })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {FILL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Stroke color">
            <select
              data-testid="prop-node-stroke"
              value={selectedNode.style.stroke ?? 'hsl(var(--border-default))'}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  style: { ...selectedNode.style, stroke: e.target.value },
                })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {STROKE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldRow>

          <div className="mt-2 text-xs text-text-tertiary">
            Type: <span className="font-medium text-text-secondary">{selectedNode.type}</span>
          </div>
          <div className="text-xs text-text-tertiary">
            Position:{' '}
            <span className="font-medium text-text-secondary tabular">
              {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}
            </span>
          </div>
        </div>
      )}

      {/* Edge properties */}
      {selectedEdge && (
        <div className="px-3 pb-4 flex flex-col gap-1">
          <SectionLabel>Edge</SectionLabel>

          <FieldRow label="Label">
            <input
              data-testid="prop-edge-label"
              type="text"
              value={selectedEdge.label ?? ''}
              onChange={(e) =>
                updateEdge(selectedEdge.id, { label: e.target.value || undefined })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="Edge label"
            />
          </FieldRow>

          <FieldRow label="Stroke color">
            <select
              data-testid="prop-edge-stroke"
              value={selectedEdge.style.stroke ?? 'hsl(var(--border-default))'}
              onChange={(e) =>
                updateEdge(selectedEdge.id, {
                  style: { ...selectedEdge.style, stroke: e.target.value },
                })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {STROKE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Arrowhead">
            <select
              data-testid="prop-edge-marker"
              value={selectedEdge.marker}
              onChange={(e) =>
                updateEdge(selectedEdge.id, { marker: e.target.value as MarkerType })
              }
              className="w-full px-2 py-1.5 text-sm rounded-md border border-border-default bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {MARKER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Dashed">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                data-testid="prop-edge-dashed"
                type="checkbox"
                checked={selectedEdge.style.dashed ?? false}
                onChange={(e) =>
                  updateEdge(selectedEdge.id, {
                    style: { ...selectedEdge.style, dashed: e.target.checked },
                  })
                }
                className="accent-brand"
              />
              Dashed line
            </label>
          </FieldRow>
        </div>
      )}
    </aside>
  )
}
