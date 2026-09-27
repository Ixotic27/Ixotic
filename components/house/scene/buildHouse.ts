import * as THREE from "three";
import type { HouseAction } from "../types";
import { box, cylinder, group, mat, outlineBox, palette as c, sphere } from "./geometry";

export interface HouseObjects {
  root: THREE.Group;
  actions: THREE.Object3D[];
  lampLight: THREE.PointLight;
  windowLight: THREE.PointLight;
  ambient: THREE.AmbientLight;
  sun: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  plantLeaves: THREE.Object3D;
  avatar: THREE.Group;
  avatarArm: THREE.Group;
  counterMug: THREE.Group;
  carriedMug: THREE.Group;
  steam: THREE.Object3D[];
  roof: THREE.Group;
}

function actionable(parent: THREE.Object3D, action: HouseAction, actions: THREE.Object3D[]) {
  const target = group(parent);
  target.userData.action = action;
  actions.push(target);
  return target;
}

function legSet(parent: THREE.Object3D, color: number, x: number, z: number, w: number, d: number, height: number, radius = 0.09) {
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
    box(parent, color, x + dx * (w / 2 - radius), height / 2, z + dz * (d / 2 - radius), radius * 2, height, radius * 2);
  }
}

function window(parent: THREE.Object3D, x: number, z: number, w = 1.12) {
  box(parent, c.ink, x, 1.65, z + 0.04, w + 0.12, 0.99, 0.12);
  box(parent, c.glass, x, 1.65, z + 0.115, w, 0.87, 0.025);
  box(parent, c.cream, x, 1.65, z + 0.14, 0.055, 0.87, 0.05);
  box(parent, c.cream, x, 1.65, z + 0.14, w, 0.05, 0.05);
  box(parent, c.oakDark, x, 1.12, z + 0.2, w + 0.25, 0.09, 0.27);
}

function walls(root: THREE.Group, roof: THREE.Group) {
  // A thick, continuous floor makes the four rooms feel like one model.
  box(root, c.ink, 0, -0.28, 0.12, 8.72, 0.36, 8.54);
  box(root, c.floor, 0, -0.08, 0, 8.42, 0.12, 8.2);
  for (let ix = -4; ix <= 4; ix++) {
    box(root, ix < 0 ? 0xd7a46f : 0xd9ad78, ix, -0.015, -1.98, 0.012, 0.006, 3.97);
    box(root, ix < 0 ? 0xd7a46f : 0xd9ad78, ix, -0.015, 2.02, 0.012, 0.006, 3.95);
  }
  for (let iz = -4; iz <= 4; iz += 0.43) {
    box(root, c.oakLight, 0, -0.012, iz, 8.35, 0.004, 0.012);
  }

  // The rear and far side remain tall; camera-facing edges are cut away.
  box(root, c.ink, 0, 1.28, -4.12, 8.66, 2.76, 0.23);
  box(root, c.wall, 0, 1.28, -3.99, 8.38, 2.53, 0.07);
  box(root, c.oakDark, 0, 2.65, -3.96, 8.45, 0.11, 0.15);
  box(root, c.wall, -4.14, 1.25, -1.48, 0.23, 2.5, 5.2);
  box(root, c.ink, -4.14, 2.54, -1.48, 0.27, 0.12, 5.2);
  box(root, c.wall, 4.14, 0.52, -1.54, 0.23, 1.04, 5.16);
  box(root, c.ink, 4.14, 1.06, -1.54, 0.27, 0.09, 5.16);
  window(root, -2.05, -3.86);
  window(root, 2.05, -3.86);

  // Four door openings meet around an oak hall cross, rather than four isolated cubes.
  box(root, c.oakLight, 0, 0.012, 0.02, 8.1, 0.04, 0.62);
  box(root, c.oakLight, 0, 0.013, 0, 0.62, 0.04, 8.03);
  for (const x of [-3.2, -0.82, 0.82, 3.2]) {
    const span = Math.abs(x) > 2 ? 1.7 : 0.74;
    const wall = box(root, c.cream, x, 0.38, 0, span, 0.75, 0.16);
    wall.castShadow = true;
    box(root, c.ink, x, 0.76, 0, span + 0.04, 0.07, 0.21);
  }
  for (const z of [-3.02, -1.62, 1.62, 3.0]) {
    box(root, c.wallLight, 0, 0.34, z, 0.16, 0.67, 1.0);
    box(root, c.ink, 0, 0.71, z, 0.22, 0.08, 1.02);
  }
  for (const x of [-4.15, 4.15]) {
    box(root, c.ink, x, 0.12, 2.46, 0.18, 0.28, 3.15);
  }
  box(root, c.ink, 0, 0.12, 4.03, 8.55, 0.28, 0.16);
  box(root, c.wall, 0, 0.19, 4.0, 8.3, 0.23, 0.11);

  // Only a slim roof fringe is retained; interiors remain visible in overview.
  for (const x of [-2.05, 2.05]) {
    const panel = box(roof, x < 0 ? c.terra : c.sageDark, x, 2.89, -3.86, 4.18, 0.14, 0.83);
    panel.rotation.x = -0.24;
    box(roof, c.ink, x, 3.03, -3.44, 4.25, 0.12, 0.11);
  }
}

