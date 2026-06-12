const PALETTE_ITEMS = [
  { type: 'service',   icon: '⬡', label: 'Service' },
  { type: 'database',  icon: '🗄', label: 'Database' },
  { type: 'queue',     icon: '⇌', label: 'Queue' },
  { type: 'gateway',   icon: '⬢', label: 'Gateway' },
  { type: 'cache',     icon: '⚡', label: 'Cache' },
  { type: 'external',  icon: '⬜', label: 'External' },
  { type: 'cloud',     icon: '☁', label: 'Cloud' },
  { type: 'container', icon: '▣', label: 'Container' },
] as const

export default function NodePalette() {
  return (
    <aside
      data-testid="node-palette"
      className="w-64 bg-raised border-r border-border-subtle flex flex-col overflow-y-auto shrink-0"
    >
      <div className="px-3 pt-4 pb-2">
        <span className="category-label">Nodes</span>
      </div>
      <div className="flex flex-col gap-0.5 px-2 pb-4">
        {PALETTE_ITEMS.map(({ type, icon, label }) => (
          <div
            key={type}
            data-testid={`palette-item-${type}`}
            className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-sunken transition-colors text-sm text-text-primary"
          >
            <span className="w-5 text-center text-base leading-none select-none" aria-hidden>
              {icon}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
