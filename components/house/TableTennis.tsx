'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createTennisState, queueShot, requestServe, stepTennis, TENNIS, type ShotTechnique, type TennisState } from '../../lib/tennisPhysics';
import './tennis.css';

type Props = { onClose: () => void; reducedMotion: boolean };
type Display = { phase: TennisState['phase']; countdown: number; player: number; opponent: number;
  winner: TennisState['winner']; lastPoint: TennisState['lastPoint']; rally: number;
  pendingTechnique: ShotTechnique; lastTechnique: ShotTechnique };
const display = (s: TennisState): Display => ({ phase: s.phase, countdown: Math.ceil(s.countdown),
  player: s.scores.player, opponent: s.scores.opponent, winner: s.winner,
  lastPoint: s.lastPoint, rally: s.rally, pendingTechnique: s.pendingTechnique,
  lastTechnique: s.lastTechnique });

const techniques: { id: ShotTechnique; key: string; label: string; tip: string }[] = [
  { id: 'drive', key: 'V', label: 'Drive', tip: 'Balanced return with a steady arc.' },
  { id: 'topspin', key: 'Z', label: 'Topspin', tip: 'Brush up to dip the ball sooner.' },
  { id: 'backspin', key: 'X', label: 'Backspin', tip: 'Slice under for a slower, floating return.' },
  { id: 'smash', key: 'C', label: 'Smash', tip: 'Strike fast and low when you can reach it.' },
];