function study(root: THREE.Group, actions: THREE.Object3D[]) {
  // Banded rug, desktop, keyboard and a solid recognizable computer silhouette.
  box(root, c.brick, -2.12, 0.018, -1.85, 2.6, 0.036, 1.52);
  box(root, c.amber, -2.12, 0.041, -1.85, 2.35, 0.013, 1.25);
  box(root, c.terra, -2.12, 0.05, -1.85, 1.98, 0.008, 0.85);
  legSet(root, c.oakDark, -2.05, -3.05, 2.55, 0.93, 0.91);
  outlineBox(root, c.oakLight, c.ink, -2.05, 0.97, -3.05, 2.74, 0.15, 1.06);
  box(root, c.cream, -2.04, 0.992, -3.04, 2.45, 0.014, 0.85);
  const computer = actionable(root, "imac", actions);
  box(computer, c.ink, -2.15, 1.68, -3.32, 1.43, 1.08, 0.15);
  box(computer, c.navy, -2.15, 1.72, -3.216, 1.28, 0.91, 0.03);
  box(computer, 0x172e50, -2.15, 1.74, -3.192, 1.16, 0.78, 0.01);
  for (const [sx, sy] of [[-0.36, 0.23], [0.27, 0.17], [0.01, -0.12], [-0.18, -0.27], [0.42, -0.22]]) {
    box(computer, c.cyan, -2.15 + sx, 1.74 + sy, -3.177, 0.035, 0.035, 0.008);
  }
  for (const [x, color] of [[-2.56, c.amber], [-2.3, c.cyan], [-2.04, c.terra], [-1.78, c.lilac]] as const) {
    box(computer, color, x, 1.56, -3.16, 0.14, 0.13, 0.012);
    box(computer, c.cream, x, 1.44, -3.158, 0.17, 0.035, 0.014);
  }
  box(computer, c.ink, -2.15, 1.12, -3.31, 0.12, 0.18, 0.14);
  box(computer, c.charcoal, -2.15, 1.04, -3.26, 0.47, 0.04, 0.32);
  box(computer, c.cream, -2.06, 1.064, -2.84, 0.8, 0.03, 0.22);
  for (let k = 0; k < 5; k++) box(computer, c.charcoal, -2.34 + k * 0.13, 1.088, -2.82, 0.06, 0.008, 0.11);

  const handheld = actionable(root, "gameboy", actions);
  const game = group(handheld, -3.02, 1.08, -2.79);
  game.rotation.y = -0.31;
  box(game, c.lilac, 0, 0, 0, 0.37, 0.07, 0.56);
  box(game, c.ink, 0, 0.043, -0.11, 0.27, 0.01, 0.23);
  box(game, c.cyan, 0, 0.051, -0.11, 0.19, 0.008, 0.15);
  box(game, c.ink, -0.09, 0.046, 0.13, 0.14, 0.012, 0.042);
  box(game, c.ink, -0.09, 0.047, 0.13, 0.045, 0.012, 0.14);
  cylinder(game, c.terra, 0.1, 0.052, 0.12, 0.035, 0.035, 0.012, 8);
  cylinder(game, c.amber, 0.14, 0.052, 0.2, 0.035, 0.035, 0.012, 8);

  // Reading chair and pinboard give this room a lived-in silhouette.
  const chair = group(root, -2.2, 0, -1.25);
  box(chair, c.ink, 0, 0.28, 0, 0.81, 0.16, 0.77);
  box(chair, c.blue, 0, 0.42, 0, 0.72, 0.14, 0.68);
  box(chair, c.navy, 0, 0.83, -0.29, 0.76, 0.82, 0.17);
  for (const dx of [-0.32, 0.32]) box(chair, c.ink, dx, 0.16, 0.26, 0.1, 0.29, 0.12);
  box(root, c.oakDark, -3.56, 1.92, -3.84, 0.56, 0.75, 0.09);
  box(root, c.cream, -3.56, 1.92, -3.77, 0.45, 0.62, 0.012);
  box(root, c.terra, -3.63, 2.07, -3.75, 0.19, 0.12, 0.014);
  box(root, c.sage, -3.5, 1.86, -3.75, 0.21, 0.17, 0.014);
  box(root, c.amber, -3.58, 1.7, -3.75, 0.19, 0.09, 0.014);
}

