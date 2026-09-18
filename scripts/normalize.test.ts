import { matchGuest, normalizeName } from './normalize'
import { FALLBACK_GUESTS } from '../data/guests'

const cases: [string, string | null][] = [
  ['Trương Thế Bách', 'Trương Thế Bách'],
  ['truong the bach', 'Trương Thế Bách'],
  ['Bách', 'Trương Thế Bách'],
  ['Bố', 'Bố của Bách'],
  ['Me', 'Mẹ của Bách'],
  ['Quân', 'Lê Minh Quân'],
  ['', null],
  ['xyzabc khong co', null],
]

for (const [input, expected] of cases) {
  const r = matchGuest(input, FALLBACK_GUESTS)
  const got = r.guest?.name ?? null
  const ok = got === expected
  console.log(ok ? 'OK' : 'FAIL', JSON.stringify(input), '→', got, expected ? '' : `(sugg ${r.suggestion})`)
}

console.log('normalize', normalizeName('Đặng Thị Đào'))
