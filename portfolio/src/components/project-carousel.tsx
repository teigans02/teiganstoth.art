'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RevealImage } from '@/components/reveal-image'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import {
  createInitialCarouselState,
  getNextCarouselState,
  wrapIntoRange,
  type CarouselEvent,
  type CarouselPhase,
  type CarouselSettings,
  type CarouselState,
  type PointerType,
} from '@/lib/carousel-state-machine'
import type { CarouselSlide } from '@/lib/project-carousel'

const SLIDE_WIDTH = 200
const SLIDE_GAP = 8
const SLIDE_WIDTH_WITH_GAP = SLIDE_WIDTH + SLIDE_GAP

const CAROUSEL_SETTINGS: CarouselSettings = {
  autoScrollSpeed: 50,
  hoverSpeedMultiplier: 0.2,
  momentumDecaySeconds: 0.45,
  dragStartDistance: 4,
  flickSpeedToChangeDirection: 300,
  maxSpeed: 5000,
  releaseVelocitySampleMs: 100,
  holdStillBeforeReleaseCancelsFlickMs: 60,
  trackpadGestureEndsAfterMs: 150,
  arrowKeyStepDistance: SLIDE_WIDTH_WITH_GAP,
}

const LONGEST_FRAME_TO_SIMULATE_SECONDS = 1 / 20
const PIXELS_PER_WHEEL_LINE = 16

function useNumberOfSlideSetCopies(
  containerRef: React.RefObject<HTMLElement | null>,
  slideSetWidth: number,
) {
  const [numberOfCopies, setNumberOfCopies] = useState(2)
  useEffect(() => {
    const container = containerRef.current
    if (!container || slideSetWidth <= 0) return
    const resizeObserver = new ResizeObserver(([entry]) => {
      const copiesToFillContainer = Math.ceil(entry.contentRect.width / slideSetWidth)
      setNumberOfCopies(Math.max(2, copiesToFillContainer + 1))
    })
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [containerRef, slideSetWidth])
  return numberOfCopies
}

function getHorizontalWheelDistanceInPixels(event: WheelEvent, containerWidth: number) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaX * PIXELS_PER_WHEEL_LINE
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaX * containerWidth
  return event.deltaX
}

