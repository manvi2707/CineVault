const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full border-brand-border border-t-brand-accent animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
