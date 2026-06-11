export const IMG_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const thumbUrl = (path) => posterUrl(path, 'w185');

export const formatRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatMoney = (n) =>
  n ? `$${(n / 1_000_000).toFixed(1)}M` : 'N/A';

export const ratingColor = (r) => {
  if (r >= 7.5) return 'text-emerald-400';
  if (r >= 6) return 'text-brand-accent';
  return 'text-brand-textSecondary';
};
