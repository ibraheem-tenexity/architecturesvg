import { BaseEdge, getStraightPath } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  target,
}: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g data-testid="canvas-edge" data-source={source} data-target={target}>
      <BaseEdge id={id} path={edgePath} />
    </g>
  )
}

export const edgeTypes = { custom: CustomEdge }