export default function TableTennis({ onClose, reducedMotion }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const courtRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<TennisState>(createTennisState());
  const targetRef = useRef(0);
  const pausedRef = useRef(false);
  const closeRef = useRef(onClose);
  const [ui, setUi] = useState<Display>(() => display(gameRef.current));
  const [paused, setPaused] = useState(false);
  const [renderError, setRenderError] = useState(false);
  closeRef.current = onClose;

  const refresh = () => setUi(display(gameRef.current));
  const selectTechnique = (technique: ShotTechnique) => {
    queueShot(gameRef.current, technique);
    refresh();
  };
  const serve = () => { if (!pausedRef.current && requestServe(gameRef.current)) refresh(); };
  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };
  const restart = () => {
    gameRef.current = createTennisState();
    targetRef.current = 0;
    pausedRef.current = false;
    setPaused(false);
    refresh();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    const onCancel = (event: Event) => { event.preventDefault(); closeRef.current(); };
    dialog.addEventListener('cancel', onCancel);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      if (dialog.open) dialog.close();
      if ((previousFocus instanceof HTMLElement || previousFocus instanceof SVGElement) && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const host = courtRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    } catch {
      setRenderError(true);
      return;
    }
    renderer.setClearColor(0x122139);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'htt-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#122139');
    const camera = new THREE.OrthographicCamera(-3.4, 3.4, 2.8, -2.8, 0.1, 30);
    camera.position.set(0, 2.5, 6.4);
    camera.lookAt(0, 0.9, 0);
    const ambient = new THREE.AmbientLight(0xffffff, 2.3);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffe4b5, 2.0);
    light.position.set(-3, 7, 5);
    scene.add(light);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const mat = (color: string) => { const m = new THREE.MeshLambertMaterial({ color, flatShading: true }); materials.push(m); return m; };
    const ink = mat('#10253d'), cyan = mat('#3a9da9'), cyanSide = mat('#236574');
    const cream = mat('#fff1d2');
    const wood = mat('#a66d57'), navy = mat('#1b3951');
    const skin = mat('#E2AA79'), shirt = mat('#C87967');
    const redRubber = mat('#d95450'), blueRubber = mat('#397c91'), rim = mat('#daa676');
    const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
      const geo = new THREE.BoxGeometry(w, h, d); geometries.push(geo);
      const mesh = new THREE.Mesh(geo, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    };
    box(8.6, 0.08, 9.2, ink, 0, -0.08, 0);
    for (let i = -3; i <= 3; i++) box(0.025, 0.008, 8.7, navy, i * 0.98, -0.025, 0);
    box(2.64, 0.13, 4.20, cyanSide, 0, TENNIS.tableY - 0.09, 0);
    box(2.43, 0.035, 4.03, cyan, 0, TENNIS.tableY - 0.01, 0);
    for (const x of [-1.17, 1.17]) box(0.032, 0.012, 4.02, cream, x, TENNIS.tableY + 0.014, 0);
    for (const z of [-1.98, 1.98]) box(2.38, 0.012, 0.032, cream, 0, TENNIS.tableY + 0.014, z);
    box(0.025, 0.012, 3.94, cream, 0, TENNIS.tableY + 0.014, 0);
    for (const x of [-1.05, 1.05]) for (const z of [-1.76, 1.76]) box(0.13, 0.72, 0.13, wood, x, 0.36, z);
    box(2.63, 0.19, 0.034, cream, 0, TENNIS.tableY + 0.11, 0);
    box(2.72, 0.035, 0.07, ink, 0, TENNIS.tableY + 0.205, 0);
    for (const x of [-1.31, 1.31]) box(0.045, 0.34, 0.045, navy, x, TENNIS.tableY + 0.12, 0);

    const makePaddle = (face: THREE.Material) => {
      const paddle = new THREE.Group(); scene.add(paddle);
      const blade = new THREE.Shape();
      blade.absellipse(0, 0, 0.285, 0.335, 0, Math.PI * 2, false, 0);
      const edgeGeo = new THREE.ExtrudeGeometry(blade, { depth: 0.075, bevelEnabled: true,
        bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 1, curveSegments: 32 });
      geometries.push(edgeGeo);
      const edge = new THREE.Mesh(edgeGeo, rim); edge.position.z = -0.038; paddle.add(edge);
      for (const z of [-0.052, 0.052]) {
        const faceGeo = new THREE.ShapeGeometry(blade, 32); geometries.push(faceGeo);
        const rubber = new THREE.Mesh(faceGeo, face);
        rubber.position.z = z; if (z < 0) rubber.rotation.y = Math.PI;
        paddle.add(rubber);
      }
      box(0.115, 0.15, 0.08, rim, 0, -0.385, 0, paddle);
      box(0.145, 0.34, 0.095, wood, 0, -0.605, 0, paddle);
      box(0.15, 0.032, 0.1, navy, 0, -0.765, 0, paddle);
      return paddle;
    };
    const playerPaddle = makePaddle(redRubber);
    const rivalPaddle = makePaddle(blueRubber);
    const avatar = new THREE.Group(); scene.add(avatar);
    const portrait = document.createElement('canvas'); portrait.width = 384; portrait.height = 640;
    const brush = portrait.getContext('2d')!;
    const shape = (path: string, fill: string) => { brush.fillStyle = fill; brush.fill(new Path2D(path)); };
    shape('M133 373 L125 588 Q143 611 164 588 L191 430 L217 587 Q236 608 254 586 L245 373Z', '#334D64');
    shape('M125 580 L112 614 Q140 633 170 615 L164 583Z M217 583 L212 617 Q249 632 269 613 L252 580Z', '#203942');
    shape('M124 214 Q81 231 69 293 L46 376 Q48 401 69 394 L109 323 L132 278Z', '#E2AA79');
    shape('M135 207 L247 207 Q274 224 284 266 L254 290 L248 390 Q192 412 125 389 L126 284 L94 265 Q106 224 135 207Z', '#C87967');
    shape('M161 171 L159 210 Q187 244 222 212 L218 172Z', '#CE9367');
    shape('M129 91 Q135 40 194 45 Q255 47 258 104 L248 165 Q225 207 188 200 Q144 192 132 154Z', '#E2AA79');
    shape('M128 133 Q107 69 144 46 Q160 14 214 31 Q279 39 260 123 L241 111 L233 75 Q203 107 149 88 L148 132Z', '#203942');
    brush.fillStyle = '#203942'; brush.fillRect(158,125,7,8); brush.fillRect(218,125,7,8);
    brush.strokeStyle = '#9B624C'; brush.lineWidth = 4; brush.beginPath(); brush.moveTo(179,166); brush.quadraticCurveTo(195,176,211,164); brush.stroke();
    const portraitTexture = new THREE.CanvasTexture(portrait); portraitTexture.colorSpace = THREE.SRGBColorSpace;
    const portraitMaterial = new THREE.SpriteMaterial({ map: portraitTexture }); materials.push(portraitMaterial);
    const person = new THREE.Sprite(portraitMaterial); person.scale.set(1.12,1.87,1); person.position.y = .98; avatar.add(person);
    // A jointed arm keeps the visible hand around the moving paddle handle.
    const armGeo = new THREE.CylinderGeometry(0.075, 0.09, 1, 8); geometries.push(armGeo);
    const sleeve = new THREE.Mesh(armGeo, shirt); scene.add(sleeve);
    const forearm = new THREE.Mesh(armGeo, skin); scene.add(forearm);
    const palmGeo = new THREE.SphereGeometry(0.105, 8, 6); geometries.push(palmGeo);
    const palm = new THREE.Mesh(palmGeo, skin); scene.add(palm);
    const shoulder = new THREE.Vector3(), elbow = new THREE.Vector3(), grip = new THREE.Vector3();
    const armUp = new THREE.Vector3(0, 1, 0), armDirection = new THREE.Vector3();
    const placeSegment = (segment: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3) => {
      segment.position.copy(from).add(to).multiplyScalar(0.5);
      segment.scale.y = from.distanceTo(to);
      segment.quaternion.setFromUnitVectors(armUp, armDirection.subVectors(to, from).normalize());
    };
    const ballGeo = new THREE.SphereGeometry(TENNIS.ballRadius, 16, 12); geometries.push(ballGeo);
    const ballMesh = new THREE.Mesh(ballGeo, cream); scene.add(ballMesh);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x183949, transparent: true, opacity: 0.34 }); materials.push(shadowMat);
    const shadowGeo = new THREE.CircleGeometry(0.09, 8); geometries.push(shadowGeo);
    const ballShadow = new THREE.Mesh(shadowGeo, shadowMat);
    ballShadow.rotation.x = -Math.PI / 2; scene.add(ballShadow);

    let width = 0, height = 0, contextLost = false;
    const resize = () => {
      if (contextLost) return;
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w === width && h === height) return;
      width = w; height = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h, false);
      const halfHeight = Math.max(2.05, 1.65 * h / w);
      camera.left = -halfHeight * w / h; camera.right = halfHeight * w / h;
      camera.top = halfHeight; camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(host); resize();

    const keys = { left: false, right: false };
    const keydown = (ev: KeyboardEvent) => {
      if (ev.code === 'ArrowLeft' || ev.code === 'KeyA') { keys.left = true; ev.preventDefault(); }
      if (ev.code === 'ArrowRight' || ev.code === 'KeyD') { keys.right = true; ev.preventDefault(); }
      const technique = ev.code === 'KeyV' ? 'drive' : ev.code === 'KeyZ' ? 'topspin' : ev.code === 'KeyX' ? 'backspin' : ev.code === 'KeyC' ? 'smash' : null;
      if (technique) { ev.preventDefault(); if (!ev.repeat) { queueShot(gameRef.current, technique); setUi(display(gameRef.current)); } }
      if (ev.code === 'Space' && !(ev.target instanceof HTMLElement && ev.target.closest('button'))) {
        ev.preventDefault(); if (!ev.repeat && gameRef.current.phase === 'ready' && !pausedRef.current) { requestServe(gameRef.current); setUi(display(gameRef.current)); }
      }
      if (ev.code === 'KeyP') { ev.preventDefault(); if (!ev.repeat) { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); } }
    };
    const keyup = (ev: KeyboardEvent) => { if (ev.code === 'ArrowLeft' || ev.code === 'KeyA') keys.left = false; if (ev.code === 'ArrowRight' || ev.code === 'KeyD') keys.right = false; };
    const blur = () => { keys.left = false; keys.right = false; };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', blur);
    const pointermove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      targetRef.current = Math.max(-1.1, Math.min(1.1, ((ev.clientX - rect.left) / rect.width * 2 - 1) * camera.right));
    };
    const pointerdown = (ev: PointerEvent) => {
      renderer.domElement.setPointerCapture(ev.pointerId);
      pointermove(ev);
    };
    renderer.domElement.addEventListener('pointermove', pointermove);
    renderer.domElement.addEventListener('pointerdown', pointerdown);
    const onVisibility = () => {
      if (document.hidden && !pausedRef.current) { pausedRef.current = true; setPaused(true); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    let frame = 0, last = 0, accumulator = 0, lastCount = -1;
    let playerSwing = -1, rivalSwing = -1, animationTime = 0;
    let playerHeight = 1;
    let playerSwingKind: ShotTechnique = 'drive';
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      pausedRef.current = true;
      setPaused(true);
      setRenderError(true);
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    const tick = (time: number) => {
      if (contextLost) return;
      if (!last) last = time;
      const delta = Math.min(0.08, Math.max(0, (time - last) / 1000)); last = time;
      if (!pausedRef.current && !document.hidden) {
        animationTime += delta * 1000;
        if (keys.left !== keys.right) targetRef.current = Math.max(-1.1, Math.min(1.1, targetRef.current + (keys.right ? 1 : -1) * 3.4 * delta));
        accumulator += delta;
        let iterations = 0;
        while (accumulator >= TENNIS.step && iterations++ < 12) {
          const event = stepTennis(gameRef.current, targetRef.current);
          if (event === 'hit') {
            if (gameRef.current.lastHitter === 'player') {
              playerSwing = animationTime; playerSwingKind = gameRef.current.lastTechnique;
              setUi(display(gameRef.current));
            } else rivalSwing = animationTime;
          }
          if (event === 'point' || event === 'win' || event === 'serve') setUi(display(gameRef.current));
          accumulator -= TENNIS.step;
        }
        if (iterations >= 12) accumulator = 0;
        const count = Math.ceil(gameRef.current.countdown);
        if (gameRef.current.phase === 'countdown' && count !== lastCount) { lastCount = count; setUi(display(gameRef.current)); }
      } else accumulator = 0;
      const s = gameRef.current;
      const incomingHeight = s.phase === 'playing' && s.ball.vz > 0 ? Math.max(.9, Math.min(1.4, s.ball.y)) : 1;
      if (!pausedRef.current) playerHeight += (incomingHeight - playerHeight) * (1 - Math.exp(-delta * 18));
      playerPaddle.position.set(s.player, playerHeight, 2.05);
      rivalPaddle.position.set(s.opponent, 1.0, -2.05);
      const swing = (paddle: THREE.Group, started: number, kind: ShotTechnique, opponent = false) => {
        const age = started < 0 ? 1 : (animationTime - started) / (reducedMotion ? 140 : 340);
        const active = Math.max(0, 1 - Math.min(1, age));
        const stroke = Math.sin(Math.min(1, age) * Math.PI);
        paddle.position.y += active * (kind === 'smash' ? 0.10 : 0.035);
        paddle.position.z += (opponent ? 1 : -1) * stroke * (kind === 'smash' ? 0.25 : 0.16);
        paddle.rotation.z = (opponent ? -1 : 1) * active * (kind === 'topspin' ? -0.36 : kind === 'backspin' ? 0.33 : -0.14);
        paddle.rotation.x = (opponent ? -1 : 1) * stroke * (kind === 'smash' ? -0.75 : kind === 'topspin' ? 0.48 : kind === 'backspin' ? -0.45 : 0.24);
        paddle.rotation.y = (opponent ? -1 : 1) * stroke * 0.16;
      };
      swing(playerPaddle, playerSwing, playerSwingKind);
      if (playerSwing < 0 || animationTime - playerSwing > 340) {
        playerPaddle.rotation.x = s.pendingTechnique === 'topspin' ? -.22 : s.pendingTechnique === 'backspin' ? .3 : s.pendingTechnique === 'smash' ? -.42 : 0;
        playerPaddle.rotation.z = s.pendingTechnique === 'smash' ? -.18 : 0;
      }
      swing(rivalPaddle, rivalSwing, 'drive', true);
      // Keep the hit surface on the physics line and put Ixotic's body to its left.
      // The animated arm reaches the handle through every paddle swing.
      avatar.position.set(s.opponent - 0.39, 0, -2.43);
      avatar.updateMatrixWorld(true);
      rivalPaddle.updateMatrixWorld(true);
      avatar.localToWorld(shoulder.set(0.28, 1.27, 0));
      rivalPaddle.localToWorld(grip.set(0, -0.605, 0));
      elbow.copy(shoulder).lerp(grip, 0.42); elbow.z += 0.08;
      placeSegment(sleeve, shoulder, elbow);
      placeSegment(forearm, elbow, grip);
      palm.position.copy(grip);
      ballMesh.position.set(s.ball.x, s.ball.y, s.ball.z);
      ballShadow.position.set(s.ball.x, TENNIS.tableY + 0.018, s.ball.z);
      ballShadow.visible = Math.abs(s.ball.x) < 1.16 && Math.abs(s.ball.z) < 2.0;
      shadowMat.opacity = reducedMotion ? 0.26 : Math.max(0.08, 0.38 - (s.ball.y - TENNIS.tableY) * 0.2);
      if (!document.hidden) renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', blur);
      renderer.domElement.removeEventListener('pointermove', pointermove);
      renderer.domElement.removeEventListener('pointerdown', pointerdown);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      document.removeEventListener('visibilitychange', onVisibility);
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); portraitTexture.dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <dialog ref={dialogRef} className="htt-dialog" aria-label="Table tennis match">
    <div className="htt-shell">
      <header className="htt-header">
        <div><span className="htt-kicker">SPORTS ROOM · SHORT MATCH</span><h2>Table tennis</h2></div>
        <button className="htt-exit" type="button" onClick={onClose} aria-label="Exit table tennis">✕ <span>Exit</span></button>
      </header>
      <div className="htt-scoreboard" aria-live="polite">
        <div className="htt-score"><span>You</span><strong>{ui.player}</strong></div>
        <div className="htt-score-middle">FIRST TO 7 <span>WIN BY 2</span></div>
        <div className="htt-score"><span>Ixotic</span><strong>{ui.opponent}</strong></div>
      </div>
      <div className="htt-stage">
        <div ref={courtRef} className="htt-court" tabIndex={0} role="group" aria-label="Table tennis court. Move with pointer, touch, arrow keys or A and D. Z topspin, X backspin, C smash, V drive. Space serves." />
        {renderError && <div className="htt-overlay"><p>3D graphics are unavailable on this device.</p><button type="button" onClick={onClose}>Return to house</button></div>}
        {!renderError && (ui.phase === 'ready' || ui.phase === 'countdown' || ui.phase === 'won' || paused) &&
          <div className="htt-overlay" aria-live="polite">
            {ui.phase === 'won' ? <><strong>{ui.winner === 'player' ? 'You win!' : 'Ixotic wins'}</strong><p>Final score {ui.player}–{ui.opponent}</p><button type="button" onClick={restart}>Rematch</button></>
              : paused ? <><strong>Paused</strong><p>Your rally is waiting.</p><button type="button" onClick={togglePause}>Resume match</button></>
              : ui.phase === 'countdown' ? <><strong className="htt-count">{ui.countdown || 'GO'}</strong><p>Get ready to return the ball.</p></>
              : <><strong>{ui.lastPoint ? (ui.lastPoint === 'player' ? 'Point to you' : 'Point to Ixotic') : 'Ready to rally?'}</strong><p>{ui.lastPoint ? `Next serve: ${gameRef.current.server === 'player' ? 'you' : 'Ixotic'}.` : 'Move your paddle. It swings automatically when the ball reaches you.'}</p><button type="button" onClick={serve}>Serve · Space</button></>}
          </div>}
      </div>
      <div className="htt-techniques" aria-label="Choose your next return">
        <div className="htt-technique-heading" role="status"><strong>Next return: {techniques.find(technique => technique.id === ui.pendingTechnique)?.label}</strong><span>{techniques.find(technique => technique.id === ui.pendingTechnique)?.tip} Select before contact; resets to Drive after the shot.</span></div>
        <div className="htt-technique-buttons">{techniques.map(technique => <button key={technique.id} type="button"
          aria-pressed={ui.pendingTechnique === technique.id} onClick={() => selectTechnique(technique.id)}
          disabled={ui.phase === 'won' || renderError}>
          <kbd>{technique.key}</kbd>{technique.label}
        </button>)}</div>
      </div>
      <div className="htt-footer">
        <p><b>Move</b> pointer, touch, ← → or A/D <span>·</span> <b>Shot</b> V/Z/X/C <span>·</span> <b>Serve</b> Space <span>·</span> <b>Pause</b> P</p>
        <div className="htt-actions"><button type="button" onClick={togglePause} disabled={ui.phase === 'won' || renderError}>{paused ? 'Resume' : 'Pause'}</button><button type="button" onClick={restart} disabled={renderError}>Restart</button></div>
      </div>
    </div>
  </dialog>;
}
