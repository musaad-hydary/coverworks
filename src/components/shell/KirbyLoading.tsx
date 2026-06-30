import { useState, useEffect } from 'react';

export function KirbyLoading({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2000);
    const t2 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`kirby-loading${fading ? ' fade-out' : ''}`}>
      <svg viewBox="0 0 100 100" aria-label="Loading" role="img">

        {/* left eye */}
        <g transform="rotate(-9, 32, 45)">
          <ellipse cx="32" cy="45" rx="13.5" ry="26" fill="#111" />
          <ellipse cx="28.5" cy="35" rx="6.5" ry="13" fill="#fff" />
          <ellipse cx="33.5" cy="64" rx="6" ry="4.5" fill="#2277bb" />
        </g>

        {/* right eye */}
        <g transform="rotate(9, 68, 45)">
          <ellipse cx="68" cy="45" rx="13.5" ry="26" fill="#111" />
          <ellipse cx="71.5" cy="35" rx="6.5" ry="13" fill="#fff" />
          <ellipse cx="66.5" cy="64" rx="6" ry="4.5" fill="#2277bb" />
        </g>

        {/* cheeks */}
        <ellipse cx="14" cy="67" rx="13" ry="8.5" fill="#e04060" opacity="0.85" />
        <ellipse cx="86" cy="67" rx="13" ry="8.5" fill="#e04060" opacity="0.85" />

        {/* smile */}
        <path d="M 41 80 Q 50 89 59 80"
          stroke="#222" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>

      <div className="kirby-bar-wrap">
        <div className="kirby-bar" />
      </div>
    </div>
  );
}
