import { Link } from 'react-router-dom';

// Picks up the CTA section's gradient (dark navy, bright blue glow on the
// right) at the seam and fades it out to the page's plain black background,
// so the footer doesn't look like an abrupt cut from the image.
export default function Footer() {
  return (
    <footer
      className="relative z-10 overflow-hidden px-6 sm:px-8 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/30 text-xs"
      style={{ background: 'linear-gradient(to bottom, #060b1c 0%, #000 60%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 480px 220px at 100% 0%, rgba(56,189,248,0.14), transparent 70%)' }}
      />
      <span className="relative">Neuron: an AI learning portal for high school students.</span>
      <Link to="/reference" className="relative hover:text-white/60 transition-colors">
        Reference Page
      </Link>
    </footer>
  );
}
