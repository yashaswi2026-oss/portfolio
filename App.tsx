import { useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CompareSlider from './components/CompareSlider';
import Approach from './components/Approach';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import BackToTop from './components/BackToTop';
import { AtmosphereProvider } from './components/AtmosphereContext';
import AtmosphereControls from './components/AtmosphereControls';

function smoothScrollTo(targetId: string, duration: number = 1050) {
  const start = window.pageYOffset;
  let target = 0;
  
  if (targetId !== 'top') {
    const element = document.getElementById(targetId);
    if (!element) return;
    // Offset slightly for sticky navbar visibility
    target = element.getBoundingClientRect().top + start - 80;
  }
  
  const change = target - start;
  let startTime: number | null = null;

  function animate(currentTime: number) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // easeInOutCubic: extremely soothing acceleration/deceleration
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, start + change * ease);

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export default function App() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          smoothScrollTo(targetId, 1050);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <AtmosphereProvider>
      <ScrollProgressBar />
      <BackToTop />
      <AtmosphereControls />
      <CustomCursor />
      <Navigation />
      <main id="top-anchor">
        <Hero />
        <CompareSlider />
        <Approach />
        <Process />
        <Contact />
      </main>
      <Footer />
    </AtmosphereProvider>
  );
}


