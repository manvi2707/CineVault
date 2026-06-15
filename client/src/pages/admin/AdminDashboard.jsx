import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon }) => (
  <div className="card-surface p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider">{label}</span>
      <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
        {icon}
      </div>
    </div>
    <p className="font-display text-3xl font-bold text-brand-textPrimary">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api.get('/admin/stats')
      .then(({ data }) => { if (!cancelled) setStats(data); })
      .catch((err) => toast.error(err.message))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          }
        />
        <StatCard
          label="New This Week"
          value={stats?.newThisWeek ?? 0}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
        />
        <StatCard
          label="Saved Items (All Users)"
          value={stats?.totalSavedItems ?? 0}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
            </svg>
          }
        />
        <StatCard
          label="Featured Items"
          value={stats?.totalFeatured ?? 0}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
            </svg>
          }
        />
      </div>

      {/* Recent users */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-brand-textPrimary">Recent Signups</h2>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-xs text-brand-accent hover:text-brand-accentHover transition-colors"
          >
            View all users →
          </button>
        </div>

        {stats?.recentUsers?.length ? (
          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-4 py-2">
                <Avatar user={u} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-textPrimary truncate">{u.name}</p>
                  <p className="text-xs text-brand-textSecondary truncate">{u.email}</p>
                </div>
                {u.role === 'admin' && (
                  <span className="text-xs text-brand-accent border border-brand-accent/30 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                <span className="text-xs text-brand-textSecondary whitespace-nowrap">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(u.createdAt))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-textSecondary">No users yet.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
