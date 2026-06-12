import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
} from '@xyflow/react'
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect } from 'react'
import { nodeTypes } from './canvas/CustomNode'
import { edgeTypes } from './canvas/CustomEdge'
import { useDiagramStore } from '../store/useDiagramStore'
import { toRFNode, toRFEdge } from '../store/adapters'
import type { NodeType } from '../store/types'
import { announce } from '../utils/a11y'

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const { selectedNodeId, connectingFrom, addEdge: storeAddEdge, setConnectingFrom, deleteNode, deleteEdge, selectedEdgeId, undo, redo } = useDiagramStore.getState()

      if (e.key === 'c' || e.key === 'C') {
        if (selectedNodeId && !connectingFrom) {
          setConnectingFrom(selectedNodeId)
          announce('Connect mode: click a node to connect to')
        }
        return
      }

      if (e.key === 'Escape') {
        setConnectingFrom(null)
        return
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) deleteNode(selectedNodeId)
        else if (selectedEdgeId) deleteEdge(selectedEdgeId)
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        onPaneClick={() => {
          const { connectingFrom, setConnectingFrom, selectNode } = useDiagramStore.getState()
          if (connectingFrom) {
            setConnectingFrom(null)
          } else {
            selectNode(null)
          }
        }}
        onEdgeClick={(_, edge) => {
          useDiagramStore.getState().selectEdge(edge.id)
        }}
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
