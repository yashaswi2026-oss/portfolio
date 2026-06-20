import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'link' | 'drag'>('default');
  const [inHero, setInHero] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;

    if (!hasHover) {
      return;
    }

    let cx = 0;
    let cy = 0;
    let ax = 0;
    let ay = 0;
    let tx = 0;
    let ty = 0;

    // Track smooth coordinates for distinct gold lag points
    let t1x = 0; let t1y = 0;
    let t2x = 0; let t2y = 0;
    let t3x = 0; let t3y = 0;

    const handleMouseMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setActive(true);
      
      const target = e.target as HTMLElement | null;
      if (target) {
        setInHero(!!target.closest('.hero, #hero'));
      }
    };

    const handleMouseLeaveWindow = () => {
      setActive(false);
    };

    // Use event delegation for detecting links/buttons/interactive zones
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      setInHero(!!target.closest('.hero, #hero'));

      const closestInteractive = target.closest('a, button, .btn, .compare, .a-point, [role="button"]');
      if (closestInteractive) {
        if (closestInteractive.classList.contains('compare')) {
          setCursorType('drag');
        } else {
          setCursorType('link');
        }
      } else {
        setCursorType('default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('.compare')) {
        setCursorType('drag');
      }
    };

    const handleMouseUp = () => {
      setCursorType('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    let animationFrameId: number;
    const updateCursor = () => {
      if (cursorRef.current) {
        cx += (tx - cx) * 0.22;
        cy += (ty - cy) * 0.22;
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      if (auraRef.current && !reduceMotion) {
        // Organic lag physics for trailing colored glow aura
        ax += (tx - ax) * 0.07;
        ay += (ty - ay) * 0.07;
        auraRef.current.style.transform = `translate(${ax}px, ${ay}px) translate(-50%, -50%)`;
      }

      // Elegant, physical gold brush trails
      if (!reduceMotion) {
        if (trail1Ref.current) {
          t1x += (tx - t1x) * 0.11;
          t1y += (ty - t1y) * 0.11;
          trail1Ref.current.style.transform = `translate(${t1x}px, ${t1y}px) translate(-50%, -50%)`;
        }
        if (trail2Ref.current) {
          t2x += (t1x - t2x) * 0.13;
          t2y += (t1y - t2y) * 0.13;
          trail2Ref.current.style.transform = `translate(${t2x}px, ${t2y}px) translate(-50%, -50%)`;
        }
        if (trail3Ref.current) {
          t3x += (t2x - t3x) * 0.15;
          t3y += (t2y - t3y) * 0.15;
          trail3Ref.current.style.transform = `translate(${t3x}px, ${t3y}px) translate(-50%, -50%)`;
        }
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };
    updateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getClassName = () => {
    let classes = 'cursor-dot';
    if (active) classes += ' active';
    if (cursorType === 'link') classes += ' is-link';
    if (cursorType === 'drag') classes += ' is-drag';
    if (inHero) classes += ' in-hero';
    return classes;
  };

  return (
    <>
      <div 
        ref={trail1Ref} 
        className={`cursor-trail-segment segment-1 ${active && inHero ? 'in-hero' : ''}`} 
      />
      <div 
        ref={trail2Ref} 
        className={`cursor-trail-segment segment-2 ${active && inHero ? 'in-hero' : ''}`} 
      />
      <div 
        ref={trail3Ref} 
        className={`cursor-trail-segment segment-3 ${active && inHero ? 'in-hero' : ''}`} 
      />
      <div ref={cursorRef} className={getClassName()} id="cursorDot" />
      <div ref={auraRef} className={`cursor-aura ${active ? 'active' : ''}`} id="cursorAura" />
    </>
  );
}
