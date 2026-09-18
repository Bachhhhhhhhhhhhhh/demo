import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COPY } from '../config'
import { loadAdminData, type OpenRow, type ResponseRow } from '../lib/sheets'
import type { Guest } from '../data/guests'

type Tab = 'opens' | 'messages'
type Range = 'all' | '24h' | '7d' | '30d'

export function Admin() {
  const [params] = useSearchParams()
  const key = params.get('key') || ''
  const expected = (import.meta.env.VITE_ADMIN_KEY || 'bach2026').trim()
  const authed = expected.length > 0 && key === expected

  const [tab, setTab] = useState<Tab>('opens')
  const [range, setRange] = useState<Range>('all')
  const [guests, setGuests] = useState<Guest[]>([])
  const [opens, setOpens] = useState<OpenRow[]>([])
  const [responses, setResponses] = useState<ResponseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const prev = document.title
    document.title = 'Admin thiệp — không công khai'
    return () => {
      document.head.removeChild(meta)
      document.title = prev
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    loadAdminData()
      .then((data) => {
        setGuests(data.guests)
        setOpens(data.opens)
        setResponses(data.responses)
      })
      .finally(() => setLoading(false))
  }, [authed])

  const filteredOpens = useMemo(() => {
    if (range === 'all') return opens
    const now = Date.now()
    const span =
      range === '24h' ? 864e5 : range === '7d' ? 6048e5 : 2592e6
    return opens.filter((o) => new Date(o.timestamp).getTime() >= now - span)
  }, [opens, range])

  const rows = useMemo(() => {
    const map = new Map<string, { count: number; last: string | null }>()
    guests.forEach((g) => map.set(g.name, { count: 0, last: null }))
    filteredOpens.forEach((o) => {
      const cur = map.get(o.guest_name) ?? { count: 0, last: null }
      cur.count += 1
      if (!cur.last || o.timestamp > cur.last) cur.last = o.timestamp
      map.set(o.guest_name, cur)
    })
    return [...map.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'))
  }, [filteredOpens, guests])

  const openedCount = rows.filter((r) => r.count > 0).length

  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="bg-card pixel-box-red max-w-lg w-full">
          <div className="pixel-stripes border-t-0" />
          <div className="p-8">
            <p className="font-pixel text-primary uppercase">Admin</p>
            <h1 className="font-display text-5xl mt-2">SAI KHOÁ RỒI</h1>
            <p className="mt-4 text-muted-foreground">
              Mở <code className="font-pixel">/admin?key=</code> với đúng{' '}
              <code className="font-pixel">VITE_ADMIN_KEY</code>.
            </p>
          </div>
          <div className="pixel-stripes border-b-0" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-10 py-12">
      <div className="grain-overlay" aria-hidden />
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-5xl sm:text-6xl mb-2">QUẢN LÝ THIỆP</h1>
        <p className="font-pixel text-lg text-muted-foreground uppercase mb-8">
          {COPY.footer.line2}
        </p>

        <div className="flex gap-2 mb-8">
          {(
            [
              ['opens', `Lượt mở (${openedCount})`],
              ['messages', `Lời nhắn (${responses.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`pixel-btn px-4 py-2 font-pixel text-lg uppercase ${
                tab === id ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="font-pixel text-xl">ĐANG TẢI...</p>
        ) : tab === 'opens' ? (
          <>
            <div className="flex gap-1 flex-wrap mb-4">
              {(
                [
                  ['all', 'Tất cả'],
                  ['24h', '24 giờ'],
                  ['7d', '7 ngày'],
                  ['30d', '30 ngày'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setRange(id)}
                  className={`pixel-btn px-3 py-1 font-pixel text-sm uppercase ${
                    range === id ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <ul className="bg-card pixel-box divide-y-[3px] divide-border">
              {rows.map((r) => (
                <li key={r.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex-1 text-base">{r.name}</span>
                  <span className="font-pixel text-lg text-muted-foreground">
                    {r.last ? new Date(r.last).toLocaleString('vi-VN') : 'CHƯA MỞ'}
                  </span>
                  <span
                    className={`font-pixel text-xl min-w-10 text-center border-[3px] border-border px-2 ${
                      r.count > 0
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="space-y-4">
            {responses.length === 0 && (
              <li className="bg-card pixel-box p-4 text-muted-foreground">Chưa có lời nhắn nào.</li>
            )}
            {responses.map((r, i) => (
              <li key={`${r.timestamp}-${i}`} className="bg-card pixel-box p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-pixel text-xl text-primary uppercase">{r.guest_name}</p>
                  <p className="font-pixel text-sm text-muted-foreground">
                    {r.timestamp ? new Date(r.timestamp).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
                <p className="mt-2 font-pixel text-lg">
                  {r.attending || '—'} · đi cùng {r.companions ?? 0}
                  {r.phone ? ` · ${r.phone}` : ''}
                </p>
                <p className="mt-2 text-foreground leading-relaxed">{r.message_to_bach}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
