import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 px-6 sm:px-8 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/30 text-xs">
      <span>Neuron: an AI learning portal for high school students.</span>
      <Link to="/reference" className="hover:text-white/60 transition-colors">
        Reference Page
      </Link>
    </footer>
  );
}
