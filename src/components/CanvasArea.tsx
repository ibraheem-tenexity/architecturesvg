import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
} from '@xyflow/react'
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback } from 'react'
import { nodeTypes } from './canvas/CustomNode'
import { edgeTypes } from './canvas/CustomEdge'
import { useDiagramStore } from '../store/useDiagramStore'
import { toRFNode, toRFEdge } from '../store/adapters'
import type { NodeType } from '../store/types'

export default function CanvasArea() {
  const { document: doc, moveNode, addEdge, addNode } = useDiagramStore()

  const rfNodes = doc.nodes.map(toRFNode)
  const rfEdges = doc.edges.map(toRFEdge)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          moveNode(change.id, change.position)
        }
      })
    },
    [moveNode]
  )

  const onEdgesChange = useCallback((_changes: EdgeChange[]) => {
    // handled by addEdge/deleteEdge
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdge(
          connection.source,
          connection.target,
          connection.sourceHandle ?? undefined,
          connection.targetHandle ?? undefined
        )
      }
    },
    [addEdge]
  )

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
      {rfNodes.length === 0 && (
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
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
