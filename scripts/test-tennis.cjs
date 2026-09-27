/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner loads the TypeScript source without a new runtime dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../lib/tennisPhysics.ts');
const source = fs.readFileSync(filename, 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = new Module(filename, module);
mod.filename = filename;
mod.paths = module.paths;
mod._compile(js, filename);
const { createTennisState, requestServe, queueShot, stepTennis, TENNIS } = mod.exports;

function steps(state, count, input = 0) {
  const events = [];
  for (let i = 0; i < count; i++) {
    const event = stepTennis(state, input);
    if (event) events.push({ event, x: state.ball.x, z: state.ball.z, phase: state.phase });
  }
  return events;
}

const initial = createTennisState(17);
assert.equal(requestServe(initial), true);
assert.equal(requestServe(initial), false);
const opening = steps(initial, 550);
assert.equal(opening[0].event, 'serve');
assert.equal(opening[1].event, 'bounce');
assert(opening[1].z < 0 && opening[1].z > -TENNIS.halfLength, 'serve must land on the far half');
assert(opening.some(e => e.event === 'hit'), 'opponent must be able to return the serve');
assert(opening.some(e => e.event === 'bounce' && e.z > 0), 'opponent return must land on the player half');

const duplicate = createTennisState(17);
requestServe(duplicate);
steps(duplicate, 550);
assert.deepEqual(duplicate, initial, 'the fixed-step simulation must be deterministic');

const net = createTennisState();
net.phase = 'playing';
net.ball = { x: 0, y: TENNIS.tableY + TENNIS.netHeight + 0.01, z: 0.01, vx: 0, vy: -2, vz: -4 };
assert.equal(stepTennis(net, 0), 'point');
assert.equal(net.scores.opponent, 1, 'striking the net awards the receiver');
assert.equal(net.phase, 'ready');

const out = createTennisState();
out.phase = 'playing';
out.ball = { x: 1.45, y: 1, z: -0.5, vx: 1, vy: 0, vz: -4 };
assert.equal(stepTennis(out, 0), 'point');
assert.equal(out.scores.opponent, 1, 'sending the ball wide loses a point');

const secondBounce = createTennisState();
secondBounce.phase = 'playing';
secondBounce.lastHitter = 'player';
secondBounce.bounces = 1;
secondBounce.validBounce = true;
secondBounce.ball = { x: 0, y: 0.82, z: -0.9, vx: 0, vy: -3, vz: -4 };
assert.equal(stepTennis(secondBounce, 0), 'point');
assert.equal(secondBounce.scores.player, 1, 'a second receiver-side bounce scores for the last hitter');

const win = createTennisState();
win.phase = 'playing';
win.scores.player = 6; win.scores.opponent = 6;
win.lastHitter = 'opponent';
win.ball = { x: 1.44, y: 1, z: 0.5, vx: 1, vy: 0, vz: 4 };
assert.equal(stepTennis(win, 0), 'point');
assert.equal(win.phase, 'ready', '7–6 is not a two-point lead');
win.phase = 'playing'; win.lastHitter = 'opponent';
win.ball = { x: 1.44, y: 1, z: 0.5, vx: 1, vy: 0, vz: 4 };
assert.equal(stepTennis(win, 0), 'win');
assert.equal(win.winner, 'player');

const rival = createTennisState();
rival.phase = 'playing';
rival.ball = { x: 0.9, y: 1.1, z: 0, vx: 0, vy: 0, vz: -4 };
const before = rival.opponent;
stepTennis(rival, 0);
assert(Math.abs(rival.opponent - before) <= 2.65 * TENNIS.step + 1e-10, 'opponent speed is bounded');

function returnWith(technique, height = 1.0) {
  const state = createTennisState(30);
  state.phase = 'playing';
  state.lastHitter = 'opponent';
  state.validBounce = true;
  state.bounces = 1;
  state.ball = { x: 0, y: height, z: 1.85, vx: 0, vy: 0, vz: 4.2 };
  queueShot(state, technique);
  assert.equal(stepTennis(state, 0), 'hit', `${technique} must be a legal player return`);
  assert.equal(state.lastTechnique, technique);
  assert.equal(state.pendingTechnique, 'drive', 'a selected technique is consumed on hit');
  const launch = { ...state.ball };
  let netHeight = null;
  let bounce = null;
  for (let i = 0; i < 180; i++) {
    const previousZ = state.ball.z;
    const event = stepTennis(state, 0);
    if (previousZ > 0 && state.ball.z <= 0) netHeight = state.ball.y;
    if (event === 'bounce') { bounce = { ...state.ball }; break; }
    assert.notEqual(event, 'point', `${technique} must clear the net and land on the table`);
  }
  assert(netHeight > TENNIS.tableY + TENNIS.netHeight + TENNIS.ballRadius,
    `${technique} must clear the net`);
  assert(bounce && bounce.z < 0 && bounce.z > -TENNIS.halfLength,
    `${technique} must bounce on the opponent's half`);
  return { state, launch, bounce, netHeight };
}

const drive = returnWith('drive');
assert.equal(drive.launch.vz, -4.2, 'ordinary drive keeps the original rally speed');
assert.equal(drive.launch.vy, 0.87, 'ordinary drive keeps the original lift');
const topspin = returnWith('topspin');
const backspin = returnWith('backspin');
const smash = returnWith('smash');
assert(Math.abs(topspin.launch.vz) > Math.abs(drive.launch.vz), 'topspin travels faster than a drive');
assert(topspin.bounce.vz < drive.bounce.vz, 'topspin kicks farther forward after bouncing');
assert(topspin.bounce.z < drive.bounce.z, 'topspin dips later on the far side');
assert(Math.abs(backspin.launch.vz) < Math.abs(drive.launch.vz), 'backspin travels more slowly');
assert(backspin.bounce.vy < drive.bounce.vy, 'backspin bounces lower');
assert(Math.abs(backspin.bounce.vz) < Math.abs(drive.bounce.vz), 'backspin slows after bouncing');
assert(Math.abs(smash.launch.vz) > Math.abs(topspin.launch.vz), 'smash is the fastest return');
assert(smash.launch.vy < drive.launch.vy, 'smash takes a flatter arc');
returnWith('smash', 1.3);

const queued = createTennisState();
const movement = createTennisState();
stepTennis(movement, 1.1);
assert(movement.player > 0 && movement.player <= 8 * TENNIS.step, 'paddle moves responsively without teleporting');
queueShot(queued, 'backspin');
assert.equal(queued.pendingTechnique, 'backspin');
assert.equal(queued.lastTechnique, 'drive');
queued.phase = 'playing';
queued.ball = { x: 1.8, y: 1, z: 2.3, vx: 0, vy: 0, vz: 4 };
assert.equal(stepTennis(queued, 0), 'point');
assert.equal(queued.pendingTechnique, 'backspin', 'a miss must not consume the queued technique');

const match = createTennisState(1209);
let rallies = 0;
for (let i = 0; i < 100000 && match.phase !== 'won'; i++) {
  if (match.phase === 'ready') { requestServe(match); rallies++; }
  stepTennis(match, 0);
}
assert.equal(match.phase, 'won', 'an ordinary match must reach a winner');
assert(rallies >= 7, 'a match must require multiple scored rallies');

const active = createTennisState(18);
for (let i = 0; i < 120000 && active.phase !== 'won'; i++) {
  if (active.phase === 'ready') requestServe(active);
  const aim = active.ball.vz > 0 ? active.ball.x + active.ball.vx * Math.max(0, (1.87 - active.ball.z) / active.ball.vz) : 0;
  stepTennis(active, Math.max(-1.1, Math.min(1.1, aim)));
}
assert.equal(active.phase, 'won');
assert(active.scores.player > 0, 'well-positioned returns should earn points');

console.log('Table tennis physics: scoring, determinism, and four distinct legal shot techniques passed.');
