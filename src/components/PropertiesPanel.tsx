export default function PropertiesPanel() {
  return (
    <aside
      data-testid="properties-panel"
      className="w-80 bg-raised border-l border-border-subtle flex flex-col shrink-0"
    >
      <div className="px-3 pt-4 pb-2">
        <span className="category-label">Properties</span>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-text-tertiary text-center select-none">
          Select a node to inspect it
        </p>
      </div>
    </aside>
  )
}
