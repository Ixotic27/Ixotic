"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import ProjectBook from "./ProjectBook";
import { projects, shelfTitle } from "./projectCatalog";
import "./library-room.css";

function LibraryDrawing({ night }: { night: boolean }) {
  return <svg className="lr-drawing" viewBox="0 0 1200 740" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
    <path fill={night ? "#617992" : "#a1bbce"} d="M0 0h1200v536H0z"/>
    <path fill={night ? "#465f78" : "#728fa7"} d="M0 0h1200v20H0zM0 0h20v536H0zm1180 0h20v536h-20z"/>
    <path fill="#737a7f" d="M0 514h1200v22H0z"/><path fill="#c29c79" d="M0 536h1200v204H0z"/>
    {[566, 611, 656, 701].map((y, i) => <g key={y} stroke="#ad8665" strokeWidth="3"><path d={`M0 ${y}h1200`}/>{[0, 1, 2, 3, 4].map(x => <path key={x} d={`M${110 + x * 240 + (i % 2) * 100} ${y - 30}v30`}/>)}</g>)}
    <path fill="#d8bf98" d="M0 710h1200v14H0z"/>
    <path fill="#5a453c" d="M67 71h791v484H67z"/><path fill="#9a7659" d="M81 85h762v454H81z"/><path fill="#394d51" d="M101 102h723v409H101z"/>
    <path fill="#705343" d="M101 302h723v18H101zM101 505h723v18H101z"/><path fill="#bf9972" d="M92 293h740v15H92zM92 497h740v15H92zM60 527h805v20H60z"/>
    <path fill="#82634f" d="M81 86h19v451H81zM825 86h19v451h-19z"/>
    <path fill="#495e5b" d="M908 86h221v195H908z"/><path fill="#e5d5b6" d="M922 100h193v166H922z"/><path fill="#6e8e8b" d="M936 114h165v138H936z"/>
    <path fill="#e6b67b" d="M987 144h65v12h12v53h-12v12h-65v-12h-12v-53h12z"/><path fill="#435f66" d="M936 215h165v37H936z"/><path fill="#779394" d="M959 196h115v56H959z"/>
    <path fill="#7b5e49" d="M885 456h272v22H885zM905 478h20v156h-20zM1118 478h20v156h-20z"/><path fill="#d6b38b" d="M877 445h288v14H877z"/>
    <path fill="#455d5a" d="M1076 343h9v102h-9zM1054 439h53v9h-53z"/><path fill="#edc283" d="M1059 310h44v12h9v29h-62v-29h9z"/>
    <path fill="#bc846a" d="M935 412h49v33h-49z"/><path fill="#e2c99f" d="M939 406h50v7h-50z"/><path fill="#f1e1c1" d="M977 392h74v43h-74z"/><path fill="#b98f6c" d="M987 386h74v39h-74z"/><path fill="#edddbc" d="M996 378h65v36h-65z"/>
    <path fill="#78948c" d="M892 579h248v73H892z"/><path fill="#c7c7a8" d="M904 589h224v51H904z"/><path fill="#82998c" d="M920 600h192v5H920zm0 22h192v5H920z"/>
  </svg>;
}

export default function LibraryRoom({ night, onOpenJournal }: { night: boolean; onOpenJournal: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastBook = useRef<HTMLButtonElement | null>(null);
  const bookRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onShelfKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const columns = window.matchMedia("(max-width: 760px)").matches ? 4 : 12;
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = projects.length - 1;
    else if (event.key in offsets) next = Math.max(0, Math.min(projects.length - 1, index + offsets[event.key]));
    else return;
    event.preventDefault();
    bookRefs.current[next]?.focus();
  }

  return <section id="library" className={`room-chapter library-room ${night ? "library-night" : "library-day"}`} aria-labelledby="library-title">
    <div className="room-scene-surface lr-scene">
      <LibraryDrawing night={night}/>
      <div className="lr-plaque"><span>THE PROJECT SHELF</span><h2 id="library-title">The library</h2><p>Choose a spine. Open a story.</p></div>
      <div className="lr-books" role="group" aria-label="Project books">
        {projects.map((project, index) => <button key={project.html_url} ref={node => { bookRefs.current[index] = node; }} type="button" className={`lr-book lr-book-color-${index % 6}`} aria-label={`Open project book: ${shelfTitle(project.name)}`} onKeyDown={event => onShelfKey(event, index)} onClick={event => { lastBook.current = event.currentTarget; setOpenIndex(index); }}><span className="lr-book-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="lr-book-title" aria-hidden="true">{shelfTitle(project.name)}</span><span className="lr-book-glyph" aria-hidden="true">✦</span></button>)}
      </div>
      <div className="lr-room-links"><button type="button" onClick={onOpenJournal}>Project journal ↗</button><a href="#sports">Table tennis room ↓</a></div>
      <span className="lr-floor-note" aria-hidden="true">{projects.length} VOLUMES · PUBLIC REPOSITORIES</span>
    </div>
    <ProjectBook project={openIndex === null ? null : projects[openIndex]} index={openIndex ?? 0} total={projects.length} onClose={() => setOpenIndex(null)} returnFocus={lastBook}/>
  </section>;
}
