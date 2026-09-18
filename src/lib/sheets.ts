import { FALLBACK_GUESTS, type Guest, type Relation } from '../data/guests'
import {
  LOCAL_OPENS_KEY,
  LOCAL_RESPONSES_KEY,
  SHEET_ID,
} from '../config'

export type Attending = 'Có mặt' | 'Chưa chắc' | 'Không đến được'

export type OpenPayload = {
  action: 'open'
  guest_name: string
  match_type: string
  referrer: string
  user_agent: string
}

export type SubmitPayload = {
  action: 'submit'
  guest_name: string
  attending: Attending
  companions: number
  phone: string
  message_to_bach: string
  user_agent: string
  opened_at: string
}

export type SheetPayload = OpenPayload | SubmitPayload

export type OpenRow = {
  timestamp: string
  guest_name: string
  match_type: string
  referrer: string
}

export type ResponseRow = {
  timestamp: string
  guest_name: string
  attending: string
  companions: number
  phone: string
  message_to_bach: string
  user_agent: string
  opened_at: string
}

const RELATIONS: Relation[] = [
  'bo_me',
  'gia_dinh',
  'thay_co',
  'ban_be',
  'nguoi_yeu',
  'khac',
]

function webappUrl(): string {
  return (import.meta.env.VITE_SHEET_WEBAPP_URL || '').trim()
}

function csvUrl(): string {
  const env = (import.meta.env.VITE_SHEET_CSV_URL || '').trim()
  if (env) return env
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`
}

function asRelation(value: string): Relation {
  const v = value.trim().toLowerCase().replace(/\s+/g, '_')
  return (RELATIONS as string[]).includes(v) ? (v as Relation) : 'khac'
}

function parseAliases(value: string): string[] {
  return value
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}

function rowToGuest(row: Record<string, unknown>): Guest | null {
  const lower: Record<string, string> = {}
  for (const [k, v] of Object.entries(row)) {
    lower[k.trim().toLowerCase()] = String(v ?? '').trim()
  }
  const name = lower.name || lower['họ tên'] || lower['ho ten'] || ''
  if (!name) return null
  return {
    name,
    aliases: parseAliases(lower.aliases || lower['tên gọi'] || ''),
    relation: asRelation(lower.relation || lower['quan hệ'] || 'khac'),
    message: lower.message || lower['thư'] || lower['thu'] || '',
    honorific: lower.honorific || lower['xưng'] || '',
  }
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  const src = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (ch !== '\r') {
      cell += ch
    }
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? ''
    })
    return obj
  })
}

function mergeGuests(fromSheet: Guest[]): Guest[] {
  return fromSheet
}

async function fetchGuestsFromWebapp(): Promise<Guest[] | null> {
  const url = webappUrl()
  if (!url) return null
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`webapp ${res.status}`)
  const data = await res.json()
  const rows: Record<string, unknown>[] = data.guests || data.rows || []
  const guests = rows.map(rowToGuest).filter((g): g is Guest => !!g)
  return mergeGuests(guests)
}

async function fetchGuestsFromCsv(): Promise<Guest[] | null> {
  const url = csvUrl()
  const res = await fetch(url)
  if (!res.ok) throw new Error(`csv ${res.status}`)
  const text = await res.text()
  if (text.trim().startsWith('<')) return null
  const rows = parseCsv(text)
  const guests = rows.map(rowToGuest).filter((g): g is Guest => !!g)
  return mergeGuests(guests)
}

export async function loadGuests(): Promise<Guest[]> {
  try {
    const fromApp = await fetchGuestsFromWebapp()
    if (fromApp && fromApp.length) return fromApp
  } catch {
    /* fallback */
  }
  try {
    const fromCsv = await fetchGuestsFromCsv()
    if (fromCsv && fromCsv.length) return fromCsv
  } catch {
    /* fallback */
  }
  return FALLBACK_GUESTS
}

function backupLocal(payload: SheetPayload) {
  const key = payload.action === 'open' ? LOCAL_OPENS_KEY : LOCAL_RESPONSES_KEY
  try {
    const raw = localStorage.getItem(key)
    const list: unknown[] = raw ? JSON.parse(raw) : []
    list.unshift({ ...payload, timestamp: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(list.slice(0, 200)))
  } catch {
    /* ignore quota */
  }
}

export function readLocalOpens(): OpenRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_OPENS_KEY)
    return raw ? (JSON.parse(raw) as OpenRow[]) : []
  } catch {
    return []
  }
}

export function readLocalResponses(): ResponseRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_RESPONSES_KEY)
    return raw ? (JSON.parse(raw) as ResponseRow[]) : []
  } catch {
    return []
  }
}

function compactPayload(payload: SheetPayload): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    let text = String(value)
    if (key === 'user_agent') text = text.slice(0, 80)
    if (key === 'message_to_bach') text = text.slice(0, 1500)
    out[key] = text
  }
  return out
}

function postViaJsonp(url: string, payload: SheetPayload, timeoutMs = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    const cb = `__gs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const params = new URLSearchParams(compactPayload(payload))
    params.set('callback', cb)
    const script = document.createElement('script')
    let done = false
    const w = window as unknown as Record<string, unknown>
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      window.clearTimeout(timer)
      script.remove()
      delete w[cb]
      resolve(ok)
    }
    const timer = window.setTimeout(() => finish(false), timeoutMs)
    w[cb] = (data: { ok?: boolean; saved?: string; spreadsheet_id?: string }) => {
      const saved = data?.saved === 'open' || data?.saved === 'submit'
      const sheetOk = !data?.spreadsheet_id || data.spreadsheet_id === SHEET_ID
      finish(data?.ok === true && saved && sheetOk)
    }
    script.onerror = () => finish(false)
    script.src = `${url}?${params.toString()}`
    document.head.appendChild(script)
  })
}

