import { motion } from 'framer-motion'
import { DoorOpen, MapPinned, SquareParking } from 'lucide-react'
import { COPY } from '../config'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

export function Directions() {
  const t = COPY.directions

  return (
    <section id="directions" className="px-4 sm:px-8 lg:px-16 py-16 lg:py-28">
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

        <motion.div {...fade} className="mb-10">
          <h3 className="flex items-center gap-2 font-pixel text-2xl text-primary uppercase mb-4">
            <DoorOpen className="w-6 h-6" strokeWidth={2.5} />
            {t.gatesTitle}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {t.gates.map((gate, i) => (
              <motion.li
                key={gate.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="pixel-box bg-card p-4"
              >
                <p className="font-pixel text-xl text-foreground uppercase mb-2">{gate.name}</p>
                <p className="text-sm text-muted-foreground leading-snug">{gate.note}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade}>
          <h3 className="flex items-center gap-2 font-pixel text-2xl text-primary uppercase mb-1">
            <SquareParking className="w-6 h-6" strokeWidth={2.5} />
            {t.parkingTitle}
          </h3>
          <p className="font-pixel text-lg text-muted-foreground mb-4">{t.parkingIntro}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {t.parking.map((spot, i) => (
              <motion.li
                key={spot.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`pixel-box p-4 ${spot.recommended ? 'bg-secondary border-secondary' : 'bg-card'}`}
              >
                {spot.recommended && (
                  <span className="inline-block font-pixel text-sm uppercase bg-primary text-primary-foreground border-[3px] border-border px-2 py-0.5 mb-2">
                    GẦN NHẤT
                  </span>
                )}
                <p className="font-pixel text-xl text-foreground uppercase mb-2">{spot.name}</p>
                <p className="text-sm text-muted-foreground leading-snug">{spot.note}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.p {...fade} className="mt-8 flex items-start gap-2 font-pixel text-lg text-primary">
          <MapPinned className="w-6 h-6 shrink-0 mt-1" strokeWidth={2.5} />
          <span>▸ {t.tip}</span>
        </motion.p>
      </div>
    </section>
  )
}
