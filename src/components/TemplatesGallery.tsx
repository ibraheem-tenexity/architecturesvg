import { useCallback } from 'react'
import { useDiagramStore } from '../store/useDiagramStore'
import type { DiagramDocument } from '../store/types'
import { announce } from '../utils/a11y'

const NOW = () => new Date().toISOString()

const MICROSERVICES_TEMPLATE: DiagramDocument = {
  meta: {
    schemaVersion: 1,
    title: 'Microservices Architecture',
    theme: 'light',
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  nodes: [
    {
      id: 'ms-gw',
      type: 'gateway',
      position: { x: 300, y: 80 },
      size: { width: 160, height: 60 },
      label: 'API Gateway',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-5))' },
    },
    {
      id: 'ms-auth',
      type: 'service',
      position: { x: 100, y: 220 },
      size: { width: 160, height: 60 },
      label: 'Auth Service',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-1))' },
    },
    {
      id: 'ms-user',
      type: 'database',
      position: { x: 100, y: 360 },
      size: { width: 160, height: 60 },
      label: 'User DB',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-3))' },
    },
    {
      id: 'ms-queue',
      type: 'queue',
      position: { x: 500, y: 220 },
      size: { width: 160, height: 60 },
      label: 'Message Queue',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-2))' },
    },
    {
      id: 'ms-notify',
      type: 'service',
      position: { x: 500, y: 360 },
      size: { width: 160, height: 60 },
      label: 'Notification Service',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-1))' },
    },
  ],
  edges: [
    {
      id: 'ms-e1',
      source: 'ms-gw',
      target: 'ms-auth',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'ms-e2',
      source: 'ms-auth',
      target: 'ms-user',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'ms-e3',
      source: 'ms-gw',
      target: 'ms-queue',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'ms-e4',
      source: 'ms-queue',
      target: 'ms-notify',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
  ],
}

const CLOUD_INFRA_TEMPLATE: DiagramDocument = {
  meta: {
    schemaVersion: 1,
    title: 'Cloud Infrastructure',
    theme: 'light',
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  nodes: [
    {
      id: 'ci-lb',
      type: 'cloud',
      position: { x: 300, y: 80 },
      size: { width: 160, height: 60 },
      label: 'Load Balancer',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-1))' },
    },
    {
      id: 'ci-app',
      type: 'service',
      position: { x: 300, y: 220 },
      size: { width: 160, height: 60 },
      label: 'App Server',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-1))' },
    },
    {
      id: 'ci-cache',
      type: 'cache',
      position: { x: 100, y: 360 },
      size: { width: 160, height: 60 },
      label: 'Cache',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-4))' },
    },
    {
      id: 'ci-db',
      type: 'database',
      position: { x: 500, y: 360 },
      size: { width: 160, height: 60 },
      label: 'Database',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-3))' },
    },
  ],
  edges: [
    {
      id: 'ci-e1',
      source: 'ci-lb',
      target: 'ci-app',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'ci-e2',
      source: 'ci-app',
      target: 'ci-cache',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'ci-e3',
      source: 'ci-app',
      target: 'ci-db',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
  ],
}

const REQUEST_FLOW_TEMPLATE: DiagramDocument = {
  meta: {
    schemaVersion: 1,
    title: 'Request Flow',
    theme: 'light',
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  nodes: [
    {
      id: 'rf-client',
      type: 'external',
      position: { x: 100, y: 200 },
      size: { width: 160, height: 60 },
      label: 'Client',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-7))' },
    },
    {
      id: 'rf-api',
      type: 'gateway',
      position: { x: 340, y: 200 },
      size: { width: 160, height: 60 },
      label: 'API',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-5))' },
    },
    {
      id: 'rf-db',
      type: 'database',
      position: { x: 580, y: 200 },
      size: { width: 160, height: 60 },
      label: 'Database',
      style: { fill: 'hsl(var(--card))', stroke: 'hsl(var(--border-default))', accent: 'hsl(var(--viz-3))' },
    },
  ],
  edges: [
    {
      id: 'rf-e1',
      source: 'rf-client',
      target: 'rf-api',
      label: 'HTTP Request',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
    {
      id: 'rf-e2',
      source: 'rf-api',
      target: 'rf-db',
      label: 'Query',
      style: { stroke: 'hsl(var(--border-default))', width: 1.5 },
      marker: 'arrow',
    },
  ],
}

interface TemplateCardProps {
  testId: string
  title: string
  description: string
  nodeCount: number
  edgeCount: number
  template: DiagramDocument
  onUse: (template: DiagramDocument) => void
}

function TemplateCard({ testId, title, description, nodeCount, edgeCount, template, onUse }: TemplateCardProps) {
  return (
    <div
      data-testid={testId}
      className="bg-raised border border-border-subtle rounded-xl p-5 flex flex-col gap-3 hover:border-brand transition-colors"
    >
      <div>
        <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
        <p className="text-text-secondary text-xs mt-1">{description}</p>
      </div>
      <div className="flex gap-3 text-xs text-text-tertiary">
        <span>{nodeCount} nodes</span>
        <span>{edgeCount} edges</span>
      </div>
      <button
        onClick={() => onUse(template)}
        className="mt-auto px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-brand-deep transition-colors"
      >
        Use Template
      </button>
    </div>
  )
}

interface TemplatesGalleryProps {
  open: boolean
  onClose: () => void
}

export default function TemplatesGallery({ open, onClose }: TemplatesGalleryProps) {
  const loadDocument = useDiagramStore((s) => s.loadDocument)

  const handleUseTemplate = useCallback(
    (template: DiagramDocument) => {
      const doc: DiagramDocument = {
        ...template,
        meta: {
          ...template.meta,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
      loadDocument(doc)
      announce(`Template "${template.meta.title}" loaded`)
      onClose()
    },
    [loadDocument, onClose]
  )

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  if (!open) return null

  return (
    <div
      data-testid="templates-gallery"
      className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={handleBackdropKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Templates Gallery"
    >
      <div
        className="bg-background rounded-xl shadow-xl w-[680px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-primary">Templates</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
            aria-label="Close templates gallery"
          >
            &times;
          </button>
        </div>

        {/* Cards */}
        <div className="p-6 grid grid-cols-3 gap-4 overflow-y-auto">
          <TemplateCard
            testId="template-card-microservices"
            title="Microservices"
            description="API Gateway, Auth Service, User DB, Message Queue, Notification Service"
            nodeCount={MICROSERVICES_TEMPLATE.nodes.length}
            edgeCount={MICROSERVICES_TEMPLATE.edges.length}
            template={MICROSERVICES_TEMPLATE}
            onUse={handleUseTemplate}
          />
          <TemplateCard
            testId="template-card-cloud-infra"
            title="Cloud Infrastructure"
            description="Load Balancer, App Server, Cache layer, and Database"
            nodeCount={CLOUD_INFRA_TEMPLATE.nodes.length}
            edgeCount={CLOUD_INFRA_TEMPLATE.edges.length}
            template={CLOUD_INFRA_TEMPLATE}
            onUse={handleUseTemplate}
          />
          <TemplateCard
            testId="template-card-request-flow"
            title="Request Flow"
            description="Simple client → API → Database request flow"
            nodeCount={REQUEST_FLOW_TEMPLATE.nodes.length}
            edgeCount={REQUEST_FLOW_TEMPLATE.edges.length}
            template={REQUEST_FLOW_TEMPLATE}
            onUse={handleUseTemplate}
          />
        </div>
      </div>
    </div>
  )
}