function bookcase(root: THREE.Group, actions: THREE.Object3D[]) {
  const shelf = actionable(root, "books", actions);
  box(shelf, c.ink, 2.15, 1.25, -3.54, 2.9, 2.5, 0.7);
  box(shelf, c.oak, 2.15, 1.25, -3.39, 2.72, 2.35, 0.58);
  for (const x of [0.85, 3.45]) box(shelf, c.oakDark, x, 1.25, -3.38, 0.16, 2.45, 0.66);
  for (const y of [0.19, 0.84, 1.5, 2.16]) {
    box(shelf, c.oakDark, 2.15, y, -3.32, 2.78, 0.13, 0.73);
    box(shelf, c.oakLight, 2.15, y + 0.072, -3.32, 2.7, 0.025, 0.69);
  }
  const colors = [c.terra, c.navy, c.sageDark, c.amber, c.cream, c.lilac, c.brick, c.blue];
  for (let row = 0; row < 3; row++) {
    let x = 0.99;
    for (let i = 0; i < 18; i++) {
      const width = 0.095 + ((i * 5 + row * 3) % 4) * 0.018;
      const height = 0.42 + ((i * 7 + row * 5) % 5) * 0.033;
      const color = colors[(i * 3 + row) % colors.length];
      box(shelf, color, x, 0.84 + row * 0.66 + height / 2, -2.96, width, height, 0.33);
      if (i % 3 === 0) box(shelf, c.cream, x, 0.93 + row * 0.66, -2.778, width * 0.63, 0.022, 0.01);
      x += width + 0.018;
    }
  }
  box(shelf, c.cream, 2.15, 2.61, -3.33, 0.9, 0.11, 0.12);

  box(root, c.sageDark, 2.16, 0.025, -1.72, 2.5, 0.045, 1.68);
  box(root, c.sage, 2.16, 0.05, -1.72, 2.28, 0.015, 1.48);
  const seat = group(root, 2.25, 0, -1.4);
  cylinder(seat, c.oakDark, 0, 0.27, 0, 0.54, 0.45, 0.48, 8);
  cylinder(seat, c.blue, 0, 0.51, 0, 0.52, 0.54, 0.16, 8);
  box(seat, c.sageDark, 0, 0.91, -0.43, 1.03, 0.87, 0.18);
  box(seat, c.sage, 0, 0.91, -0.34, 0.85, 0.67, 0.07);
  box(seat, c.cream, -0.31, 0.64, 0, 0.19, 0.27, 0.81);
  box(seat, c.cream, 0.31, 0.64, 0, 0.19, 0.27, 0.81);

  const cat = actionable(root, "cat", actions);
  cylinder(cat, c.ink, 3.34, 0.22, -1.62, 0.41, 0.42, 0.13, 8);
  cylinder(cat, c.sageDark, 3.34, 0.3, -1.62, 0.36, 0.38, 0.09, 8);
  sphere(cat, c.paper, 3.3, 0.49, -1.65, 0.35, 7);
  sphere(cat, c.charcoal, 3.45, 0.55, -1.44, 0.19, 6);
  for (const x of [3.33, 3.57]) {
    const ear = box(cat, c.charcoal, x, 0.75, -1.49, 0.14, 0.19, 0.1);
    ear.rotation.z = x < 3.4 ? 0.25 : -0.25;
  }
  box(cat, c.paper, 3.52, 0.5, -1.31, 0.14, 0.11, 0.07);
  for (const x of [3.4, 3.57]) box(cat, c.ink, x, 0.61, -1.35, 0.03, 0.035, 0.012);
  const tail = box(cat, c.charcoal, 3.04, 0.55, -1.72, 0.13, 0.42, 0.13);
  tail.rotation.z = -0.63;
  sphere(cat, c.paper, 2.89, 0.7, -1.72, 0.09, 5);

  const lamp = actionable(root, "lamp", actions);
  cylinder(lamp, c.ink, 0.91, 0.08, -1.1, 0.25, 0.32, 0.13);
  cylinder(lamp, c.oakDark, 0.91, 0.85, -1.1, 0.045, 0.05, 1.5);
  cylinder(lamp, c.amber, 0.91, 1.69, -1.1, 0.21, 0.39, 0.45, 6);
  sphere(lamp, c.paper, 0.91, 1.51, -1.1, 0.11);
  return lamp;
}

