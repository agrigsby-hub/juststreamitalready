export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill="#1a0a00" />

      {/* Film reel outer ring */}
      <circle cx="32" cy="32" r="28" stroke="#c8952a" strokeWidth="2.5" fill="none" />

      {/* Film sprocket holes around the ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 32 + 22 * Math.cos(rad);
        const y = 32 + 22 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#c8952a" />;
      })}

      {/* Inner circle */}
      <circle cx="32" cy="32" r="14" fill="#c8952a" opacity="0.15" stroke="#c8952a" strokeWidth="1.5" />

      {/* Play button triangle */}
      <path
        d="M27 24.5 L27 39.5 L42 32 Z"
        fill="#c8952a"
      />
    </svg>
  );
}
