import { AlertCircleIcon } from "@/components/icons";

interface DangerCalloutProps {
  children: React.ReactNode;
}

export function DangerCallout({ children }: DangerCalloutProps) {
  return (
    <div
      className="flex gap-4 rounded-sm p-5"
      style={{
        background: "rgba(224, 92, 58, 0.06)",
        borderLeft: "3px solid var(--danger)",
      }}
    >
      <AlertCircleIcon
        size={24}
        className="shrink-0 mt-0.5"
        style={{ color: "var(--danger)" }}
      />
      <p className="text-base leading-relaxed m-0" style={{ color: "var(--text-primary)" }}>
        {children}
      </p>
    </div>
  );
}
