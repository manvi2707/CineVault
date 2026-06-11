import { Link } from 'react-router-dom';

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className="inline-flex items-baseline gap-0.5 group">
      <span
        className={`font-display font-bold tracking-tight text-brand-textPrimary ${sizes[size]} group-hover:text-brand-accent transition-colors duration-200`}
      >
        Cine
      </span>
      <span
        className={`font-display font-light tracking-widest text-brand-accent ${sizes[size]}`}
      >
        VAULT
      </span>
    </Link>
  );
};

export default Logo;
