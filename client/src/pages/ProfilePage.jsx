import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useMyList } from '../context/MyListContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Avatar from '../components/common/Avatar.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-4 border-b border-brand-border/50 last:border-b-0">
    <span className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider">{label}</span>
    <span className="text-sm text-brand-textPrimary">{value}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const { list } = useMyList();
  usePageTitle('My Profile');
  const navigate = useNavigate();

  const joinDate = user?.createdAt
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(user.createdAt))
    : '—';

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-brand-accent rounded-full" />
            <h1 className="font-display text-2xl font-bold text-brand-textPrimary">My Profile</h1>
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border
                       text-sm text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                       transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Avatar section */}
        <div className="card-surface p-8 mb-6">
          <div className="flex items-center gap-6">
            <Avatar user={user} size="lg" />
            <div>
              <h2 className="font-display text-xl font-semibold text-brand-textPrimary">{user?.name}</h2>
              <p className="text-brand-textSecondary text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 text-xs text-brand-accent border border-brand-accent/30 px-2.5 py-0.5 rounded-full">
                Member
              </span>
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="card-surface p-6 mb-6">
          <h3 className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider mb-2">Account Details</h3>
          <InfoRow label="Name" value={user?.name} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Member since" value={joinDate} />
        </div>

        {/* My List preview */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider">My List</h3>
            <button
              onClick={() => navigate('/my-list')}
              className="text-xs text-brand-accent hover:text-brand-accentHover transition-colors"
            >
              View all →
            </button>
          </div>
          <p className="text-sm text-brand-textPrimary mt-2">
            {list.length} title{list.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
