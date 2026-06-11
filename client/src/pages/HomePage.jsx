import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <p className="text-2xl sm:text-3xl font-display font-bold text-brand-accent">{value}</p>
    <p className="text-xs text-brand-textSecondary mt-1 uppercase tracking-widest">{label}</p>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* Hero section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-brand-bg to-brand-bg" />
          <div className="absolute top-0 right-0 w-2/3 h-full"
            style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(200,169,110,0.07) 0%, transparent 60%)' }} />
          {/* Decorative film strip pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-border to-transparent" />
        </div>

        {/* Floating accent dots */}
        <div className="absolute top-24 right-1/4 w-1 h-1 rounded-full bg-brand-accent opacity-60" />
        <div className="absolute top-48 right-1/3 w-0.5 h-0.5 rounded-full bg-brand-accent opacity-40" />
        <div className="absolute bottom-32 right-1/5 w-1.5 h-1.5 rounded-full bg-brand-accent opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-brand-accent" />
              <span className="text-xs font-medium text-brand-accent uppercase tracking-[0.2em]">
                Welcome back
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-textPrimary leading-[1.05] mb-6">
              Your stage
              <br />
              is set,{' '}
              <span className="text-brand-accent">{firstName}.</span>
            </h1>

            <p className="text-brand-textSecondary text-lg leading-relaxed mb-10 max-w-lg">
              Thousands of films, curated for the discerning eye. From auteur masterpieces to hidden gems — your next obsession is one scroll away.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/movies')}
                className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Browse Films
              </button>
              <button
                onClick={() => navigate('/my-list')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent transition-all duration-200 text-base font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
                </svg>
                My List
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent" />
      </section>

      {/* Stats bar */}
      <section className="border-y border-brand-border/40 bg-brand-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Films & Series" />
            <StatCard value="50+" label="Genres" />
            <StatCard value="4K" label="Ultra HD" />
            <StatCard value="∞" label="Your Watchlist" />
          </div>
        </div>
      </section>

      {/* Coming soon placeholder rows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-brand-accent rounded-full" />
          <h2 className="font-display text-xl font-semibold text-brand-textPrimary">Trending Now</h2>
          <span className="text-xs text-brand-textSecondary border border-brand-border px-2 py-0.5 rounded-full">
            Coming in Stage 2
          </span>
        </div>

        {/* Skeleton cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-brand-surface rounded-lg border border-brand-border/40 animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
