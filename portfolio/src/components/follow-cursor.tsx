'use client'

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';

const FollowCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 100, stiffness: 700, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!canHover) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
       const relatedTarget = event.relatedTarget as Element;
        if (!relatedTarget || !relatedTarget.closest('a, button, [role="button"], input, textarea, select')) {
            setIsHovering(false);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, canHover]);

  if (!canHover) return null;

  return (
    <motion.div
      variants={{
        default: { scale: 0.7 },
        hovering: { scale: 1.1 },
      }}
      animate={isHovering ? "hovering" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
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
      {isHovering && (
        <ArrowRightIcon size={16} className="text-white" />
      )}
    </motion.div>
  );
};

export default FollowCursor;
