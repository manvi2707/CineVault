const AVATAR_COLORS = [
  'bg-indigo-800',
  'bg-purple-800',
  'bg-teal-800',
  'bg-rose-800',
  'bg-amber-800',
  'bg-cyan-800',
];

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const colorClass = AVATAR_COLORS[user?.avatar ?? 0];

  return (
    <div
      className={`
        ${sizes[size]} ${colorClass} ${className}
        rounded-full flex items-center justify-center
        font-display font-semibold text-brand-textPrimary
        ring-2 ring-brand-border hover:ring-brand-accent
        transition-all duration-200 cursor-pointer select-none
      `}
      aria-label={`Avatar for ${user?.name}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
