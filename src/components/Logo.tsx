export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Background rounded square — app icon shape */}
      <rect width="64" height="64" rx="16" fill="url(#grad)" />

      {/* Play triangle */}
      <path d="M22 18 L22 46 L48 32 Z" fill="white" />

      {/* Small speed lines */}
      <rect x="10" y="20" width="7" height="3" rx="1.5" fill="white" opacity="0.4" />
      <rect x="8" y="29" width="9" height="3" rx="1.5" fill="white" opacity="0.6" />
      <rect x="10" y="38" width="7" height="3" rx="1.5" fill="white" opacity="0.4" />
    </svg>
  );
}
