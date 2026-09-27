"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import EndingArt from "../journey/EndingArt";
import "./room-ending.css";

type Props = {
  night: boolean;
  reducedMotion: boolean;
  onContact?: () => void;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function RoomEnding({ night, reducedMotion, onContact }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 620px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const distance = Math.max(1, section.offsetHeight - window.innerHeight);
        setProgress(clamp(-section.getBoundingClientRect().top / distance));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion]);

  const p = reducedMotion ? 1 : progress;
  // The preserved artwork supplies the entire house and globe. These values only
  // reframe its existing SVG as the visitor scrolls through this final chapter.
  const pullback = smooth(p);
  const placement = smooth((p - 0.38) / 0.62);
  const style = {
    "--ending-house-scale": 10.2 - 9.87 * pullback,
    "--ending-house-scale-mobile": 4.2 - 3.98 * pullback,
    "--ending-house-rise": `${270 * placement}px`,
    "--ending-house-rise-mobile": `${42 * placement}px`,
  } as CSSProperties;

  return (
    <section
      id="door"
      ref={sectionRef}
      className={`room-chapter room-ending ${reducedMotion ? "room-ending--still" : ""}`}
      style={style}
      aria-label="The way home"
    >
      <div className="room-ending__sticky">
        <EndingArt
          progress={p}
          night={night}
          reducedMotion={reducedMotion}
          onContact={onContact ?? (() => { window.location.hash = "contact"; })}
          fit={compact ? "xMidYMid slice" : "xMidYMid meet"}
        />
        <a className="room-ending__return" href="#study">Back to the beginning ↑</a>
      </div>
    </section>
  );
}
