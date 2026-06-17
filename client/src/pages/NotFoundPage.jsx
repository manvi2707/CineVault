import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const NotFoundPage = () => {
  const navigate = useNavigate();
  usePageTitle('Page Not Found');
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" />
      <p className="mt-8 font-display text-8xl font-bold text-brand-border select-none">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-textPrimary">
        This scene doesn't exist
      </h1>
      <p className="mt-3 text-brand-textSecondary max-w-sm">
        The page you're looking for has been cut from the reel.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary mt-8 px-8">
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
