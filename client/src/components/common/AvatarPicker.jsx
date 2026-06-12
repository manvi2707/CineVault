import { AVATAR_COLORS } from './Avatar.jsx';

const AvatarPicker = ({ user, selected, onSelect }) => {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="flex flex-wrap gap-3">
      {AVATAR_COLORS.map((color, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(idx)}
          className={`relative w-14 h-14 rounded-full ${color} flex items-center justify-center
                     font-display font-semibold text-brand-textPrimary
                     ring-2 transition-all duration-200
                     ${selected === idx
                       ? 'ring-brand-accent scale-110'
                       : 'ring-brand-border hover:ring-brand-textSecondary hover:scale-105'
                     }`}
          aria-label={`Select avatar style ${idx + 1}`}
        >
          {initials}
          {selected === idx && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-accent rounded-full
                             flex items-center justify-center ring-2 ring-brand-surface">
              <svg className="w-3 h-3 text-brand-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default AvatarPicker;
