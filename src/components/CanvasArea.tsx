import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect } from 'react'
import { nodeTypes } from './canvas/CustomNode'
import { edgeTypes } from './canvas/CustomEdge'
import { useDiagramStore } from '../store/diagramStore'
import type { NodeType } from '../store/diagramStore'

const initialEdges: Edge[] = []

export default function CanvasArea() {
  const storeNodes = useDiagramStore((s) => s.nodes)
  const addNode = useDiagramStore((s) => s.addNode)
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Keep local ReactFlow state in sync with store
  useEffect(() => {
    setNodes(storeNodes)
  }, [storeNodes, setNodes])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/architecturesvg-node') as NodeType
    if (!type) return
    const rect = e.currentTarget.getBoundingClientRect()
    const position = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    addNode(type, position)
  }

  return (
    <div
      data-testid="canvas"
      className="relative flex-1 bg-sunken overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
