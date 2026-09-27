"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import type { Project } from "./projectCatalog";
import { shelfTitle } from "./projectCatalog";
import { projectNotes } from "./projectNotes";
import "./project-book.css";

type Props = { project: Project | null; index: number; total: number; onClose: () => void; returnFocus: React.RefObject<HTMLButtonElement | null> };
type Turn = { from: number; to: number; direction: "next" | "previous" };
const lastSpread = 2;

export default function ProjectBook({ project, index, total, onClose, returnFocus }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [spread, setSpread] = useState(0);
  const [turning, setTurning] = useState<Turn | null>(null);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const note = project ? projectNotes[project.name] : null;

  useEffect(() => {
    const node = dialog.current;
    if (!node || !project) return;
    setSpread(0);
    setTurning(null);
    const oldOverflow = document.body.style.overflow;
    const focusTarget = returnFocus.current;
    document.body.style.overflow = "hidden";
    if (!node.open) node.showModal();
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      if (node.open) node.close();
      focusTarget?.focus();
    };
  }, [project, returnFocus]);

  useEffect(() => {
    if (!turning) return;
    const timer = window.setTimeout(() => setTurning(null), 700);
    return () => window.clearTimeout(timer);
  }, [turning]);

  function turn(to: number) {
    if (turning || to < 0 || to > lastSpread || to === spread) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSpread(to);
      return;
    }
    setTurning({ from: spread, to, direction: to > spread ? "next" : "previous" });
    setSpread(to);
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchX.current;
    const vertical = event.changedTouches[0].clientY - (touchY.current ?? event.changedTouches[0].clientY);
    touchX.current = null;
    touchY.current = null;
    if (Math.abs(delta) > 65 && Math.abs(delta) > Math.abs(vertical) * 1.5) turn(spread + (delta < 0 ? 1 : -1));
  }

  function onBookKey(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable=true]")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      turn(spread + (event.key === "ArrowRight" ? 1 : -1));
    }
  }

  function leaf(which: "left" | "right", at: number, interactive = true): ReactNode {
    if (!project) return null;
    if (at === 0 && which === "left") return <div className="pb-endpaper"><span>THE PROJECT SHELF</span><span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>;
    if (at === 0) return <button type="button" className="pb-cover" onClick={() => turn(1)} tabIndex={interactive ? 0 : -1} aria-label={`Open ${shelfTitle(project.name)} project book`}>
      <span className="pb-overline">IXOTIC / REPOSITORY {String(index + 1).padStart(2, "0")}</span>
      <span className="pb-cover-mark" aria-hidden="true"><span/><span/><span/></span>
      <span className="pb-cover-title">{shelfTitle(project.name)}</span>
      <span>{project.language ?? "Language not listed"}{project.fork ? " · Fork" : ""}</span>
      <span className="pb-cover-foot">OPEN THE BOOK ←</span>
    </button>;
    if (at === 1 && which === "left") return <div className="pb-content">
      <span className="pb-eyebrow">01 / REPOSITORY NOTE</span>
      <h2>{shelfTitle(project.name)}</h2>
      <p className="pb-description">{note?.overview ?? project.description ?? "This repository has no description on GitHub."}</p>
      <span className="pb-page-foot">SOURCE: {note?.source ?? "PUBLIC GITHUB REPOSITORY"}</span>
    </div>;
    if (at === 1) return <div className="pb-content">
      <span className="pb-eyebrow">02 / NOTES</span>
      <h2>Inside the repository</h2>
      {note?.highlights?.length ? <ul className="pb-highlights">{note.highlights.map(item => <li key={item}>{item}</li>)}</ul> : <p className="pb-description">No additional feature notes are available for this repository.</p>}
      <span className="pb-page-foot">TURN THE PAGE →</span>
    </div>;
    if (which === "left") return <div className="pb-content pb-details">
      <span className="pb-eyebrow">03 / REPOSITORY RECORD</span>
      <h2>On the record</h2>
      <dl>
        <div><dt>Language</dt><dd>{project.language ?? "Not listed"}</dd></div>
        <div><dt>Repository</dt><dd>{project.fork ? "Fork" : "Original repository"}</dd></div>
        {project.archived && <div><dt>Status</dt><dd>Archived</dd></div>}
      </dl>
      <span className="pb-page-foot">PUBLIC REPOSITORY</span>
    </div>;
    return <div className="pb-content pb-details">
      <span className="pb-eyebrow">04 / LINKS</span>
      <h2>Keep exploring</h2>
      <p className="pb-description">Open the project source and its listed site, when available.</p>
      <div className="pb-links"><a href={project.html_url} target="_blank" rel="noopener noreferrer" tabIndex={interactive ? 0 : -1}>View on GitHub ↗</a>{project.homepage && <a href={project.homepage} target="_blank" rel="noopener noreferrer" tabIndex={interactive ? 0 : -1}>Visit project site ↗</a>}</div>
      <span className="pb-page-foot">END OF RECORD</span>
    </div>;
  }

  return <dialog
    ref={dialog}
    className="project-book-dialog"
    aria-label={project ? `${shelfTitle(project.name)} project book` : "Project book"}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={onBookKey}
    onClick={event => { if (event.target === dialog.current) onClose(); }}
  >
    {project && <div className="pb-shell" onTouchStart={event => { touchX.current = event.touches[0]?.clientX ?? null; touchY.current = event.touches[0]?.clientY ?? null; }} onTouchEnd={onTouchEnd}>
      <div className="pb-topline"><span>THE PROJECT SHELF / {String(index + 1).padStart(2, "0")} OF {total}</span><button ref={closeButton} type="button" className="pb-close" onClick={onClose} aria-label="Close project book">× <span>Close</span></button></div>
      <div className="pb-book" aria-label={spread === 0 ? "Book cover" : `Pages ${spread * 2 - 1} and ${spread * 2}`}>
        <div className="pb-leaf pb-left">{leaf("left", turning?.direction === "next" ? turning.from : spread)}</div>
        <div className="pb-leaf pb-right">{leaf("right", turning?.direction === "previous" ? turning.from : spread)}</div>
        <div className="pb-gutter" aria-hidden="true" />
        {turning && <div key={`${project.name}-${turning.from}-${turning.to}`} className="pb-turn" data-direction={turning.direction} aria-hidden="true" onAnimationEnd={event => { if (event.target === event.currentTarget) setTurning(null); }}>
          <div className="pb-turn-face pb-turn-front">{leaf(turning.direction === "next" ? "right" : "left", turning.from, false)}</div>
          <div className="pb-turn-face pb-turn-back">{leaf(turning.direction === "next" ? "left" : "right", turning.to, false)}</div>
        </div>}
      </div>
      <div className="pb-controls"><button type="button" onClick={() => turn(spread - 1)} disabled={spread === 0 || !!turning} aria-label="Previous spread">← <span>Previous</span></button><span aria-live="polite">{spread === 0 ? "COVER" : `PAGES ${spread * 2 - 1}–${spread * 2}`} / 4</span><button type="button" onClick={() => turn(spread + 1)} disabled={spread === lastSpread || !!turning} aria-label="Next spread"><span>{spread === 0 ? "Open" : "Next"}</span> →</button></div>
    </div>}
  </dialog>;
}
