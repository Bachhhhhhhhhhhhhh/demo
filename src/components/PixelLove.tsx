import { useMemo } from 'react'

type Bit = {
  id: number
  left: string
  delay: string
  duration: string
  size: number
  kind: 'heart' | 'star' | 'spark'
  color: string
}

const COLORS = ['#8B1E2D', '#E2B84A', '#f3a6b5', '#ff6b8a', '#9B1B2E']

function PixelHeart({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} aria-hidden>
      <path d="M1 0h2v1h2V0h2v1h1v3H7v1H6v1H5v1H3V6H2V5H1V4H0V1h1z" />
    </svg>
  )
}

function PixelStar({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 7 7" fill={color} aria-hidden>
      <path d="M3 0h1v2h2v1H4v2H3V3H1V2h2z" />
    </svg>
  )
}

export function PixelLove() {
  const bits = useMemo<Bit[]>(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 5) % 100}%`,
        delay: `${(i % 12) * 0.22}s`,
        duration: `${2.4 + (i % 5) * 0.35}s`,
        size: i % 5 === 0 ? 18 : 10 + (i % 4) * 2,
        kind: i % 5 === 0 ? 'star' : i % 3 === 0 ? 'spark' : 'heart',
        color: COLORS[i % COLORS.length],
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]" aria-hidden>
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-[-12px] pixel-love-float"
          style={{
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        >
          {b.kind === 'heart' && <PixelHeart size={b.size} color={b.color} />}
          {b.kind === 'star' && <PixelStar size={b.size} color={b.color} />}
          {b.kind === 'spark' && (
            <span
              className="block"
              style={{ width: 4, height: 4, background: b.color, imageRendering: 'pixelated' }}
            />
          )}
        </span>
      ))}
    </div>
  )
}
