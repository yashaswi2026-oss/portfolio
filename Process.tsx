import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, useMotionValue } from 'motion/react';
import ScrollReveal from './ScrollReveal';

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Set up 1:1 scroll tracking within the workflow section
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 85%", "start 30%"]
  });

  // Create an overrides-friendly motion value for the line progress
  const lineProgress = useMotionValue(0);

  // Spring physical feedback for the tracking line
  const scaleX = useSpring(lineProgress, {
    stiffness: 45, // Softened from 90 to slow down and smooth the animation
    damping: 24,   // Balanced damping for an elegant lag effect
    restDelta: 0.001
  });

  // Calculate active checkpoint index as progress builds
  useMotionValueEvent(scrollYProgress, "change", (latestVal) => {
    // 4 step checkpoints mapped directly to scroll intervals
    if (latestVal < 0.25) {
      setActiveStep(0);
      lineProgress.set(latestVal);
    } else if (latestVal < 0.50) {
      setActiveStep(1);
      lineProgress.set(latestVal);
    } else if (latestVal < 0.75) {
      setActiveStep(2);
      lineProgress.set(latestVal);
    } else {
      setActiveStep(3);
      // Automatically complete the remaining line motion to 100% as soon as Step 04 is reached
      lineProgress.set(1.0);
    }
  });

  const steps = [
    {
      num: '01',
      title: 'Discovery',
      desc: 'Defining core brand vision, project objectives, and dynamic competitive landscapes.'
    },
    {
      num: '02',
      title: 'Design',
      desc: 'Constructing high-fidelity mockups, spatial grids, and curated color stories.'
    },
    {
      num: '03',
      title: 'Build',
      desc: 'Writing responsive, accessible, pixel-perfect code with clean modularity.'
    },
    {
      num: '04',
      title: 'Launch',
      desc: 'Deploying to rapid edge servers, verifying SEO metadata, and fine-tuning key elements.'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="process py-24 md:py-32 overflow-hidden" 
      id="process"
    >
      <div className="wrap border-box">
        <ScrollReveal>
          <div className="section-head mb-16">
            <div>
              <span className="section-tag mb-4 inline-block">Workflow Excellence</span>
              <h2>
                A simple, rigorous process<span>.</span>
              </h2>
            </div>
            <p className="max-w-md text-neutral-500">
              Four streamlined phases from dynamic architecture to refined deployment.
            </p>
          </div>
        </ScrollReveal>

        <div ref={trackRef} className="process-track-wrapper relative mt-16">
          {/* Scroll-Linked Progress Line (Desktop only) */}
          <div className="process-line">
            <motion.div 
              className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left"
              style={{ scaleX }}
            />
          </div>

          <div className="process-track">
            {steps.map((step, i) => {
              // Current active checkpoint status
              const isActive = i === activeStep;
              // Evaluated status (completed or active) for fill states
              const isPastOrActive = i <= activeStep;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 55 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    type: "spring",
                    stiffness: 95,
                    damping: 18,
                    delay: i * 0.16
                  }}
                  className="p-step flex flex-col items-start"
                >
                  {/* Number Badge with Spring 'Pop' & solid shift transitions */}
                  <motion.div 
                    className="p-num font-mono"
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      backgroundColor: isPastOrActive ? 'var(--ink)' : 'var(--surface)',
                      borderColor: isPastOrActive ? 'var(--ink)' : 'var(--line)',
                      color: isPastOrActive ? 'var(--canvas)' : 'var(--ink-soft)',
                      boxShadow: isActive ? '0 0 16px rgba(var(--shadow), 0.12)' : 'none'
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 16
                    }}
                  >
                    {step.num}
                  </motion.div>

                  {/* Heading with smooth attention transitions */}
                  <motion.h3
                    animate={{
                      color: isPastOrActive ? 'var(--ink)' : 'var(--ink-faint)',
                      opacity: isActive ? 1 : (isPastOrActive ? 0.8 : 0.4)
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description text recedes dynamically */}
                  <motion.p
                    animate={{
                      color: isPastOrActive ? 'var(--ink-soft)' : 'var(--ink-faint)',
                      opacity: isActive ? 1 : (isPastOrActive ? 0.75 : 0.4)
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {step.desc}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
