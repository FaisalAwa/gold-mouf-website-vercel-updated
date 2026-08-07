/* ═══════════════════════════════════════════════════════════════
   Shopify Admin API — thin client for the import script.

   Node-side only. The admin token carries write_products and must
   never reach the browser bundle, which is why it is read from a
   non-VITE_ env var.
   ═══════════════════════════════════════════════════════════════ */

import { readFileSync, statSync, createReadStream } from 'node:fs'
import { basename, join } from 'node:path'
import { ROOT } from './sheet.mjs'

/* ── Credentials ────────────────────────────────────────────────── */

function loadEnv() {
  const env = { ...process.env }
  try {
    for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (m && !env[m[1]]) env[m[1]] = m[2].trim()
    }
  } catch { /* no .env.local — rely on the real environment */ }
  return env
}

const ENV = loadEnv()
export const DOMAIN = ENV.VITE_SHOPIFY_STORE_DOMAIN
export const API_VERSION = ENV.VITE_SHOPIFY_API_VERSION || '2025-01'
const TOKEN = ENV.SHOPIFY_ADMIN_TOKEN

if (!DOMAIN || !TOKEN) {
  throw new Error('Missing VITE_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN — see .env.example')
}

const ENDPOINT = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`

/* ── GraphQL ────────────────────────────────────────────────────── */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * One GraphQL round-trip. Retries on Shopify's throttle and on 5xx,
 * and turns a non-empty `userErrors` into a thrown error so a partial
 * import can never look like a successful one.
 */
export async function admin(query, variables = {}, { retries = 5 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
      body: JSON.stringify({ query, variables }),
    })

    if (res.status === 429 || res.status >= 500) {
      if (attempt >= retries) throw new Error(`Shopify ${res.status} after ${retries} retries`)
      await sleep(1000 * 2 ** attempt)
      continue
    }
    if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`)

    const body = await res.json()

    if (body.errors) {
      const throttled = body.errors.some((e) => e.extensions?.code === 'THROTTLED')
      if (throttled && attempt < retries) { await sleep(1000 * 2 ** attempt); continue }
      throw new Error(`GraphQL: ${JSON.stringify(body.errors)}`)
    }

    // Every mutation in this repo returns userErrors — surface them.
    for (const value of Object.values(body.data ?? {})) {
      const errs = value?.userErrors
      if (Array.isArray(errs) && errs.length) {
        throw new Error(`userErrors: ${JSON.stringify(errs)}`)
      }
    }
    return body.data
  }
}

/* ── Media ──────────────────────────────────────────────────────── */

const MIME = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }

const STAGED_UPLOADS = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }`

/**
 * Push a local image to Shopify's staging bucket and return the
 * resourceUrl that productSet accepts as `files[].originalSource`.
 */
export async function stageUpload(publicPath) {
  const abs = join(ROOT, 'public', publicPath)
  const filename = basename(abs)
  const ext = filename.split('.').pop().toLowerCase()
  const mimeType = MIME[ext]
  if (!mimeType) throw new Error(`Unsupported image type: ${filename}`)

  const { stagedUploadsCreate } = await admin(STAGED_UPLOADS, {
    input: [{
      filename,
      mimeType,
      resource: 'IMAGE',
      httpMethod: 'POST',
      fileSize: String(statSync(abs).size),
    }],
  })

  const target = stagedUploadsCreate.stagedTargets[0]
  const form = new FormData()
  for (const p of target.parameters) form.append(p.name, p.value)
  form.append('file', new Blob([readFileSync(abs)], { type: mimeType }), filename)

  const upload = await fetch(target.url, { method: 'POST', body: form })
  if (!upload.ok) throw new Error(`Staged upload failed (${upload.status}) for ${filename}`)

  return target.resourceUrl
}

export { createReadStream }
