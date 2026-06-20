import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
      <div className="wrap nav-row">
        <a href="#top" className="logo">
          new build<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#transform">Compare</a>
          <a href="#approach">Approach</a>
          <a href="#process">Process</a>
          <a href="#contact" className="nav-cta btn btn-ghost text-[10px] tracking-[0.25em]" style={{ padding: '10px 18px' }}>
            Start a project
          </a>
        </div>
      </div>
    </nav>
  );
}
