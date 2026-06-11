import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../common/Logo.jsx';
import Avatar from '../common/Avatar.jsx';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/series', label: 'Series' },
  { to: '/genres', label: 'Genres' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out');
      navigate('/login');
    } catch {
      toast.error('Could not sign out');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            <button
              className="text-brand-textSecondary hover:text-brand-accent transition-colors duration-150 p-1"
              aria-label="Search"
              onClick={() => navigate('/search')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
              </svg>
            </button>

            {/* Avatar + dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen((o) => !o)} aria-label="User menu">
                  <Avatar user={user} size="sm" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 card-surface shadow-xl shadow-black/40 py-1 animate-fade-in">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-sm font-semibold text-brand-textPrimary truncate">{user.name}</p>
                      <p className="text-xs text-brand-textSecondary truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surfaceHover transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      My Profile
                    </Link>

                    <Link
                      to="/my-list"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surfaceHover transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
                      </svg>
                      My List
                    </Link>

                    <div className="border-t border-brand-border mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-danger hover:bg-brand-surfaceHover transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-brand-textSecondary hover:text-brand-textPrimary p-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-border/40 pb-4 pt-3 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-accent bg-brand-surfaceHover'
                      : 'text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surfaceHover'
                  }`
                }
                onClick={() => setMobileOpen(false)}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
