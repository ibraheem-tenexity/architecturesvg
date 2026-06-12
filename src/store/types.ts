export type NodeType = 'service' | 'database' | 'queue' | 'gateway' | 'cache' | 'external' | 'cloud' | 'container'

export interface NodeStyle {
  fill?: string
  stroke?: string
  accent?: string  // viz-ramp color for accent bar
  textColor?: string
  status?: 'success' | 'warning' | 'danger'
}

export interface DiagramNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  size: { width: number; height: number }
  label: string
  style: NodeStyle
  group?: string
}

export interface EdgeStyle {
  stroke?: string
  width?: number
  dashed?: boolean
}

export type MarkerType = 'arrow' | 'arrow-open' | 'none'

export interface DiagramEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
  style: EdgeStyle
  marker: MarkerType
}

export interface DocumentMeta {
  schemaVersion: number
  title: string
  theme: 'light' | 'dark' | 'adaptive'
  createdAt: string
  updatedAt: string
}

export interface DiagramDocument {
  meta: DocumentMeta
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}
