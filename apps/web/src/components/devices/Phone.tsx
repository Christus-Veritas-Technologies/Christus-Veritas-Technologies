import { cropStyle, type Crop } from "@/lib/crop";
import type { Device } from "@/content/site";

const ORANGE = { frame: "linear-gradient(135deg,#FFA261 0%,#EC6418 30%,#FF8A3D 52%,#C9500F 78%,#F27A2E 100%)", btn: "linear-gradient(90deg,#C24C0E,#FFA466 50%,#C24C0E)" };
const PURPLE = { frame: "linear-gradient(135deg,#9A87DE 0%,#5E47AC 30%,#806BCB 52%,#4A3791 78%,#6F5ABE 100%)", btn: "linear-gradient(90deg,#3E2E7E,#9C8AE0 50%,#3E2E7E)" };

type Props = { device: Device; src: string; crop: Crop; width: number; alt?: string; style?: React.CSSProperties; className?: string };

/** iPhone 17 Pro Max (Cosmic Orange) or Galaxy S26 Ultra (purple). Height is width × 2.058. */
export function Phone({ device, src, crop, width, alt = "", style, className }: Props) {
  const u = (n: number) => (n * width) / 100;
  const h = width * 2.058;
  const ip = device === "iphone";
  const f = ip ? ORANGE : PURPLE;
  const R = ip ? 18 : 10, bezel = ip ? 15.6 : 7.8, scr = ip ? 5.2 : 4.4, scrR = ip ? 12.8 : 5.8;
  const abs: React.CSSProperties = { position: "absolute" };
  const btn = (side: "left" | "right", top: string, height: string, w = 2, inset = -1): React.CSSProperties => ({ ...abs, [side]: u(inset), top, width: u(w), height, borderRadius: u(ip ? 1 : 0.6), background: f.btn });
  const antenna = (pos: React.CSSProperties): React.CSSProperties => ({ ...abs, width: u(2.4), height: u(0.8), background: "rgba(0,0,0,.18)", ...pos });
  return (
    <div className={className} style={{ position: "relative", width, height: h, flex: "none", ...style }}>
      <div style={{ ...abs, inset: 0, borderRadius: u(R), boxShadow: `0 ${u(7)}px ${u(16)}px -${u(5)}px rgba(8,24,80,.38), 0 ${u(2)}px ${u(5)}px rgba(10,10,10,.14)` }} />
      {ip ? (<>
        <div style={btn("left", "17.6%", "3.6%")} /><div style={btn("left", "24.2%", "7.4%")} /><div style={btn("left", "33.2%", "7.4%")} />
        <div style={btn("right", "27%", "11%")} /><div style={{ ...btn("right", "55%", "7.2%", 1.6, -0.6), boxShadow: `inset 0 0 0 ${u(0.3)}px rgba(0,0,0,.2)` }} />
      </>) : (<>
        <div style={btn("right", "21%", "12%", 2.2, -1.1)} /><div style={btn("right", "35.5%", "6.4%", 2.2, -1.1)} />
      </>)}
      <div style={{ ...abs, inset: 0, borderRadius: u(R), background: f.frame, boxShadow: `inset 0 0 0 ${u(0.35)}px rgba(255,255,255,.45), inset 0 0 0 ${u(0.8)}px rgba(0,0,0,.08)` }} />
      <div style={antenna({ left: 0, top: ip ? "8.5%" : "6.5%" })} /><div style={antenna({ right: 0, top: ip ? "8.5%" : "6.5%" })} />
      <div style={antenna({ left: 0, bottom: ip ? "8.5%" : "6.5%" })} /><div style={antenna({ right: 0, bottom: ip ? "8.5%" : "6.5%" })} />
      <div style={{ ...abs, inset: u(2.4), borderRadius: u(bezel), background: "#030303", boxShadow: `inset 0 0 0 ${u(0.35)}px #1C1C1E` }} />
      <div style={{ ...abs, inset: u(scr), borderRadius: u(scrR), overflow: "hidden", background: "#FFFFFF" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={cropStyle(crop)} draggable={false} />
        <div style={{ ...abs, inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 34%)", pointerEvents: "none" }} />
      </div>
      {ip ? (
        <div style={{ ...abs, left: "50%", top: u(7.6), width: u(28.4), height: u(8.3), marginLeft: -u(14.2), borderRadius: u(4.15), background: "#000" }}>
          <div style={{ ...abs, right: u(2.3), top: u(2.05), width: u(4.2), height: u(4.2), borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, #3A4A6B 0 10%, #121A2C 32%, #04060B 70%)" }} />
        </div>
      ) : (
        <div style={{ ...abs, left: "50%", top: u(7.4), width: u(4.6), height: u(4.6), marginLeft: -u(2.3), borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, #3A4A6B 0 10%, #121A2C 34%, #000 64%)", boxShadow: `0 0 0 ${u(0.5)}px #000` }} />
      )}
    </div>
  );
}
