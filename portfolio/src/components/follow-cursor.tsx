'use client'

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';

const FollowCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 100, stiffness: 700, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener to update when orientation changes
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Skip all event listeners on mobile
    if (isMobile) return;
    
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

    // We use mouseout instead of mouseleave to better handle nested elements
    const handleMouseOut = (event: MouseEvent) => {
      //  const target = event.target as Element;
       // Check if the mouse is still over a hoverable element even after moving out of the current one
       const relatedTarget = event.relatedTarget as Element;
        if (!relatedTarget || !relatedTarget.closest('a, button, [role="button"], input, textarea, select')) {
            setIsHovering(false);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut); // Listen on document for broader capture

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isMobile]);

  // Don't render anything on mobile
  if (isMobile) return null;

  // const cursorSize = isHovering ? 60 : 30; // Larger size when hovering
  // const offset = cursorSize / 2; // Calculate offset dynamically

  return (
    <motion.div
      // Animate scale and potentially opacity or other properties
      variants={{
        default: { scale: 0.7 },
        hovering: { scale: 1.1 }, // Scale up when hovering
      }}
      animate={isHovering ? "hovering" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      style={{
        translateX: smoothMouseX,
        translateY: smoothMouseY,
        position: 'fixed',
        // Adjust offset slightly down and right from the pointer
        top: 15, // Offset slightly down
        left: 15, // Offset slightly right
        width: '30px', // Base width
        height: '30px', // Base height
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        // Ensure transform origin is center for scaling
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