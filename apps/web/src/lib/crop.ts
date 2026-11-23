export type Crop = { x: number; y: number; w: number };
/** Portfolio PNGs are 1080x1350 with a dark phone frame. Returns <img> style that shows only the screen area inside a box of any width. */
export function cropStyle(crop: Crop): React.CSSProperties {
  const sx = crop.x + 2, sy = crop.y + 2, sw = crop.w - 4;
  return { position: "absolute", left: 0, top: 0, display: "block", maxWidth: "none", width: `${(1080 / sw) * 100}%`, marginLeft: `${(-sx / sw) * 100}%`, marginTop: `${(-sy / sw) * 100}%` };
}
