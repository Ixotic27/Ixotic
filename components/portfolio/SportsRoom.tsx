"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { createTennisState, queueShot, requestServe, stepTennis, TENNIS, type ShotTechnique, type TennisState } from "../../lib/tennisPhysics";
import { racketPose, type CourtPoint } from "../../lib/tennisPresentation";
import "./sports-room.css";

type Props = { night: boolean; reducedMotion?: boolean; onPlayingChange?: (playing: boolean) => void };
type Swing = { at: number; contact: CourtPoint; technique: ShotTechnique };
type View = TennisState & { swing: Swing | null; rivalSwing: Swing | null };
const shots: { id: ShotTechnique; key: string; label: string }[] = [
  { id: "drive", key: "V", label: "Drive" }, { id: "topspin", key: "Z", label: "Topspin" },
  { id: "backspin", key: "X", label: "Backspin" }, { id: "smash", key: "C", label: "Smash" },
];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const copy = (s: TennisState, swing: Swing | null = null, rivalSwing: Swing | null = null): View => ({ ...s, ball: { ...s.ball }, scores: { ...s.scores }, swing, rivalSwing });
// Near court is z=+2; height is projected above the table plane.
function project(x: number, y: number, z: number) {
  const depth = clamp((z + 2) / 4, 0, 1);
  return { x: 600 + x / TENNIS.halfWidth * (85 + 60 * depth), y: 240 + depth * 320 - (y - TENNIS.tableY) * (95 + 54 * depth), scale: .66 + depth * .58 };
}

