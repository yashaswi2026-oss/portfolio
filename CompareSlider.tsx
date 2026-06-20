import React, { useEffect, useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import ScrollReveal from './ScrollReveal';

export default function CompareSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPct, setSliderPct] = useState(90);
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Monitors the scrolling position of the compare container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Smoothly glides the slider to reveal the "After" side as the user scrolls down
  useMotionValueEvent(scrollYProgress, 'change', (val) => {
    if (!hasInteracted && !dragging) {
      // Map scroll progress from 0.15 to 0.7 into slider position of 90% down to 18%
      if (val >= 0.15 && val <= 0.7) {
        const pctRange = 0.7 - 0.15;
        const norm = (val - 0.15) / pctRange; // 0 to 1
        const calculated = 90 - norm * (90 - 18); // 90% to 18%
        setSliderPct(Math.round(calculated));
      } else if (val < 0.15) {
        setSliderPct(90);
      } else if (val > 0.7) {
        setSliderPct(18);
      }
    }
  });

  // Handle drag calculations
  const calculatePct = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    setSliderPct(pct);
  };

  // Drag listeners
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      calculatePct(clientX);
    };

    const handleGlobalEnd = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove, { passive: true });
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [dragging]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setHasInteracted(true); // Disable auto scroll control once user interacts
    setDragging(true);
    const clientX = 'touches' in e ? e.nativeEvent.touches[0].clientX : (e as React.MouseEvent).clientX;
    calculatePct(clientX);
  };

  return (
    <section className="transform" id="transform">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div>
              <span className="section-tag">See It Transform</span>
              <h2>Same business. A completely&nbsp;different impression.</h2>
            </div>
            <p>Drag the handle to compare a typical template site with what thoughtful design does to it.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div
            ref={containerRef}
            className={`compare ${dragging ? 'dragging' : ''}`}
            id="compare"
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            {/* AFTER LAYER (premium) */}
            <div className="compare-layer compare-after">
              <div className="cm-chrome">
                <i />
                <i />
                <i />
                <span className="cm-url">After — designed with intent</span>
              </div>
              <div className="cm-body cm-after-body">
                <div className="cm-nav">
                  <div className="cm-logo">Atelier slow.</div>
                  <div className="cm-nav-links">
                    <span>Galleries</span>
                    <span>Journal</span>
                    <span>Atelier</span>
                  </div>
                  <div className="cm-cta">Inquire</div>
                </div>
                
                <div className="cm-hero">
                  <span className="cm-eyebrow">EST. 1994 / SWEDEN</span>
                  <h1 className="cm-h-title">Quiet structures with permanent posture.</h1>
                  <p className="cm-h-sub">
                    We engineer silent architecture and highly responsive, bespoke physical spaces designed to focus and restore human attention.
                  </p>
                  <button className="cm-h-btn">View Exhibitions</button>
                </div>
                
                <div className="cm-grid">
                  <div className="cm-card">
                    <span className="cm-card-num">01 / CONCEPTUAL</span>
                    <h4>Tectonic Joins</h4>
                    <p>Bespoke carbon steel frames and damp mortise connection.</p>
                  </div>
                  <div className="cm-card">
                    <span className="cm-card-num">02 / INTERLINING</span>
                    <h4>Passive Shading</h4>
                    <p>Maximizing raw natural daylight during severe winter cycles.</p>
                  </div>
                  <div className="cm-card">
                    <span className="cm-card-num">03 / REALIZATION</span>
                    <h4>Aesthetic Rest</h4>
                    <p>Monolithic limestone floorboards forged and finished locally.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BEFORE LAYER (cluttered) */}
            <div
              className="compare-layer compare-before"
              id="compareBefore"
              style={{ width: `${sliderPct}%` }}
            >
              <div className="cm-chrome cm-chrome-before">
                <i />
                <i />
                <i />
                <span className="cm-url">Before — generic templates</span>
              </div>
              <div className="cm-body cm-before-body">
                {/* Sale Badge */}
                <div className="cm-badge">🔥 SPECIAL DEALS! 80% OFF LAST DAY! 🔥</div>

                <div className="cm-nav cm-nav-busy">
                  <div className="cm-logo cm-logo-busy">🚀 FREE-WEBSITE-v3-LITE</div>
                  <div className="cm-nav-links">
                    <span>HOME!</span>
                    <span>BLOG</span>
                    <span>PRICING</span>
                    <span>FORUMS</span>
                    <span>REVIEWS</span>
                  </div>
                </div>
                
                <div className="cm-hero cm-hero-busy">
                  <h1 className="cm-busy-title">WELCOME TO THE NUMBER #1 COOLEST MULTIPURPOSE THEME FOR GENERAL BEST BUSINESSES!!!</h1>
                  <p className="cm-busy-sub">
                    We make premium generic templates which are extremely search engine optimized. Click buttons down below right now to download our free framework files!
                  </p>
                  <div className="cm-busy-btns">
                    <div className="cm-btn-a">CLICK ME!</div>
                    <div className="cm-btn-b">BUY NOW!</div>
                    <div className="cm-btn-c">FREE TRIAL</div>
                  </div>
                </div>
                
                <div className="cm-grid cm-grid-busy">
                  <div className="cm-card cm-card-busy">
                    <h5>SEO READY!!!</h5>
                    <p>Become top of search results instantly with our high keywords density code block!</p>
                  </div>
                  <div className="cm-card cm-card-busy">
                    <h5>100% NO BUGS</h5>
                    <p>Our files never crash because they are double programmed by computers globally!</p>
                  </div>
                  <div className="cm-card cm-card-busy">
                    <h5>DRAG & DROP</h5>
                    <p>Move headers around with our premium slider system without writing code!</p>
                  </div>
                  <div className="cm-card cm-card-busy">
                    <h5>CHEAPEST ONLY</h5>
                    <p>Why pay expensive design snobs when you can do it yourself in five seconds!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPARE HANDLE */}
            <div
              className="compare-handle"
              id="compareHandle"
              style={{ left: `${sliderPct}%` }}
            >
              <div className="handle-knob">
                <ChevronsLeftRight size={16} strokeWidth={2.5} />
              </div>
            </div>

            <span className="compare-tag compare-tag-before">Before</span>
            <span className="compare-tag compare-tag-after">After</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
