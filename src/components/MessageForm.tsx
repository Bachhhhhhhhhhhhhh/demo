import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { COPY } from '../config'
import type { Guest } from '../data/guests'
import { nowIsoPlus7, postToSheet, type Attending } from '../lib/sheets'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

function PixelConfetti() {
  const bits = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 8) % 100}%`,
    delay: `${(i % 8) * 0.08}s`,
    color: i % 3 === 0 ? '#8B1E2D' : i % 3 === 1 ? '#E2B84A' : '#2B2118',
    size: 6 + (i % 4) * 2,
  }))
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            background: b.color,
            animation: `pixel-confetti 1.6s steps(8, end) ${b.delay} forwards`,
          }}
        />
      ))}
    </div>
  )
}

type Props = {
  guest: Guest
  openedAt: string
}

export function MessageForm({ guest, openedAt }: Props) {
  const t = COPY.guestbook
  const [attending, setAttending] = useState<Attending | ''>('')
  const [companions, setCompanions] = useState(0)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!attending || !message.trim()) {
      setError(t.errorEmpty)
      return
    }
    setError('')
    setStatus('sending')
    const result = await postToSheet({
      action: 'submit',
      guest_name: guest.name,
      attending,
      companions,
      phone: phone.trim(),
      message_to_bach: message.trim(),
      user_agent: navigator.userAgent,
      opened_at: openedAt || nowIsoPlus7(),
    })
    if (!result.ok) {
      setStatus('idle')
      setError(t.errorGeneric)
      toast.error(t.errorGeneric)
      return
    }
    setStatus('sent')
    toast.success('Bách đã nhận được thông tin 💌')
  }

  return (
    <section id="guestbook" className="px-4 sm:px-8 lg:px-16 py-16 lg:py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fade} className="mb-6">
          <span className="inline-block font-pixel text-lg uppercase bg-secondary text-secondary-foreground border-[3px] border-border px-3 py-1">
            {t.label}
          </span>
        </motion.div>
        <motion.h2 {...fade} className="font-display text-[13vw] sm:text-[6rem] text-primary mb-5">
          {t.title}
        </motion.h2>
        <motion.p {...fade} className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {t.thanks}
        </motion.p>

        <motion.div {...fade} className="mt-12 bg-card pixel-box p-5 sm:p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <PixelConfetti />
                <h3 className="font-display text-5xl sm:text-6xl text-primary relative z-10">
                  {t.successTitle}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl relative z-10">
                  {t.successMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle')
                    setMessage('')
                  }}
                  className="pixel-btn mt-7 px-5 py-2 bg-secondary text-secondary-foreground font-pixel text-xl uppercase relative z-10"
                >
                  {t.another}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={submit}
              >
                <p className="block font-pixel text-xl text-foreground uppercase mb-2">{t.formTitle}</p>
                <p className="font-pixel text-lg text-muted-foreground mb-6 uppercase">
                  {t.fromLabel}: <span className="text-primary">{guest.name}</span>
                </p>

                <fieldset className="mb-6">
                  <legend className="font-pixel text-lg text-foreground uppercase mb-3">
                    {t.attendingLabel}
                  </legend>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {t.attending.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setAttending(opt)
                          if (error) setError('')
                        }}
                        className={`pixel-btn px-4 py-2 font-pixel text-lg uppercase ${
                          attending === opt
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-foreground'
                        }`}
                        aria-pressed={attending === opt}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mb-6">
                  <label htmlFor="companions" className="block font-pixel text-lg text-foreground uppercase mb-2">
                    {t.companionsLabel}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="pixel-btn w-11 h-11 bg-background font-pixel text-2xl"
                      onClick={() => setCompanions((n) => Math.max(0, n - 1))}
                      aria-label="Giảm số người đi cùng"
                    >
                      −
                    </button>
                    <input
                      id="companions"
                      type="number"
                      min={0}
                      max={10}
                      value={companions}
                      onChange={(e) =>
                        setCompanions(Math.min(10, Math.max(0, Number(e.target.value) || 0)))
                      }
                      className="pixel-input w-20 text-center py-2 text-xl font-pixel"
                    />
                    <button
                      type="button"
                      className="pixel-btn w-11 h-11 bg-background font-pixel text-2xl"
                      onClick={() => setCompanions((n) => Math.min(10, n + 1))}
                      aria-label="Tăng số người đi cùng"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block font-pixel text-lg text-foreground uppercase mb-2">
                    {t.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="pixel-input px-4 py-3 text-lg"
                  />
                </div>

                <label htmlFor="guestbook-message" className="block font-pixel text-lg text-foreground uppercase mb-2">
                  Lời nhắn
                </label>
                <textarea
                  id="guestbook-message"
                  rows={5}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder={t.textareaPlaceholder}
                  className="pixel-input p-4 text-base resize-y min-h-[80px]"
                />
                {error && (
                  <p className="mt-3 font-pixel text-lg text-primary" role="alert">
                    ▸ {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="pixel-btn mt-7 w-full sm:w-auto px-7 py-3 bg-primary text-primary-foreground font-pixel text-xl uppercase"
                >
                  {status === 'sending' ? t.sendingLabel : t.buttonLabel}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <footer className="mt-20">
          <div className="pixel-stripes mb-5" />
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <p className="font-pixel text-lg text-foreground uppercase">{COPY.footer.line1}</p>
            <p className="font-pixel text-lg text-foreground uppercase">{COPY.footer.line2}</p>
          </div>
        </footer>
      </div>
    </section>
  )
}
