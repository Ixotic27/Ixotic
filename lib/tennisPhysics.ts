/** Fixed-step arcade table tennis. Coordinates are metres in a small, real 3D court. */
export const TENNIS = {
  halfWidth: 1.18,
  halfLength: 2.0,
  tableY: 0.76,
  netHeight: 0.18,
  ballRadius: 0.045,
  gravity: 4.6,
  step: 1 / 120,
} as const;

export type Side = 'player' | 'opponent';
export type Phase = 'ready' | 'countdown' | 'playing' | 'won';
export type ShotTechnique = 'drive' | 'topspin' | 'backspin' | 'smash';
export type Ball = { x: number; y: number; z: number; vx: number; vy: number; vz: number };
export type TennisEvent = 'serve' | 'hit' | 'bounce' | 'net' | 'point' | 'win' | null;

export type TennisState = {
  ball: Ball;
  phase: Phase;
  countdown: number;
  player: number;
  playerVelocity: number;
  opponent: number;
  opponentTarget: number;
  opponentThink: number;
  seed: number;
  lastHitter: Side;
  validBounce: boolean;
  bounces: number;
  scores: { player: number; opponent: number };
  server: Side;
  winner: Side | null;
  lastPoint: Side | null;
  rally: number;
  pendingTechnique: ShotTechnique;
  lastTechnique: ShotTechnique;
  activeTechnique: ShotTechnique;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const other = (side: Side): Side => side === 'player' ? 'opponent' : 'player';

function random(state: TennisState): number {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}

export function createTennisState(seed = 0x127cafe): TennisState {
  return {
    ball: { x: 0, y: 1.05, z: 1.83, vx: 0, vy: 0, vz: 0 },
    phase: 'ready', countdown: 0, player: 0, playerVelocity: 0,
    opponent: 0, opponentTarget: 0, opponentThink: 0, seed: seed >>> 0,
    lastHitter: 'player', validBounce: false, bounces: 0,
    scores: { player: 0, opponent: 0 }, server: 'player',
    winner: null, lastPoint: null, rally: 0,
    pendingTechnique: 'drive', lastTechnique: 'drive', activeTechnique: 'drive',
  };
}

/** Selects the technique for the next successful player return. */
export function queueShot(state: TennisState, technique: ShotTechnique): void {
  if (state.phase === 'won') return;
  state.pendingTechnique = technique;
}

export function requestServe(state: TennisState): boolean {
  if (state.phase !== 'ready') return false;
  state.phase = 'countdown';
  state.countdown = 1.8;
  return true;
}

function launch(state: TennisState): void {
  const fromPlayer = state.server === 'player';
  const x = fromPlayer ? state.player : state.opponent;
  const target = fromPlayer ? state.opponent : state.player;
  state.ball = {
    x, y: 1.06, z: fromPlayer ? 1.78 : -1.78,
    vx: clamp((target - x) * 0.62, -0.72, 0.72),
    vy: 1.05, vz: fromPlayer ? -4.15 : 4.15,
  };
  state.lastHitter = state.server;
  state.activeTechnique = 'drive';
  state.validBounce = false;
  state.bounces = 0;
  state.phase = 'playing';
}

function award(state: TennisState, side: Side): TennisEvent {
  state.scores[side] += 1;
  state.lastPoint = side;
  state.server = other(side);
  state.rally = 0;
  if (state.scores[side] >= 7 && state.scores[side] - state.scores[other(side)] >= 2) {
    state.phase = 'won';
    state.winner = side;
    return 'win';
  }
  state.phase = 'ready';
  state.ball = { x: state.server === 'player' ? state.player : state.opponent,
    y: 1.06, z: state.server === 'player' ? 1.78 : -1.78,
    vx: 0, vy: 0, vz: 0 };
  return 'point';
}

function hit(state: TennisState, side: Side): void {
  const b = state.ball;
  const technique = side === 'player' ? state.pendingTechnique : 'drive';
  const hitterX = side === 'player' ? state.player : state.opponent;
  const offset = clamp(b.x - hitterX, -0.46, 0.46);
  const aim = side === 'player'
    ? clamp(offset * 1.25 + state.playerVelocity * 0.13, -0.82, 0.82)
    : clamp((random(state) - 0.5) * 2.2, -1.0, 1.0);
  const speed = side === 'player'
    ? ({ drive: 4.2, topspin: 5.1, backspin: 3.65, smash: 6.1 } as const)[technique]
    : 4.2;
  b.x = clamp(b.x, -1.12, 1.12);
  b.y = technique === 'drive' ? Math.max(1.08, b.y) : clamp(b.y, 1.08, 1.34);
  b.z = side === 'player' ? 1.86 : -1.86;
  b.vx = clamp((aim - b.x) * (side === 'opponent' ? 0.98 : 0.58), -1.46, 1.46);
  if (side === 'player' && technique !== 'drive') {
    // Aim each arc at a legal far-side landing point. The faster smash needs
    // enough height at the net even when the return is taken low.
    const landingZ = ({ drive: -0.72, topspin: -1.04, backspin: -0.65, smash: -1.26 } as const)[technique];
    const gravity = technique === 'topspin' ? 5.7 : technique === 'backspin' ? 4.0 : TENNIS.gravity;
    const flight = (b.z - landingZ) / speed;
    b.vy = (TENNIS.tableY + TENNIS.ballRadius - b.y + 0.5 * gravity * flight * flight) / flight;
  } else {
    b.vy = 0.87;
  }
  b.vz = side === 'player' ? -speed : speed;
  state.lastHitter = side;
  state.activeTechnique = technique;
  if (side === 'player') {
    state.lastTechnique = technique;
    state.pendingTechnique = 'drive';
  }
  state.validBounce = false;
  state.bounces = 0;
  state.rally += 1;
}

/** Mutates a state by exactly one fixed step. Caller owns the frame accumulator. */
export function stepTennis(state: TennisState, playerTarget: number): TennisEvent {
  const dt = TENNIS.step;
  const prevPlayer = state.player;
  state.player = clamp(prevPlayer + clamp(playerTarget - prevPlayer, -8 * dt, 8 * dt), -1.11, 1.11);
  state.playerVelocity = clamp((state.player - prevPlayer) / dt, -5, 5);

  if (state.phase === 'ready') {
    state.ball.x = state.server === 'player' ? state.player : state.opponent;
    return null;
  }
  if (state.phase === 'countdown') {
    state.countdown -= dt;
    if (state.countdown <= 0) { launch(state); return 'serve'; }
    state.ball.x = state.server === 'player' ? state.player : state.opponent;
    return null;
  }
  if (state.phase !== 'playing') return null;

  const b = state.ball;
  if (state.opponentThink <= 0) {
    const headingToOpponent = b.vz < 0;
    const predicted = headingToOpponent ? b.x + b.vx * clamp((-1.86 - b.z) / b.vz, 0, 1) : 0;
    const error = (random(state) - 0.5) * (random(state) < 0.10 ? 0.93 : 0.23);
    state.opponentTarget = clamp(predicted + error, -1.06, 1.06);
    state.opponentThink = 0.16;
  }
  state.opponentThink -= dt;
  const chase = clamp(state.opponentTarget - state.opponent, -2.65 * dt, 2.65 * dt);
  state.opponent = clamp(state.opponent + chase, -1.10, 1.10);

  const previousY = b.y;
  const previousZ = b.z;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.z += b.vz * dt;
  const gravity = state.activeTechnique === 'topspin' ? 5.7
    : state.activeTechnique === 'backspin' ? 4.0 : TENNIS.gravity;
  b.vy -= gravity * dt;

  // The net is a vertical object, so its upper edge catches low crossings.
  if (previousZ * b.z <= 0 && b.y - TENNIS.ballRadius <= TENNIS.tableY + TENNIS.netHeight) {
    return award(state, other(state.lastHitter));
  }

  const side: Side = b.z >= 0 ? 'player' : 'opponent';
  if (previousY - TENNIS.ballRadius > TENNIS.tableY &&
      b.y - TENNIS.ballRadius <= TENNIS.tableY &&
      Math.abs(b.x) <= TENNIS.halfWidth && Math.abs(b.z) <= TENNIS.halfLength) {
    b.y = TENNIS.tableY + TENNIS.ballRadius;
    if (side === state.lastHitter) return award(state, other(state.lastHitter));
    if (state.bounces > 0) return award(state, state.lastHitter);
    if (state.activeTechnique === 'topspin') {
      b.vy = Math.max(2.1, -b.vy * 0.86);
      b.vz *= 1.14;
    } else if (state.activeTechnique === 'backspin') {
      b.vy = Math.max(1.2, -b.vy * 0.55);
      b.vz *= 0.76;
    } else {
      b.vy = Math.max(1.85, -b.vy * 0.79);
    }
    state.bounces = 1;
    state.validBounce = true;
    return 'bounce';
  }

  // Automatic swing leaves room for imperfect positioning, especially on touch.
  const nearPlayer = b.vz > 0 && previousZ < 1.87 && b.z >= 1.87;
  const nearOpponent = b.vz < 0 && previousZ > -1.87 && b.z <= -1.87;
  if ((nearPlayer || nearOpponent) && state.validBounce) {
    const receiver: Side = nearPlayer ? 'player' : 'opponent';
    const paddleX = receiver === 'player' ? state.player : state.opponent;
    if (Math.abs(b.x - paddleX) <= 0.47 && b.y >= 0.66 && b.y <= 1.43) {
      if (receiver === 'opponent' && random(state) < 0.07) return null;
      hit(state, receiver);
      return 'hit';
    }
  }

  if (Math.abs(b.x) > TENNIS.halfWidth + 0.26 ||
      Math.abs(b.z) > TENNIS.halfLength + 0.55 || b.y < 0.15) {
    return award(state, state.validBounce ? state.lastHitter : other(state.lastHitter));
  }
  return null;
}
