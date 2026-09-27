"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { HouseAction, HouseSceneProps } from "./types";
import { buildHouse } from "./scene/buildHouse";
import { disposeMaterials, disposeTree } from "./scene/geometry";

type CameraStop = { x: number; y: number; z: number; height: number; width: number };

const CAMERA_STOPS: CameraStop[] = [
  { x: -0.5, y: 0.5, z: 0.62, height: 12.6, width: 16 },
  { x: -2.14, y: 0.93, z: -2.24, height: 5.25, width: 5.6 },
  { x: 2.13, y: 0.9, z: -2.18, height: 5.3, width: 5.7 },
  { x: -2.1, y: 0.89, z: 1.91, height: 5.3, width: 5.7 },
  { x: 2.11, y: 0.91, z: 1.96, height: 5.3, width: 5.7 },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function cameraStop(progress: number, reducedMotion: boolean): CameraStop {
  const position = reducedMotion ? Math.round(clamp(progress, 0, 4)) : clamp(progress, 0, 4);
  const index = Math.floor(position);
  const next = Math.min(4, index + 1);
  const fraction = position - index;
  const a = CAMERA_STOPS[index];
  const b = CAMERA_STOPS[next];
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, fraction),
    y: THREE.MathUtils.lerp(a.y, b.y, fraction),
    z: THREE.MathUtils.lerp(a.z, b.z, fraction),
    height: THREE.MathUtils.lerp(a.height, b.height, fraction),
    width: THREE.MathUtils.lerp(a.width, b.width, fraction),
  };
}

