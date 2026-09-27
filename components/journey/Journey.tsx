"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import RoomArt from "./RoomArt";
import EndingArt from "./EndingArt";
import { useRoomMusic } from "./useRoomMusic";
import "./journey.css";

const DevicePanels = dynamic(() => import("../house/DevicePanels"), { ssr: false });
const TableTennis = dynamic(() => import("../house/TableTennis"), { ssr: false });
type Action = "imac" | "gameboy" | "books" | "coffee" | "tennis" | "lamp" | "cat" | "plant" | "music" | "next";
type Panel = "imac" | "gameboy" | "books" | "tennis" | null;
const names = ["study", "library", "kitchen", "sports", "door", "earth"];
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Journey() {
  const [progress, setProgress] = useState(0);
  const [night, setNight] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [initialApp, setInitialApp] = useState<"Work" | "About" | "Contact">();
  const [announcement, setAnnouncement] = useState("");
  const scrollFrame = useRef(0);
  const chapter = Math.min(5, Math.floor(progress + 0.001));
  const music = useRoomMusic({ chapter: progress >= 4.5 ? 5 : chapter, paused: panel !== null });

  const goTo = useCallback((index: number, instant = false) => {
    const bounded = Math.max(0, Math.min(5, index));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * bounded / 5, behavior: instant || reducedMotion ? "instant" : "smooth" });
    window.history.replaceState(null, "", `#${names[bounded]}`);
  }, [reducedMotion]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    change(); media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        setProgress(clamp(scrollY / max) * 5);
      });
    };
    const hash = () => {
      const value = location.hash.slice(1);
      const index = names.indexOf(value);
      if (index >= 0) goTo(index, true);
      else if (["work", "about", "contact", "capabilities"].includes(value)) {
        setInitialApp(value === "about" ? "About" : value === "contact" ? "Contact" : "Work");
        setPanel(value === "capabilities" ? "books" : "imac");
        goTo(value === "capabilities" ? 1 : 0, true);
      } else if (value === "overview") goTo(0, true);
    };
    hash(); update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    addEventListener("hashchange", hash);
    return () => { cancelAnimationFrame(scrollFrame.current); removeEventListener("scroll", update); removeEventListener("resize", update); removeEventListener("hashchange", hash); };
  }, [goTo]);

  useEffect(() => {
    if (!panel) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [panel]);

  const act = (action: Action) => {
    if (action === "music") music.toggle();
    else if (action === "next") goTo(chapter + 1);
    else if (["imac", "gameboy", "books", "tennis"].includes(action)) { setInitialApp(undefined); setPanel(action as Panel); }
    else setAnnouncement(({ coffee: "A little coffee break.", cat: "Prrrr. The cat says hello.", plant: "Plant watered.", lamp: "Desk lamp switched." } as Record<string,string>)[action]);
  };
  const close = useCallback(() => setPanel(null), []);
  const contact = useCallback(() => { setInitialApp("Contact"); setPanel("imac"); }, []);
  const roomProgress = reducedMotion ? Math.floor(progress + .15) : Math.min(5, progress + .001);
  const current = Math.min(4, Math.floor(roomProgress));
  const local = roomProgress - current;
  const transition = reducedMotion ? 0 : clamp((local - .5) / .5);
  const fade = clamp((transition - .65) / .35);

  return <main className={`journey ${night ? "journey-night" : ""}`}>
    <h1 className="journey-sr">Ixotic’s house — come in, look around.</h1>
    <p className="journey-sr">Scroll or use Page Down to travel through the rooms. Tab to explore objects. Press M to mute or play music.</p>
    <div className="journey-viewport">
      {[0,1,2,3].filter(i => i === current || (i === current + 1 && transition > 0)).reverse().map(i => {
        const outgoing = i === current;
        const usable = outgoing && fade < .5 && panel === null;
        return <section key={i} className="journey-room" aria-label={`${names[i]} room`} aria-hidden={!usable} style={{
          opacity: outgoing ? 1 - fade : 1,
          transform: outgoing ? `scale(${1 + transition * transition * 2.6})` : `scale(${.92 + fade * .08})`,
          pointerEvents: usable ? "auto" : "none",
          zIndex: outgoing ? 2 : 1,
        }}><RoomArt room={i as 0|1|2|3} night={night} active={usable} reducedMotion={reducedMotion} onAction={act} musicEnabled={music.enabled}/></section>;
      })}
      {((current === 3 && transition > 0) || current >= 4) && <section className="journey-ending" aria-label="The way home" style={{ zIndex:1 }}><EndingArt progress={reducedMotion ? (progress >= 4.5 ? 1 : 0) : clamp(progress - 4)} night={night} reducedMotion={reducedMotion} onContact={contact}/></section>}
    </div>
    <button className="journey-daylight" onClick={() => setNight(v => !v)} aria-label={night ? "Switch to daylight" : "Switch to evening"} title={night ? "Switch to daylight" : "Switch to evening"}><span aria-hidden="true">{night ? "☾" : "☼"}</span><span>{night ? "Evening" : "Daylight"}</span></button>
    <div className="journey-sr" role="status">{announcement}</div>
    <div className="journey-scroll" aria-hidden="true"/>
    {panel && panel !== "tennis" && <DevicePanels panel={panel} onClose={close} initialApp={initialApp}/>}
    {panel === "tennis" && <TableTennis onClose={close} reducedMotion={reducedMotion}/>}
  </main>;
}
