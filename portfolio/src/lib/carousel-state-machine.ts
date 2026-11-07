export type CarouselPhase = 'gliding' | 'pressed' | 'dragging' | 'trackpadScrolling'
export type ScrollDirection = 1 | -1
export type PointerType = 'mouse' | 'touch' | 'pen'

interface PointerSample {
  time: number
  pointerX: number
}

interface DragGesture {
  pointerId: number
  pointerType: PointerType
  startPointerX: number
  startPointerY: number
  startPosition: number
  recentPointerSamples: PointerSample[]
}

interface TrackpadGesture {
  lastEventTime: number
  totalDistance: number
}

export interface CarouselState {
  phase: CarouselPhase
  position: number
  velocity: number
  autoScrollDirection: ScrollDirection
  isHovered: boolean
  isKeyboardFocused: boolean
  drag: DragGesture | null
  trackpad: TrackpadGesture | null
}

export interface CarouselSettings {
  autoScrollSpeed: number
  hoverSpeedMultiplier: number
  momentumDecaySeconds: number
  dragStartDistance: number
  flickSpeedToChangeDirection: number
  maxSpeed: number
  releaseVelocitySampleMs: number
  holdStillBeforeReleaseCancelsFlickMs: number
  trackpadGestureEndsAfterMs: number
  arrowKeyStepDistance: number
}

export type CarouselEvent =
  | {
      type: 'POINTER_DOWN'
      pointerId: number
      pointerType: PointerType
      pointerX: number
      pointerY: number
      time: number
    }
  | { type: 'POINTER_MOVE'; pointerId: number; pointerX: number; pointerY: number; time: number }
  | { type: 'POINTER_UP'; pointerId: number; time: number }
  | { type: 'POINTER_CANCEL'; pointerId: number }
  | { type: 'TRACKPAD_SCROLL'; distance: number; time: number }
  | { type: 'MOUSE_HOVER'; isHovering: boolean }
  | { type: 'KEYBOARD_FOCUS'; isFocused: boolean }
  | { type: 'ARROW_KEY'; direction: ScrollDirection }
  | {
      type: 'ANIMATION_FRAME'
      secondsSinceLastFrame: number
      time: number
      prefersReducedMotion: boolean
    }

export function createInitialCarouselState(): CarouselState {
  return {
    phase: 'gliding',
    position: 0,
    velocity: 0,
    autoScrollDirection: -1,
    isHovered: false,
    isKeyboardFocused: false,
    drag: null,
    trackpad: null,
  }
}

function limitSpeed(velocity: number, maxSpeed: number) {
  return Math.max(-maxSpeed, Math.min(maxSpeed, velocity))
}

export function wrapIntoRange(min: number, max: number, value: number) {
  const rangeSize = max - min
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min
}

function measureReleaseVelocity(
  samples: PointerSample[],
  releaseTime: number,
  settings: CarouselSettings,
) {
  const lastSample = samples[samples.length - 1]
  if (!lastSample) return 0
  if (releaseTime - lastSample.time > settings.holdStillBeforeReleaseCancelsFlickMs) return 0

  const firstSampleInWindow =
    samples.find((sample) => lastSample.time - sample.time <= settings.releaseVelocitySampleMs) ??
    lastSample
  const elapsedSeconds = (lastSample.time - firstSampleInWindow.time) / 1000
  if (elapsedSeconds <= 0) return 0

  const distance = lastSample.pointerX - firstSampleInWindow.pointerX
  return limitSpeed(distance / elapsedSeconds, settings.maxSpeed)
}

function getAutoScrollVelocity(
  state: CarouselState,
  settings: CarouselSettings,
  prefersReducedMotion: boolean,
) {
  if (prefersReducedMotion || state.isKeyboardFocused) return 0
  const speedMultiplier = state.isHovered ? settings.hoverSpeedMultiplier : 1
  return state.autoScrollDirection * settings.autoScrollSpeed * speedMultiplier
}

function canPointerScrollThePage(pointerType: PointerType) {
  return pointerType !== 'mouse'
}

function isMovingFreely(state: CarouselState) {
  if (state.phase === 'gliding') return true
  return state.phase === 'pressed' && !!state.drag && canPointerScrollThePage(state.drag.pointerType)
}

function directionOf(value: number): ScrollDirection {
  return value > 0 ? 1 : -1
}

function letGoAndGlide(
  state: CarouselState,
  releaseVelocity: number,
  settings: CarouselSettings,
): CarouselState {
  const wasFlicked = Math.abs(releaseVelocity) >= settings.flickSpeedToChangeDirection
  return {
    ...state,
    phase: 'gliding',
    velocity: releaseVelocity,
    autoScrollDirection: wasFlicked ? directionOf(releaseVelocity) : state.autoScrollDirection,
    drag: null,
    trackpad: null,
  }
}

