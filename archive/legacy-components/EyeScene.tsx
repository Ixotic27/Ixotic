"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function EyeScene({ wireframe, paused, rotation }: { wireframe: boolean; paused: boolean; rotation: number }) {
  const host = useRef<HTMLDivElement>(null);
  const settings = useRef({ wireframe, paused, rotation });
  useEffect(() => { settings.current = { wireframe, paused, rotation }; }, [wireframe, paused, rotation]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    camera.position.set(0, 0, 9.5);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const chrome = new THREE.MeshStandardMaterial({ color: 0xe6e8e1, metalness: 1, roughness: .16 });
    const orange = new THREE.MeshPhysicalMaterial({ color: 0xf24b19, metalness: .18, roughness: .27, clearcoat: 1, clearcoatRoughness: .2 });
    const black = new THREE.MeshStandardMaterial({ color: 0x151810, roughness: .18, metalness: .25 });
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x713011, metalness: .4, roughness: .4 });
    const ringGeometry = new THREE.TorusGeometry(1.6, .095, 20, 160);
    const outer = new THREE.Mesh(ringGeometry, chrome);
    outer.scale.set(1.56, .83, 1);
    sculpture.add(outer);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.43, .075, 20, 144), chrome);
    inner.rotation.set(.45, .9, -.22);
    sculpture.add(inner);
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.75, .038, 12, 144), chrome);
    orbit.rotation.set(.9, -.55, .3);
    sculpture.add(orbit);
    const eye = new THREE.Group();
    sculpture.add(eye);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.86, 64, 48), orange);
    eye.add(ball);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(.395, 48, 32), black);
    pupil.scale.z = .34;
    pupil.position.z = .805;
    eye.add(pupil);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.405, .022, 12, 96), chrome);
    rim.position.z = .824;
    eye.add(rim);
    const irisLines = new THREE.Group();
    for (let i = 0; i < 64; i++) {
      const angle = i * Math.PI * 2 / 64;
      const length = .11 + .045 * Math.sin(i * 2.7);
      const line = new THREE.Mesh(new THREE.CapsuleGeometry(.005, length, 2, 4), lineMaterial);
      const radius = .53;
      line.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, .676);
      line.rotation.z = angle - Math.PI / 2;
      irisLines.add(line);
    }
    eye.add(irisLines);
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(-3, 5, 6);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffe1c4, 2);
    fill.position.set(4, -2, 3);
    scene.add(fill);

    let pointerX = 0, pointerY = 0, visible = true, frame = 0, time = 0, previous = 0;
    let appliedWireframe = false, contextLost = false;
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - .5) * 2;
      pointerY = (event.clientY / window.innerHeight - .5) * 2;
    };
    const resize = () => {
      const width = element.clientWidth, height = element.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1 ? 10.5 : 9;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: "100px" });
    observer.observe(element);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const onContextLost = (event: Event) => { event.preventDefault(); contextLost = true; element.classList.remove("is-ready"); };
    const onContextRestored = () => { contextLost = false; };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
    resize();

    function animate(now: number) {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previous) / 1000, .04);
      previous = now;
      if (!visible || document.hidden || contextLost) return;
      const { paused: isPaused, wireframe: isWireframe, rotation: turn } = settings.current;
      if (!isPaused) time += delta;
      if (appliedWireframe !== isWireframe) {
        chrome.wireframe = isWireframe;
        orange.wireframe = isWireframe;
        appliedWireframe = isWireframe;
      }
      const follow = isPaused ? 0 : 1;
      sculpture.rotation.x = THREE.MathUtils.lerp(sculpture.rotation.x, .17 + pointerY * .16 * follow, .055);
      sculpture.rotation.y = THREE.MathUtils.lerp(sculpture.rotation.y, -.23 + pointerX * .28 * follow + turn, .055);
      sculpture.rotation.z = -.27 + Math.sin(time * .3) * .045;
      sculpture.position.y = Math.sin(time * .75) * .08;
      inner.rotation.y = .8 + Math.sin(time * .35) * .25;
      orbit.rotation.z = .3 + time * .055;
      eye.rotation.y = pointerX * .12 * follow;
      eye.rotation.x = pointerY * .1 * follow;
      renderer.render(scene, camera);
      element?.classList.add("is-ready");
    }
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect(); observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      chrome.dispose(); orange.dispose(); black.dispose(); lineMaterial.dispose();
      environment.dispose(); pmrem.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="eye-webgl" aria-hidden="true"/>;
}
