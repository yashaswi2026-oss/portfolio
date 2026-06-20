export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap footer-row">
        <a href="#top" className="logo">
          new build<span>.</span>
        </a>
        <div className="f-owner text-xs tracking-wider text-neutral-500 font-mono">
          Design &amp; Build:<span className="font-sans font-semibold text-neutral-900 ml-1.5 mr-2">Yashaswi Vasamsetti</span>
          <span className="text-neutral-300">|</span>
          <a href="tel:+919032696061" className="font-sans font-medium text-neutral-700 hover:text-black hover:underline ml-2">
            +91 9032696061
          </a>
        </div>
        <div className="f-links">
          <a href="#transform">Compare</a>
          <a href="#process">Process</a>
          <a href="tel:+919032696061">Call</a>
        </div>
        <span className="f-meta">© {currentYear} — All rights reserved</span>
      </div>
    </footer>
  );
}
