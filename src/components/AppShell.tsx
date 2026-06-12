import { useState, useEffect, useRef } from 'react'
import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'
import ExportDialog from './ExportDialog'
import { useDiagramStore } from '../store/useDiagramStore'
import { saveDocument, loadDocument } from '../utils/idbPersistence'

const AUTOSAVE_DELAY_MS = 1000

export default function AppShell() {
  const [exportOpen, setExportOpen] = useState(false)
  const [idbError, setIdbError] = useState(false)

  const loadDocumentStore = useDiagramStore((s) => s.loadDocument)
  const setSaveStatus = useDiagramStore((s) => s.setSaveStatus)
  const document = useDiagramStore((s) => s.document)

  // Debounce timer ref
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: restore last document from IndexedDB
  useEffect(() => {
    loadDocument()
      .then((saved) => {
        if (saved) {
          loadDocumentStore(saved)
          // Apply persisted theme immediately
          if (saved.meta.theme === 'dark') {
            globalThis.document.documentElement.classList.add('dark')
          } else {
            globalThis.document.documentElement.classList.remove('dark')
          }
        }
      })
      .catch(() => {
        // IDB not available or corrupted — show recovery banner
        setIdbError(true)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Autosave on every document change (debounced 1s)
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    setSaveStatus('saving')

    saveTimerRef.current = setTimeout(() => {
      saveDocument(document)
        .then(() => {
          setSaveStatus('saved')
          // Return to idle after 2s so the indicator fades
          setTimeout(() => setSaveStatus('idle'), 2000)
        })
        .catch(() => {
          setSaveStatus('error')
          setIdbError(true)
        })
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document])

  // Keep theme class in sync whenever theme changes in the store
  useEffect(() => {
    if (document.meta.theme === 'dark') {
      globalThis.document.documentElement.classList.add('dark')
    } else {
      globalThis.document.documentElement.classList.remove('dark')
    }
  }, [document.meta.theme])

  const handleExportJSON = () => {
    const json = JSON.stringify(document, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = globalThis.document.createElement('a')
    a.href = url
    a.download = 'diagram.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <Toolbar onExport={() => setExportOpen(true)} />

      {/* IDB error / recovery banner */}
      {idbError && (
        <div
          data-testid="idb-recovery-banner"
          className="shrink-0 flex items-center justify-between px-4 py-2 bg-warning/10 border-b border-warning/20 text-sm text-warning"
          role="alert"
        >
          <span>Auto-save unavailable. Your diagram will not persist on reload.</span>
          <button
            onClick={handleExportJSON}
            className="ml-4 px-3 py-1 rounded-md bg-warning text-warning-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Export JSON now
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <CanvasArea />
        <PropertiesPanel />
      </div>
      <div
        data-testid="a11y-live"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live"
      />
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
