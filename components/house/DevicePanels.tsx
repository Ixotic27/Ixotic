"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import "./devices.css";
import { projects as repositoryProjects, shelfTitle } from "../portfolio/projectCatalog";
import { projectNotes } from "../portfolio/projectNotes";

type Panel = "imac" | "gameboy" | "books" | null;
type InfoApp = "Work" | "About" | "Contact";
type Game = "Pixel Quest" | "Maze Run";
type Point = { x: number; y: number };
type BookId = "projects" | "skills" | "about";

const infoApps: InfoApp[] = ["Work", "About", "Contact"];
const games: Game[] = ["Pixel Quest", "Maze Run"];
const stars: Point[] = [{ x: 5, y: 1 }, { x: 1, y: 5 }, { x: 5, y: 5 }, { x: 1, y: 1 }];
const walls = new Set(["1,5", "1,6", "2,3", "3,3", "4,3", "5,1", "5,2"]);
const projects = repositoryProjects.map(project => [shelfTitle(project.name), projectNotes[project.name]?.overview ?? project.description ?? "View this public repository on GitHub.", project.name] as const);
const books: { id: BookId; title: string; subtitle: string; color: string }[] = [
  { id: "projects", title: "Project Journal", subtitle: "Things I’ve built", color: "amber" },
  { id: "skills", title: "Skills Notebook", subtitle: "Tools & technologies", color: "sage" },
  { id: "about", title: "About Journal", subtitle: "A little about Ixotic", color: "blue" },
];

function AppIcon({ app }: { app: InfoApp }) {
  const shape: Record<InfoApp, string> = {
    Work: "M2 7h11l3 4h14v17H2z M2 11h28",
    About: "M16 2a7 7 0 1 0 0 14a7 7 0 0 0 0-14 M4 30c0-7 5-11 12-11s12 4 12 11z",
    Contact: "M2 5h28v22H2z M3 7l13 11L29 7",
  };
  return <svg viewBox="0 0 32 32" aria-hidden="true" shapeRendering="crispEdges"><path d={shape[app]} /></svg>;
}

function InfoContent({ app }: { app: InfoApp }) {
  return <div className="hdev-app-content">
    {app === "Work" && <><h2>Things I’ve built.</h2>{projects.map(([name, description, slug]) => <a className="hdev-project" href={`https://github.com/Ixotic27/${slug}`} target="_blank" rel="noopener noreferrer" key={name}><strong>{name} ↗</strong><span>{description}</span></a>)}<a className="hdev-text-link" href="https://github.com/Ixotic27" target="_blank" rel="noopener noreferrer">More on GitHub ↗</a></>}
    {app === "About" && <><h2>Hey, I’m Ixotic.</h2><p>I’m a vibe coder with a keen sense of design.</p><p>This is my little room on the internet. Everything here is drawn in code.</p><div className="hdev-skills">TypeScript · React · Next.js<br />Java · Python · Canvas</div></>}
    {app === "Contact" && <><h2>Leave a little hello.</h2><p>Have a project or an interesting idea? Let’s talk.</p><a className="hdev-mail" href="mailto:ishant.off@gmail.com">ishant.off@gmail.com ↗</a><a className="hdev-text-link" href="https://github.com/Ixotic27" target="_blank" rel="noopener noreferrer">Find me on GitHub ↗</a></>}
  </div>;
}

