import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronDown, Sparkles, Compass, Lightbulb, Eye } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useAtmosphere } from './AtmosphereContext';

interface ApproachCardProps {
  pt: any;
  i: number;
  isOpen: boolean;
  onClick: () => void;
  key?: any;
}

function ApproachCard({ pt, i, isOpen, onClick }: ApproachCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { stiffness, damping } = useAtmosphere();

  // Motion Values for real-time tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for silky-smooth physics-based animation (fully synchronized to Atmosphere Controls)
  const springX = useSpring(mouseX, { stiffness: stiffness, damping: damping });
  const springY = useSpring(mouseY, { stiffness: stiffness, damping: damping });

  // Map spring coordinates (-0.5 to 0.5) to subtle 3D tilt angles and translations
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates so center is (0, 0), ranging from -0.5 to 0.5
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(cx);
    mouseY.set(cy);
  };

  const handleMouseLeave = () => {
    // Return smoothly to the center
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ScrollReveal delay={250 + i * 80}>
      <div style={{ perspective: '1000px' }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            x: translateX,
            y: translateY,
            transformStyle: 'preserve-3d',
            borderRadius: '16px',
          }}
          animate={{
            scale: isOpen ? 1.01 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: stiffness,
            damping: damping
          }}
          className={`group cursor-pointer p-6 border select-none transition-colors duration-300 ${
            isOpen 
              ? 'bg-[var(--surface)] border-[var(--accent)]/35 shadow-lg shadow-[rgba(var(--shadow),0.04)] text-[var(--ink)]' 
              : 'border-[var(--line)] bg-[var(--canvas)]/20 hover:bg-[var(--surface)] hover:border-[var(--ink-faint)]/40 text-[var(--ink)]'
          }`}
        >
          <div style={{ transform: 'translateZ(15px)' }} className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className={`font-mono text-xs tracking-wider transition-colors duration-300 ${isOpen ? 'text-[var(--accent)] font-semibold' : 'text-neutral-400'}`}>
                {pt.num}
              </span>
              <span className={`font-serif text-lg md:text-xl font-medium transition-all duration-300 ${isOpen ? 'text-[var(--accent)]' : 'text-[#1F2824]'}`}>
                {pt.text}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {pt.icon}
              <motion.div
                style={{ transform: 'translateZ(25px)' }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                  isOpen ? 'bg-[#F1ECE3] border-[var(--accent)]/20 text-[var(--accent)]' : 'bg-white border-neutral-200 text-neutral-400'
                }`}
              >
                <ChevronDown size={14} strokeWidth={2.5} />
              </motion.div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden"
                style={{ transform: 'translateZ(10px)' }}
              >
                <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl pl-9 italic font-serif">
                  {pt.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

export default function Approach() {
  const [activePoint, setActivePoint] = useState<number | null>(0); // Default to first open for delightful interactive discovery


  const points = [
    {
      num: '01',
      text: 'Clean visual direction',
      icon: <Compass className="w-4 h-4 text-[var(--accent)]" />,
      desc: 'Stripping away the noise to let your brand shine. We cultivate spacious architectural alignments, custom-crafted typography pairings, and a carefully curated palette that honors quiet sophistication and professional gravity.'
    },
    {
      num: '02',
      text: 'Smooth user experience',
      icon: <Lightbulb className="w-4 h-4 text-[var(--accent)]" />,
      desc: 'Websites should feel as natural to maneuver as physical paper. Through organic custom scroll pacing, fluid mouse transitions, and 3D physical depth transformations, every action feels highly tactile and rewarding.'
    },
    {
      num: '03',
      text: 'Attention to details',
      icon: <Eye className="w-4 h-4 text-[var(--accent)]" />,
      desc: 'The difference between ordinary and bespoke is the space between lines. From pixel-precise visual alignment and safe responsive scaling to micro-interactive details, we ensure that every corner tells a cohesive story of high craftsmanship.'
    },
  ];

  return (
    <section className="approach" id="approach">
      <div className="wrap approach-inner">
        <ScrollReveal>
          <span className="section-tag mb-4 inline-block">Design Approach</span>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <h2 className="cursor-pointer group flex items-center justify-center md:justify-start gap-3 select-none hover:text-[var(--accent)] transition-colors duration-300">
            A quiet kind of premium.
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="inline-block"
            >
              <Sparkles className="w-5 h-5 text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity" />
            </motion.span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="approach-lede mb-10">
            Thoughtful websites designed to feel clear, modern and easy to use — where each interaction tells a story of intent. Click below to explore our values.
          </p>
        </ScrollReveal>

        <div className="approach-points mt-8 space-y-4">
          {points.map((pt, i) => {
            const isOpen = activePoint === i;
            return (
              <ApproachCard
                key={i}
                pt={pt}
                i={i}
                isOpen={isOpen}
                onClick={() => setActivePoint(isOpen ? null : i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
