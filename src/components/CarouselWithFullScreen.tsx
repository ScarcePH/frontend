import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

type Props = {
  images: string[]
  productName?: string
}

export default function CarouselWithFullScreen({ images, productName = 'Product' }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const startX = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const visibleIndex = Math.min(currentIndex, Math.max(images.length - 1, 0))

  const next = () => setCurrentIndex((current) => (current + 1) % images.length)
  const previous = () => setCurrentIndex((current) => (current - 1 + images.length) % images.length)

  useEffect(() => {
    if (!zoomOpen) return

    const previousOverflow = document.body.style.overflow
    const galleryTrigger = triggerRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomOpen(false)
      if (event.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((current) => (current + 1) % images.length)
      }
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((current) => (current - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
      galleryTrigger?.focus()
    }
  }, [zoomOpen, images.length])

  const handleTouchStart = (event: React.TouchEvent) => {
    startX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (startX.current === null || images.length < 2) return
    const difference = startX.current - event.changedTouches[0].clientX
    if (difference > 50) next()
    if (difference < -50) previous()
    startX.current = null
  }

  return (
    <>
      <div className="flex w-full flex-col items-center gap-4 p-3 sm:p-6">
        <div className="relative flex aspect-square w-full max-w-[34rem] items-center justify-center">
          <button
            ref={triggerRef}
            type="button"
            className="storefront-focus group relative flex h-full w-full cursor-zoom-in items-center justify-center"
            onClick={() => setZoomOpen(true)}
            aria-label={`Open fullscreen image of ${productName}`}
          >
            <img
              src={images[visibleIndex]}
              alt={`${productName}, view ${visibleIndex + 1} of ${images.length}`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
            <span className="absolute bottom-2 right-2 flex size-11 items-center justify-center border border-border bg-background/90" aria-hidden="true">
              <Expand className="size-4" />
            </span>
          </button>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={previous} className="storefront-focus absolute left-0 flex size-11 items-center justify-center border border-border bg-background/90" aria-label="Previous image">
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={next} className="storefront-focus absolute right-0 flex size-11 items-center justify-center border border-border bg-background/90" aria-label="Next image">
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="flex flex-wrap justify-center gap-2" aria-label="Product image thumbnails">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className="storefront-focus flex size-12 items-center justify-center border bg-background p-1"
                data-active={index === visibleIndex}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === visibleIndex ? 'true' : undefined}
              >
                <img src={image} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {zoomOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 text-white"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} fullscreen gallery`}
          >
            <div
              className="flex h-full w-full max-w-[100rem] flex-col"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex min-h-16 items-center justify-between border-b border-white/20 px-4 sm:px-6">
                <span className="text-xs uppercase tracking-[0.18em]">{visibleIndex + 1} / {images.length}</span>
                <button ref={closeButtonRef} type="button" onClick={() => setZoomOpen(false)} className="flex size-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close fullscreen gallery">
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>
              <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
                <img src={images[visibleIndex]} alt={`${productName}, fullscreen view ${visibleIndex + 1}`} className="max-h-full max-w-full object-contain" />
                {images.length > 1 ? (
                  <>
                    <button type="button" onClick={previous} className="absolute left-3 flex size-12 items-center justify-center border border-white/40 bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6" aria-label="Previous image">
                      <ChevronLeft className="size-7" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={next} className="absolute right-3 flex size-12 items-center justify-center border border-white/40 bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6" aria-label="Next image">
                      <ChevronRight className="size-7" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
