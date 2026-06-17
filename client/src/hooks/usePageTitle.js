import { useEffect } from 'react';

const SITE_NAME = 'CineVault';
const DEFAULT_DESCRIPTION = 'CineVault — a curated streaming experience. Discover, save, and explore thousands of films and series.';

/**
 * Sets document.title and the meta description tag.
 * @param {string} [title] - Page-specific title. Omit for the site default.
 * @param {string} [description] - Page-specific meta description.
 */
const usePageTitle = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Stream Smarter`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description || DEFAULT_DESCRIPTION);
  }, [title, description]);
};

export default usePageTitle;