function GameScreen({ game, player, score, steps, won, focusRef }: { game: Game; player: Point; score: number; steps: number; won: boolean; focusRef: RefObject<HTMLElement> }) {
  const target = game === "Pixel Quest" ? stars[score % stars.length] : { x: 6, y: 0 };
  return <section ref={focusRef} tabIndex={0} className="hdev-gb-game" aria-label={`${game} game`}><div className="hdev-quest">
    <div className="hdev-quest-title"><h2>{game}</h2><span>{game === "Pixel Quest" ? `★ ${score.toString().padStart(2, "0")}` : `${steps} steps`}</span></div>
    <p className="hdev-quest-help" aria-live="polite">{game === "Pixel Quest" ? "Find the star." : won ? "You made it! A or Space to replay." : "Reach the flag. Avoid the blocks."}</p>
    <div className="hdev-quest-grid" role="img" aria-label={`Player at column ${player.x + 1}, row ${player.y + 1}. ${game === "Pixel Quest" ? `Star at column ${target.x + 1}, row ${target.y + 1}. Score ${score}.` : `Flag at column 7, row 1. ${steps} steps. ${won ? "Won." : "Playing."}`}`}>
      {Array.from({ length: 49 }, (_, i) => {
        const x = i % 7, y = Math.floor(i / 7);
        const isPlayer = player.x === x && player.y === y;
        const isTarget = target.x === x && target.y === y;
        const isWall = game === "Maze Run" && walls.has(`${x},${y}`);
        return <span key={i} className={isPlayer ? "hdev-player" : isWall ? "hdev-wall" : isTarget ? "hdev-star" : ""}>{isTarget && !isPlayer ? game === "Pixel Quest" ? "✦" : "⚑" : ""}</span>;
      })}
    </div>
  </div></section>;
}

function BookPage({ book, page }: { book: BookId; page: number }) {
  if (book === "projects") {
    const project = projects[Math.min(page, projects.length - 1)];
    return <><p className="hdev-book-kicker">PROJECT JOURNAL · {page + 1} / {projects.length}</p><h2>{project[0]}</h2><p>{project[1]}</p><p className="hdev-book-note">From Ixotic’s public repository collection.</p><a className="hdev-book-link" href={`https://github.com/Ixotic27/${project[2]}`} target="_blank" rel="noopener noreferrer">Open project on GitHub ↗</a></>;
  }
  if (book === "skills") return <><p className="hdev-book-kicker">SKILLS NOTEBOOK · {page + 1} / 2</p><h2>{page === 0 ? "Web & interfaces" : "Programming & creative tools"}</h2><p>{page === 0 ? "TypeScript · React · Next.js" : "Java · Python · Canvas"}</p><p className="hdev-book-note">Technologies listed in the portfolio.</p></>;
  return <><p className="hdev-book-kicker">ABOUT JOURNAL · {page + 1} / 2</p><h2>{page === 0 ? "Hey, I’m Ixotic." : "A little room online"}</h2><p>{page === 0 ? "I’m a vibe coder with a keen sense of design." : "This is my little room on the internet. Everything here is drawn in code."}</p></>;
}

