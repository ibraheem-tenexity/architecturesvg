/**
 * PNG rasterizer — converts an SVG string to a PNG Blob via an offscreen canvas.
 * Lazy-loaded by ExportDialog so the canvas machinery is not in the initial bundle.
 */

export interface RasterizeOptions {
  /** Scale factor for DPI — default 2 (Retina / 2x) */
  scale?: number
  /** If true, the canvas background is transparent; otherwise white */
  transparent?: boolean
}

/**
 * Rasterize an SVG string to a PNG Blob at the given scale.
 *
 * Steps:
 *  1. Wrap SVG in a Blob URL so Image can load it cross-origin safely.
 *  2. Measure the intrinsic dimensions from the SVG `width`/`height` attributes,
 *     falling back to viewBox dimensions, then to 800×600.
 *  3. Draw to an OffscreenCanvas (or regular canvas) at scale×.
 *  4. Optionally fill a solid white background before drawing.
 *  5. Return a `image/png` Blob.
 */
export async function rasterize(
  svgString: string,
  { scale = 2, transparent = false }: RasterizeOptions = {}
): Promise<Blob> {
  // Parse intrinsic size from SVG
  const { w, h } = parseSvgDimensions(svgString)

  const canvasW = Math.ceil(w * scale)
  const canvasH = Math.ceil(h * scale)

  // Create a Blob URL from the SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  try {
    const img = await loadImage(url)

    // Use OffscreenCanvas when available (worker-safe), fall back to DOM canvas
    let canvas: HTMLCanvasElement | OffscreenCanvas
    let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

    if (typeof OffscreenCanvas !== 'undefined') {
      canvas = new OffscreenCanvas(canvasW, canvasH)
      ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    } else {
      canvas = document.createElement('canvas')
      ;(canvas as HTMLCanvasElement).width = canvasW
      ;(canvas as HTMLCanvasElement).height = canvasH
      ctx = (canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
    }

    if (!transparent) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasW, canvasH)
    }

    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0, w, h)

    if (canvas instanceof OffscreenCanvas) {
      return canvas.convertToBlob({ type: 'image/png' })
    } else {
      return await new Promise<Blob>((resolve, reject) => {
        ;(canvas as HTMLCanvasElement).toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error('canvas.toBlob returned null'))
        }, 'image/png')
      })
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load SVG image for rasterization'))
    img.src = url
  })
}

/** Parse width/height from the SVG root element, falling back to viewBox or defaults. */
function parseSvgDimensions(svg: string): { w: number; h: number } {
  const widthMatch = svg.match(/\bwidth="([^"]+)"/)
  const heightMatch = svg.match(/\bheight="([^"]+)"/)
  const viewBoxMatch = svg.match(/\bviewBox="([^"]+)"/)

  const w = widthMatch ? parseFloat(widthMatch[1]) : undefined
  const h = heightMatch ? parseFloat(heightMatch[1]) : undefined

  if (w && h && isFinite(w) && isFinite(h)) {
    return { w, h }
  }

  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts[2] && parts[3]) {
      return { w: parts[2], h: parts[3] }
    }
  }

  return { w: 800, h: 600 }
}
