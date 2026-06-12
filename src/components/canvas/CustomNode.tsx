import { NodeProps, Handle, Position } from '@xyflow/react'
import { useDiagramStore } from '../../store/useDiagramStore'
import { useRef, useEffect } from 'react'
import type { NodeType } from '../../store/types'

// Viz-ramp accent colors per node type
const ACCENT_COLORS: Record<NodeType, string> = {
  service: 'hsl(var(--viz-1))',
  database: 'hsl(var(--viz-3))',
  queue: 'hsl(var(--viz-2))',
  gateway: 'hsl(var(--viz-5))',
  cache: 'hsl(var(--viz-4))',
  external: 'hsl(var(--viz-7))',
  cloud: 'hsl(var(--viz-1))',
  container: 'hsl(var(--viz-3))',
}

// Node type icons (text glyphs, no external deps)
const NODE_ICONS: Record<NodeType, string> = {
  service: '⬡',
  database: '⬤',
  queue: '⇄',
  gateway: '◈',
  cache: '⚡',
  external: '◇',
  cloud: '☁',
  container: '▣',
}

interface NodeData {
  label: string
  nodeType: NodeType
  style?: { accent?: string; fill?: string; stroke?: string }
  [key: string]: unknown
}

export function CustomNode({ id, data, selected }: NodeProps) {
  const nodeData = data as NodeData
  const nodeType = nodeData.nodeType || 'service'
  const accentColor = nodeData.style?.accent || ACCENT_COLORS[nodeType]
  const label = nodeData.label || ''

  const { editingNodeId, setNodeLabel, setEditingNodeId, selectNode } = useDiagramStore()
  const isEditing = editingNodeId === id
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when this node enters edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleLabelCommit = (value: string) => {
    setNodeLabel(id, value.trim() || 'Node')
    selectNode(id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLabelCommit(e.currentTarget.value)
    }
    if (e.key === 'Escape') {
      setEditingNodeId(null)
      selectNode(id)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingNodeId(id)
  }

  return (
    <div
      data-testid="canvas-node"
      data-node-id={id}
      className={`
        relative bg-card rounded-lg border overflow-hidden select-none cursor-default
        transition-shadow duration-fast
        ${selected
          ? 'border-brand shadow-[0_0_0_2px_hsl(var(--brand))]'
          : 'border-border-default shadow-sm hover:shadow-md'
        }
      `}
      style={{ minWidth: 140, minHeight: 52 }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 3px left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
        style={{ backgroundColor: accentColor }}
      />

      {/* Node content (left-padded past accent bar) */}
      <div className="pl-4 pr-3 py-2 flex items-center gap-2">
        {/* Type icon with accent color */}
        <span
          className="text-base flex-shrink-0"
          style={{ color: accentColor }}
          aria-hidden="true"
        >
          {NODE_ICONS[nodeType]}
        </span>

        {/* Label — input when editing, div when not */}
        {isEditing ? (
          <input
            ref={inputRef}
            data-testid="node-label-input"
            defaultValue={label}
            className="
              flex-1 bg-transparent border-none outline-none
              text-body-sm font-medium text-text-primary
              border-b border-brand pb-px
              min-w-0 w-24
            "
            placeholder="Node label..."
            onBlur={(e) => handleLabelCommit(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="flex-1 text-body-sm font-medium text-text-primary truncate">
            {label || <span className="text-text-tertiary italic">Unnamed</span>}
          </span>
        )}
      </div>

      {/* React Flow connection handles */}
      <Handle
        type="source"
        position={Position.Right}
        data-testid="node-handle-source"
        className="!w-3 !h-3 !bg-brand !border-2 !border-background !rounded-full opacity-0 hover:opacity-100 transition-opacity"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        data-testid="node-handle-target"
        className="!w-3 !h-3 !bg-brand !border-2 !border-background !rounded-full opacity-0 hover:opacity-100 transition-opacity"
        style={{ left: -6 }}
      />
    </div>
  )
}

export const nodeTypes = { custom: CustomNode }
