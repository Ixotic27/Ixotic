import * as THREE from "three";

export const palette = {
  ink: 0x182e36,
  deep: 0x294550,
  navy: 0x334d64,
  blue: 0x7195a5,
  cyan: 0x97d9cf,
  teal: 0x318c9e,
  tealLight: 0x5db9bc,
  coral: 0xe97862,
  skin: 0xe2aa79,
  hair: 0x203942,
  cream: 0xf2e8d3,
  paper: 0xfff4d8,
  wall: 0xe9dfc8,
  wallLight: 0xffefda,
  oak: 0xc58d59,
  oakLight: 0xe1ad71,
  oakDark: 0x805740,
  floor: 0xdbad79,
  sage: 0x9aaa85,
  sageDark: 0x4e6b5c,
  moss: 0x3f6556,
  terra: 0xc37159,
  brick: 0x9c5547,
  amber: 0xf3ba66,
  lilac: 0xa59ac5,
  charcoal: 0x4c5050,
  glass: 0xb5e3db,
  turf: 0x8eb28b,
  grass: 0x739b78,
};

const materialCache = new Map<string, THREE.MeshLambertMaterial>();

export function mat(color: number, opts: { transparent?: boolean; opacity?: number; emissive?: number } = {}) {
  const key = `${color}-${opts.transparent ? 1 : 0}-${opts.opacity ?? 1}-${opts.emissive ?? 0}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new THREE.MeshLambertMaterial({
      color,
      flatShading: true,
      transparent: opts.transparent,
      opacity: opts.opacity,
      emissive: opts.emissive ?? 0,
    });
    materialCache.set(key, material);
  }
  return material;
}

export function box(parent: THREE.Object3D, color: number, x: number, y: number, z: number, w: number, h: number, d: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function cylinder(parent: THREE.Object3D, color: number, x: number, y: number, z: number, top: number, bottom: number, height: number, segments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, segments), mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function sphere(parent: THREE.Object3D, color: number, x: number, y: number, z: number, radius: number, segments = 6) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, 4), mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function group(parent: THREE.Object3D, x = 0, y = 0, z = 0) {
  const result = new THREE.Group();
  result.position.set(x, y, z);
  parent.add(result);
  return result;
}

export function outlineBox(parent: THREE.Object3D, fill: number, trim: number, x: number, y: number, z: number, w: number, h: number, d: number, edge = 0.045) {
  box(parent, trim, x, y - edge / 2, z, w + edge * 2, h + edge, d + edge * 2);
  return box(parent, fill, x, y + edge / 2, z, w, h, d);
}

export function disposeTree(root: THREE.Object3D) {
  root.traverse((item) => {
    if (item instanceof THREE.Mesh) {
      item.geometry.dispose();
    }
  });
}

export function disposeMaterials() {
  materialCache.forEach((material) => material.dispose());
  materialCache.clear();
}
