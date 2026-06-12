import { create } from 'zustand'
import { DiagramDocument, DiagramNode, DiagramEdge, NodeType } from './types'

const VIZ_COLORS: Record<NodeType, string> = {
  service: 'hsl(var(--viz-1))',
  database: 'hsl(var(--viz-3))',
  queue: 'hsl(var(--viz-2))',
  gateway: 'hsl(var(--viz-5))',
  cache: 'hsl(var(--viz-4))',
  external: 'hsl(var(--viz-7))',
  cloud: 'hsl(var(--viz-1))',
  container: 'hsl(var(--viz-3))',
}

const DEFAULT_SIZE = { width: 160, height: 60 }

function createId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function now(): string {
  return new Date().toISOString()
}

interface DiagramStore {
  document: DiagramDocument
  selectedNodeId: string | null
  selectedEdgeId: string | null
  connectingFrom: string | null  // node id we're connecting from (C key mode)
  editingNodeId: string | null   // node id currently being label-edited

  // Node actions
  addNode: (type: NodeType, position: { x: number; y: number }) => string
  updateNode: (id: string, updates: Partial<Omit<DiagramNode, 'id'>>) => void
  deleteNode: (id: string) => void
  moveNode: (id: string, position: { x: number; y: number }) => void
  setNodeLabel: (id: string, label: string) => void

  // Edge actions
  addEdge: (source: string, target: string, sourceHandle?: string, targetHandle?: string) => string
  updateEdge: (id: string, updates: Partial<Omit<DiagramEdge, 'id'>>) => void
  deleteEdge: (id: string) => void

  // Selection
  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void

  // Connect mode
  setConnectingFrom: (id: string | null) => void

  // Label editing
  setEditingNodeId: (id: string | null) => void

  // Document
  setTitle: (title: string) => void
  resetDocument: () => void
  loadDocument: (doc: DiagramDocument) => void

  // Undo/Redo (simple history)
  history: DiagramDocument[]
  historyIndex: number
  pushHistory: () => void
  undo: () => void
  redo: () => void
}

const initialDocument: DiagramDocument = {
  meta: {
    schemaVersion: 1,
    title: 'Untitled Diagram',
    theme: 'light',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  nodes: [],
  edges: [],
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
  document: initialDocument,
  selectedNodeId: null,
  selectedEdgeId: null,
  connectingFrom: null,
  editingNodeId: null,
  history: [initialDocument],
  historyIndex: 0,

  addNode: (type, position) => {
    const id = createId()
    const node: DiagramNode = {
      id,
      type,
      position,
      size: DEFAULT_SIZE,
      label: '',
      style: {
        fill: 'hsl(var(--card))',
        stroke: 'hsl(var(--border-default))',
        accent: VIZ_COLORS[type],
      },
    }
    set((state) => {
      const nodes = [...state.document.nodes, node]
      const doc = { ...state.document, nodes, meta: { ...state.document.meta, updatedAt: now() } }
      return { document: doc, editingNodeId: id, selectedNodeId: id }
    })
    get().pushHistory()
    return id
  },

  updateNode: (id, updates) => {
    set((state) => {
      const nodes = state.document.nodes.map((n) => n.id === id ? { ...n, ...updates } : n)
      return { document: { ...state.document, nodes, meta: { ...state.document.meta, updatedAt: now() } } }
    })
  },

  deleteNode: (id) => {
    set((state) => {
      const nodes = state.document.nodes.filter((n) => n.id !== id)
      const edges = state.document.edges.filter((e) => e.source !== id && e.target !== id)
      const doc = { ...state.document, nodes, edges, meta: { ...state.document.meta, updatedAt: now() } }
      return { document: doc, selectedNodeId: null }
    })
    get().pushHistory()
  },

  moveNode: (id, position) => {
    set((state) => {
      const nodes = state.document.nodes.map((n) => n.id === id ? { ...n, position } : n)
      return { document: { ...state.document, nodes, meta: { ...state.document.meta, updatedAt: now() } } }
    })
  },

  setNodeLabel: (id, label) => {
    set((state) => {
      const nodes = state.document.nodes.map((n) => n.id === id ? { ...n, label } : n)
      const doc = { ...state.document, nodes, meta: { ...state.document.meta, updatedAt: now() } }
      return { document: doc, editingNodeId: null }
    })
    get().pushHistory()
  },

  addEdge: (source, target, sourceHandle, targetHandle) => {
    const id = createId()
    const edge: DiagramEdge = {
      id,
      source,
      target,
      sourceHandle,
      targetHandle,
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    }
    set((state) => {
      const edges = [...state.document.edges, edge]
      const doc = { ...state.document, edges, meta: { ...state.document.meta, updatedAt: now() } }
      return { document: doc }
    })
    get().pushHistory()
    return id
  },

  updateEdge: (id, updates) => {
    set((state) => {
      const edges = state.document.edges.map((e) => e.id === id ? { ...e, ...updates } : e)
      return { document: { ...state.document, edges, meta: { ...state.document.meta, updatedAt: now() } } }
    })
  },

  deleteEdge: (id) => {
    set((state) => {
      const edges = state.document.edges.filter((e) => e.id !== id)
      return { document: { ...state.document, edges, meta: { ...state.document.meta, updatedAt: now() } } }
    })
    get().pushHistory()
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),
  setEditingNodeId: (id) => set({ editingNodeId: id }),

  setTitle: (title) => {
    set((state) => ({
      document: { ...state.document, meta: { ...state.document.meta, title, updatedAt: now() } }
    }))
  },

  resetDocument: () => {
    const doc = { ...initialDocument, meta: { ...initialDocument.meta, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }
    set({ document: doc, history: [doc], historyIndex: 0, selectedNodeId: null, selectedEdgeId: null })
  },

  loadDocument: (doc) => {
    set({ document: doc, history: [doc], historyIndex: 0, selectedNodeId: null, selectedEdgeId: null })
  },

  pushHistory: () => {
    set((state) => {
      const { history, historyIndex, document } = state
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(document)
      return { history: newHistory, historyIndex: newHistory.length - 1 }
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({ document: history[newIndex], historyIndex: newIndex })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({ document: history[newIndex], historyIndex: newIndex })
    }
  },
}))

// Expose read-only __diagram for tests
if (typeof window !== 'undefined') {
  useDiagramStore.subscribe((state) => {
    Object.defineProperty(window, '__diagram', {
      get: () => JSON.parse(JSON.stringify(state.document)),
      configurable: true,
    })
  })
  // Initialize immediately
  Object.defineProperty(window, '__diagram', {
    get: () => JSON.parse(JSON.stringify(useDiagramStore.getState().document)),
    configurable: true,
  })
}
