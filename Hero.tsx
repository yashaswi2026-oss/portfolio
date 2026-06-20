import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 50, y: 40 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    media.addEventListener('change', handleMediaChange);

    // Scroll parallax for background elements
    const handleScroll = () => {
      const y = window.scrollY;
      const innerHeight = window.innerHeight;

      if (y < innerHeight) {
        if (blobRef.current && !media.matches) {
          blobRef.current.style.transform = `translateY(${y * 0.15}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      media.removeEventListener('change', handleMediaChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });

    // Interactive tilting on mockup relative to premium default stance
    if (mockupRef.current) {
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      // Slanted on X and Y, with a dynamic subtle responsive tilt deviation
      mockupRef.current.style.transform = `rotateX(${-cy * 22 + 12}deg) rotateY(${cx * 28 - 18}deg) rotateZ(${2 + cx * 4}deg)`;
      mockupRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (mockupRef.current) {
      mockupRef.current.style.animationPlayState = 'running';
      mockupRef.current.style.transform = '';
    }
  };

  return (
    <header
      ref={containerRef}
      className="hero"
      id="top"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glowRef}
        className="hero-glow"
        style={{
          background: `radial-gradient(560px circle at ${mousePos.x}% ${mousePos.y}%, rgba(26, 26, 26, 0.04), transparent 60%)`,
        }}
      />
      <div ref={blobRef} className="hero-blob" />
      <div ref={gridRef} className="wrap hero-grid">
        <div>
          <ScrollReveal delay={0}>
            <div className="eyebrow">
              <span className="dot" />
              Freelance web designer &amp; developer
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1>
              Websites people <em>remember.</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p>
              I design and build premium, fast websites for founders and brands who want to feel different the moment
              someone lands on their page.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="hero-actions">
              <a href="#transform" className="btn btn-primary">
                View Showcase
              </a>
              <a href="#contact" className="btn btn-ghost">
                Start Your Website
              </a>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={400} className="mockup-stage" id="mockupStage">
          <div ref={mockupRef} className="mockup" id="mockup">
            <div className="mockup-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="mockup-body">
              {/* 3D floating popout badges */}
              <div className="m-floating-badge-1">Bespoke Design</div>
              <div className="m-floating-badge-2">Fast &amp; Secure</div>

              <div className="m-nav">
                <div className="m-logo" />
                <div className="m-links">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="m-hero" />
              <div className="m-title" />
              <div className="m-sub" />
              <div className="m-grid">
                <div className="m-card" />
                <div className="m-card" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </header>
  );
}
