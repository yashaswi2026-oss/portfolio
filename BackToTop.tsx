import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after the user has scrolled past the hero section (approx 80% viewport height)
      if (window.scrollY > window.innerHeight * 0.8) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          id="back-to-top"
          href="#top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          type="button"
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--ink)] hover:bg-[var(--accent)] text-[var(--canvas)] hover:text-[var(--ink)] flex items-center justify-center shadow-[0_12px_40px_rgba(var(--shadow),0.25)] hover:shadow-[0_16px_48px_rgba(var(--shadow),0.35)] border border-[var(--line)]/50 transition-colors duration-300 ease-out cursor-pointer group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
