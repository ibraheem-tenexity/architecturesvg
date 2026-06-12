import { useState, useEffect, useCallback } from 'react'
import { exportSVG } from '../utils/svgExporter'
import { useDiagramStore } from '../store/useDiagramStore'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
}

type ExportFormat = 'svg' | 'png'

async function downloadSVG(svgString: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'diagram.svg'
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadPNG(svgString: string, transparent: boolean): Promise<void> {
  // Lazy-load the rasterizer module so it is not in the initial bundle
  const { rasterize } = await import('../utils/pngRasterizer')
  const blob = await rasterize(svgString, { scale: 2, transparent })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'diagram.png'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportDialog({ open, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('svg')
  const [svgPreview, setSvgPreview] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [transparentBg, setTransparentBg] = useState(false)

  useEffect(() => {
    if (open) {
      const doc = useDiagramStore.getState().document
      setSvgPreview(exportSVG(doc))
      setShowSuccess(false)
      setFormat('svg')
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  const handleConfirm = async () => {
    setIsExporting(true)
    try {
      if (format === 'svg') {
        await downloadSVG(svgPreview)
      } else {
        await downloadPNG(svgPreview, transparentBg)
      }
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } finally {
      setIsExporting(false)
    }
  }

  if (!open) return null

  return (
    <div
      data-testid="export-dialog"
      className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-raised rounded-xl shadow-xl w-[560px] max-h-[80vh] flex flex-col p-6 gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Export Diagram</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
            aria-label="Close export dialog"
          >
            &times;
          </button>
        </div>

        {/* Format selector */}
        <div className="flex gap-2">
          <button
            data-testid="export-format-svg"
            onClick={() => setFormat('svg')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              format === 'svg'
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            SVG
          </button>
          <button
            data-testid="export-format-png"
            onClick={() => setFormat('png')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              format === 'png'
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            PNG
          </button>
        </div>

        {/* PNG options */}
        {format === 'png' && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              id="transparent-bg"
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => setTransparentBg(e.target.checked)}
              className="accent-brand"
            />
            <label htmlFor="transparent-bg">Transparent background</label>
            <span className="ml-2 text-text-tertiary">(2× DPI)</span>
          </div>
        )}

        {/* SVG Preview */}
        <div className="flex-1 overflow-auto min-h-0">
          <pre className="text-xs text-text-secondary bg-surface rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap break-all">
            {svgPreview}
          </pre>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div
            data-testid="export-success"
            className="text-sm font-medium text-success px-3 py-2 bg-success/10 rounded-md"
            aria-live="polite"
          >
            Diagram exported successfully!
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            data-testid="export-confirm"
            onClick={handleConfirm}
            disabled={isExporting}
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-brand-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting…' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