function mug(parent: THREE.Object3D, x: number, y: number, z: number) {
  const result = group(parent, x, y, z);
  cylinder(result, c.cream, 0, 0.11, 0, 0.12, 0.11, 0.22, 8);
  cylinder(result, c.ink, 0, 0.226, 0, 0.095, 0.095, 0.009, 8);
  box(result, c.cream, 0.13, 0.12, 0, 0.095, 0.045, 0.045);
  return result;
}

function avatar(root: THREE.Group) {
  const body = group(root, -2.88, 0, 2.85);
  for (const x of [-0.16, 0.16]) {
    box(body, c.ink, x, 0.13, 0.01, 0.24, 0.2, 0.36);
    box(body, c.navy, x, 0.46, 0, 0.22, 0.48, 0.25);
  }
  box(body, c.coral, 0, 0.97, 0, 0.74, 0.64, 0.34);
  box(body, c.cream, 0, 1.17, 0.19, 0.24, 0.09, 0.025);
  box(body, c.skin, 0, 1.42, 0, 0.13, 0.24, 0.13);
  box(body, c.hair, 0, 1.76, -0.03, 0.58, 0.65, 0.55);
  box(body, c.skin, 0, 1.73, 0.26, 0.49, 0.46, 0.09);
  box(body, c.hair, 0, 2.03, 0.18, 0.62, 0.14, 0.24);
  for (const x of [-0.14, 0.14]) box(body, c.ink, x, 1.77, 0.312, 0.045, 0.045, 0.012);
  const arm = group(body, 0.42, 1.23, 0.02);
  box(arm, c.coral, 0.06, -0.2, 0, 0.24, 0.43, 0.27);
  box(arm, c.skin, 0.07, -0.48, 0.01, 0.2, 0.18, 0.19);
  box(body, c.coral, -0.43, 1.01, 0, 0.22, 0.45, 0.27);
  box(body, c.skin, -0.43, 0.69, 0.02, 0.18, 0.22, 0.19);
  const held = mug(arm, 0.06, -0.57, 0.13);
  held.visible = false;
  return { body, arm, held };
}

