import { EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react'

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, target, selected }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return (
    <g data-testid="canvas-edge" data-source={source} data-target={target}>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'hsl(var(--brand))' : 'hsl(var(--border-default))',
          strokeWidth: selected ? 2 : 1.5,
        }}
      />
    </g>
  )
}

export const edgeTypes = { custom: CustomEdge }
