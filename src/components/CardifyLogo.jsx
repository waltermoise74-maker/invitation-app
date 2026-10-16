import { Link } from 'react-router-dom';

export default function CardifyLogo({ size = 'default', light = false, linkTo = '/' }) {
  const isLarge = size === 'large';
  const iconSize = isLarge ? 36 : 28;

  const content = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}>
      <div
        style={{
          width: `${iconSize + 10}px`,
          height: `${iconSize + 10}px`,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #4c1d95 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          flexShrink: 0
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Symmetrical 8-point floral star motif */}
          <circle cx="12" cy="12" r="3" fill="white" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="m16.24 7.76 2.83-2.83" />
        </svg>
      </div>
      <span
        style={{
          fontSize: isLarge ? '26px' : '22px',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          color: light ? '#0f172a' : '#ffffff',
          fontFamily: 'var(--font-heading)'
        }}
      >
        Cardify
      </span>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
