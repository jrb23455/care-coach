export default function CoraRobot({ size = 200, className = '' }) {
  const h = Math.round(size * (320 / 200))
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2A1B8A" floodOpacity="0.18"/>
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EAE7FF"/>
        </linearGradient>
        <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F0EEFF"/>
        </linearGradient>
        <radialGradient id="eyeL" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7FF4FF"/>
          <stop offset="100%" stopColor="#00B8CC"/>
        </radialGradient>
        <radialGradient id="eyeR" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7FF4FF"/>
          <stop offset="100%" stopColor="#00B8CC"/>
        </radialGradient>
        <linearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1560"/>
          <stop offset="100%" stopColor="#0A082E"/>
        </linearGradient>
        <linearGradient id="antGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B7EFA"/>
          <stop offset="100%" stopColor="#6B4EF3"/>
        </linearGradient>
      </defs>

      {/* ── Antenna ── */}
      <rect x="97" y="4" width="6" height="36" rx="3" fill="url(#antGrad)"/>
      {/* antenna orb */}
      <circle cx="100" cy="4" r="14" fill="#6B4EF3" filter="url(#drop)"/>
      <circle cx="100" cy="4" r="10" fill="#9B7EFA"/>
      <circle cx="96" cy="0" r="4" fill="white" opacity="0.45"/>
      {/* LED blink rings */}
      <circle cx="100" cy="4" r="17" stroke="#6B4EF3" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>

      {/* ── Head ── */}
      <rect x="22" y="36" width="156" height="112" rx="32" fill="url(#headGrad)" filter="url(#drop)"/>
      {/* panel seam lines */}
      <line x1="22" y1="70" x2="178" y2="70" stroke="#E0DAFF" strokeWidth="1"/>
      {/* corner bolts */}
      <circle cx="34" cy="48" r="3.5" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>
      <circle cx="166" cy="48" r="3.5" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>
      <circle cx="34" cy="136" r="3.5" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>
      <circle cx="166" cy="136" r="3.5" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>

      {/* Ear ports */}
      <rect x="14" y="72" width="12" height="36" rx="6" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1.5"/>
      <rect x="174" y="72" width="12" height="36" rx="6" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1.5"/>
      <circle cx="20" cy="90" r="4" fill="#6B4EF3"/>

      {/* Visor */}
      <rect x="38" y="52" width="124" height="80" rx="18" fill="url(#visorGrad)"/>
      {/* visor glare */}
      <rect x="44" y="56" width="50" height="4" rx="2" fill="white" opacity="0.07"/>

      {/* Left eye */}
      <circle cx="74" cy="88" r="20" fill="#0D0B3E" opacity="0.8"/>
      <circle cx="74" cy="88" r="14" fill="url(#eyeL)" filter="url(#glow)"/>
      <circle cx="74" cy="88" r="8" fill="#7FF4FF"/>
      <circle cx="74" cy="88" r="4" fill="#003844"/>
      <circle cx="78" cy="83" r="3" fill="white" opacity="0.8"/>
      {/* eye ring */}
      <circle cx="74" cy="88" r="17" stroke="#00D4FF" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>

      {/* Right eye */}
      <circle cx="126" cy="88" r="20" fill="#0D0B3E" opacity="0.8"/>
      <circle cx="126" cy="88" r="14" fill="url(#eyeR)" filter="url(#glow)"/>
      <circle cx="126" cy="88" r="8" fill="#7FF4FF"/>
      <circle cx="126" cy="88" r="4" fill="#003844"/>
      <circle cx="130" cy="83" r="3" fill="white" opacity="0.8"/>
      <circle cx="126" cy="88" r="17" stroke="#00D4FF" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>

      {/* Mouth — segmented display */}
      <rect x="62" y="116" width="76" height="10" rx="5" fill="#001A1F"/>
      <rect x="65" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.9"/>
      <rect x="76" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.6"/>
      <rect x="87" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.9"/>
      <rect x="98" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.4"/>
      <rect x="109" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.8"/>
      <rect x="120" y="118" width="8" height="6" rx="2" fill="#00D4FF" opacity="0.6"/>

      {/* Cheek blush LEDs */}
      <circle cx="46" cy="100" r="8" fill="#FF6BB5" opacity="0.35"/>
      <circle cx="154" cy="100" r="8" fill="#FF6BB5" opacity="0.35"/>

      {/* ── Neck ── */}
      <rect x="85" y="148" width="30" height="20" rx="6" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1"/>
      <line x1="91" y1="148" x2="91" y2="168" stroke="#C0B8F0" strokeWidth="1"/>
      <line x1="100" y1="148" x2="100" y2="168" stroke="#C0B8F0" strokeWidth="1"/>
      <line x1="109" y1="148" x2="109" y2="168" stroke="#C0B8F0" strokeWidth="1"/>

      {/* ── Body ── */}
      <rect x="20" y="165" width="160" height="110" rx="36" fill="url(#bodyGrad)" filter="url(#drop)"/>
      {/* body panel lines */}
      <line x1="20" y1="200" x2="180" y2="200" stroke="#E8E4FF" strokeWidth="1"/>
      <line x1="100" y1="200" x2="100" y2="265" stroke="#E8E4FF" strokeWidth="1"/>
      {/* body bolts */}
      <circle cx="36" cy="178" r="3" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>
      <circle cx="164" cy="178" r="3" fill="#D5CFFF" stroke="#B8AFFF" strokeWidth="1"/>

      {/* Chest display — heart + CARE COACH */}
      <rect x="60" y="208" width="80" height="56" rx="12" fill="#F0EEFF" stroke="#D0C8FF" strokeWidth="1.5"/>
      {/* heart */}
      <path d="M100 248 C100 248 80 232 80 220 C80 212 86 207 93 207 C96.5 207 100 211 100 211 C100 211 103.5 207 107 207 C114 207 120 212 120 220 C120 232 100 248 100 248Z" fill="#6B4EF3"/>
      <text x="100" y="260" textAnchor="middle" fontSize="7" fill="#6B4EF3" fontFamily="system-ui,sans-serif" fontWeight="800" letterSpacing="1">CARE COACH</text>

      {/* Shoulder indicator lights */}
      <circle cx="28" cy="195" r="5" fill="#6B4EF3" opacity="0.7"/>
      <circle cx="172" cy="195" r="5" fill="#6B4EF3" opacity="0.7"/>

      {/* ── Left Arm ── */}
      <rect x="6" y="172" width="20" height="72" rx="10" fill="url(#bodyGrad)" filter="url(#drop)" transform="rotate(-15, 16, 208)"/>
      {/* shoulder joint */}
      <circle cx="22" cy="178" r="8" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5"/>
      {/* elbow joint */}
      <circle cx="14" cy="218" r="6" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5" transform="rotate(-15, 14, 218)"/>
      {/* left hand */}
      <rect x="3" y="228" width="18" height="14" rx="7" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5" transform="rotate(-15, 12, 235)"/>

      {/* ── Right Arm ── */}
      <rect x="174" y="172" width="20" height="72" rx="10" fill="url(#bodyGrad)" filter="url(#drop)"/>
      <circle cx="178" cy="178" r="8" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5"/>
      <circle cx="184" cy="218" r="6" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5"/>
      {/* right hand */}
      <rect x="179" y="230" width="18" height="14" rx="7" fill="#E0DAFF" stroke="#C9C0FF" strokeWidth="1.5"/>

      {/* ── Feet ── */}
      <rect x="46" y="273" width="48" height="26" rx="13" fill="url(#bodyGrad)" filter="url(#drop)"/>
      <rect x="106" y="273" width="48" height="26" rx="13" fill="url(#bodyGrad)" filter="url(#drop)"/>
      {/* foot detail */}
      <rect x="52" y="280" width="36" height="4" rx="2" fill="#D5CFFF"/>
      <rect x="112" y="280" width="36" height="4" rx="2" fill="#D5CFFF"/>
    </svg>
  )
}