function postJsonBeacon(url: string, payload: SheetPayload) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=utf-8' })
    return navigator.sendBeacon(url, blob)
  } catch {
    return false
  }
}

async function postJsonManual(url: string, payload: SheetPayload) {
  try {
    await fetch(url, {
      method: 'POST',
      redirect: 'manual',
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
  } catch {
    /* CORS / redirect — request may still have hit doPost */
  }
}

export async function postToSheet(payload: SheetPayload): Promise<{ ok: boolean; localOnly: boolean }> {
  const full = { ...payload, spreadsheet_id: SHEET_ID }
  backupLocal(full)
  const url = webappUrl()
  if (!url) return { ok: false, localOnly: true }

  const confirmed = await postViaJsonp(url, full)
  if (confirmed) return { ok: true, localOnly: false }

  postJsonBeacon(url, full)
  await postJsonManual(url, full)
  return { ok: false, localOnly: true }
}

export async function loadAdminData(): Promise<{
  guests: Guest[]
  opens: OpenRow[]
  responses: ResponseRow[]
}> {
  const url = webappUrl()
  if (url) {
    try {
      const key = encodeURIComponent(import.meta.env.VITE_ADMIN_KEY || '')
      const res = await fetch(`${url}?action=list&key=${key}`)
      if (res.ok) {
        const data = await res.json()
        const guests = Array.isArray(data.guests)
          ? data.guests.map(rowToGuest).filter((g: Guest | null): g is Guest => !!g)
          : []
        return {
          guests,
          opens: (data.opens || []) as OpenRow[],
          responses: (data.responses || []) as ResponseRow[],
        }
      }
    } catch {
      /* fallback local */
    }
  }
  return {
    guests: [],
    opens: readLocalOpens(),
    responses: readLocalResponses(),
  }
}

export function nowIsoPlus7(): string {
  const now = new Date()
  const plus7 = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  return plus7.toISOString().replace('Z', '+07:00')
}