function useInfiniteCarousel(
  containerRef: React.RefObject<HTMLDivElement | null>,
  slideSetWidth: number,
): { trackX: MotionValue<number>; eventHandlers: React.HTMLAttributes<HTMLDivElement> } {
  const trackX = useMotionValue(0)
  const carouselStateRef = useRef<CarouselState>(createInitialCarouselState())
  const wasDraggedRef = useRef(false)

  const isInView = useInView(containerRef)
  const prefersReducedMotion = useReducedMotion() ?? false
  const latestConditionsRef = useRef({ isInView, prefersReducedMotion })
  useEffect(() => {
    latestConditionsRef.current = { isInView, prefersReducedMotion }
  }, [isInView, prefersReducedMotion])

  const onPhaseEnter = useCallback(
    (phase: CarouselPhase) => {
      const container = containerRef.current
      if (!container) return
      container.dataset.phase = phase
      if (phase === 'dragging') wasDraggedRef.current = true
    },
    [containerRef],
  )

  const handleCarouselEvent = useCallback(
    (event: CarouselEvent) => {
      const previousState = carouselStateRef.current
      const nextState = getNextCarouselState(previousState, event, CAROUSEL_SETTINGS)
      carouselStateRef.current = nextState
      if (nextState.phase !== previousState.phase) onPhaseEnter(nextState.phase)
    },
    [onPhaseEnter],
  )

  useEffect(() => onPhaseEnter(carouselStateRef.current.phase), [onPhaseEnter])

  useAnimationFrame((_, millisecondsSinceLastFrame) => {
    if (slideSetWidth <= 0) return
    if (latestConditionsRef.current.isInView) {
      handleCarouselEvent({
        type: 'ANIMATION_FRAME',
        secondsSinceLastFrame: Math.min(
          millisecondsSinceLastFrame / 1000,
          LONGEST_FRAME_TO_SIMULATE_SECONDS,
        ),
        time: performance.now(),
        prefersReducedMotion: latestConditionsRef.current.prefersReducedMotion,
      })
    }
    trackX.set(wrapIntoRange(-slideSetWidth, 0, carouselStateRef.current.position))
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (event: WheelEvent) => {
      const isMostlyHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      if (!isMostlyHorizontal) return
      event.preventDefault()
      handleCarouselEvent({
        type: 'TRACKPAD_SCROLL',
        distance: -getHorizontalWheelDistanceInPixels(event, container.clientWidth),
        time: event.timeStamp,
      })
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [containerRef, handleCarouselEvent])

  const eventHandlers: React.HTMLAttributes<HTMLDivElement> = {
    onPointerDown: (event) => {
      const isSecondaryMouseButton = event.pointerType === 'mouse' && event.button !== 0
      if (isSecondaryMouseButton) return
      wasDraggedRef.current = false
      event.currentTarget.setPointerCapture(event.pointerId)
      handleCarouselEvent({
        type: 'POINTER_DOWN',
        pointerId: event.pointerId,
        pointerType: event.pointerType as PointerType,
        pointerX: event.clientX,
        pointerY: event.clientY,
        time: event.timeStamp,
      })
    },
    onPointerMove: (event) =>
      handleCarouselEvent({
        type: 'POINTER_MOVE',
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        time: event.timeStamp,
      }),
    onPointerUp: (event) =>
      handleCarouselEvent({ type: 'POINTER_UP', pointerId: event.pointerId, time: event.timeStamp }),
    onPointerCancel: (event) =>
      handleCarouselEvent({ type: 'POINTER_CANCEL', pointerId: event.pointerId }),
    onLostPointerCapture: (event) =>
      handleCarouselEvent({ type: 'POINTER_CANCEL', pointerId: event.pointerId }),
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') handleCarouselEvent({ type: 'MOUSE_HOVER', isHovering: true })
    },
    onPointerLeave: (event) => {
      if (event.pointerType === 'mouse') handleCarouselEvent({ type: 'MOUSE_HOVER', isHovering: false })
    },
    onFocus: (event) =>
      handleCarouselEvent({
        type: 'KEYBOARD_FOCUS',
        isFocused: event.currentTarget.matches(':focus-visible'),
      }),
    onBlur: () => handleCarouselEvent({ type: 'KEYBOARD_FOCUS', isFocused: false }),
    onKeyDown: (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      handleCarouselEvent({ type: 'ARROW_KEY', direction: event.key === 'ArrowLeft' ? 1 : -1 })
    },
    onClickCapture: (event) => {
      if (!wasDraggedRef.current) return
      event.preventDefault()
      event.stopPropagation()
    },
  }

  return { trackX, eventHandlers }
}

export function ProjectCarousel({ slides }: { slides: CarouselSlide[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slideSetWidth = slides.length * SLIDE_WIDTH_WITH_GAP
  const numberOfCopies = useNumberOfSlideSetCopies(containerRef, slideSetWidth)
  const { trackX, eventHandlers } = useInfiniteCarousel(containerRef, slideSetWidth)

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work. Drag, swipe or use the arrow keys to browse."
      tabIndex={0}
      data-cursor="drag"
      className="w-full overflow-hidden rounded-lg select-none touch-pan-y cursor-grab data-[phase=dragging]:cursor-grabbing data-[phase=pressed]:cursor-grabbing outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900"
      {...eventHandlers}
    >
      <motion.div className="flex will-change-transform" style={{ x: trackX }}>
        {Array.from({ length: numberOfCopies }, (_, copyIndex) =>
          slides.map((slide, slideIndex) => {
            const isOriginalCopy = copyIndex === 0
            return (
              <div
                key={`${copyIndex}-${slide.id}`}
                aria-hidden={!isOriginalCopy || undefined}
                className="flex-shrink-0"
                style={{ width: SLIDE_WIDTH, marginRight: SLIDE_GAP }}
              >
                <RevealImage
                  src={slide.src}
                  alt={isOriginalCopy ? slide.alt : ''}
                  width={2000}
                  height={1500}
                  sizes={`${SLIDE_WIDTH}px`}
                  draggable={false}
                  priority={isOriginalCopy && slideIndex < 5}
                  loading="eager"
                  placeholderColor={slide.color}
                  wrapperClassName="overflow-hidden rounded-lg"
                  className="w-full aspect-[4/3] object-cover pointer-events-none"
                />
              </div>
            )
          }),
        )}
      </motion.div>
    </div>
  )
}
