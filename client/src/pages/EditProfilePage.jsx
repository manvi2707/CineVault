import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Avatar from '../components/common/Avatar.jsx';
import AvatarPicker from '../components/common/AvatarPicker.jsx';
import Spinner from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';

const SectionCard = ({ title, children }) => (
  <div className="card-surface p-6 sm:p-8 mb-6">
    <h3 className="text-xs font-medium text-brand-textSecondary uppercase tracking-wider mb-5">{title}</h3>
    {children}
  </div>
);

const EditProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar ?? 0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const hasProfileChanges = name.trim() !== user?.name || avatar !== user?.avatar;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    try {
      await updateProfile({ name: name.trim(), avatar });
      toast.success('Profile updated');
      setProfileErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current) errs.current = 'Enter your current password.';
    if (!pwForm.next || pwForm.next.length < 6) errs.next = 'New password must be at least 6 characters.';
    if (pwForm.next !== pwForm.confirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwLoading(true);
    try {
      await changePassword(pwForm.current, pwForm.next);
      toast.success('Password changed successfully');
      setPwForm({ current: '', next: '', confirm: '' });
      setPwErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate('/profile')}
            className="text-brand-textSecondary hover:text-brand-textPrimary transition-colors"
            aria-label="Back to profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-1 h-6 bg-brand-accent rounded-full" />
          <h1 className="font-display text-2xl font-bold text-brand-textPrimary">Edit Profile</h1>
        </div>

        {/* Avatar + Name */}
        <form onSubmit={handleProfileSubmit}>
          <SectionCard title="Profile">
            <div className="flex items-center gap-5 mb-6">
              <Avatar user={{ name, avatar }} size="lg" />
              <div className="flex-1">
                <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setProfileErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="Your name"
                  className={`input-field ${profileErrors.name ? 'border-brand-danger' : ''}`}
                />
                {profileErrors.name && <p className="mt-1.5 text-xs text-brand-danger">{profileErrors.name}</p>}
              </div>
            </div>

            <label className="block text-xs font-medium text-brand-textSecondary mb-3 uppercase tracking-wider">
              Avatar Style
            </label>
            <AvatarPicker user={{ name }} selected={avatar} onSelect={setAvatar} />

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-brand-textSecondary">{user?.email}</p>
              <button
                type="submit"
                disabled={profileLoading || !hasProfileChanges}
                className="btn-primary px-6 py-2.5 flex items-center gap-2"
              >
                {profileLoading ? <><Spinner size="sm" /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </SectionCard>
        </form>

        {/* Password section */}
        <form onSubmit={handlePasswordSubmit}>
          <SectionCard title="Change Password">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pwForm.current}
                  onChange={(e) => { setPwForm((f) => ({ ...f, current: e.target.value })); setPwErrors((p) => ({ ...p, current: '' })); }}
                  autoComplete="current-password"
                  className={`input-field ${pwErrors.current ? 'border-brand-danger' : ''}`}
                  placeholder="Enter current password"
                />
                {pwErrors.current && <p className="mt-1.5 text-xs text-brand-danger">{pwErrors.current}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm.next}
                    onChange={(e) => { setPwForm((f) => ({ ...f, next: e.target.value })); setPwErrors((p) => ({ ...p, next: '' })); }}
                    autoComplete="new-password"
                    className={`input-field ${pwErrors.next ? 'border-brand-danger' : ''}`}
                    placeholder="Min. 6 characters"
                  />
                  {pwErrors.next && <p className="mt-1.5 text-xs text-brand-danger">{pwErrors.next}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm.confirm}
                    onChange={(e) => { setPwForm((f) => ({ ...f, confirm: e.target.value })); setPwErrors((p) => ({ ...p, confirm: '' })); }}
                    autoComplete="new-password"
                    className={`input-field ${pwErrors.confirm ? 'border-brand-danger' : ''}`}
                    placeholder="Repeat new password"
                  />
                  {pwErrors.confirm && <p className="mt-1.5 text-xs text-brand-danger">{pwErrors.confirm}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-brand-textSecondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPw}
                    onChange={(e) => setShowPw(e.target.checked)}
                    className="rounded border-brand-border bg-brand-surfaceHover text-brand-accent focus:ring-brand-accent"
                  />
                  Show passwords
                </label>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="btn-primary px-6 py-2.5 flex items-center gap-2"
                >
                  {pwLoading ? <><Spinner size="sm" /> Updating…</> : 'Update Password'}
                </button>
              </div>
            </div>
          </SectionCard>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
