import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Avatar from '../components/common/Avatar.jsx';

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-4 border-b border-brand-border/50">
    <span className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider">{label}</span>
    <span className="text-sm text-brand-textPrimary">{value}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();

  const joinDate = user?.createdAt
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(user.createdAt))
    : '—';

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-6 bg-brand-accent rounded-full" />
          <h1 className="font-display text-2xl font-bold text-brand-textPrimary">My Profile</h1>
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
          <InfoRow label="Watchlist" value={`${user?.myList?.length ?? 0} titles`} />
        </div>

        {/* Edit notice */}
        <div className="card-surface p-6 border-brand-accent/20">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            </div>
            <div>
              <p className="text-sm text-brand-textSecondary">
                Profile editing — including avatar selection, name change, and password update — arrives in{' '}
                <span className="text-brand-accent font-medium">Stage 3</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
