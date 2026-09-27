"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoomPalette, { initialColors, roomColorStyle } from "./RoomPalette";
import LibraryRoom from "./LibraryRoom";
import SportsRoom from "./SportsRoom";
import RoomEnding from "./RoomEnding";
import { useRoomMusic } from "../journey/useRoomMusic";
import PortraitStudyArt from "./PortraitStudyArt";
import "./room.css";
import "./fullscreen-rooms.css";

type App = "Work" | "About" | "Contact" | "Pixel Quest";
const DevicePanels = dynamic(() => import("../house/DevicePanels"), { ssr: false });

function PixelIcon({ type }: { type: App }) {
  const paths = { Work: "M2 6h10v3h18v19H2z", About: "M11 3h10v10H11zM7 17h18v13H7z", Contact: "M2 7h28v20H2z", "Pixel Quest": "M12 2h8v8h10v10H20v10h-8V20H2V10h10z" };
  return <svg viewBox="0 0 32 32" aria-hidden="true" shapeRendering="crispEdges"><path d={paths[type]} fill="currentColor"/>{type === "Contact" && <path d="m3 9 13 10L29 9" fill="none" stroke="var(--icon-cutout, #d8dec0)" strokeWidth="3"/>}</svg>;
}

function Landscape({ night }: { night: boolean }) {
  return <svg viewBox="0 0 600 340" preserveAspectRatio="none" className="os-wallpaper" aria-hidden="true" shapeRendering="crispEdges"><path fill={night ? "#172539" : "#243b59"} d="M0 0h600v340H0z"/><path fill="#354e6b" d="M0 280h90v-30h80v-35h90v35h110v-55h75v35h85v-20h70v130H0z"/><path fill="#b9d6da" d="M310 45h5v5h-5zm145 60h5v5h-5zm-200 53h4v4h-4zm270 24h5v5h-5z"/><path fill="#f6ce86" d="M474 39h32v8h8v32h-8v8h-32v-8h-8V47h8z"/></svg>;
}

