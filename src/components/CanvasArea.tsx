import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from './canvas/CustomNode'
import { edgeTypes } from './canvas/CustomEdge'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function CanvasArea() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div
      data-testid="canvas"
      className="relative flex-1 bg-sunken overflow-hidden"
    >
      {nodes.length === 0 && (
        <div
          data-testid="canvas-empty-state"
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="text-center">
            <p className="text-text-secondary text-sm select-none">
              Click a shape in the palette to add your first node
            </p>
          </div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.1}
        maxZoom={4}
        className="h-full w-full"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="hsl(240 5% 84% / 0.5)"
        />
        <MiniMap
          className="!bg-raised !border !border-border-subtle"
          maskColor="hsl(240 5% 96% / 0.7)"
        />
        <Controls className="!bg-raised !border !border-border-subtle !rounded-lg !shadow-sm" />
      </ReactFlow>
    </div>
  )
}
