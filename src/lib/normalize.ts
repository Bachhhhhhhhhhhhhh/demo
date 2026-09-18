import type { Guest } from '../data/guests'

export type MatchType = 'exact' | 'fuzzy' | 'suggested'

export type MatchResult = {
  guest: Guest | null
  suggestion: string | null
  matchType: MatchType | null
}

export function normalizeName(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, (ch) => (ch === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export function levenshtein(a: string, b: string): number {
  const n = a.length
  const m = b.length
  let prev = Array.from({ length: m + 1 }, (_, i) => i)
  for (let i = 1; i <= n; i++) {
    const curr = [i]
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    prev = curr
  }
  return prev[m]
}

type Entry = { guest: Guest; label: string; norm: string }

function entriesOf(guests: Guest[]): Entry[] {
  const out: Entry[] = []
  for (const guest of guests) {
    out.push({ guest, label: guest.name, norm: normalizeName(guest.name) })
    for (const alias of guest.aliases ?? []) {
      const trimmed = alias.trim()
      if (!trimmed) continue
      out.push({ guest, label: trimmed, norm: normalizeName(trimmed) })
    }
  }
  return out
}

function uniqueGuests(list: Guest[]): Guest[] {
  const seen = new Set<string>()
  const out: Guest[] = []
  for (const g of list) {
    const key = normalizeName(g.name)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(g)
  }
  return out
}

export function matchGuest(input: string, guests: Guest[]): MatchResult {
  const q = normalizeName(input)
  if (!q) return { guest: null, suggestion: null, matchType: null }

  const entries = entriesOf(guests)

  const exact = entries.filter((e) => e.norm === q)
  if (exact.length > 0) {
    const uniq = uniqueGuests(exact.map((e) => e.guest))
    if (uniq.length === 1) {
      return { guest: uniq[0], suggestion: null, matchType: 'exact' }
    }
    return { guest: null, suggestion: uniq[0].name, matchType: 'suggested' }
  }

  if (q.length >= 6) {
    const partial = entries.filter(
      (e) => e.norm.includes(` ${q}`) || e.norm.startsWith(q),
    )
    const uniq = uniqueGuests(partial.map((e) => e.guest))
    if (uniq.length === 1) {
      return { guest: uniq[0], suggestion: null, matchType: 'fuzzy' }
    }
    if (uniq.length > 1) {
      return { guest: null, suggestion: uniq[0].name, matchType: 'suggested' }
    }
  }

  let best: { guest: Guest; dist: number } | null = null
  let second: { guest: Guest; dist: number } | null = null

  for (const e of entries) {
    if (e.norm.length <= 2 && q.length > 2) continue
    const dist = levenshtein(q, e.norm)
    if (!best || dist < best.dist) {
      second = best
      best = { guest: e.guest, dist }
    } else if (
      best.guest !== e.guest &&
      (!second || dist < second.dist)
    ) {
      second = { guest: e.guest, dist }
    }
  }

  const threshold = q.length <= 8 ? 2 : 3
  if (!best) return { guest: null, suggestion: null, matchType: null }

  if (best.dist > threshold) {
    const loose = Math.max(4, Math.ceil(q.length * 0.4))
    if (best.dist <= loose) {
      return { guest: null, suggestion: best.guest.name, matchType: 'suggested' }
    }
    return { guest: null, suggestion: null, matchType: null }
  }

  if (second && second.guest !== best.guest && second.dist - best.dist < 2) {
    return { guest: null, suggestion: best.guest.name, matchType: 'suggested' }
  }

  return { guest: best.guest, suggestion: null, matchType: 'fuzzy' }
}
