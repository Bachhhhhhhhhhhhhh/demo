import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { COPY } from '../config'
import { guestFromName, type Guest } from '../data/guests'

type Props = {
  onSubmit: (guest: Guest) => void
}

export function Gate({ onSubmit }: Props) {
  const t = COPY.gate
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = value.trim().replace(/\s+/g, ' ')
    if (!name) return setError(t.errorEmpty)
    if (name.length < 2) return setError(t.errorShort)
    setError('')
    onSubmit(guestFromName(name))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'linear' }}
      className="fixed inset-0 z-[200] bg-background flex items-center justify-center px-4 sm:px-6 py-12 overflow-y-auto"
    >
      <motion.div
        initial={{ y: 12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'linear' }}
        className="w-full max-w-xl bg-card pixel-box-red"
      >
        <div className="pixel-stripes border-t-0" />
        <div className="p-5 sm:p-8">
          <p className="font-pixel text-base sm:text-lg text-primary uppercase">{t.eyebrow}</p>
          <h1 className="font-display text-6xl sm:text-8xl text-foreground mt-3">{t.title}</h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
          <form onSubmit={handleSubmit} className="mt-8">
            <label
              htmlFor="guest-name"
              className="block font-pixel text-lg text-foreground uppercase mb-2"
            >
              {t.inputLabel}
            </label>
            <input
              id="guest-name"
              type="text"
              autoComplete="name"
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError('')
              }}
              placeholder={t.inputPlaceholder}
              className="pixel-input px-4 py-3 text-lg"
            />
            {error && (
              <p className="mt-3 font-pixel text-lg text-primary" role="alert">
                ▸ {error}
              </p>
            )}
            <button
              type="submit"
              className="pixel-btn mt-8 w-full sm:w-auto px-7 py-3 bg-primary text-primary-foreground font-pixel text-xl uppercase"
            >
              {t.buttonLabel}
            </button>
          </form>
        </div>
        <div className="pixel-stripes border-b-0" />
      </motion.div>
    </motion.div>
  )
}