function kitchen(root: THREE.Group, actions: THREE.Object3D[]) {
  box(root, c.terra, -2.14, 0.025, 2.03, 3.06, 0.048, 2.83);
  for (let x = -3.5; x <= -0.75; x += 0.49) box(root, c.cream, x, 0.053, 2.02, 0.017, 0.007, 2.8);
  for (let z = 0.75; z <= 3.3; z += 0.49) box(root, c.cream, -2.14, 0.053, z, 3.01, 0.007, 0.017);
  box(root, c.ink, -2.1, 0.45, 0.76, 3.28, 0.9, 0.77);
  for (const x of [-3.12, -2.15, -1.19]) {
    box(root, c.oak, x, 0.44, 1.17, 0.88, 0.76, 0.035);
    box(root, c.ink, x + 0.26, 0.45, 1.205, 0.065, 0.12, 0.025);
  }
  outlineBox(root, c.cream, c.oakDark, -2.1, 0.94, 0.82, 3.4, 0.12, 0.98);
  box(root, c.wallLight, -2.05, 1.52, 0.24, 3.28, 0.88, 0.06);
  for (let i = 0; i < 6; i++) box(root, c.cream, -3.45 + i * 0.55, 1.52, 0.28, 0.022, 0.83, 0.012);
  for (const y of [1.23, 1.8]) box(root, c.cream, -2.05, y, 0.28, 3.26, 0.022, 0.012);
  // Counter appliances and the coffee hit target.
  const coffee = actionable(root, "coffee", actions);
  box(coffee, c.ink, -2.42, 1.27, 0.77, 0.59, 0.54, 0.51);
  box(coffee, c.charcoal, -2.42, 1.58, 0.75, 0.66, 0.09, 0.56);
  box(coffee, c.cyan, -2.42, 1.4, 1.036, 0.3, 0.14, 0.02);
  box(coffee, c.cream, -2.42, 1.21, 1.05, 0.21, 0.06, 0.045);
  cylinder(coffee, c.ink, -2.43, 1.66, 0.69, 0.14, 0.14, 0.1, 8);
  const counterMug = mug(coffee, -2.04, 1.0, 1.05);
  const steam: THREE.Object3D[] = [];
  for (let i = 0; i < 3; i++) {
    const p = sphere(coffee, c.cream, -2.04 + (i % 2) * 0.07, 1.32 + i * 0.14, 1.05, 0.043, 4);
    steam.push(p);
  }
  box(root, c.ink, -1.05, 0.99, 0.75, 0.54, 0.02, 0.42);
  box(root, c.glass, -1.05, 1.0, 0.75, 0.35, 0.014, 0.27);
  for (const x of [-3.36, -1.15]) {
    cylinder(root, c.oakDark, x, 0.46, 2.08, 0.07, 0.1, 0.82, 8);
    cylinder(root, c.sageDark, x, 0.88, 2.08, 0.3, 0.27, 0.13, 8);
    box(root, c.ink, x, 0.64, 2.08, 0.38, 0.055, 0.38);
  }
  const character = avatar(root);

  const plant = actionable(root, "plant", actions);
  cylinder(plant, c.brick, -0.78, 0.28, 3.18, 0.29, 0.2, 0.5, 8);
  cylinder(plant, c.oakDark, -0.78, 0.53, 3.18, 0.3, 0.3, 0.06, 8);
  const leaves = group(plant, -0.78, 0.55, 3.18);
  box(leaves, c.moss, 0, 0.42, 0, 0.09, 0.79, 0.09);
  for (const [x, y, z] of [[-0.2, 0.37, 0], [0.2, 0.55, 0.03], [0, 0.78, -0.11], [-0.1, 0.66, 0.18]]) {
    sphere(leaves, c.sageDark, x, y, z, 0.27, 5);
  }
  return { coffee, counterMug, steam, leaves, character };
}

function sports(root: THREE.Group, actions: THREE.Object3D[]) {
  box(root, c.navy, 2.12, 0.022, 2.04, 3.1, 0.043, 2.96);
  box(root, c.blue, 2.12, 0.045, 2.04, 2.91, 0.011, 2.77);
  box(root, c.cream, 2.12, 0.055, 2.04, 2.71, 0.006, 2.54);
  box(root, c.navy, 2.12, 0.061, 2.04, 2.66, 0.006, 2.49);
  const tennis = actionable(root, "tennis", actions);
  // Table is lengthwise in Z so both end paddles read from the overview camera.
  legSet(tennis, c.ink, 2.08, 2.05, 1.82, 2.4, 0.78, 0.1);
  box(tennis, c.ink, 2.08, 0.84, 2.05, 2.08, 0.17, 2.65);
  box(tennis, c.teal, 2.08, 0.94, 2.05, 1.96, 0.035, 2.52);
  box(tennis, c.cream, 2.08, 0.964, 2.05, 1.82, 0.006, 0.025);
  for (const x of [1.18, 2.98]) box(tennis, c.cream, x, 0.964, 2.05, 0.022, 0.006, 2.38);
  for (const z of [0.86, 3.24]) box(tennis, c.cream, 2.08, 0.964, z, 1.82, 0.006, 0.025);
  box(tennis, c.cream, 2.08, 1.14, 2.05, 1.99, 0.27, 0.032);
  for (let i = 0; i < 12; i++) box(tennis, c.navy, 1.17 + i * 0.165, 1.14, 2.075, 0.009, 0.21, 0.009);
  box(tennis, c.navy, 2.08, 1.26, 2.074, 1.99, 0.025, 0.012);
  box(tennis, c.ink, 1.0, 1.12, 2.05, 0.08, 0.47, 0.08);
  box(tennis, c.ink, 3.16, 1.12, 2.05, 0.08, 0.47, 0.08);
  sphere(tennis, c.paper, 1.58, 1.21, 1.42, 0.066, 6);
  // Ready paddles read as separate equipment but share table's game action.
  for (const [x, z, color] of [[1.18, 3.58, c.terra], [2.94, 0.54, c.cyan]] as const) {
    cylinder(tennis, color, x, 0.25, z, 0.19, 0.19, 0.06, 8);
    box(tennis, c.oakDark, x, 0.25, z + 0.25, 0.11, 0.08, 0.33);
  }
  box(root, c.ink, 3.52, 1.78, 0.68, 0.76, 0.63, 0.12);
  box(root, c.cream, 3.52, 1.79, 0.755, 0.64, 0.49, 0.02);
  for (const x of [3.36, 3.68]) {
    box(root, c.ink, x, 1.79, 0.777, 0.2, 0.29, 0.01);
    box(root, c.amber, x, 1.79, 0.786, 0.12, 0.16, 0.008);
  }
  box(root, c.cream, 0.7, 1.42, 0.72, 0.27, 0.67, 0.25);
  box(root, c.navy, 0.7, 1.61, 0.87, 0.16, 0.14, 0.02);
}

