import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const ROOT = process.cwd()
const TARGETS = ['public']
const MAX_DIMENSION = 1920
const QUALITY = 80
const MIN_BYTES = 250 * 1024
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function walk(dir) {
  let results = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(await walk(fullPath))
    } else {
      results.push(fullPath)
    }
  }
  return results
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (!SUPPORTED.has(ext)) return null
  let beforeStat
  try {
    beforeStat = await fs.stat(filePath)
  } catch {
    return null
  }
  if (beforeStat.size < MIN_BYTES) return null

  let pipeline = sharp(filePath).rotate().resize(MAX_DIMENSION, MAX_DIMENSION, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true })
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY, effort: 4 })
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true })
  }
  const buffer = await pipeline.toBuffer()
  const targetPath = filePath
  if (buffer.length >= beforeStat.size) return null

  await fs.writeFile(targetPath, buffer)
  return { filePath, targetPath, before: beforeStat.size, after: buffer.length }
}

async function main() {
  const dirs = TARGETS.map((target) => path.join(ROOT, target))
  const files = []
  for (const dir of dirs) {
    try {
      files.push(...(await walk(dir)))
    } catch {
      // ignore missing directory
    }
  }

  let totalBefore = 0
  let totalAfter = 0
  let updated = 0

  for (const filePath of files) {
    const result = await compressImage(filePath)
    if (!result) continue
    updated += 1
    totalBefore += result.before
    totalAfter += result.after
    console.log(`compressed: ${path.relative(ROOT, result.filePath)} -> ${path.relative(ROOT, result.targetPath)}`)
  }

  const saved = totalBefore - totalAfter
  console.log(`done: ${updated} files compressed, saved ${Math.max(0, Math.round(saved / 1024))} KB`)
}

main().catch((error) => {
  console.error('compression failed:', error)
  process.exit(1)
})
