'use client'

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const SPRING_CONFIG = { damping: 100, stiffness: 700, mass: 0.5 };

type TargetKind = 'internal' | 'external' | 'drag';

function getTargetKind(el: EventTarget | null): TargetKind | null {
  if (!(el instanceof Element)) return null;
  const target = el.closest(INTERACTIVE);
  if (!target) return el.closest('[data-cursor="drag"]') ? 'drag' : null;
  if (
    target instanceof HTMLAnchorElement &&
    target.hasAttribute('href') &&
    (target.target === '_blank' ||
      !target.protocol.startsWith('http') ||
      target.origin !== window.location.origin)
  ) {
    return 'external';
  }
  return 'internal';
}

function subscribeFinePointer(onChange: () => void) {
  const media = window.matchMedia(FINE_POINTER);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

const FollowCursor: React.FC = () => {
  const canHover = useFinePointer();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState<{ active: boolean; kind: TargetKind }>({
    active: false,
    kind: 'internal',
  });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothMouseX = useSpring(mouseX, SPRING_CONFIG);
  const smoothMouseY = useSpring(mouseY, SPRING_CONFIG);

  useEffect(() => {
    if (!canHover) return;
    let hasMoved = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!hasMoved) {
        // Jump straight to the cursor on first appearance instead of springing in from off-screen
        hasMoved = true;
        smoothMouseX.jump(event.clientX);
        smoothMouseY.jump(event.clientY);
      }
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);
    };

    // mouseover fires for every element entered (including plain page areas),
    // so it covers both entering and leaving interactive targets
    const handleMouseOver = (event: MouseEvent) => {
      const kind = getTargetKind(event.target);
      setHover((prev) =>
        kind
          ? prev.active && prev.kind === kind ? prev : { active: true, kind }
          : prev.active ? { ...prev, active: false } : prev,
      );
    };

    // Only needed for leaving the window, where no mouseover follows
    const handleMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget) return;
      setVisible(false);
      setHover((prev) => (prev.active ? { ...prev, active: false } : prev));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [canHover, mouseX, mouseY, smoothMouseX, smoothMouseY]);

  if (!canHover) return null;

  const isDrag = hover.active && hover.kind === 'drag';

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible && !isDrag ? 1 : 0,
        scale: isDrag ? 0.2 : hover.active ? 1.1 : 0.7,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      style={{
        translateX: smoothMouseX,
        translateY: smoothMouseY,
        position: 'fixed',
        top: 15,
        left: 15,
        width: '30px',
        height: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transformOrigin: 'center center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: hover.active ? 1 : 0,
          scale: hover.active ? 1 : 0.5,
          rotate: hover.kind === 'external' ? -45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ display: 'flex' }}
      >
        <ArrowRightIcon size={16} className="text-white" />
      </motion.div>
    </motion.div>
  );
};

export default FollowCursor;
