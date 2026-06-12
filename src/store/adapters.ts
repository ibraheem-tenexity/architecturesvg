import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react'
import { DiagramNode, DiagramEdge } from './types'

export function toRFNode(node: DiagramNode): RFNode {
  return {
    id: node.id,
    type: 'custom',
    position: node.position,
    data: {
      label: node.label,
      nodeType: node.type,
      style: node.style,
    },
    width: node.size.width,
    height: node.size.height,
  }
}

export function toRFEdge(edge: DiagramEdge): RFEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    type: 'custom',
    label: edge.label,
    data: {
      style: edge.style,
      marker: edge.marker,
    },
  }
}
