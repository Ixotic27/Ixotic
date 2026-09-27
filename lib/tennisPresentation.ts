import type { ShotTechnique } from "./tennisPhysics";

export type CourtPoint = { x: number; y: number };
export type RacketPose = { head: CourtPoint; grip: CourtPoint; angle: number };

const strokes: Record<ShotTechnique, { angle: number; sweep: number; x: number; y: number }> = {
  drive: { angle: -19, sweep: 42, x: 24, y: -8 },
  topspin: { angle: -29, sweep: 55, x: 20, y: -31 },
  backspin: { angle: 18, sweep: -47, x: 26, y: 25 },
  smash: { angle: -47, sweep: 79, x: 34, y: 33 },
};

/** The racket is drawn about its grip; its blade passes through contact at t=0. */
export function racketPose(
  rest: CourtPoint,
  contact: CourtPoint | null,
  technique: ShotTechnique,
  elapsedMs: number,
  side: "player" | "opponent",
): RacketPose {
  const distance = side === "player" ? 67 : 42;
  const idleAngle = side === "player" ? 4 : 8;
  const duration = side === "player" ? 360 : 320;
  const progress = contact ? Math.max(0, Math.min(1, elapsedMs / duration)) : 1;
  const stroke = side === "player" ? strokes[technique] : strokes.drive;
  const easeHome = (1 - progress) ** 2;
  const followThrough = Math.sin(Math.PI * progress);
  const head = {
    x: rest.x + (contact ? (contact.x - rest.x) * easeHome : 0) + stroke.x * followThrough,
    y: rest.y + (contact ? (contact.y - rest.y) * easeHome : 0) + stroke.y * followThrough,
  };
  const angle = idleAngle + (stroke.angle - idleAngle) * easeHome + stroke.sweep * followThrough;
  const radians = angle * Math.PI / 180;
  return {
    head,
    grip: { x: head.x - distance * Math.sin(radians), y: head.y + distance * Math.cos(radians) },
    angle,
  };
}
