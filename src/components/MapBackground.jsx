/**
 * Stylized cartoon city map — pure SVG, zero network. Roads, blocks, a park and
 * a river give the map a recognizable "you are here" feel without Mapbox/keys.
 */
export default function MapBackground() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {/* base land */}
      <rect width="100" height="100" fill="#e8f0e6" />

      {/* park */}
      <rect x="6" y="55" width="30" height="28" rx="3" fill="#cfe6c0" />
      <circle cx="14" cy="63" r="2.4" fill="#a9d18e" />
      <circle cx="22" cy="70" r="3" fill="#a9d18e" />
      <circle cx="30" cy="62" r="2" fill="#a9d18e" />

      {/* river */}
      <path d="M0 18 Q 30 28 50 16 T 100 24 L 100 32 Q 70 26 50 36 T 0 28 Z" fill="#bcd6ef" />

      {/* roads (light gray) */}
      <g stroke="#ffffff" strokeWidth="3.2">
        <line x1="0" y1="44" x2="100" y2="44" />
        <line x1="0" y1="74" x2="100" y2="74" />
        <line x1="46" y1="0" x2="46" y2="100" />
        <line x1="78" y1="30" x2="78" y2="100" />
      </g>
      <g stroke="#f4c542" strokeWidth="0.5" strokeDasharray="2 2">
        <line x1="0" y1="44" x2="100" y2="44" />
        <line x1="46" y1="0" x2="46" y2="100" />
      </g>

      {/* building blocks */}
      <g fill="#dfe3ea">
        <rect x="52" y="48" width="20" height="20" rx="1.5" />
        <rect x="84" y="48" width="12" height="20" rx="1.5" />
        <rect x="52" y="80" width="20" height="16" rx="1.5" />
        <rect x="6" y="6" width="30" height="8" rx="1.5" />
      </g>
    </svg>
  )
}
