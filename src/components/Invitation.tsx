import { motion } from 'framer-motion'
import { COPY, HOST } from '../config'
import { letterFor, type Guest } from '../data/guests'
import { isNyBach } from '../lib/ny'
import { PixelGrad } from './PixelGrad'
import { PixelLove } from './PixelLove'

type Props = {
  guest: Guest
  onSwitch: () => void
}

export function Invitation({ guest, onSwitch }: Props) {
  const t = COPY.welcome
  const letter = letterFor(guest)
  const love = isNyBach(guest.name) || guest.relation === 'nguoi_yeu'

  return (
    <section
      id="welcome"
      className={`relative min-h-[100svh] flex items-center px-4 sm:px-8 lg:px-16 py-20 ${love ? 'love-mode' : ''}`}
    >
      {love && <PixelLove />}
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className={`bg-card p-5 sm:p-10 ${love ? 'pixel-box-love' : 'pixel-box'}`}>
          <div className="flex items-start justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-pixel text-lg sm:text-xl text-primary uppercase"
            >
              {love ? 'Gửi riêng đến' : t.greetingPrefix}
            </motion.p>
            <button
              type="button"
              onClick={onSwitch}
              className="font-pixel text-sm sm:text-base uppercase text-muted-foreground hover:text-primary"
            >
              {t.switchGuest}
            </button>
          </div>
          {love && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mt-3 font-pixel text-sm sm:text-base uppercase bg-primary text-primary-foreground border-[3px] border-border px-2 py-1"
            >
              ♡ NY CỦA BÁCH ♡
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className={`font-display text-[15vw] sm:text-[6.5rem] lg:text-[8rem] mt-2 break-words ${love ? 'text-primary' : 'text-foreground'}`}
          >
            {love ? 'NY BÁCH' : guest.name}
          </motion.h1>
          <div className="mt-2">
            <PixelGrad love={love} />
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            className={love ? 'pixel-stripes-love my-8' : 'pixel-stripes my-8'}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line"
          >
            {letter}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <p className="font-pixel text-lg text-muted-foreground uppercase">{t.signature}</p>
            <p className="font-display text-4xl sm:text-5xl text-primary mt-1">{HOST.name}</p>
            <p className="font-pixel text-lg text-foreground mt-1 uppercase">
              {HOST.degree} · {HOST.school}
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex items-center gap-3"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="font-pixel text-2xl text-primary leading-none"
            aria-hidden
          >
            ▼
          </motion.span>
          <span className="font-pixel text-lg text-foreground uppercase">{t.scrollHint}</span>
        </motion.div>
      </div>
    </section>
  )
}