export default function DevicePanels({ panel, onClose, initialApp }: { panel: Panel; onClose: () => void; initialApp?: InfoApp | "Pixel Quest" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const gameSurface = useRef<HTMLElement>(null);
  const menuButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const restoreFocus = useRef<HTMLElement | SVGElement | null>(null);
  const didDismiss = useRef(false);
  const [infoApp, setInfoApp] = useState<InfoApp | null>(panel === "imac" && initialApp !== "Pixel Quest" ? initialApp ?? null : null);
  const [game, setGame] = useState<Game | null>(panel === "gameboy" && initialApp === "Pixel Quest" ? "Pixel Quest" : null);
  const [selection, setSelection] = useState(0);
  const [player, setPlayer] = useState<Point>({ x: 3, y: 3 });
  const [score, setScore] = useState(0);
  const [steps, setSteps] = useState(0);
  const [won, setWon] = useState(false);
  const [book, setBook] = useState<BookId | null>(null);
  const [page, setPage] = useState(0);
  const active = panel !== null;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !active) return;
    didDismiss.current = false;
    restoreFocus.current = document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement ? document.activeElement : null;
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      restoreFocus.current?.focus({ preventScroll: true });
    };
  }, [active]);

  useEffect(() => {
    setInfoApp(panel === "imac" && initialApp !== "Pixel Quest" ? initialApp ?? null : null);
    setGame(panel === "gameboy" && initialApp === "Pixel Quest" ? "Pixel Quest" : null);
    setSelection(0);
    setBook(null);
    setPage(0);
  }, [panel, initialApp]);

  useEffect(() => {
    if (panel !== "gameboy") return;
    if (game) gameSurface.current?.focus({ preventScroll: true });
    else menuButtons.current[selection]?.focus({ preventScroll: true });
  }, [panel, game, selection]);

  function close() {
    if (didDismiss.current) return;
    didDismiss.current = true;
    if (dialog.current?.open) dialog.current.close();
    onClose();
  }
  function startGame(next: Game) {
    setGame(next);
    setPlayer(next === "Pixel Quest" ? { x: 3, y: 3 } : { x: 0, y: 6 });
    setScore(0);
    setSteps(0);
    setWon(false);
  }
  function move(dx: number, dy: number) {
    if (!game) {
      const next = (selection + (dx || dy) + games.length) % games.length;
      setSelection(next);
      menuButtons.current[next]?.focus({ preventScroll: true });
      return;
    }
    if (won) return;
    const next = { x: Math.max(0, Math.min(6, player.x + dx)), y: Math.max(0, Math.min(6, player.y + dy)) };
    if (game === "Maze Run" && walls.has(`${next.x},${next.y}`)) return;
    if (next.x === player.x && next.y === player.y) return;
    setPlayer(next);
    if (game === "Pixel Quest") {
      const star = stars[score % stars.length];
      if (next.x === star.x && next.y === star.y) setScore((current) => current + 1);
    } else {
      setSteps((current) => current + 1);
      if (next.x === 6 && next.y === 0) setWon(true);
    }
  }
  function back() {
    if (panel === "gameboy" && game) setGame(null);
    else if (panel === "imac" && infoApp) setInfoApp(null);
    else if (panel === "books" && book) setBook(null);
    else close();
  }
  function activate() {
    if (game) startGame(game);
    else startGame(games[selection]);
  }
  function keyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") { event.preventDefault(); back(); return; }
    const target = event.target;
    const onControl = target instanceof HTMLElement && Boolean(target.closest("button, a, input, select, textarea"));
    if (panel === "gameboy") {
      const moves: Record<string, [number, number]> = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
      const direction = moves[event.key.toLowerCase()];
      if (direction) { event.preventDefault(); move(...direction); return; }
      if (event.key.toLowerCase() === "b") { event.preventDefault(); back(); return; }
      if (!onControl && event.key === " " && game) { event.preventDefault(); startGame(game); return; }
      if (!onControl && !game && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); activate(); }
    } else if (panel === "imac" && !infoApp && ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const next = (selection + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + infoApps.length) % infoApps.length;
      setSelection(next);
      desktopButtons.current[next]?.focus({ preventScroll: true });
    }
  }

  if (!active) return null;
  const isBook = panel === "books";
  return <dialog ref={dialog} id="house-device-dialog" className={`hdev-dialog ${panel === "gameboy" ? "hdev-handheld" : ""} ${isBook ? "hdev-library" : ""}`} aria-label={isBook ? "Library journals" : panel === "gameboy" ? "Game Boy games" : "Ixotic desktop"} onCancel={(event) => { event.preventDefault(); back(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={keyDown}>
    {isBook ? <div className="hdev-library-shell">
      <button className="hdev-close" onClick={close} aria-label="Close library">×</button>
      <p className="hdev-eyebrow">THE LIBRARY</p><h1>Choose a journal</h1>
      {!book ? <div className="hdev-shelf" aria-label="Library journals">{books.map((item) => <button className={`hdev-book hdev-book-${item.color}`} key={item.id} onClick={() => { setBook(item.id); setPage(0); }}><span className="hdev-book-spine" aria-hidden="true" /><strong>{item.title}</strong><span>{item.subtitle}</span><span className="hdev-book-open">Read journal →</span></button>)}</div> : <>
        <button className="hdev-back" onClick={() => setBook(null)}>← All journals</button>
        <article className="hdev-open-book" aria-live="polite"><div className="hdev-page hdev-page-left"><span className="hdev-page-mark">IXOTIC’S HOUSE</span><div className="hdev-page-lines" aria-hidden="true" /></div><div className="hdev-page hdev-page-right"><BookPage book={book} page={page} /><span className="hdev-page-number">{page + 1}</span></div></article>
        <nav className="hdev-page-controls" aria-label="Journal pages"><button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>← Previous page</button><span>Page {page + 1}</span><button onClick={() => setPage(Math.min(book === "projects" ? projects.length - 1 : 1, page + 1))} disabled={page >= (book === "projects" ? projects.length - 1 : 1)}>Next page →</button></nav>
      </>}
    </div> : <div className="hdev-device-shell">
      <button className="hdev-close" onClick={close} aria-label="Back to room">×</button>
      <div className="hdev-device-top"><span>{panel === "gameboy" ? "DOT MATRIX WITH CHARACTER" : "IXOTIC OS"}</span><span className="hdev-power" aria-label="Power on">●</span></div>
      <div className="hdev-screen">
        {panel === "imac" && <><div className="hdev-menubar"><button onClick={() => setInfoApp(null)}>⌘ Desktop</button><span>{infoApp ?? "Welcome home."}</span><span>● ● ●</span></div>
          {!infoApp ? <div className="hdev-desktop-apps">{infoApps.map((name, index) => <button ref={(element) => { desktopButtons.current[index] = element; }} key={name} className={`hdev-app-${index} ${selection === index ? "hdev-selected" : ""}`} onFocus={() => setSelection(index)} onClick={() => { setSelection(index); setInfoApp(name); }}><span className="hdev-icon"><AppIcon app={name} /></span><span className="hdev-label-plate">{name}</span></button>)}</div> : <section className="hdev-window" aria-label={`${infoApp} application`}><div className="hdev-window-title"><span>{infoApp}</span><button onClick={() => setInfoApp(null)} aria-label="Close app">×</button></div><InfoContent app={infoApp} /></section>}</>}
        {panel === "gameboy" && !game && <nav className="hdev-gb-menu" aria-label="Game Boy games">{games.map((name, index) => <button ref={(element) => { menuButtons.current[index] = element; }} key={name} className={selection === index ? "hdev-gb-selected" : ""} onFocus={() => setSelection(index)} onClick={() => { setSelection(index); startGame(name); }}><span className="hdev-gb-icon" aria-hidden="true">{index === 0 ? "✦" : "⚑"}</span><span>{name}</span></button>)}</nav>}
        {panel === "gameboy" && game && <GameScreen focusRef={gameSurface} game={game} player={player} score={score} steps={steps} won={won} />}
      </div>
      <div className="hdev-brand">{panel === "gameboy" ? <>ixotic <strong>GAME BOY</strong><span>™</span></> : "iMac"}</div>
      {panel === "gameboy" && <div className="hdev-physical-controls"><div className="hdev-dpad" aria-label="Directional pad"><button className="hdev-up" aria-label="Move up" onClick={() => move(0, -1)}>▲</button><button className="hdev-left" aria-label="Move left" onClick={() => move(-1, 0)}>◀</button><span /><button className="hdev-right" aria-label="Move right" onClick={() => move(1, 0)}>▶</button><button className="hdev-down" aria-label="Move down" onClick={() => move(0, 1)}>▼</button></div><div className="hdev-ab"><button onClick={back} aria-label={game ? "B: Back to games" : "B: Back to room"}>B</button><button onClick={activate} aria-label={game ? "A: Restart game" : "A: Open selected game"}>A</button></div></div>}
      {panel === "gameboy" && <p className="hdev-help">{game ? "WASD / arrows / D-pad move · Button A / Space restart · B / Esc back" : "Arrows / D-pad choose · Button A / Enter open · B / Esc back"}</p>}
    </div>}
  </dialog>;
}


