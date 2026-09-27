/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const filename = path.resolve(__dirname, '../lib/tennisPresentation.ts');
const mod = new Module(filename, module);
mod.filename = filename;
mod.paths = module.paths;
mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { racketPose } = mod.exports;
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const rest = { x: 600, y: 520 }, contact = { x: 615, y: 495 };
for (const side of ['player', 'opponent']) {
  const duration = side === 'player' ? 360 : 320;
  const distance = side === 'player' ? 67 : 42;
  for (const technique of ['drive', 'topspin', 'backspin', 'smash']) {
    const hit = racketPose(rest, contact, technique, 0, side);
    near(hit.head.x, contact.x); near(hit.head.y, contact.y);
    const mid = racketPose(rest, contact, technique, duration / 2, side);
    assert.ok(Math.hypot(mid.head.x - hit.head.x, mid.head.y - hit.head.y) > 8, 'Blade must move through follow-through');
    for (const time of [-100, 0, duration / 2, duration, 10000]) {
      const pose = racketPose(rest, contact, technique, time, side);
      const angle = pose.angle * Math.PI / 180;
      near(pose.head.x, pose.grip.x + distance * Math.sin(angle));
      near(pose.head.y, pose.grip.y - distance * Math.cos(angle));
    }
    const settled = racketPose(rest, contact, technique, duration, side);
    near(settled.head.x, rest.x); near(settled.head.y, rest.y);
    const idle = racketPose(rest, null, technique, 0, side);
    near(idle.head.x, rest.x); near(idle.head.y, rest.y);
  }
}
const top = racketPose(rest, contact, 'topspin', 180, 'player');
const back = racketPose(rest, contact, 'backspin', 180, 'player');
assert.ok(top.head.y < back.head.y - 40, 'Topspin and backspin need distinct blade paths');
console.log('Racket contact, moving blades, grip attachment, technique paths and return-to-rest pass.');
