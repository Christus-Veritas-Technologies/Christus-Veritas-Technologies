import Link from "next/link";

export function CvtLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 no-underline select-none">
      {/* Double-chevron mark */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 22L16 12L26 22"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 15L16 5L26 15"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className="text-base tracking-wide"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--text-primary)" }}
        >
          HOSTS
        </span>
        <span
          className="text-[9px] tracking-[0.14em]"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 400, color: "var(--text-secondary)" }}
        >
          BY CHRISTUS VERITAS TECHNOLOGIES
        </span>
      </div>
    </Link>
  );
}
