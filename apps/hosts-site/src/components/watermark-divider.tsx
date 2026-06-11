export function WatermarkDivider() {
  return (
    <div className="flex justify-center py-16 pointer-events-none select-none" aria-hidden="true">
      <svg
        width="320"
        height="120"
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.04 }}
      >
        <path
          d="M20 100L160 30L300 100"
          stroke="var(--text-primary)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 68L160 0L300 68"
          stroke="var(--text-primary)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
