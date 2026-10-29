// 제주 마스코트 '귤이' (SVG)
export default function Mandarin({ size = 120, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="귤이">
      <defs>
        <radialGradient id="mg" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffd36b" />
          <stop offset="0.55" stopColor="#ff9a14" />
          <stop offset="1" stopColor="#e06a00" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,.12)" />
      <circle cx="60" cy="66" r="44" fill="url(#mg)" />
      <rect x="57" y="17" width="6" height="12" rx="3" fill="#5b7a2a" />
      <ellipse cx="76" cy="20" rx="17" ry="8" fill="#3fae33" transform="rotate(-18 76 20)" />
      <ellipse cx="45" cy="63" rx="7" ry="9" fill="#fff" />
      <ellipse cx="75" cy="63" rx="7" ry="9" fill="#fff" />
      <circle cx="46" cy="65" r="4" fill="#222" />
      <circle cx="76" cy="65" r="4" fill="#222" />
      <circle cx="47.5" cy="63" r="1.4" fill="#fff" />
      <circle cx="77.5" cy="63" r="1.4" fill="#fff" />
      <ellipse cx="33" cy="80" rx="7" ry="4.5" fill="#ff6f86" opacity=".7" />
      <ellipse cx="87" cy="80" rx="7" ry="4.5" fill="#ff6f86" opacity=".7" />
      <path d="M49 82 Q60 94 71 82" fill="none" stroke="#7a2a00" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