/** One mounted WebGL world. Room changes only move the camera through it. */
export default function HouseScene(props: HouseSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const controllerRef = useRef<(() => void) | null>(null);
  propsRef.current = props;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let disposed = false;
    let errorSent = false;
    let readySent = false;
    let raf: number | null = null;
    let lastFrame = 0;
    let coffeeElapsed = Number.POSITIVE_INFINITY;
    let previousCoffeeTrigger = propsRef.current.coffeeTrigger;
    const notifyError = () => {
      if (errorSent || disposed) return;
      errorSent = true;
      propsRef.current.onError();
    };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: "low-power" });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0xe8e5d8);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.imageRendering = "pixelated";
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);
    } catch {
      notifyError();
      return;
    }

    const activeRenderer = renderer;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e5d8);
    const house = buildHouse(scene);
    const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, 0.1, 90);
    const direction = new THREE.Vector3(7.8, 10.5, 12.2).normalize();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const current = { x: CAMERA_STOPS[0].x, y: CAMERA_STOPS[0].y, z: CAMERA_STOPS[0].z, height: CAMERA_STOPS[0].height, width: CAMERA_STOPS[0].width };
    const viewport = { width: 0, height: 0 };

    function resize() {
      if (disposed) return;
      const bounds = host!.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      if (viewport.width === width && viewport.height === height) return;
      viewport.width = width;
      viewport.height = height;
      const factor = width < 640 ? 1.8 : 2.1;
      const renderWidth = clamp(Math.round(width / factor), 220, 860);
      const renderHeight = Math.max(160, Math.round(renderWidth * height / width));
      activeRenderer.setSize(renderWidth, renderHeight, false);
    }

    function updateCoffee(dt: number, trigger: number, paused: boolean, reducedMotion: boolean) {
      if (trigger !== previousCoffeeTrigger) {
        previousCoffeeTrigger = trigger;
        coffeeElapsed = reducedMotion ? Number.POSITIVE_INFINITY : 0;
      }
      if (!paused && !reducedMotion && Number.isFinite(coffeeElapsed)) coffeeElapsed += dt;
      const t = coffeeElapsed;
      // A six-second one-shot: approach, reach, lift, sip, replace, and retreat.
      const approach = clamp(t / 1.15, 0, 1);
      const retreat = clamp((t - 4.9) / 1.15, 0, 1);
      house.avatar.position.z = 2.85 - 1.25 * approach + 1.25 * retreat;
      house.avatar.position.x = -2.88 + 0.38 * approach - 0.38 * retreat;
      const reach = clamp((t - 0.92) / 0.75, 0, 1);
      const lift = clamp((t - 1.98) / 0.82, 0, 1);
      const lower = clamp((t - 3.55) / 0.77, 0, 1);
      const release = clamp((t - 4.36) / 0.44, 0, 1);
      house.avatarArm.rotation.x = 1.05 * reach + 1.05 * lift - 1.05 * lower - 1.05 * release;
      house.avatarArm.rotation.z = -0.33 * reach + 0.33 * release;
      const holding = t >= 1.69 && t < 4.46;
      house.carriedMug.visible = holding;
      house.counterMug.visible = !holding;
      for (let i = 0; i < house.steam.length; i++) {
        const steam = house.steam[i];
        steam.visible = !reducedMotion && !paused && !holding && t < 5.3;
        if (steam.visible) steam.position.y = 1.32 + i * 0.14 + (t % 0.42) * 0.06;
      }
      if (t > 6.2) coffeeElapsed = Number.POSITIVE_INFINITY;
    }

    function frame(now: number) {
      raf = null;
      if (disposed || errorSent) return;
      const settings = propsRef.current;
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      resize();
      const stop = cameraStop(settings.progress, settings.reducedMotion);
      const smooth = settings.reducedMotion || settings.paused ? 1 : 1 - Math.exp(-dt * 8.5);
      current.x = THREE.MathUtils.lerp(current.x, stop.x, smooth);
      current.y = THREE.MathUtils.lerp(current.y, stop.y, smooth);
      current.z = THREE.MathUtils.lerp(current.z, stop.z, smooth);
      current.height = THREE.MathUtils.lerp(current.height, stop.height, smooth);
      current.width = THREE.MathUtils.lerp(current.width, stop.width, smooth);
      const aspect = viewport.width / viewport.height;
      const frustumHeight = Math.max(current.height, current.width / aspect);
      camera.left = -frustumHeight * aspect / 2;
      camera.right = frustumHeight * aspect / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();
      const target = new THREE.Vector3(current.x, current.y, current.z);
      camera.position.copy(target).addScaledVector(direction, 17);
      camera.lookAt(target);

      (scene.background as THREE.Color).setHex(settings.night ? 0x283c50 : 0xe8e5d8);
      house.ambient.intensity = settings.night ? 0.42 : 1.02;
      house.sun.intensity = settings.night ? 0.18 : 1.12;
      house.fill.intensity = settings.night ? 0.48 : 0.37;
      house.windowLight.intensity = settings.night ? 1.75 : 0;
      house.lampLight.intensity = settings.lampOn ? (settings.night ? 2.6 : 1.6) : 0;
      house.plantLeaves.scale.setScalar(settings.watered ? 1.18 : 1);
      house.roof.visible = settings.progress < 0.6;
      updateCoffee(dt, settings.coffeeTrigger, settings.paused, settings.reducedMotion);
      try {
        activeRenderer.render(scene, camera);
        if (!readySent) {
          readySent = true;
          settings.onReady();
        }
      } catch {
        notifyError();
        return;
      }
      if (!settings.paused && !document.hidden) raf = window.requestAnimationFrame(frame);
    }

    function requestDraw() {
      if (disposed || errorSent || raf !== null) return;
      raf = window.requestAnimationFrame(frame);
    }

    function pick(event: PointerEvent) {
      const rectangle = activeRenderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rectangle.left) / rectangle.width) * 2 - 1,
        -((event.clientY - rectangle.top) / rectangle.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(house.actions, true);
      for (const hit of hits) {
        let node: THREE.Object3D | null = hit.object;
        while (node && !node.userData.action) node = node.parent;
        if (node?.userData.action) return node.userData.action as HouseAction;
      }
      return null;
    }

    let pointerStart: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => { pointerStart = { x: event.clientX, y: event.clientY }; };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 8) return;
      pointerStart = null;
      const action = pick(event);
      if (action) propsRef.current.onAction(action);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      activeRenderer.domElement.style.cursor = pick(event) ? "pointer" : "default";
    };
    const onContextLost = (event: Event) => { event.preventDefault(); notifyError(); };
    activeRenderer.domElement.addEventListener("pointerdown", onPointerDown);
    activeRenderer.domElement.addEventListener("pointerup", onPointerUp);
    activeRenderer.domElement.addEventListener("pointermove", onPointerMove);
    activeRenderer.domElement.addEventListener("webglcontextlost", onContextLost);
    const observer = new ResizeObserver(requestDraw);
    observer.observe(host);
    const onVisibility = () => { lastFrame = 0; if (!document.hidden) requestDraw(); };
    document.addEventListener("visibilitychange", onVisibility);
    requestDraw();
    controllerRef.current = requestDraw;

    return () => {
      disposed = true;
      controllerRef.current = null;
      if (raf !== null) window.cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      activeRenderer.domElement.removeEventListener("pointerdown", onPointerDown);
      activeRenderer.domElement.removeEventListener("pointerup", onPointerUp);
      activeRenderer.domElement.removeEventListener("pointermove", onPointerMove);
      activeRenderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      disposeTree(scene);
      disposeMaterials();
      activeRenderer.dispose();
      activeRenderer.forceContextLoss();
      if (activeRenderer.domElement.parentNode === host) host.removeChild(activeRenderer.domElement);
    };
  }, []);

  useEffect(() => { controllerRef.current?.(); }, [props.progress, props.night, props.reducedMotion, props.paused, props.coffeeTrigger, props.lampOn, props.watered]);

  return <div ref={hostRef} role="img" aria-label="An interactive pixel-art 3D house with a study, library, kitchen, sports room and garden" style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#e8e5d8" }} />;
}
