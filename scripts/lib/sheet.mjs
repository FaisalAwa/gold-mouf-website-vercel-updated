/* ═══════════════════════════════════════════════════════════════
   Client sheet reader.
   Parses `products/Client Product Sheet — with Image Filenames - Sheet1.csv`
   into normalized rows. The sheet is the client's source of truth for
   SKU / title / price / copy / specs — nothing here invents data.
   ═══════════════════════════════════════════════════════════════ */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const SHEET_PATH = join(ROOT, 'products', 'Client Product Sheet — with Image Filenames - Sheet1.csv')
export { ROOT }

/** RFC-4180 parser — the sheet has quoted commas and quoted newlines in copy. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { quoted = false }
      } else field += c
      continue
    }
    if (c === '"') { quoted = true; continue }
    if (c === ',') { row.push(field); field = ''; continue }
    if (c === '\r') continue
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue }
    field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

/** "$1,050" → 1050 ; "$175" → 175 */
function parseUsd(raw) {
  const n = Number(String(raw).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

/** The sheet's image column sometimes carries a gallery list in parentheses. */
function parseImages(raw) {
  const cell = String(raw || '').trim()
  if (!cell || /^needs photo$/i.test(cell)) return { file: null, gallery: [] }
  const file = (cell.match(/^([\w.-]+\.webp)/i) || [])[1] || null
  const gallery = (cell.match(/[\w-]+-\d\.webp/gi) || []).filter((f) => f !== file)
  return { file, gallery }
}

export function readSheet() {
  const rows = parseCsv(readFileSync(SHEET_PATH, 'utf8'))
  const [header, ...body] = rows
  const col = (name) => header.findIndex((h) => h.trim().toLowerCase().startsWith(name))

  const iSku = col('product sku')
  const iTitle = col('product title')
  const iPrice = col('price')
  const iDesc = col('product description')
  const iCollection = col('collection')
  const iStones = col('variant values')
  const iWeight = col('product weight')
  const iHeight = col('product height')
  const iImage = col('image file name')
  const iNotes = col('notes')

  return body
    .map((r) => {
      const sku = (r[iSku] || '').trim()
      if (!sku) return null
      const { file, gallery } = parseImages(r[iImage])
      return {
        sku,
        title: (r[iTitle] || '').trim(),
        price: parseUsd(r[iPrice]),
        description: (r[iDesc] || '').trim(),
        collection: (r[iCollection] || '').trim(),
        stoneSpec: (r[iStones] || '').trim(),
        weight: (r[iWeight] || '').trim(),
        dimensions: (r[iHeight] || '').trim(),
        imageFile: file,
        galleryFiles: gallery,
        notes: (r[iNotes] || '').trim(),
      }
    })
    .filter(Boolean)
}
