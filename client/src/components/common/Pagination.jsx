const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const maxPages = Math.min(totalPages, 500); // TMDB caps at 500
  const pages = [];
  const delta = 2;

  for (let i = Math.max(1, page - delta); i <= Math.min(maxPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center
                   text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-lg border border-brand-border text-sm text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent transition-all duration-200">1</button>
          {pages[0] > 2 && <span className="text-brand-border text-sm px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200 ${
            p === page
              ? 'bg-brand-accent text-brand-bg border-brand-accent'
              : 'border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent'
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < maxPages && (
        <>
          {pages[pages.length - 1] < maxPages - 1 && <span className="text-brand-border text-sm px-1">…</span>}
          <button onClick={() => onPageChange(maxPages)} className="w-9 h-9 rounded-lg border border-brand-border text-sm text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent transition-all duration-200">{maxPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= maxPages}
        className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center
                   text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
