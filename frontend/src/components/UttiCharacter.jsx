export default function UttiCharacter({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="120"
      height="120"
      aria-hidden
    >
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="rgba(26, 39, 146, 0.12)" />
      <circle cx="60" cy="62" r="44" fill="#ffffff" stroke="#dce3f7" strokeWidth="2" />
      <circle cx="60" cy="62" r="38" fill="#f8faff" />
      <ellipse cx="44" cy="54" rx="8" ry="10" fill="#ffffff" opacity="0.85" />
      <ellipse cx="76" cy="54" rx="8" ry="10" fill="#ffffff" opacity="0.85" />
      <circle cx="48" cy="52" r="5" fill="#1a2792" />
      <circle cx="72" cy="52" r="5" fill="#1a2792" />
      <circle cx="49" cy="50" r="1.8" fill="#ffffff" />
      <circle cx="73" cy="50" r="1.8" fill="#ffffff" />
      <path
        d="M 48 74 Q 60 82 72 74"
        fill="none"
        stroke="#1a2792"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="34" cy="68" rx="10" ry="7" fill="#f0f4ff" stroke="#dce3f7" strokeWidth="1.5" />
      <ellipse cx="86" cy="68" rx="10" ry="7" fill="#f0f4ff" stroke="#dce3f7" strokeWidth="1.5" />
    </svg>
  );
}
