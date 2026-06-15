import { NavLink } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/featured', label: 'Featured Content' },
];

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 bg-brand-accent rounded-full" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-textPrimary">Admin Panel</h1>
        </div>
        <p className="text-sm text-brand-textSecondary mb-8 ml-4">
          Manage users and curate featured homepage content.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-border/50 pb-px">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `px-5 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'text-brand-accent border-brand-accent'
                    : 'text-brand-textSecondary border-transparent hover:text-brand-textPrimary'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