export default function SportsRoom({ night, reducedMotion = false, onPlayingChange }: Props) {
  const root = useRef<HTMLElement>(null), court = useRef<HTMLDivElement>(null), art = useRef<SVGSVGElement>(null);
  const physics = useRef(createTennisState()), target = useRef(0), keys = useRef({ left: false, right: false });
  const active = useRef(false), paused = useRef(false), visible = useRef(false);
  const onPlayingChangeRef = useRef(onPlayingChange), reportedPlaying = useRef(false);
  onPlayingChangeRef.current = onPlayingChange;
  const reportPlaying = useCallback(() => {
    const playing = active.current && !paused.current && visible.current && !document.hidden && !document.querySelector("dialog[open]") && physics.current.phase !== "won";
    if (reportedPlaying.current === playing) return;
    reportedPlaying.current = playing;
    onPlayingChangeRef.current?.(playing);
  }, []);
  const swings = useRef<{ player: Swing | null; rival: Swing | null }>({ player: null, rival: null });
  const elapsed = useRef(0);
  const paddleHeight = useRef(1.04);
  const [view, setView] = useState<View>(() => copy(physics.current));
  const [viewBox, setViewBox] = useState("0 0 1200 740");
  const [started, setStarted] = useState(false), [pauseUi, setPauseUi] = useState(false);
  const [status, setStatus] = useState("Ready to rally?");
  const paint = () => setView(copy(physics.current, swings.current.player, swings.current.rival));
  const focus = () => court.current?.focus({ preventScroll: true });
  const serve = () => { if (!paused.current && requestServe(physics.current)) { setStatus("Get ready!"); paint(); focus(); } };
  const start = () => {
    if (physics.current.phase === "won") physics.current = createTennisState();
    active.current = true; paused.current = false; setPauseUi(false); setStarted(true);
    reportPlaying();
    serve();
  };
  const restart = () => {
    physics.current = createTennisState(); target.current = 0; swings.current = { player: null, rival: null }; elapsed.current = 0; paddleHeight.current = 1.04;
    setStatus("Fresh match. First to seven, win by two."); start();
  };
  const togglePause = () => {
    if (!active.current || physics.current.phase === "won") return;
    paused.current = !paused.current; setPauseUi(paused.current);
    reportPlaying();
    if (!paused.current) focus();
  };
  const shot = (technique: ShotTechnique) => { queueShot(physics.current, technique); paint(); focus(); };

  useEffect(() => {
    const node = root.current; if (!node) return;
    const resize = new ResizeObserver(() => {
      const bounds = node.getBoundingClientRect();
      const width = clamp(740 * bounds.width / Math.max(1, bounds.height), 390, 1200);
      setViewBox(`${600 - width / 2} 0 ${width} 740`);
    });
    resize.observe(node);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.intersectionRatio >= .23;
      if (!visible.current && active.current && !paused.current && physics.current.phase !== "won") {
        paused.current = true; setPauseUi(true); keys.current = { left: false, right: false };
      }
      reportPlaying();
    }, { threshold: [0, .23, .6] });
    observer.observe(node);
    const hide = () => {
      if ((document.hidden || !!document.querySelector("dialog[open]")) && active.current && !paused.current && physics.current.phase !== "won") {
        paused.current = true; setPauseUi(true);
      }
      reportPlaying();
    };
    const blur = () => { keys.current = { left: false, right: false }; };
    const focusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !node.contains(event.relatedTarget)) blur();
    };
    document.addEventListener("visibilitychange", hide); window.addEventListener("blur", blur);
    node.addEventListener("focusout", focusOut);
    return () => { observer.disconnect(); resize.disconnect(); document.removeEventListener("visibilitychange", hide); window.removeEventListener("blur", blur); node.removeEventListener("focusout", focusOut); if (reportedPlaying.current) onPlayingChangeRef.current?.(false); reportedPlaying.current = false; };
  }, [reportPlaying]);
  useEffect(() => {
    let frame = 0, last = 0, accumulator = 0, lastPaint = 0;
    const tick = (time: number) => {
      if (!last) last = time;
      const delta = clamp((time - last) / 1000, 0, .08); last = time;
      if (active.current && !paused.current && visible.current && !document.hidden && !document.querySelector("dialog[open]")) {
        elapsed.current += delta * 1000;
        const incomingHeight = physics.current.ball.vz > 0 && physics.current.phase === "playing" ? clamp(physics.current.ball.y, .96, 1.38) : 1.04;
        paddleHeight.current += (incomingHeight - paddleHeight.current) * (1 - Math.exp(-delta * 18));
        if (keys.current.left !== keys.current.right) target.current = clamp(target.current + (keys.current.right ? 1 : -1) * 3.4 * delta, -1.1, 1.1);
        accumulator += delta;
        let steps = 0;
        while (accumulator >= TENNIS.step && steps++ < 12) {
          const event = stepTennis(physics.current, target.current); accumulator -= TENNIS.step;
          if (event === "hit") {
            const hit = physics.current;
            const contact = project(hit.ball.x, hit.ball.y, hit.ball.z);
            const swing: Swing = { at: elapsed.current, contact, technique: hit.activeTechnique };
            if (hit.lastHitter === "player") { swings.current.player = swing; setStatus(hit.lastTechnique + " return!"); }
            else swings.current.rival = swing;
          } else if (event === "point" || event === "win") {
            const s = physics.current;
            setStatus(event === "win" ? (s.winner === "player" ? "You win!" : "Ixotic wins!") : "Point to " + (s.lastPoint === "player" ? "you" : "Ixotic") + ". " + (s.server === "player" ? "Your" : "Ixotic’s") + " serve.");
          } else if (event === "serve") setStatus("Rally on!");
          if (event === "win") reportPlaying();
        }
        if (steps >= 12) accumulator = 0;
        if (time - lastPaint >= (reducedMotion ? 33 : 16)) { lastPaint = time; paint(); }
      } else {
        accumulator = 0;
        if (active.current && !paused.current && (document.hidden || !!document.querySelector("dialog[open]"))) {
          paused.current = true; setPauseUi(true);
        }
      }
      reportPlaying();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, reportPlaying]);
  const keyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!active.current || !root.current?.contains(document.activeElement)) return;
    if (e.code === "ArrowLeft" || e.code === "KeyA") { keys.current.left = true; e.preventDefault(); }
    if (e.code === "ArrowRight" || e.code === "KeyD") { keys.current.right = true; e.preventDefault(); }
    if (e.repeat) return;
    const technique = e.code === "KeyV" ? "drive" : e.code === "KeyZ" ? "topspin" : e.code === "KeyX" ? "backspin" : e.code === "KeyC" ? "smash" : null;
    if (technique) { e.preventDefault(); shot(technique); }
    if (e.code === "Space" && !(e.target instanceof HTMLElement && e.target.closest("button"))) { e.preventDefault(); serve(); }
    if (e.code === "KeyP") { e.preventDefault(); togglePause(); }
  };
  const keyUp = (e: KeyboardEvent<HTMLElement>) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = false;
  };
  const pointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!active.current || paused.current) return;
    const matrix = art.current?.getScreenCTM(); if (!matrix) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    target.current = clamp((point.x - 600) / 145 * TENNIS.halfWidth, -1.1, 1.1);
    if (e.type === "pointerdown") { court.current?.setPointerCapture(e.pointerId); focus(); }
  };
  const ball = project(view.ball.x, view.ball.y, view.ball.z), shadow = project(view.ball.x, TENNIS.tableY, view.ball.z);
  const player = project(view.player, paddleHeight.current, 2.05), rival = project(view.opponent, 1.04, -2.05);
  const playerSwing = !reducedMotion && view.swing && elapsed.current - view.swing.at < 360 ? view.swing : null;
  const rivalSwing = !reducedMotion && view.rivalSwing && elapsed.current - view.rivalSwing.at < 320 ? view.rivalSwing : null;
  const playerRacket = racketPose({ x: player.x, y: player.y }, playerSwing?.contact ?? null, playerSwing?.technique ?? "drive", playerSwing ? elapsed.current - playerSwing.at : 360, "player");
  const rivalRacket = racketPose({ x: rival.x + 24, y: rival.y - 16 }, rivalSwing?.contact ?? null, "drive", rivalSwing ? elapsed.current - rivalSwing.at : 320, "opponent");
  // Feet stay behind the far rail; the table is painted in front of the body.
  const rivalBody = { x: rival.x - 42, y: rival.y - 104 };
  const rivalGrip = rivalRacket.grip;
  return <section ref={root} id="sports" className={`room-chapter sports-room ${night ? "sports-night" : "sports-day"}`} aria-labelledby="sports-title" onKeyDown={keyDown} onKeyUp={keyUp}>
    <div className="room-scene-surface sports-surface">
      <svg ref={art} className="sports-art" viewBox={viewBox} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated table tennis room with a perspective court, Ixotic on the far side, and your paddle near the bottom" shapeRendering="crispEdges">
        <path fill={night ? "#435d70" : "#7694a6"} d="M0 0h1200v740H0z"/>
        <path fill={night ? "#597284" : "#adc5c9"} d="M0 0h1200L755 108H445z"/>
        <path fill={night ? "#526b82" : "#8dacc0"} d="M0 0l445 108v132L0 690z"/>
        <path fill={night ? "#3e5b71" : "#7294ab"} d="M1200 0L755 108v132l445 450z"/>
        <path fill={night ? "#6e8798" : "#a9c2ca"} d="M445 108h310v132H445z"/>
        <path fill="#bb9673" d="M445 240h310l445 450v50H0v-50z"/>
        <path fill="#ccaa83" d="M445 240h310l445 450H0z"/>
        <path d="M0 0l445 108h310L1200 0M0 690l445-450h310l445 450M445 108v132m310-132v132" fill="none" stroke={night ? "#2d485c" : "#557b8c"} strokeWidth="11"/>
        <path d="M0 0l445 108M1200 0L755 108M0 690l445-450m755 450L755 240M445 240h310" fill="none" stroke="#e3d4b5" strokeWidth="4"/>
        <path d="M0 690h1200M59 630h1082M128 560h944M202 486h796M280 407h640M445 240L0 740M507 240L253 740M569 240L505 740M631 240L695 740M693 240l254 500M755 240l445 500" fill="none" stroke="#9d785d" strokeWidth="4"/>
        <g className="sports-right-wall-art">
        <path fill="#42616c" d="M790.94 129.38 L949.06 124.71 L949.06 346.16 L790.94 233.85 Z"/><path fill={night ? "#354c63" : "#a7d0d1"} d="M802.87 136.75 L937.13 139.56 L937.13 321.98 L802.87 233.96 Z"/>
        <path fill={night ? "#f3dfad" : "#f4d08a"} d="M862.54 157.68 L883.43 160.05 L883.43 166.92 L890.39 167.92 L890.39 189.16 L883.43 187.55 L883.43 194.43 L862.54 188.99 L862.54 182.73 L855.58 181.12 L855.58 162.95 L862.54 163.94 Z"/>
        <path fill="#536778" d="M802.87 213.36 L818.78 221.65 L818.78 202.46 L840.66 211.38 L840.66 233.05 L860.55 243.41 L860.55 200.88 L882.43 207.86 L882.43 254.82 L900.33 264.14 L900.33 228.33 L918.23 235.10 L918.23 273.47 L937.13 283.32 L937.13 321.98 L802.87 233.96 Z"/>
        <path fill="#e4d6b8" d="M864.53 138.04 L872.49 138.21 L872.49 279.60 L864.53 274.38 Z M798.90 179.30 L941.10 222.93 L941.10 231.50 L798.90 183.69 Z M780.00 218.96 L960.00 336.97 L960.00 353.93 L780.00 226.08 Z"/>
        </g>
        <g className="sports-left-wall-art">
        <path fill="#526762" d="M250.00 143.51 L420.00 137.87 L420.00 219.54 L250.00 331.77 Z"/><path fill="#e4d6b8" d="M261.69 157.04 L408.31 145.10 L408.31 220.41 L261.69 310.13 Z"/><path fill="#284957" d="M274.44 169.30 L395.56 153.60 L395.56 220.07 L274.44 287.82 Z"/>
        <path fill="#ead7af" d="M287.19 181.49 L382.81 164.07 L382.81 169.20 L287.19 189.57 Z M293.56 214.09 L329.69 202.76 L329.69 240.48 L293.56 257.99 Z M344.56 198.09 L379.63 187.09 L379.63 216.27 L344.56 233.27 Z"/>
        <path fill="#8fc3ba" d="M333.94 191.94 L342.44 189.65 L342.44 243.41 L333.94 247.90 Z"/><path fill="#e7ad7e" d="M302.06 222.31 L321.19 215.47 L321.19 234.55 L302.06 242.99 Z M353.06 204.07 L372.19 197.23 L372.19 212.07 L353.06 220.50 Z"/>
        </g>
        <path fill="#806451" d="M490 143h176v11H490zM501 154h10v20h-10zM645 154h10v20h-10z"/>
        <circle cx="537" cy="198" r="21" fill="#e7c99b"/><circle cx="537" cy="198" r="16" fill="#b95352"/><path fill="#a66d57" d="M533 219h8v20h-8z"/>
        <circle cx="620" cy="198" r="21" fill="#e7c99b"/><circle cx="620" cy="198" r="16" fill="#397c91"/><path fill="#a66d57" d="M616 219h8v20h-8z"/>
        <path fill="#334f5c" d="M1048 163h22v58h-22z"/><path fill="#e7c99b" d="M1020 228l23-58h30l23 58z"/><path fill="#ead7af" d="M1039 219h40v9h-40z"/>
        <g transform={`translate(${rivalBody.x} ${rivalBody.y})`}>
          <path fill="#334d64" d="M13 91h27v31H9zm32 0h27l5 31H46z"/>
          <path fill="#c87967" d="M8 40h67v58H8z"/>
          <path fill="#e2aa79" d="M26 8h33v39H26z"/><path fill="#203942" d="M23 12Q27-7 58 3l5 16-11-8-27 9z"/>
          <path d={`M11 55L-9 77 16 91M73 55L99 84 ${rivalGrip.x-rivalBody.x} ${rivalGrip.y-rivalBody.y}`} fill="none" stroke="#e2aa79" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
          <circle cx={rivalGrip.x-rivalBody.x} cy={rivalGrip.y-rivalBody.y} r="7" fill="#e2aa79"/>
          <path fill="#203942" d="M34 24h4v4h-4zm17 0h4v4h-4z"/>
        </g>
        <path fill="#7d5946" d="M458 548h17v128h-17zm268 0h17v128h-17zM514 270h12v106h-12zm160 0h12v106h-12z"/>
        <path fill="#344e57" d="M510 235h180l64 341H446z"/><path fill="#337787" d="M515 240h170l62 325H453z"/><path fill="#4e9daa" d="M520 246h160l58 307H462z"/>
        <path d="M600 246v307M462 553h276M520 246h160" fill="none" stroke="#e8dec2" strokeWidth="5"/>
        <path fill="#354f56" d="M485 376h230v5H485z"/><path fill="#c9d8cf" opacity=".65" d="M485 381h230v19H485z"/><path d="M485 374v31m230-31v31M489 387h222m-222 7h222" stroke="#e8dec2" strokeWidth="3"/>
        <ellipse cx={shadow.x} cy={shadow.y} rx={10*shadow.scale} ry={4*shadow.scale} fill="#244756" opacity={reducedMotion ? .25 : .38}/>

        <g transform={`translate(${rivalGrip.x} ${rivalGrip.y}) rotate(${rivalRacket.angle})`}><path fill="#a66d57" d="M-5-34h10V2H-5z"/><path fill="#314955" d="M-6-5H6V4H-6z"/><circle cy="-42" r="21" fill="#e7c99b"/><circle cy="-42" r="17" fill="#397c91"/></g>
        <ellipse cx={rivalGrip.x + 3} cy={rivalGrip.y - 1} rx="3" ry="5" fill="#e2aa79"/>
        <circle cx={ball.x} cy={ball.y} r={Math.max(5, 7*ball.scale)} fill="#f6e5b8" stroke="#d3aa77" strokeWidth="2"/>
        <g transform={`translate(${playerRacket.grip.x} ${playerRacket.grip.y}) rotate(${playerRacket.angle})`}><path fill="#a66d57" d="M-7-51h14V3H-7z"/><path fill="#485d59" d="M-8-13h16V4H-8z"/><circle cy="-67" r="34" fill="#e7c99b"/><circle cy="-67" r="28" fill="#b95352"/></g>
        <path fill="#7c594b" d="M1027 513h107v103h-107z"/><path fill="#d5ba8d" d="M1018 503h125v16h-125z"/><path fill="#4a6665" d="M1040 542h80v8h-80zm0 22h80v8h-80z"/><circle cx="1050" cy="494" r="8" fill="#f2dfb3"/><circle cx="1074" cy="494" r="8" fill="#f2dfb3"/>
      </svg>
      <div className="sports-room-label"><span>ROOM 03 · TABLE TENNIS</span><h2 id="sports-title">A little friendly competition.</h2></div>
      <div className="sports-score" aria-live="polite"><span>You <b>{view.scores.player}</b></span><i>FIRST TO 7 · WIN BY 2</i><span>Ixotic <b>{view.scores.opponent}</b></span></div>
      <div ref={court} className="sports-court-input" tabIndex={0} role="group" aria-label="Table tennis court. Move with pointer or touch, left and right arrows or A and D. Space serves. P pauses." onPointerDown={pointer} onPointerMove={pointer}/>
      <div className="sports-console">
        <div className="sports-status" role="status" aria-live="polite">{pauseUi ? "Paused. Your rally is waiting." : view.phase === "countdown" ? `Serve in ${Math.max(1, Math.ceil(view.countdown))}…` : status}</div>
        {!started ? <button type="button" className="sports-primary" onClick={start}>Step up to the table ↗</button> : view.phase === "won" ? <button type="button" className="sports-primary" onClick={restart}>Rematch ↗</button> : <div className="sports-actions"><button type="button" onClick={pauseUi ? togglePause : view.phase === "ready" ? serve : togglePause}>{pauseUi ? "Resume · P" : view.phase === "ready" ? "Serve · Space" : "Pause · P"}</button><button type="button" onClick={restart}>Restart</button></div>}
        <div className="sports-shots" aria-label="Choose your next return">{shots.map(s => <button type="button" key={s.id} onClick={() => shot(s.id)} aria-pressed={view.pendingTechnique === s.id} disabled={!started || view.phase === "won"}><kbd>{s.key}</kbd>{s.label}</button>)}</div>
        <p className="sports-help">Move: pointer, touch, ← → or A/D · Return: V/Z/X/C · Serve: Space · Pause: P</p>
      </div>
      <a className="sports-next" href="#door">Out to the little world ↓</a>
    </div>
  </section>;
}