export default function StudyRoom() {
  const [device, setDevice] = useState<"imac" | "gameboy" | "books" | null>(null);
  const [initialApp, setInitialApp] = useState<"Work" | "About" | "Contact">();
  const [night, setNight] = useState(false);
  const [lamp, setLamp] = useState(true);
  const [watered, setWatered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colors, setColors] = useState(initialColors);
  const [notice, setNotice] = useState<{ object: "plant" | "cat" | "lamp"; message: string } | null>(null);
  const [chapter, setChapter] = useState(0);
  const [gamePlaying, setGamePlaying] = useState(false);
  const music = useRoomMusic({ chapter, paused: device !== null, gamePlaying });
  function open(which: "imac" | "gameboy" | "books", app?: "Work" | "About" | "Contact") { setInitialApp(app); setDevice(which); }
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    const followLink = () => {
      const hash = location.hash.slice(1);
      if (hash === "capabilities") open("books");
      else if (["work", "about", "contact"].includes(hash)) open("imac", hash === "work" ? "Work" : hash === "about" ? "About" : "Contact");
    };
    followLink(); addEventListener("hashchange", followLink);
    return () => { media.removeEventListener("change", update); removeEventListener("hashchange", followLink); };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const rooms = ["study", "library", "sports", "door"];
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        let current = 0;
        const line = innerHeight * .48;
        rooms.forEach((id, index) => {
          const node = document.getElementById(id);
          if (!node) return;
          const rect = node.getBoundingClientRect();
          if (rect.top <= line) current = index;
          const surface = node.querySelector<HTMLElement>(".room-scene-surface");
          if (!surface) return;
          const offset = Math.max(-1, Math.min(1, rect.top / Math.max(1, innerHeight)));
          const t = Math.abs(offset);
          const eased = t * t * (3 - 2 * t);
          surface.style.setProperty("--room-scale", String(reducedMotion ? 1 : 1 - eased * .035));
          surface.style.setProperty("--room-shift", `${reducedMotion ? 0 : offset * 22}px`);
          surface.style.setProperty("--room-opacity", String(reducedMotion ? 1 : 1 - eased * .22));
        });
        const door = document.getElementById("door");
        const ending = current === 3 && door && -door.getBoundingClientRect().top > (door.offsetHeight - innerHeight) * .55;
        setChapter(ending ? 5 : [0, 1, 3, 4][current]);
      });
    };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, [reducedMotion]);
  useEffect(() => {
    if (!device) return;
    const before = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [device]);

  return <main className={`room-page ${night ? "room-night" : "room-day"}`} style={roomColorStyle(colors)}>
    <a className="room-skip" href="#library">Skip to projects in the library</a>
    <div className="room-sound"><button onClick={music.toggle} aria-pressed={music.enabled} aria-label={music.enabled ? "Mute room music" : "Play room music"}>{music.enabled ? "♫ Sound on" : "♪ Sound off"}</button><span>{["Study", "Library", "", "Sports room", "At the door", "A little world"][chapter]}</span></div>
    <button className="room-time room-global-time" onClick={() => setNight(!night)} aria-label={night ? "Switch room to daytime" : "Switch room to nighttime"}>{night ? "☾ Night" : "☀ Daylight"}</button>
    <section id="study" className="room-chapter room-study" aria-labelledby="study-title">
    <div className="room-scene-surface study-surface">
    <h1 id="study-title" className="study-nameplate">Ixotic’s study <span>Come in. Look around.</span></h1>
    <div className="room-stage">
      <svg viewBox="0 0 1200 740" preserveAspectRatio="none" className="room-drawing study-landscape" aria-hidden="true" shapeRendering="crispEdges">
        <path fill={night ? "#6d829b" : "#9eb9ce"} d="M30 16h1140v520H30z"/>
        <path fill={night ? "#506982" : "#728ea8"} d="M30 16h1140v16H30zM30 32h16v504H30zM1154 32h16v504h-16z"/>
        <path fill="#737a7f" d="M30 514h1140v22H30z"/><path fill="#c29c79" d="M30 536h1140v180H30z"/>
        {[566,611,656,701].map((y,i)=><g key={y} stroke="#ad8665" strokeWidth="3"><path d={`M30 ${y}h1140`}/>{[0,1,2,3,4].map(x=><path key={x} d={`M${110+x*240+(i%2)*100} ${y-30}v30`}/>)}</g>)}
        <path fill="#d8bf98" d="M30 710h1140v12H30z"/>
        {/* A midnight window, with a skyline built one pixel at a time. */}
        <path fill="#46565d" d="M852 80h258v290H852z"/><path fill={night ? "#344553" : "#a6d0cc"} d="M868 96h226v258H868z"/>
        {night ? <g fill="#f9e3ac"><path d="M1020 122h30v10h10v30h-10v10h-30v-10h-10v-30h10z"/><path d="M897 122h4v4h-4zm65 46h4v4h-4zm-53 53h4v4h-4zm147-13h4v4h-4zm-66 41h4v4h-4z"/></g> : <path fill="#f4d08a" d="M999 122h42v10h10v42h-10v10h-42v-10h-10v-42h10z"/>}
        <path fill="#536778" d="M868 299h22v-37h26v37h19v-65h30v65h35v-43h31v43h26v-62h37v117H868z"/><path fill="#ecd5a2" d="M895 277h5v7h-5zm48-26h5v7h-5zm0 17h5v7h-5zm72 2h5v7h-5zm54-18h5v7h-5z"/>
        <path fill="#d2c3ab" d="M975 89h10v270h-10zM860 217h245v10H860zM839 357h284v17H839z"/>
        <path fill="#68797e" d="M831 70h16v283h-16zM1113 70h16v283h-16z"/>
        {/* Shelf, records, books and a framed print. */}
        <path fill="#7d6756" d="M300 127h430v14H300zM326 140h12v30h-12zM689 140h12v30h-12z"/>
        {["#c47e65","#e3c68d","#6e8c83","#b6b1ac","#d58d63"].map((color,i)=><g key={color}><path fill={color} d={`M${331+i*25} ${68+(i%2)*9}h20v${59-(i%2)*9}h-20z`}/><path stroke="#efe0bd" strokeWidth="3" d={`M${336+i*25} 104h10`}/></g>)}
        <path fill="#526762" d="M542 76h55v51h-55z"/><path fill="#e2cda8" d="M550 84h39v35h-39z"/><path fill="#d78c68" d="M560 89h19v8h8v11h-8v8h-19v-8h-8V97h8z"/>
        <path fill="#ac785b" d="M650 102h33v25h-33z"/><path fill="#536c55" d="M660 53h10v53h-10zM643 66h17v13h-17zM670 77h20v12h-20zM650 48h10v13h-10z"/>
        <path fill="#53635f" d="M98 94h136v152H98z"/><path fill="#e3d6bd" d="M109 105h114v130H109z"/><path fill="#354f65" d="M119 115h94v108h-94z"/><ellipse cx="151" cy="151" rx="23" ry="28" fill="#db735f"/><path d="M150 176h11l8 33h-11z" fill="#ddb988"/><ellipse cx="183" cy="161" rx="19" ry="24" fill="#76b5ad"/><path d="M179 182h9v26h-9z" fill="#ddb988"/><circle cx="186" cy="126" r="7" fill="#fff3ca"/>
        {/* Bookshelf. */}
        <path fill="#806451" d="M83 293h173v234H83z"/><path fill="#514c43" d="M95 306h149v90H95zM95 410h149v103H95z"/>
        {["#a9b9ac","#d69374","#d9c398","#738d93","#c1aea5","#bfb889"].map((color,i)=><rect key={color} fill={color} x={104+i*21} y={326+(i%3)*7} width="16" height={70-(i%3)*7}/>)}
        <path fill="#b6bba6" d="M115 433h81v58h-81z"/><path fill="#798679" d="M124 444h62v7h-62zm0 15h40v7h-40z"/><path fill="#c78763" d="M207 444h22v69h-22z"/>
        {/* Desk with a real, clickable computer surface. */}
        <path fill="#795e49" d="M282 462h555v25H282zM302 487h25v173h-25zM792 487h25v173h-25z"/><path fill="#dcbb90" d="M274 449h570v15H274z"/>
        <path fill="#aebbb8" d="M470 245h283v172H470z"/><path fill="#354a4d" d="M479 254h265v139H479z"/><path fill="#657875" d="M597 401h16v7h-16zM587 417h45v27h-45zM568 440h84v9h-84z"/>
        <path fill="#e1d9c5" d="M471 451h216v10H471z"/><path fill="#88958a" d="M478 453h190v3H478z"/>
        <path fill="#d5d4bf" d="M718 443h22v15h-22z"/><path fill="#788c80" d="M693 440h72v24h-72z"/><path fill="#d5d4bf" d="M715 444h24v14h-24z"/>
        {/* Task lamp and coffee. */}
        {lamp && <path fill="#f6d39a" opacity=".22" d="m367 341-61 107h149l-64-107z"/>}
        <path fill="#465b58" d="M377 351h9v89h-9zM357 440h50v9h-50z"/><path fill={lamp ? "#e8ba72" : "#839791"} d="M365 310h33v12h11v29h-56v-29h12z"/>
        <path fill="#b56951" d="M418 416h29v30h-29zM447 422h11v18h-11z"/><path fill="#e3c7a5" d="M421 418h23v5h-23z"/>
        {/* Rug and chair. */}
        <path fill="#879692" d="M377 620h416v70H377z"/><path fill="#bbc2a6" d="M388 630h394v49H388z"/><path fill="#879692" d="M400 642h370v4H400zm0 22h370v4H400z"/>
        <path fill="#42595c" d="M527 496h129v17h12v85H515v-85h12z"/><path fill="#66827e" d="M529 510h124v67H529z"/><path fill="#8aa397" d="M537 518h108v8H537z"/>
        <path fill="#374c50" d="M502 590h180v23H502zM579 613h24v48h-24zM535 658h110v9H535zM528 665h19v12h-19zm105 0h19v12h-19z"/>
        {/* Side cabinet and handheld. */}
        <path fill="var(--cabinet-color)" d="M886 455h186v179H886z"/><path fill="var(--cabinet-light)" d="M896 467h166v70H896zm0 80h166v70H896z"/><path fill="#29444d" d="M959 495h40v8h-40zm0 81h40v8h-40z"/><path fill="var(--cabinet-light)" d="M878 444h202v16H878z"/>
        <path fill="#ded4ba" d="M921 373h64v68h-8v8h-56z"/><path fill="#6a7665" d="M929 379h47v29h-47z"/><path fill="#b1c18a" d="M935 384h35v18h-35z"/><path fill="#42524c" d="M931 416h18v6h-18zm6-6h6v18h-6z"/><path fill="#af6857" d="M962 418h8v8h-8zm12-9h8v8h-8z"/>
        <path fill="#7e876a" d="M1020 415h27v30h-27z"/><path fill="#e2bd7e" d="M1022 392h23v25h-23z"/>
        {/* Floor plant and a sleepy cat. */}
        <path fill="var(--pot-color)" d="M119 574h62v73h-62z"/><path fill="var(--pot-light)" d="M109 565h82v16h-82zM128 591h7v39h-7z"/><path fill={watered ? "var(--plant-light)" : "var(--plant-color)"} d="M146 458h12v110h-12zM112 484h34v27h-34zM158 466h33v31h-33zM118 528h29v25h-29zM158 516h43v26h-43z"/>
        <g className={notice?.object === "cat" ? "room-cat room-cat-happy" : "room-cat"}><path fill="var(--cat-color)" d="M920 653h82v12h17v22H900v-22h20zM921 645h13v19h-13zm48 0h13v19h-13z"/><path fill="var(--cat-light)" d="M929 670h12v3h-12zm28 0h12v3h-12zM942 680h12v3h-12z"/></g>
      </svg>
      <PortraitStudyArt night={night} lamp={lamp} watered={watered}/>
      <button className="room-hotspot monitor-hotspot" aria-label="Use the iMac" onClick={() => open("imac")}><Landscape night={night}/><span className="mini-desktop"><PixelIcon type="Work"/><PixelIcon type="About"/></span><span className="hotspot-label">Use iMac ↗</span></button>
      <button className="room-hotspot gameboy-hotspot" aria-label="Pick up the Game Boy" onClick={() => open("gameboy")}><span className="hotspot-label">Pick up & play ↗</span></button>
      <button className="room-hotspot lamp-hotspot" aria-label={lamp ? "Turn desk lamp off" : "Turn desk lamp on"} aria-pressed={lamp} onClick={() => { setLamp(!lamp); setNotice({ object: "lamp", message: lamp ? "A little quieter. Lamp off." : "Warm light, good company." }); }}><span className="hotspot-label">Desk lamp</span></button>
      <a href="#library" className="room-hotspot books-hotspot" aria-label="Visit the library"><span className="hotspot-label">Into the library ↓</span></a>
      <button className="room-hotspot plant-hotspot" aria-label="Water the plant" onClick={() => { setWatered(true); setNotice({ object: "plant", message: watered ? "That’s plenty of water for today!" : "Plant watered. A tiny good deed." }); }}><span className="hotspot-label">Water me</span></button>
      <button className="room-hotspot cat-hotspot" aria-label="Say hello to the cat" onClick={() => setNotice({ object: "cat", message: "Prrrr. You have been approved by the cat." })}><span className="hotspot-label">pspsps…</span></button>
      <a href="#sports" className="room-hotspot tennis-hotspot" aria-label="Visit the table tennis room"><span className="hotspot-label">Fancy a match? ↓</span></a>
      <div className={`room-object-notice ${notice ? `notice-${notice.object}` : ""}`} role="status" aria-live="polite" aria-atomic="true">{notice?.message}</div>
    </div>
    <nav className="study-directory" aria-label="Room directory"><button onClick={() => open("imac", "Work")}>Work</button><button onClick={() => open("imac", "About")}>About</button><button onClick={() => open("imac", "Contact")}>Contact</button><button onClick={() => open("gameboy")}>Games</button></nav>
    <RoomPalette colors={colors} onChange={setColors}/>
    <a className="study-next-room" href="#library">Library <span aria-hidden="true">↓</span></a>
    </div>
    </section>
    <LibraryRoom night={night} onOpenJournal={() => open("books")}/>
    <SportsRoom night={night} reducedMotion={reducedMotion} onPlayingChange={setGamePlaying}/>
    <RoomEnding night={night} reducedMotion={reducedMotion}/>
    {device && <DevicePanels panel={device} initialApp={initialApp} onClose={() => setDevice(null)}/>}
  </main>;
}
