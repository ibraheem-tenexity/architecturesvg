import type { NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'

interface CustomNodeData {
  label: string
  type: string
  [key: string]: unknown
}

export function CustomNode({ id, data }: NodeProps) {
  return (
    <div
      data-testid="canvas-node"
      data-node-id={id}
      className="bg-card border border-border-default rounded-lg p-3 min-w-[120px] shadow-sm"
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-medium text-text-primary">
        {(data as CustomNodeData).label || 'Node'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export const nodeTypes = { custom: CustomNode }
