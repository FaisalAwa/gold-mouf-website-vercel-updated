/* ═══════════════════════════════════════════════════════════════
   HeroSlider — full-bleed autoplaying image slider used as the hero
   backdrop. Crossfades between shots with a slow Ken Burns drift;
   pauses on hover/focus and respects prefers-reduced-motion. Dots
   are click-to-jump and double as a progress read for the section.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SLIDE_MS = 5200

export function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const dir = useRef(1)

  useEffect(() => {
    if (reduce || paused || images.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + dir.current + images.length) % images.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused, images.length])

  const goTo = (i: number) => {
    dir.current = i > index ? 1 : -1
    setIndex(i)
  }

  return (
    <div
      className="gmd-hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={images[index]}
          className="gmd-hero-slider-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <motion.img
            src={images[index]}
            alt=""
            className="gmd-hero-slider-img"
            initial={{ scale: reduce ? 1 : 1.04 }}
            animate={{ scale: reduce ? 1 : 1.14 }}
            transition={{ duration: (SLIDE_MS / 1000) + 1.1, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="gmd-hero-slider-dots" role="tablist" aria-label="Hero image slides">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1} of ${images.length}`}
              className={i === index ? 'is-active' : ''}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
