"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { SkyLayer } from "./layers/SkyLayer";
import { CityLayer } from "./layers/CityLayer";
import { GroundLayer } from "./layers/GroundLayer";
import { CharacterSprite } from "./layers/CharacterSprite";

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress();
  
  // To avoid constant array reallocation, store layers in ref
  const layersRef = useRef<{
    sky: SkyLayer | null;
    city: CityLayer | null;
    ground: GroundLayer | null;
    character: CharacterSprite | null;
  }>({
    sky: null,
    city: null,
    ground: null,
    character: null
  });

  const [isReady, setIsReady] = useState(false);

  // Initialize Layers on Mount or Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // We want pixelated sharp look so we sync canvas resolution strictly
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false; // Pixel art!
      }

      // Initialize or Re-init layers with new dimensions
      layersRef.current.sky = new SkyLayer(rect.width, rect.height);
      layersRef.current.city = new CityLayer(rect.width, rect.height);
      layersRef.current.ground = new GroundLayer(rect.height);
      layersRef.current.character = new CharacterSprite(rect.width, layersRef.current.ground.getGroundLevel());
      
      setIsReady(true);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // Main Render Loop (requestAnimationFrame)
  useEffect(() => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rAF_ID: number;
    let lastTime = performance.now();

    const draw = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Because scrollHeight can be huge, we convert normalized progress
      // into a pixel 'world offset' mapped for background movement.
      const worldScrollOffset = scrollProgress * 15000; // Large multiplier for endless road feel
      
      // We expect CSS to fix the canvas strictly matching window size.
      // E.g. 100vw, 100vh.
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear frame
      ctx.clearRect(0, 0, w, h);

      // Draw Parallax Layers
      const layers = layersRef.current;
      
      layers.sky?.draw(ctx, w, h, worldScrollOffset, time);
      layers.city?.draw(ctx, w, h, worldScrollOffset);
      layers.ground?.draw(ctx, w, h, worldScrollOffset);
      
      // Update and Draw Sprite
      layers.character?.update(worldScrollOffset, delta, w, layers.ground?.getGroundLevel() || h * 0.85);
      layers.character?.draw(ctx);

      rAF_ID = requestAnimationFrame(draw);
    };

    rAF_ID = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rAF_ID);
  }, [scrollProgress, isReady]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] pointer-events-none w-screen h-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Overlay vignette to match game/retro feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,10,15,0.8)_120%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
