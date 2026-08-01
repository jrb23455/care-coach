export default function CoraRobot({ size = 200, className = '' }) {
  const h = Math.round(size * (290 / 180))
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 180 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000000" floodOpacity="0.09"/>
        </filter>
        <radialGradient id="eye-glow-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="eye-glow-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Antenna pole */}
      <rect x="87" y="10" width="6" height="40" rx="3" fill="#8B6EF5"/>
      {/* Antenna ball */}
      <circle cx="90" cy="10" r="12" fill="#6B4EF3"/>
      <circle cx="90" cy="10" r="8" fill="#9B7EFA"/>
      <circle cx="87" cy="7" r="3" fill="white" opacity="0.5"/>

      {/* Head */}
      <rect x="16" y="46" width="148" height="108" rx="34" fill="white" filter="url(#soft-shadow)"/>

      {/* Face visor */}
      <rect x="30" y="58" width="120" height="82" rx="20" fill="#0E0C45"/>

      {/* Left eye — outer glow */}
      <circle cx="70" cy="92" r="16" fill="url(#eye-glow-l)"/>
      <circle cx="70" cy="92" r="10" fill="#00D4FF" opacity="0.25"/>
      <circle cx="70" cy="92" r="7" fill="#00D4FF"/>
      <circle cx="73" cy="88" r="2.5" fill="white"/>

      {/* Right eye — outer glow */}
      <circle cx="110" cy="92" r="16" fill="url(#eye-glow-r)"/>
      <circle cx="110" cy="92" r="10" fill="#00D4FF" opacity="0.25"/>
      <circle cx="110" cy="92" r="7" fill="#00D4FF"/>
      <circle cx="113" cy="88" r="2.5" fill="white"/>

      {/* Smile */}
      <path d="M 63 116 Q 90 132 117 116" stroke="#00D4FF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Cheek blush */}
      <circle cx="41" cy="100" r="11" fill="#FF9EC4" opacity="0.5"/>
      <circle cx="139" cy="100" r="11" fill="#FF9EC4" opacity="0.5"/>

      {/* Left arm — raised/waving */}
      <g transform="rotate(-42, 20, 176)">
        <rect x="4" y="164" width="28" height="66" rx="14" fill="white" filter="url(#soft-shadow)"/>
      </g>

      {/* Right arm — resting */}
      <rect x="148" y="166" width="28" height="66" rx="14" fill="white" filter="url(#soft-shadow)"/>

      {/* Body */}
      <rect x="14" y="162" width="152" height="106" rx="40" fill="white" filter="url(#soft-shadow)"/>

      {/* Blue heart */}
      <path d="M90 228 C90 228 67 211 67 199 C67 189 74 183 83 183 C87 183 90 187 90 187 C90 187 93 183 97 183 C106 183 113 189 113 199 C113 211 90 228 90 228Z" fill="#3B82F6"/>

      {/* CARE COACH label */}
      <text x="90" y="248" textAnchor="middle" fontSize="8.5" fill="#13105A" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.8">CARE COACH</text>

      {/* Feet */}
      <rect x="40" y="262" width="44" height="22" rx="11" fill="white" filter="url(#soft-shadow)"/>
      <rect x="96" y="262" width="44" height="22" rx="11" fill="white" filter="url(#soft-shadow)"/>
    </svg>
  )
}