function exterior(root: THREE.Group) {
  box(root, c.ink, 0, -0.38, 5.35, 10.0, 0.24, 2.55);
  box(root, c.turf, 0, -0.23, 5.35, 9.85, 0.08, 2.42);
  for (let i = 0; i < 5; i++) {
    const z = 4.19 + i * 0.47;
    box(root, i % 2 ? c.cream : c.wallLight, -0.17, -0.16, z, 1.0, 0.05, 0.35);
  }
  box(root, c.oakDark, -0.18, -0.01, 4.17, 1.34, 0.28, 0.61);
  box(root, c.oakLight, -0.18, 0.15, 4.18, 1.29, 0.05, 0.59);
  for (const x of [-4.45, 4.45]) for (const z of [4.4, 6.3]) box(root, c.cream, x, 0.11, z, 0.12, 0.68, 0.12);
  for (const z of [4.4, 6.3]) {
    box(root, c.cream, -4.45, 0.26, z, 0.13, 0.1, 1.78);
    box(root, c.cream, 4.45, 0.26, z, 0.13, 0.1, 1.78);
  }
  for (const x of [-3.9, -3.1, 2.75, 3.65]) {
    cylinder(root, c.brick, x, -0.04, 5.38, 0.3, 0.23, 0.37, 7);
    for (const [dx, y, dz] of [[0, 0.45, 0], [-0.19, 0.29, 0.05], [0.17, 0.31, -0.04]]) sphere(root, c.moss, x + dx, y, 5.38 + dz, 0.24, 5);
    sphere(root, c.amber, x + 0.12, 0.49, 5.48, 0.06, 5);
    sphere(root, c.cream, x - 0.14, 0.39, 5.31, 0.055, 5);
  }
  for (const x of [-4.8, -4.55, 4.55, 4.8]) for (const z of [4.45, 4.95, 5.85, 6.25]) {
    sphere(root, c.sageDark, x, 0.04, z, 0.31, 5);
  }
  for (let i = 0; i < 8; i++) {
    const x = -4.1 + i * 1.19;
    box(root, c.oakDark, x, -0.03, 6.55, 0.1, 0.49, 0.11);
    if (i < 7) box(root, c.oakLight, x + 0.59, 0.15, 6.55, 1.13, 0.08, 0.1);
  }
}

export function buildHouse(scene: THREE.Scene): HouseObjects {
  const root = group(scene);
  const roof = group(root);
  const actions: THREE.Object3D[] = [];
  walls(root, roof);
  study(root, actions);
  bookcase(root, actions);
  const kitchenObjects = kitchen(root, actions);
  sports(root, actions);
  exterior(root);

  const ambient = new THREE.AmbientLight(0xffffff, 1.02);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.12);
  sun.position.set(-3, 11, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 1;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xd8eeff, 0.37);
  fill.position.set(7, 5, -6);
  scene.add(fill);
  const lampLight = new THREE.PointLight(0xffbf6a, 0, 3.0, 2);
  lampLight.position.set(0.91, 1.5, -1.1);
  scene.add(lampLight);
  const windowLight = new THREE.PointLight(0x8fb8e8, 0, 12, 2);
  windowLight.position.set(0, 4, -2);
  scene.add(windowLight);
  // Floor-level contact shadows remain legible when sun is dimmed for night mode.
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 11.8), mat(0xb7b6a5));
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = -0.535;
  contact.receiveShadow = true;
  scene.add(contact);

  return {
    root,
    actions,
    lampLight,
    windowLight,
    ambient,
    sun,
    fill,
    plantLeaves: kitchenObjects.leaves,
    avatar: kitchenObjects.character.body,
    avatarArm: kitchenObjects.character.arm,
    counterMug: kitchenObjects.counterMug,
    carriedMug: kitchenObjects.character.held,
    steam: kitchenObjects.steam,
    roof,
  };
}
