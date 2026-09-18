import { normalizeName } from './normalize'

const EXACT = new Set([
  'ny',
  'ny bach',
  'nybach',
  'ny cua bach',
  'ny cua bachh',
  'nguoi yeu',
  'nguoi yeu bach',
  'ny be',
  'em yeu',
  'em yeu bach',
  'nyb',
])

export function isNyBach(name: string): boolean {
  const n = normalizeName(name)
  if (!n) return false
  if (EXACT.has(n)) return true
  const tokens = n.split(' ')
  const hasNy = tokens.includes('ny') || tokens.includes('nybach')
  const hasLove = tokens.includes('yeu') || n.includes('nguoi yeu')
  const hasBach = tokens.includes('bach')
  if (hasNy && hasBach) return true
  if (hasLove && hasBach) return true
  return false
}
