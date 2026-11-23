import { CVTMark } from "./CVTMark";
import { font } from "@/lib/tokens";

/** Mark + wordmark. size = wordmark cap height in px (11 ≈ nav size). */
export function Lockup({ size = 11, layout = "row", light = false, animate = false }: { size?: number; layout?: "row" | "stack"; light?: boolean; animate?: boolean }) {
  const ink = light ? "#DFE0E2" : "#0A0A0A", sub = light ? "#A0A0A0" : "#4A4A4A";
  const words = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: layout === "stack" ? "center" : "flex-start", gap: size * 0.4 }}>
      <span style={{ font: `800 ${size}px/1 ${font.wordmark}`, letterSpacing: ".01em", color: ink, whiteSpace: "nowrap" }}>CHRISTUS VERITAS</span>
      <span style={{ font: `400 ${size * 0.44}px/1 ${font.wordmark}`, letterSpacing: ".42em", marginRight: layout === "stack" ? "-.42em" : 0, color: sub, whiteSpace: "nowrap" }}>TECHNOLOGIES</span>
    </div>
  );
  return layout === "stack" ? (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.9 }}><CVTMark size={size * 6.8} animate={animate} />{words}</div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.55 }}><CVTMark size={size * 3.6} animate={animate} />{words}</div>
  );
}
