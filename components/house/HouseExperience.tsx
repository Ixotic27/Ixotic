"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HouseAction, PanelId, RoomId } from "./types";
import "./house.css";

const HouseScene = dynamic(() => import("./HouseScene"), { ssr: false });
const DevicePanels = dynamic(() => import("./DevicePanels"), { ssr: false });
const TableTennis = dynamic(() => import("./TableTennis"), { ssr: false });

const rooms: { id: RoomId; name: string; title: string; description: string; action?: HouseAction; button?: string }[] = [
  { id: "overview", name: "The house", title: "Make yourself at home.", description: "A house full of work, curiosities, and little things that make me, me." },
  { id: "study", name: "The study", title: "Where ideas become things.", description: "A familiar desktop. A few things I’ve built. A handheld for the occasional distraction.", action: "imac", button: "Wake up the iMac" },
  { id: "library", name: "The library", title: "A little room to think.", description: "Project journals, notes, and a very comfortable cat. Pick a book and settle in.", action: "books", button: "Browse the bookshelf" },
  { id: "kitchen", name: "The kitchen", title: "First, a coffee.", description: "A quiet break between ideas. There’s always time for another cup.", action: "coffee", button: "Make a coffee" },
  { id: "sports", name: "The games room", title: "Your serve.", description: "I love a good game of table tennis. Grab a paddle and challenge my avatar.", action: "tennis", button: "Play a match" },
];

function HouseGlyph() {
  return <svg width="23" height="25" viewBox="0 0 24 26" aria-hidden="true" shapeRendering="crispEdges"><path d="M0 10h4V6h4V2h8v4h4v4h4v4h-3v12H3V14H0z" fill="currentColor"/><path d="M10 17h5v9h-5zM5 15h3v4H5zm12 0h3v4h-3z" fill="var(--house-paper)"/></svg>;
}

function MapView({ active, onChoose }: { active: number; onChoose: (index: number) => void }) {
  return <div className="house-map" aria-label="House floor plan"><span className="house-map-porch" aria-hidden="true"/><div>{rooms.slice(1).map((room, i) => <button key={room.id} className={active === i + 1 ? "is-active" : ""} aria-label={`Visit ${room.name.toLowerCase()}`} aria-current={active === i + 1 ? "location" : undefined} onClick={() => onChoose(i + 1)}><span>{["S", "L", "K", "G"][i]}</span></button>)}</div></div>;
}

