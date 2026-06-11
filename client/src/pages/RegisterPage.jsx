import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import Spinner from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      toast.success('Welcome to CineVault!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen film-grain relative flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-brand-bg">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"
          style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(200,169,110,0.08) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="card-surface p-8 sm:p-10 shadow-2xl shadow-black/60">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="mt-3 text-brand-textSecondary text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                className={`input-field ${errors.name ? 'border-brand-danger' : ''}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-brand-danger">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`input-field ${errors.email ? 'border-brand-danger' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-brand-danger">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`input-field pr-12 ${errors.password ? 'border-brand-danger' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textSecondary hover:text-brand-accent transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-brand-danger">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-brand-textSecondary mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                autoComplete="new-password"
                className={`input-field ${errors.confirm ? 'border-brand-danger' : ''}`}
              />
              {errors.confirm && <p className="mt-1.5 text-xs text-brand-danger">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-brand-surface px-3 text-brand-textSecondary">Already have an account?</span>
            </div>
          </div>

          <Link to="/login" className="block text-center text-sm text-brand-accent hover:text-brand-accentHover font-medium transition-colors">
            Sign in instead →
          </Link>
        </div>

        <p className="text-center text-xs text-brand-textSecondary mt-6">
          By creating an account you agree to our{' '}
          <span className="text-brand-accent cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
