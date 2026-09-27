"use client";

import { useRef, useEffect, useState } from "react";
import { useSpring, useMotionValueEvent, MotionValue } from "framer-motion";

const TOTAL_FRAMES = 120; // Number of frames in /sequence/

function getFramePath(index: number) {
  // e.g. /sequence_optimized/frame_001_delay-0.066s.webp
  const paddedIndex = String(index + 1).padStart(3, "0");
  return `/sequence_optimized/frame_${paddedIndex}_delay-0.066s.webp`;
}

export default function ScrollyCanvas({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Apply a slight spring to the scroll progress to make the scrubbing feel Awwwards-smooth
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  /* ── Preload Images (Progressive Streaming) ──────────────────────── */
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let isActive = true;

    // A smart, sequential preloader that prioritizes the first few frames
    // so the hero loads instantly without choking the entire network bandwidth
    // with 120 simultaneous 2K image requests (which freezes the browser).
    const loadFrameSequentially = (i: number) => {
      if (!isActive || i >= TOTAL_FRAMES) return;

      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (!isActive) return;
        loadedCount++;
        images[i] = img;
        setLoadingProgress(loadedCount / TOTAL_FRAMES);

        // When the very first 30 frames exist (1/4 of the sequence), consider the canvas "Loaded".
        // This guarantees that if the user immediately scrolls down very fast, 
        // the background downloader won't be outpaced and stutter.
        if (loadedCount === Math.min(30, TOTAL_FRAMES)) {
          setIsLoaded(true);
        }

        // Recursively load the next single frame in the background implicitly
        loadFrameSequentially(i + 1);
      };

      // Also handle errors so we don't stall the whole loop forever
      img.onerror = () => {
        if (!isActive) return;
        loadedCount++;
        setLoadingProgress(loadedCount / TOTAL_FRAMES);
        loadFrameSequentially(i + 1);
      };
    };

    // Kickoff the sequential waterfall loader
    loadFrameSequentially(0);
    imagesRef.current = images;

    return () => {
      isActive = false;
    };
  }, []);

  /* ── Canvas Render Logic (Object-fit: Cover) ──────────────────────── */
  const renderFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set internal canvas resolution ONLY if it changes (prevents massive memory re-allocation stutter)
    const targetWidth = rect.width * dpr;
    const targetHeight = rect.height * dpr;
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    // Calculate dimensions for object-fit: cover mapping raw pixels
    const canvasRatio = targetWidth / targetHeight;
    const imgRatio = img.width / img.height;

    let drawWidth = targetWidth;
    let drawHeight = targetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = targetHeight * imgRatio;
      drawHeight = targetHeight;
      offsetX = (targetWidth - drawWidth) / 2;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  /* ── Sync render loop with smooth scroll progress ──────────────────────── */
  useMotionValueEvent(smoothProgress, "change", (latest: number) => {
    if (!isLoaded) return;
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(latest * TOTAL_FRAMES))
    );
    // Use requestAnimationFrame to ensure we don't block the main thread
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  // Initial draw and window resize handler
  useEffect(() => {
    if (!isLoaded) return;
    renderFrame(0);

    const handleResize = () => {
      const latest = smoothProgress.get();
      const frameIndex = Math.floor(latest * TOTAL_FRAMES);
      renderFrame(Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex)));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, smoothProgress]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#121212]">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#121212]">
          <div className="text-white/50 text-sm tracking-widest uppercase mb-4">Loading Sequence</div>
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${Math.round(loadingProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Cinematic Vignette Overlay to blend the edges deeply */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-70" />
    </div>
  );
}