export default function HouseExperience() {
  const [progress, setProgress] = useState(0);
  const [night, setNight] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [panel, setPanel] = useState<PanelId>(null);
  const [initialApp, setInitialApp] = useState<"Work" | "About" | "Contact" | undefined>();
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lampOn, setLampOn] = useState(true);
  const [watered, setWatered] = useState(false);
  const [coffeeTrigger, setCoffeeTrigger] = useState(0);
  const [status, setStatus] = useState("");
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousRoom = useRef(-1);
  const active = Math.max(0, Math.min(4, Math.round(progress)));
  const room = rooms[active];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const jump = useCallback((index: number, instant = false) => {
    const range = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    window.scrollTo({ top: range * index / 4, behavior: instant || reducedMotion ? "instant" : "smooth" });
    window.history.replaceState(null, "", `#${rooms[index].id}`);
  }, [reducedMotion]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        setProgress(Math.max(0, Math.min(4, window.scrollY / range * 4)));
      });
    };
    const followHash = () => {
      const hash = window.location.hash.slice(1);
      const aliases: Record<string, number> = { work: 1, about: 1, contact: 1, capabilities: 2 };
      const index = rooms.findIndex(item => item.id === hash);
      if (index >= 0) jump(index, true);
      else if (hash in aliases) { setInitialApp(hash === "about" ? "About" : hash === "contact" ? "Contact" : "Work"); jump(aliases[hash], true); setPanel(hash === "capabilities" ? "books" : "imac"); }
    };
    followHash(); update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", followHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.removeEventListener("hashchange", followHash); };
  }, [jump]);

  useEffect(() => {
    if (active === 3 && previousRoom.current !== 3 && !reducedMotion) setCoffeeTrigger(value => value + 1);
    previousRoom.current = active;
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!panel) return;
    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = saved; };
  }, [panel]);

  useEffect(() => () => { if (statusTimer.current) clearTimeout(statusTimer.current); }, []);

  const announce = useCallback((message: string) => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setStatus(message);
    statusTimer.current = setTimeout(() => setStatus(""), 6000);
  }, []);

  const act = useCallback((action: HouseAction) => {
    if (action === "imac" || action === "gameboy" || action === "books" || action === "tennis") { setInitialApp(undefined); setPanel(action); }
    else if (action === "coffee") { setCoffeeTrigger(value => value + 1); announce("One small coffee break. Watch the kitchen counter."); }
    else if (action === "lamp") { setLampOn(value => !value); announce("A change of light."); }
    else if (action === "cat") announce("Prrrr. You have been approved by the cat.");
    else if (action === "plant") { setWatered(true); announce("A little water. A little happiness."); }
  }, [announce]);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setLite(true); }, []);
  const closePanel = useCallback(() => setPanel(null), []);

  return <main className={`house-page ${night ? "house-is-night" : ""}`}>
    <a className="house-skip" href="#house-access">Skip to room controls</a>
    <header className="house-header"><button className="house-brand" onClick={() => jump(0)} aria-label="Return to the house overview"><HouseGlyph/><span>ixotic<span className="house-brand-secondary"> / at home</span></span></button><p>Open doors. Curious mind.</p><div><button onClick={() => setLite(value => !value)} className="house-view-button" aria-pressed={lite}>{lite ? "3D view" : "Simple view"}</button><button className="house-day-button" onClick={() => setNight(value => !value)} aria-label={night ? "Switch to daytime" : "Switch to nighttime"}><span aria-hidden="true">{night ? "☾" : "☼"}</span><span>{night ? "Evening" : "Daylight"}</span></button></div></header>

    <div className="house-stage" aria-label="Interactive three-dimensional pixel-art house">
      {!lite && <HouseScene progress={reducedMotion ? active : progress} night={night} reducedMotion={reducedMotion} paused={panel !== null} coffeeTrigger={coffeeTrigger} lampOn={lampOn} watered={watered} onAction={act} onReady={onReady} onError={onError}/>}
      {lite && <div className="house-lite"><div className="house-lite-roof" aria-hidden="true"/><div className="house-lite-rooms">{rooms.slice(1).map((item, i) => <button key={item.id} onClick={() => { jump(i + 1); if (item.action) act(item.action); }}><span aria-hidden="true">{["▣", "▤", "♨", "◒"][i]}</span><strong>{item.name}</strong><small>{item.button}</small></button>)}</div><p>{failed ? "The 3D view couldn’t load. Every room is still here to explore." : "A lighter way around the house."}</p></div>}
      {!ready && !lite && <div className="house-loading" role="status"><HouseGlyph/><span>Opening the front door…</span></div>}
    </div>

    <nav className="house-room-nav" aria-label="Rooms">{rooms.map((item, i) => <button key={item.id} onClick={() => jump(i)} aria-current={active === i ? "location" : undefined} className={active === i ? "is-current" : ""}><span className="house-nav-dot"/><span>{item.name}</span></button>)}</nav>

    <div className="house-room-caption" id="house-access" tabIndex={-1}><span className="house-room-count">{String(active).padStart(2, "0")} / 04</span><h1>{room.title}</h1><p>{room.description}</p><div className="house-room-actions">{room.action ? <button className="house-primary" onClick={() => act(room.action!)}>{room.button}<span aria-hidden="true">↗</span></button> : <button className="house-primary" onClick={() => jump(1)}>Come on in<span aria-hidden="true">↗</span></button>}{active === 1 && <button className="house-secondary" onClick={() => act("gameboy")}>Pick up the Game Boy</button>}{active === 2 && <button className="house-secondary" onClick={() => act("cat")}>Say hello to the cat</button>}{active === 3 && <button className="house-secondary" onClick={() => act("plant")}>Water the plant</button>}</div></div>

    <div className="house-bottom-bar"><span className="house-scroll-hint"><span aria-hidden="true">↓</span> Scroll to explore the house</span><span className="house-status" role="status">{status}</span><MapView active={active} onChoose={jump}/></div>
    <div className="house-tour-track" aria-hidden="true"/>

    {panel && panel !== "tennis" && <DevicePanels panel={panel} onClose={closePanel} initialApp={initialApp}/>}
    {panel === "tennis" && <TableTennis onClose={closePanel} reducedMotion={reducedMotion}/>}
  </main>;
}
