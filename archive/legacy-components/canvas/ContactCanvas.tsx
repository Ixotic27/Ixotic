"use client";

import { useEffect, useRef, useState } from "react";
import { SkyLayer } from "./layers/SkyLayer";
import { CityLayer } from "./layers/CityLayer";

class PlaneLayer {
  private x: number;
  private y: number;
  private speed: number;
  private blinkTimer: number = 0;
  private blinkState: boolean = false;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = height * 0.2 + Math.random() * (height * 0.2); // Upper sky
    this.speed = 0.5 + Math.random() * 0.5; // slow plane
  }

  draw(ctx: CanvasRenderingContext2D, width: number, delta: number) {
    this.x += this.speed * (delta / 16);
    if (this.x > width + 100) {
      this.x = -100;
      this.y = width * 0.2 + Math.random() * (width * 0.2);
    }

    this.blinkTimer += delta;
    if (this.blinkTimer > 500) {
      this.blinkState = !this.blinkState;
      this.blinkTimer = 0;
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Plane body (simple silhouette)
    ctx.fillStyle = "#1a1a2e"; // dark shape against night sky
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-2, -8);
    ctx.lineTo(2, 0);
    ctx.fill();

    // Blinking lights
    if (this.blinkState) {
      ctx.fillStyle = "#ff0000"; // Red nav light
      ctx.beginPath();
      ctx.arc(-10, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff"; // White strobe
      ctx.beginPath();
      ctx.arc(10, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export default function ContactCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const layersRef = useRef<{
    sky: SkyLayer | null;
    city: CityLayer | null;
    plane: PlaneLayer | null;
  }>({
    sky: null,
    city: null,
    plane: null
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;
      }

      layersRef.current.sky = new SkyLayer(rect.width, rect.height);
      layersRef.current.city = new CityLayer(rect.width, rect.height);
      layersRef.current.plane = new PlaneLayer(rect.width, rect.height);
      
      setIsReady(true);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

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

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const layers = layersRef.current;
      
      // Time-driven animation (no scroll)
      const mockScrollOffset = time * 0.05;

      layers.sky?.draw(ctx, w, h, mockScrollOffset * 0.1, time);
      layers.city?.draw(ctx, w, h, mockScrollOffset * 0.2); // Extremely slow city drift
      layers.plane?.draw(ctx, w, delta);

      rAF_ID = requestAnimationFrame(draw);
    };

    rAF_ID = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rAF_ID);
  }, [isReady]);

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
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,10,15,0.8)_120%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
