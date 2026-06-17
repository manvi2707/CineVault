import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// A subtle gold progress bar that animates briefly on every route change,
// giving the app a "snappy" perceived-performance feel.
const RouteProgressBar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    // Clear any pending timers from a previous transition
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setWidth(0);

    // Animate to ~70% quickly, then finish to 100% shortly after
    timers.current.push(setTimeout(() => setWidth(70), 50));
    timers.current.push(setTimeout(() => setWidth(100), 250));
    timers.current.push(setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 450));

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-brand-accent transition-all ease-out"
        style={{
          width: `${width}%`,
          opacity: visible ? 1 : 0,
          transitionDuration: visible ? '300ms' : '150ms',
          boxShadow: visible ? '0 0 8px rgba(200,169,110,0.6)' : 'none',
        }}
      />
    </div>
  );
};

export default RouteProgressBar;
