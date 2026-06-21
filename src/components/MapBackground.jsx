/**
 * Stylized Amsterdam-Zuid map — pure SVG, zero network. Light base, soft green
 * blocks, light-blue canals and thin white roads, echoing the design mockup.
 */
export default function MapBackground() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
      {/* base */}
      <rect width="100" height="140" fill="#eef1f4" />

      {/* green blocks */}
      <g fill="#d8e8cf">
        <rect x="2" y="20" width="22" height="18" rx="2" />
        <rect x="62" y="14" width="34" height="16" rx="2" />
        <rect x="6" y="92" width="30" height="22" rx="2" />
        <rect x="70" y="96" width="26" height="26" rx="2" />
        <rect x="40" y="118" width="26" height="20" rx="2" />
      </g>

      {/* canals (light blue) */}
      <g stroke="#bcd6ef" strokeWidth="2.6" fill="none" opacity="0.9">
        <path d="M-2 40 Q 30 46 55 40 T 102 44" />
        <path d="M-2 108 Q 24 100 52 106 T 102 100" />
        <line x1="14" y1="0" x2="20" y2="140" />
        <line x1="88" y1="0" x2="82" y2="140" />
      </g>

      {/* big diagonal rail/road band through the middle */}
      <g stroke="#cfd6e0" strokeWidth="2.4">
        <line x1="-2" y1="70" x2="102" y2="64" />
        <line x1="-2" y1="74" x2="102" y2="68" />
      </g>

      {/* white roads */}
      <g stroke="#ffffff" strokeWidth="2.2">
        <line x1="0" y1="56" x2="100" y2="52" />
        <line x1="0" y1="88" x2="100" y2="86" />
        <line x1="34" y1="0" x2="38" y2="140" />
        <line x1="64" y1="0" x2="62" y2="140" />
      </g>

      {/* label */}
      <text x="50" y="34" textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#9aa5b1" letterSpacing="0.5">
        AMSTERDAM ZUID
      </text>
      <text x="44" y="44" textAnchor="middle" fontSize="2.6" fill="#9db8d6" fontStyle="italic">Amstelkanaal</text>
    </svg>
  )
}
