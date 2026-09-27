"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const options = {
  pot: [
    { name: "Cobalt ceramic", main: "#365caa", light: "#8fc6ed" },
    { name: "Mulberry", main: "#8b416e", light: "#dfa2c3" },
    { name: "Porcelain", main: "#e5edf0", light: "#ffffff" },
    { name: "Lagoon", main: "#236b79", light: "#84d4cd" },
  ],
  plant: [
    { name: "Emerald", main: "#276349", light: "#408c66" },
    { name: "Blue spruce", main: "#285b67", light: "#559b9e" },
    { name: "Plum leaves", main: "#6b416f", light: "#a975a7" },
    { name: "Forest", main: "#344e38", light: "#649157" },
  ],
  cat: [
    { name: "Lilac cat", main: "#8074be", light: "#28253f" },
    { name: "Tuxedo cat", main: "#354655", light: "#f2f1e7" },
    { name: "Snow cat", main: "#e8eff5", light: "#344456" },
    { name: "Blue cat", main: "#538ead", light: "#182f45" },
  ],
  cabinet: [
    { name: "Harbour blue", main: "#367482", light: "#89c6ce" },
    { name: "Berry cabinet", main: "#81516f", light: "#c79bb5" },
    { name: "Indigo cabinet", main: "#515782", light: "#a0add4" },
    { name: "Pine cabinet", main: "#436b5f", light: "#9cc6ac" },
  ],
};
export type RoomColors = Record<keyof typeof options, number>;
export const initialColors: RoomColors = { pot: 0, plant: 0, cat: 0, cabinet: 0 };
export function roomColorStyle(colors: RoomColors): CSSProperties {
  return Object.fromEntries(Object.entries(colors).flatMap(([key, value]) => {
    const color = options[key as keyof RoomColors][value];
    return [[`--${key}-color`, color.main], [`--${key}-light`, color.light]];
  })) as CSSProperties;
}

function ColorReel({ name, label, value, onChange }: { name: keyof RoomColors; label: string; value: number; onChange: (value: number) => void }) {
  const reel = useRef<HTMLDivElement>(null);
  const items = options[name];
  const change = (next: number) => {
    const bounded = Math.max(0, Math.min(items.length - 1, next));
    onChange(bounded);
    reel.current?.scrollTo({ left: bounded * reel.current.clientWidth, behavior: "instant" });
  };
  useEffect(() => {
    const element = reel.current;
    if (!element) return;
    const resize = new ResizeObserver(() => { element.scrollLeft = value * element.clientWidth; });
    resize.observe(element);
    return () => resize.disconnect();
  }, [value]);
  useEffect(() => {
    const element = reel.current;
    if (!element) return;
    // Only a focused reel consumes the wheel; normal room scrolling stays native.
    let lastWheel = 0;
    const wheel = (event: WheelEvent) => {
      if (document.activeElement !== element || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const next = Math.max(0, Math.min(items.length - 1, value + Math.sign(event.deltaY)));
      if (next === value) return;
      event.preventDefault();
      if (performance.now() - lastWheel < 160) return;
      lastWheel = performance.now();
      element.scrollTo({ left: next * element.clientWidth, behavior: "instant" });
      onChange(next);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [items.length, onChange, value]);
  return <div className="room-color-control">
    <label id={`color-${name}`}>{label}</label>
    <div className="room-color-row">
      <button aria-label={`Previous ${label.toLowerCase()} color`} disabled={value === 0} onClick={() => change(value - 1)}>‹</button>
      <div ref={reel} className="room-color-reel" tabIndex={0} role="slider" aria-labelledby={`color-${name}`} aria-valuemin={0} aria-valuemax={items.length - 1} aria-valuenow={value} aria-valuetext={items[value].name}
        onScroll={event => { const el = event.currentTarget; const next = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); if (next !== value && next >= 0 && next < items.length) onChange(next); }}
        onKeyDown={event => { const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : ["ArrowRight", "ArrowUp"].includes(event.key) ? value + 1 : ["ArrowLeft", "ArrowDown"].includes(event.key) ? value - 1 : null; if (next !== null) { event.preventDefault(); change(next); } }}>
        {items.map(item => <span className="room-color-option" key={item.name} aria-hidden="true"><i style={{ background: item.main, borderColor: item.light }}/><span>{item.name}</span></span>)}
      </div>
      <button aria-label={`Next ${label.toLowerCase()} color`} disabled={value === items.length - 1} onClick={() => change(value + 1)}>›</button>
    </div>
  </div>;
}

export default function RoomPalette({ colors, onChange }: { colors: RoomColors; onChange: (colors: RoomColors) => void }) {
  return <details className="room-palette"><summary>Make it yours <span>Change the room’s colors</span></summary>
    <p>Swipe a color, use the arrows, or focus a swatch and scroll. The room changes as you choose.</p>
    <div className="room-color-grid">{([["pot", "Plant pot"], ["plant", "Leaves"], ["cat", "Cat"], ["cabinet", "Game Boy desk"]] as const).map(([name, label]) => <ColorReel key={name} name={name} label={label} value={colors[name]} onChange={value => onChange({ ...colors, [name]: value })}/>)}</div>
  </details>;
}
