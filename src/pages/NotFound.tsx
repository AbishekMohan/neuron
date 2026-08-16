import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen flex items-center">
      <div className="max-w-md mx-auto text-center">
        <p className="text-white/40 text-sm mb-2">404</p>
        <h1 className="text-white text-2xl font-light mb-4">Page not found</h1>
        <Link to="/" className="text-sky-400 text-sm hover:text-sky-300 transition-colors">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
