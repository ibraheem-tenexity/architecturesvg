import { create } from 'zustand'
import type { Node } from '@xyflow/react'

export type NodeType =
  | 'service'
  | 'database'
  | 'queue'
  | 'gateway'
  | 'cache'
  | 'external'
  | 'cloud'
  | 'container'

interface DiagramState {
  nodes: Node[]
  editingNodeId: string | null
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  setEditingNodeId: (id: string | null) => void
}

let nodeCounter = 0

export const useDiagramStore = create<DiagramState>((set) => ({
  nodes: [],
  editingNodeId: null,

  addNode: (type, position) => {
    nodeCounter += 1
    const id = `${type}-${nodeCounter}`
    const newNode: Node = {
      id,
      type: 'custom',
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), nodeType: type },
    }
    set((state) => ({
      nodes: [...state.nodes, newNode],
      editingNodeId: id,
    }))
  },

  setEditingNodeId: (id) => set({ editingNodeId: id }),
}))