export function getNextCarouselState(
  state: CarouselState,
  event: CarouselEvent,
  settings: CarouselSettings,
): CarouselState {
  switch (event.type) {
    case 'MOUSE_HOVER':
      if (state.isHovered === event.isHovering) return state
      return { ...state, isHovered: event.isHovering }

    case 'KEYBOARD_FOCUS':
      if (state.isKeyboardFocused === event.isFocused) return state
      return { ...state, isKeyboardFocused: event.isFocused }

    case 'ARROW_KEY': {
      if (state.phase !== 'gliding') return state
      const velocityToTravelOneStep =
        (event.direction * settings.arrowKeyStepDistance) / settings.momentumDecaySeconds
      return {
        ...state,
        velocity: limitSpeed(state.velocity + velocityToTravelOneStep, settings.maxSpeed),
      }
    }

    case 'POINTER_DOWN': {
      if (state.phase === 'pressed' || state.phase === 'dragging') return state
      const mightBePageScroll = canPointerScrollThePage(event.pointerType)
      return {
        ...state,
        phase: 'pressed',
        velocity: mightBePageScroll ? state.velocity : 0,
        trackpad: null,
        drag: {
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          startPointerX: event.pointerX,
          startPointerY: event.pointerY,
          startPosition: state.position,
          recentPointerSamples: [{ time: event.time, pointerX: event.pointerX }],
        },
      }
    }

    case 'POINTER_MOVE': {
      const drag = state.drag
      if (!drag || drag.pointerId !== event.pointerId) return state

      const recentPointerSamples = [
        ...drag.recentPointerSamples,
        { time: event.time, pointerX: event.pointerX },
      ].filter((sample) => event.time - sample.time <= settings.releaseVelocitySampleMs * 2)

      if (state.phase === 'dragging') {
        return {
          ...state,
          position: drag.startPosition + (event.pointerX - drag.startPointerX),
          drag: { ...drag, recentPointerSamples },
        }
      }

      const horizontalDistance = Math.abs(event.pointerX - drag.startPointerX)
      const verticalDistance = Math.abs(event.pointerY - drag.startPointerY)
      const isMovingSideways =
        !canPointerScrollThePage(drag.pointerType) || horizontalDistance > verticalDistance
      const hasMovedEnoughToDrag =
        horizontalDistance >= settings.dragStartDistance && isMovingSideways

      if (!hasMovedEnoughToDrag) {
        return { ...state, drag: { ...drag, recentPointerSamples } }
      }
      return {
        ...state,
        phase: 'dragging',
        velocity: 0,
        drag: {
          ...drag,
          startPointerX: event.pointerX,
          startPosition: state.position,
          recentPointerSamples,
        },
      }
    }

    case 'POINTER_UP': {
      const drag = state.drag
      if (!drag || drag.pointerId !== event.pointerId) return state
      if (state.phase === 'dragging') {
        const releaseVelocity = measureReleaseVelocity(drag.recentPointerSamples, event.time, settings)
        return letGoAndGlide(state, releaseVelocity, settings)
      }
      if (!canPointerScrollThePage(drag.pointerType)) return letGoAndGlide(state, 0, settings)

      const isTapToStopAFlick = Math.abs(state.velocity) >= settings.flickSpeedToChangeDirection
      return letGoAndGlide(state, isTapToStopAFlick ? 0 : state.velocity, settings)
    }

    case 'POINTER_CANCEL': {
      const drag = state.drag
      if (!drag || drag.pointerId !== event.pointerId) return state
      const wasHoldingCarouselStill = state.phase === 'dragging' || !canPointerScrollThePage(drag.pointerType)
      return letGoAndGlide(state, wasHoldingCarouselStill ? 0 : state.velocity, settings)
    }

    case 'TRACKPAD_SCROLL': {
      if (state.phase === 'pressed' || state.phase === 'dragging') return state
      return {
        ...state,
        phase: 'trackpadScrolling',
        velocity: 0,
        position: state.position + event.distance,
        trackpad: {
          lastEventTime: event.time,
          totalDistance: (state.trackpad?.totalDistance ?? 0) + event.distance,
        },
      }
    }

    case 'ANIMATION_FRAME': {
      if (state.phase === 'trackpadScrolling') {
        const trackpad = state.trackpad
        const hasTrackpadGestureEnded =
          trackpad && event.time - trackpad.lastEventTime > settings.trackpadGestureEndsAfterMs
        if (!hasTrackpadGestureEnded) return state

        const scrolledFarEnoughToChangeDirection =
          Math.abs(trackpad.totalDistance) > settings.arrowKeyStepDistance / 2
        return {
          ...state,
          phase: 'gliding',
          velocity: 0,
          autoScrollDirection: scrolledFarEnoughToChangeDirection
            ? directionOf(trackpad.totalDistance)
            : state.autoScrollDirection,
          trackpad: null,
        }
      }
      if (!isMovingFreely(state)) return state

      const autoScrollVelocity = getAutoScrollVelocity(state, settings, event.prefersReducedMotion)
      const remainingMomentum =
        (state.velocity - autoScrollVelocity) *
        Math.exp(-event.secondsSinceLastFrame / settings.momentumDecaySeconds)
      const velocity = autoScrollVelocity + remainingMomentum
      return { ...state, velocity, position: state.position + velocity * event.secondsSinceLastFrame }
    }
  }
}
