import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { COPY, HELPER, HOST } from '../config'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h2.5V5h-2.5C11.6 5 10 6.6 10 9v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  )
}

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

type Channel = {
  icon: 'phone' | 'facebook'
  label: string
  value: string
  href: string
}

export function Contact() {
  const t = COPY.contact
  const channels: Channel[] = [
    {
      icon: 'phone',
      label: `Điện thoại (${HOST.shortName})`,
      value: HOST.phone,
      href: HOST.phoneHref,
    },
    {
      icon: 'facebook',
      label: `Facebook (${HOST.shortName})`,
      value: HOST.facebook,
      href: HOST.facebookHref,
    },
  ]

  if (HELPER) {
    channels.push(
      {
        icon: 'phone',
        label: `Điện thoại (${HELPER.name})`,
        value: HELPER.phone,
        href: HELPER.phoneHref,
      },
      {
        icon: 'facebook',
        label: `Facebook (${HELPER.name})`,
        value: HELPER.facebook,
        href: HELPER.facebookHref,
      },
    )
  }

  return (
    <section id="contact" className="px-4 sm:px-8 lg:px-16 py-16 lg:py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fade} className="mb-6">
          <span className="inline-block font-pixel text-lg uppercase bg-primary text-primary-foreground border-[3px] border-border px-3 py-1">
            {t.label}
          </span>
        </motion.div>
        <motion.h2 {...fade} className="font-display text-[13vw] sm:text-[5.5rem] text-foreground mb-5">
          {t.title}
        </motion.h2>
        <motion.p {...fade} className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-10">
          {t.intro}
        </motion.p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {channels.map((ch, i) => {
            const Icon = ch.icon === 'facebook' ? FacebookIcon : Phone
            return (
              <motion.li
                key={ch.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <a
                  href={ch.href}
                  target={ch.href.startsWith('http') ? '_blank' : undefined}
                  rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="pixel-btn flex items-center gap-4 p-4 bg-card hover:bg-secondary"
                >
                  <Icon className="w-6 h-6 text-primary shrink-0" strokeWidth={2.5} />
                  <span className="min-w-0">
                    <span className="block font-pixel text-lg text-muted-foreground uppercase">
                      {ch.label}
                    </span>
                    <span className="block text-base text-foreground truncate">{ch.value}</span>
                  </span>
                  <span className="ml-auto font-pixel text-xl text-primary" aria-hidden>
                    ▸
                  </span>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
