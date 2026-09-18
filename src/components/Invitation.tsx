import { motion } from 'framer-motion'
import { COPY, HOST } from '../config'
import { letterFor, type Guest } from '../data/guests'
import { PixelGrad } from './PixelGrad'

type Props = {
  guest: Guest
  onSwitch: () => void
}

export function Invitation({ guest, onSwitch }: Props) {
  const t = COPY.welcome
  const letter = letterFor(guest)

  return (
    <section
      id="welcome"
      className="relative min-h-[100svh] flex items-center px-4 sm:px-8 lg:px-16 py-20"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-card pixel-box p-5 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-pixel text-lg sm:text-xl text-primary uppercase"
            >
              {t.greetingPrefix}
            </motion.p>
            <button
              type="button"
              onClick={onSwitch}
              className="font-pixel text-sm sm:text-base uppercase text-muted-foreground hover:text-primary"
            >
              {t.switchGuest}
            </button>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="font-display text-[15vw] sm:text-[6.5rem] lg:text-[8rem] text-foreground mt-2 break-words"
          >
            {guest.name}
          </motion.h1>
          <div className="mt-2">
            <PixelGrad />
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            className="pixel-stripes my-8"
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
