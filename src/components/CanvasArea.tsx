interface CanvasAreaProps {
  hasNodes?: boolean
}

export default function CanvasArea({ hasNodes = false }: CanvasAreaProps) {
  return (
    <main
      data-testid="canvas"
      className="flex-1 bg-sunken overflow-hidden relative"
    >
      {!hasNodes && (
        <div
          data-testid="canvas-empty-state"
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-sm text-text-tertiary select-none">
            Click a shape in the palette to add your first node
          </p>
        </div>
      )}
    </main>
  )
}
