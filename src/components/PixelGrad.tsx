import { useEffect, useRef, useState } from 'react'
import { COPY } from '../config'
import { assetUrl } from '../lib/assets'

const WALK = [assetUrl('sprites/walk-1.png'), assetUrl('sprites/walk-2.png'), assetUrl('sprites/walk-3.png')]
const JUMP = assetUrl('sprites/jump.png')

const WALK_IN = 3600
const WAVE = 2400
const WALK_OUT = 3600
const LOOP = WALK_IN + WAVE + WALK_OUT
const WALK_MS = 130

type Heart = { id: number; dx: number; delay: number }

type Pose = {
  phase: 'walkIn' | 'wave' | 'walkOut'
  x: number
  frame: number
  jumping: boolean
}

function poseAt(t: number): Pose {
  if (t < WALK_IN) {
    return {
      phase: 'walkIn',
      x: (t / WALK_IN) * 0.5,
      frame: Math.floor(t / WALK_MS) % WALK.length,
      jumping: false,
    }
  }
  if (t < WALK_IN + WAVE) {
    return { phase: 'wave', x: 0.5, frame: 0, jumping: true }
  }
  const u = t - WALK_IN - WAVE
  return {
    phase: 'walkOut',
    x: 0.5 + (u / WALK_OUT) * 0.5,
    frame: Math.floor(u / WALK_MS) % WALK.length,
    jumping: false,
  }
}

export function PixelGrad({ alt = COPY.welcome.mascotAlt, love = false }: { alt?: string; love?: boolean }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [pose, setPose] = useState<Pose>(() => poseAt(0))
  const [hearts, setHearts] = useState<Heart[]>([])
  const origin = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = (now: number) => {
      if (origin.current === null) origin.current = now
      const t = (now - origin.current) % LOOP
      setPose((prev) => {
        const next = poseAt(t)
        if (
          prev.phase === next.phase &&
          prev.frame === next.frame &&
          prev.jumping === next.jumping &&
          Math.abs(prev.x - next.x) < 0.002
        ) {
          return prev
        }
        return next
      })
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    if (!love && pose.phase !== 'wave') return
    let n = 0
    const spawn = () => {
      const heart: Heart = {
        id: Date.now() + n++,
        dx: Math.round((Math.random() - 0.5) * (love ? 48 : 28)),
        delay: Math.random() * 0.2,
      }
      setHearts((h) => [...h.slice(-18), heart])
      window.setTimeout(
        () => setHearts((h) => h.filter((x) => x.id !== heart.id)),
        1600,
      )
    }
    spawn()
    const id = window.setInterval(spawn, love ? 180 : 420)
    return () => window.clearInterval(id)
  }, [pose.phase, reduced, love])

  const hop = pose.jumping ? -8 : [0, 2, 0, -3][pose.frame % WALK.length]
  const src = pose.jumping ? JUMP : WALK[pose.frame]

  return (
    <div className="relative h-32 sm:h-36 overflow-hidden">
      <div
        className="absolute bottom-0 w-24 sm:w-28 will-change-transform"
        style={{
          left: reduced ? '50%' : `${pose.x * 100}%`,
          transform: `translate(${reduced ? '-50%' : `${-pose.x * 100}%`}, ${reduced ? 0 : hop}px)`,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 -top-2 h-0" aria-hidden>
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute left-1/2 text-primary heart-float"
              style={{ marginLeft: `${h.dx}px`, animationDelay: `${h.delay}s` }}
            >
              <svg width="14" height="14" viewBox="0 0 8 8" fill="currentColor" aria-hidden>
                <path d="M1 0h2v1h2V0h2v1h1v3H7v1H6v1H5v1H3V6H2V5H1V4H0V1h1z" />
              </svg>
            </span>
          ))}
        </div>
        <img
          src={src}
          alt={alt}
          width={256}
          height={256}
          className="w-full h-auto select-none pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  )
}
