const MAX_IMAGE_DIMENSION = 1920
const DEFAULT_QUALITY = 0.82
const MIN_BYTES_TO_COMPRESS = 250 * 1024

function readAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for compression'))
    }
    img.src = objectUrl
  })
}

function shouldSkipCompression(file: File) {
  if (!file.type.startsWith('image/')) return true
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return true
  if (file.size < MIN_BYTES_TO_COMPRESS) return true
  return false
}

export async function compressImageForUpload(file: File): Promise<File> {
  if (typeof window === 'undefined' || shouldSkipCompression(file)) return file

  const img = await readAsImage(file)
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return file
  context.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', DEFAULT_QUALITY),
  )
  if (!blob || blob.size >= file.size) return file

  const baseName = file.name.replace(/\.[^/.]+$/, '')
  return new File([blob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
