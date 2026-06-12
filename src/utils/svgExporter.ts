import type { DiagramDocument, DiagramNode, NodeType } from '../store/types'

// Accent color palette mapped from node types
const NODE_ACCENT_COLORS: Record<NodeType, string> = {
  service: '#3B82F6',
  database: '#10B981',
  queue: '#8B5CF6',
  gateway: '#F59E0B',
  cache: '#EF4444',
  external: '#6B7280',
  cloud: '#3B82F6',
  container: '#10B981',
}

/**
 * Escape characters that are special in XML text content and attribute values.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Build the <defs> block containing arrowhead markers.
 */
function buildDefs(): string {
  return [
    '<defs>',
    // Closed arrowhead marker
    '  <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">',
    '    <path d="M0,0 L0,7 L10,3.5 z" fill="#71717A"/>',
    '  </marker>',
    // Open arrowhead marker
    '  <marker id="arrow-open" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">',
    '    <path d="M0,0 L10,3.5 L0,7" stroke="#71717A" stroke-width="1.5" fill="none"/>',
    '  </marker>',
    '</defs>',
  ].join('\n')
}

/**
 * Build SVG elements for all edges (rendered before nodes so nodes appear on top).
 */
function buildEdges(doc: DiagramDocument): string {
  const nodeMap = new Map<string, DiagramNode>()
  for (const node of doc.nodes) {
    nodeMap.set(node.id, node)
  }

  const parts: string[] = []

  for (const edge of doc.edges) {
    const sourceNode = nodeMap.get(edge.source)
    const targetNode = nodeMap.get(edge.target)

    // Skip edges with missing endpoints
    if (!sourceNode || !targetNode) continue

    // Source anchor: right edge center
    const sx = sourceNode.position.x + sourceNode.size.width
    const sy = sourceNode.position.y + sourceNode.size.height / 2

    // Target anchor: left edge center
    const tx = targetNode.position.x
    const ty = targetNode.position.y + targetNode.size.height / 2

    // Bezier control points
    const dx = (tx - sx) * 0.5
    const cx1 = sx + dx
    const cy1 = sy
    const cx2 = tx - dx
    const cy2 = ty

    const strokeColor = edge.style.stroke ?? '#A1A1AA'
    const strokeWidth = edge.style.width ?? 1.5
    const strokeDash = edge.style.dashed ? ' stroke-dasharray="6 3"' : ''

    let markerEnd = ''
    if (edge.marker === 'arrow') {
      markerEnd = ' marker-end="url(#arrow)"'
    } else if (edge.marker === 'arrow-open') {
      markerEnd = ' marker-end="url(#arrow-open)"'
    }

    const pathD = `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`
    parts.push(
      `  <path d="${pathD}" stroke="${escapeXml(strokeColor)}" stroke-width="${strokeWidth}" fill="none"${strokeDash}${markerEnd}/>`
    )

    // Optional edge label at midpoint
    if (edge.label) {
      const midX = (sx + tx) / 2
      const midY = (sy + ty) / 2 - 6
      parts.push(
        `  <text x="${midX}" y="${midY}" text-anchor="middle" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="11" fill="#71717A">${escapeXml(edge.label)}</text>`
      )
    }
  }

  return parts.join('\n')
}

/**
 * Build SVG elements for all nodes (rendered on top of edges).
 */
function buildNodes(doc: DiagramDocument): string {
  const parts: string[] = []

  for (const node of doc.nodes) {
    const { x, y } = node.position
    const { width: w, height: h } = node.size

    const accentColor = node.style.accent ?? NODE_ACCENT_COLORS[node.type] ?? '#3B82F6'
    const fillColor = node.style.fill ?? '#FFFFFF'
    const strokeColor = node.style.stroke ?? '#D4D4D8'

    // Background card
    parts.push(
      `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${escapeXml(fillColor)}" stroke="${escapeXml(strokeColor)}" stroke-width="1"/>`
    )

    // Accent bar (left edge)
    parts.push(
      `  <rect x="${x}" y="${y}" width="3" height="${h}" rx="1.5" fill="${escapeXml(accentColor)}"/>`
    )

    // Node label
    const labelX = x + 20
    const labelY = y + h / 2 + 5
    parts.push(
      `  <text x="${labelX}" y="${labelY}" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="13" font-weight="500" fill="#18181B">${escapeXml(node.label)}</text>`
    )
  }

  return parts.join('\n')
}

/**
 * Export a DiagramDocument to a clean, self-contained SVG string.
 *
 * Guarantees:
 * - Starts with <?xml prolog followed by <svg
 * - Contains <text elements with node labels
 * - Contains <path for edges and <marker arrowheads in <defs>
 * - Does NOT contain <foreignObject
 * - Does NOT contain external http:// or https:// URLs in href/src
 * - Single self-contained <svg xmlns="http://www.w3.org/2000/svg"> with valid viewBox
 */
export function exportSVG(doc: DiagramDocument): string {
  // Handle empty diagram
  if (doc.nodes.length === 0) {
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">',
      buildDefs(),
      '</svg>',
    ].join('\n')
  }

  // Compute viewBox: union of all node bounding boxes + 40px padding
  const PADDING = 40
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const node of doc.nodes) {
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + node.size.width)
    maxY = Math.max(maxY, node.position.y + node.size.height)
  }

  const vbX = minX - PADDING
  const vbY = minY - PADDING
  const vbW = maxX - minX + PADDING * 2
  const vbH = maxY - minY + PADDING * 2

  const defs = buildDefs()
  const edges = buildEdges(doc)
  const nodes = buildNodes(doc)

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${vbW}" height="${vbH}" viewBox="${vbX} ${vbY} ${vbW} ${vbH}">`,
    defs,
  ]

  if (edges) {
    lines.push(edges)
  }

  if (nodes) {
    lines.push(nodes)
  }

  lines.push('</svg>')

  return lines.join('\n')
}
