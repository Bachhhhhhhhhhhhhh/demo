import { motion } from 'framer-motion'
import { COPY, EVENT, HOST } from '../config'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

export function EventInfo() {
  const t = COPY.event
  const rows = [
    { label: 'NGÀY', value: EVENT.date },
    { label: 'THỜI GIAN', value: EVENT.time },
    { label: 'ĐỊA ĐIỂM', value: EVENT.venueName },
    { label: 'ĐỊA CHỈ', value: EVENT.address },
    { label: 'TRANG PHỤC', value: EVENT.dressCode },
  ]

  return (
    <section id="event" className="px-4 sm:px-8 lg:px-16 py-16 lg:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade} className="mb-6">
          <span className="inline-block font-pixel text-lg uppercase bg-secondary text-secondary-foreground border-[3px] border-border px-3 py-1">
            {t.label}
          </span>
        </motion.div>
        <motion.h2 {...fade} className="font-display text-[14vw] sm:text-[6rem] lg:text-[7.5rem] text-primary mb-10">
          {t.title}
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div {...fade}>
            <img
              src={HOST.photo}
              alt={`Ảnh lễ tốt nghiệp của ${HOST.name}`}
              loading="lazy"
              className="pixel-img w-full h-auto object-cover aspect-[3/4] sm:aspect-auto"
            />
            <p className="mt-5 font-pixel text-lg text-foreground uppercase">{HOST.photoCaption}</p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
            <dl className="bg-card pixel-box p-4 sm:p-6">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 border-b-[3px] border-dashed border-border/40 py-3 last:border-b-0"
                >
                  <dt className="font-pixel text-lg text-primary uppercase sm:w-36 shrink-0">
                    {row.label}
                  </dt>
                  <dd className="text-base sm:text-lg text-foreground leading-snug">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-pixel text-lg text-muted-foreground">▸ {EVENT.note}</p>
            <a
              href={EVENT.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn inline-flex items-center gap-2 mt-7 px-6 py-3 bg-secondary text-secondary-foreground font-pixel text-xl uppercase"
            >
              {t.mapsButtonLabel}
              <span aria-hidden>▸</span>
            </a>
          </motion.div>
        </div>
        <motion.div {...fade} className="mt-14 lg:mt-20">
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] pixel-box-yellow overflow-hidden bg-card">
            <iframe
              title="Bản đồ địa điểm buổi lễ"
              src={EVENT.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full saturate-[0.6] contrast-[1.1] sepia-[0.15]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
