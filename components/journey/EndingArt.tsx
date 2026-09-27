"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./ending-art.css";

type EndingArtProps = {
  progress: number;
  night: boolean;
  reducedMotion: boolean;
  onContact: () => void;
  fit?: "xMidYMid meet" | "xMidYMid slice";
};

const quotes = [
  "Curiosity makes room for another door.",
  "The best ideas begin with a closer look.",
  "A little wonder can change the whole view.",
  "Keep making space for what might be possible.",
];

// Anchor foliage to the globe's circumference, facing out along its radius.
function groundTransform(angle: number, scale = 1) {
  const radians = angle * Math.PI / 180;
  return `translate(${720 + 178 * Math.sin(radians)} ${699 - 178 * Math.cos(radians)}) rotate(${angle}) scale(${scale})`;
}

const roofTiles = Array.from({ length: 14 }, (_, index) => index);
const brickRows = Array.from({ length: 7 }, (_, index) => index);
const stars = [
  [104, 106, 2], [201, 178, 1.6], [337, 85, 2.2], [421, 156, 1.5],
  [1030, 91, 2], [1159, 176, 1.5], [1320, 105, 2.4], [1375, 255, 1.4],
  [271, 308, 1.4], [1205, 346, 1.3], [92, 475, 1.2], [1329, 531, 1.7],
];

export default function EndingArt({ progress, night, reducedMotion, fit = "xMidYMid slice" }: EndingArtProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotePaused, setQuotePaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const p = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  const eased = p * p * (3 - 2 * p);
  const scale = 1 + (5.1 - 1) * (1 - eased);
  const worldTransform = `translate(${720 * (1 - scale)} ${472 * (1 - scale)}) scale(${scale})`;
  const earthOpacity = Math.min(1, Math.max(0, (p - 0.18) / 0.48));
  const panelsVisible = p >= 0.47;
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || quotePaused || !panelsVisible || !inView || !documentVisible) return;
    const timer = window.setInterval(() => setQuoteIndex(index => (index + 1) % quotes.length), 8000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, quotePaused, panelsVisible, inView, documentVisible]);
  const paper = night ? "#d7d3b9" : "#f3e8ce";
  const trim = night ? "#c6ad7f" : "#aa764d";
  const wall = night ? "#829196" : "#c6c7af";
  const wallShade = night ? "#50666b" : "#8fa99f";
  const roof = night ? "#344d59" : "#496473";
  const ink = night ? "#263a43" : "#344a4d";
  const glass = night ? "#e1bd73" : "#6f9aa4";
  const contactCredits = <div className="ending-art__credit-set">
    <span className="ending-art__eyebrow">Still curious</span>
    <h2>A note from me</h2>
    <p className="ending-art__bio">I’m a vibe coder with a keen sense of design.</p>
    <div className="ending-art__contact"><span className="ending-art__eyebrow">Until next time</span><p>Have an idea worth exploring?</p><a className="ending-art__contact-link" href="mailto:ishant.off@gmail.com" tabIndex={panelsVisible ? 0 : -1}>Let&apos;s talk <span aria-hidden="true">↗</span></a><a className="ending-art__email" href="mailto:ishant.off@gmail.com" tabIndex={panelsVisible ? 0 : -1}>ishant.off@gmail.com</a></div>
  </div>;

  return <section ref={sectionRef} className={`ending-art ${night ? "ending-art--night" : "ending-art--day"} ${reducedMotion ? "ending-art--still" : ""}`} aria-label="Leaving the illustrated house" style={{ "--ending-earth-opacity": earthOpacity } as CSSProperties}>
    <svg className="ending-art__scene" viewBox="0 0 1440 900" preserveAspectRatio={fit} role="img" aria-label={p < 0.3 ? "A closed front door reads Thanks for coming over, signed Ixotic." : "A complete illustrated house sits on a small round earth under a wide sky."}>
      <defs>
        <linearGradient id="endingSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#142f40" : "#9bc0c2"}/>
          <stop offset="0.61" stopColor={night ? "#36545c" : "#d5d6bd"}/>
          <stop offset="1" stopColor={night ? "#65827e" : "#efe2bf"}/>
        </linearGradient>
        <linearGradient id="endingEarth" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={night ? "#67988d" : "#a6bb86"}/>
          <stop offset="0.6" stopColor={night ? "#3e746c" : "#6c9882"}/>
          <stop offset="1" stopColor={night ? "#253f51" : "#52798b"}/>
        </linearGradient>
        <clipPath id="endingGlobeClip"><circle cx="720" cy="699" r="178"/></clipPath>
        <pattern id="endingSiding" width="16" height="26" patternUnits="userSpaceOnUse"><path d="M0 25.5H16" stroke={night ? "#5e7476" : "#a2aa97"} strokeWidth="1" opacity=".52"/></pattern>
      </defs>

      <path fill="url(#endingSky)" d="M0 0h1440v900H0z"/>
      <g className="ending-art__sky-detail" opacity={night ? 0.88 : 0.43}>
        {stars.map(([x, y, r]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r={r} fill={night ? "#f4e4ba" : "#fff9df"}/><path d={`M${x - r * 3} ${y}h${r * 6}M${x} ${y - r * 3}v${r * 6}`} stroke={night ? "#f4e4ba" : "#fff9df"} strokeWidth=".7"/></g>)}
        <path d="M383 110c20-9 36-8 53-2m34 249c17-7 29-7 44-1m487-265c18-8 32-7 46-2" fill="none" stroke={night ? "#91aaac" : "#fff8e5"} strokeWidth="3" strokeLinecap="round" opacity=".4"/>
      </g>
      {night ? <g><circle cx="1185" cy="133" r="39" fill="#f1e4ba"/><circle cx="1202" cy="121" r="37" fill="#193746"/></g> : <g><circle cx="1194" cy="139" r="48" fill="#f9e9bf" opacity=".8"/><circle cx="1194" cy="139" r="35" fill="#fff1ce"/></g>}

      <g className="ending-art__planet" opacity={earthOpacity}>
        <ellipse cx="720" cy="867" rx="231" ry="19" fill={night ? "#183646" : "#82988b"} opacity=".23"/>
        <circle cx="720" cy="699" r="182" fill={night ? "#d8d5b0" : "#e8dfbb"}/>
        <circle cx="720" cy="699" r="178" fill="url(#endingEarth)" stroke={night ? "#244e57" : "#507666"} strokeWidth="4"/>
        <g clipPath="url(#endingGlobeClip)">
          <path d="M529 624c51 4 75-7 109-22 48-19 85-15 130 5 54 24 96 20 155-5v56c-69 32-104 44-156 20-51-24-88-33-139-11-35 15-62 27-99 15z" fill={night ? "#80a481" : "#bad097"}/>
          <path d="M519 731c41-21 79-14 114 2 46 21 95 17 142-8 55-29 113-20 154 4v45c-54-21-96-11-143 16-60 35-109 27-160-4-39-24-72-27-107-7z" fill={night ? "#416b70" : "#7eaa9a"}/>
          <path d="M569 770c29 13 42 26 58 53m178-24c27-24 60-25 88-29" fill="none" stroke={night ? "#a9c0a1" : "#d4d7ad"} strokeWidth="8" strokeLinecap="round" opacity=".6"/>
          <path d="M554 670c47 2 66-8 93-24m145-5c37 21 71 23 104 7" fill="none" stroke={night ? "#c7c999" : "#e5d8a5"} strokeWidth="3" opacity=".55"/>
          <path d="M598 798c27-10 57-7 85 10m154-63c22-7 43-5 60 2" fill="none" stroke={night ? "#214d5f" : "#497c85"} strokeWidth="3" opacity=".55"/>
          <circle cx="629" cy="714" r="4" fill="#d9c492"/><circle cx="808" cy="760" r="3" fill="#d9c492"/><circle cx="862" cy="697" r="4" fill="#d9c492"/>
        </g>
        <g clipPath="url(#endingGlobeClip)">
          <path d="M569.05 604.67A178 178 0 0 1 870.95 604.67Q720 647 569.05 604.67Z" fill={night ? "#526e5f" : "#829c73"}/>
        </g>
        <g className="ending-art__tree" transform={`${groundTransform(-33, .27)} translate(-533 -569)`} strokeLinecap="round" strokeLinejoin="round">
          <path d="M533 569c0-39 4-81-4-117m4 70-34-25m35-10 27-30" fill="none" stroke={night ? "#4d4944" : "#786452"} strokeWidth="13"/>
          <path d="M472 487c-18-18-14-46 4-60 4-31 35-43 58-27 22-15 50-2 55 24 26 16 25 48 6 64-8 25-38 34-57 20-26 17-55 7-66-21Z" fill={night ? "#426f65" : "#6e9878"} stroke={night ? "#315850" : "#4f7969"} strokeWidth="5"/>
          <path d="M484 456c23-11 45-9 65 4m-12-40c13-5 28-2 40 9m-80 59c14-5 27-5 38-1" fill="none" stroke={night ? "#80a888" : "#a9be8c"} strokeWidth="5" opacity=".7"/>
          {[486, 518, 557, 571].map((x, i) => <circle key={x} cx={x} cy={450 + i * 8} r="3" fill={night ? "#e8c083" : "#e6b16f"}/>)}
        </g>
        <g fill={night ? "#e1bb83" : "#e6c393"} stroke={night ? "#627b6b" : "#6e8e70"} strokeWidth="2">
          <path transform={`${groundTransform(36, .48)} translate(-901 -578)`} d="M872 567c4-23 17-31 29-22 13-19 33-12 34 5 15 7 8 27-6 28l-58-1Z"/>
          <path transform={`${groundTransform(-19, .55)} translate(-575 -573)`} d="M605 573c-4-20-18-27-30-16-10-11-26-4-27 10Z"/>
        </g>
        <g fill={night ? "#f3d59a" : "#d88e6c"}>
          {[-25, -22, 40, 44, 48].map((angle, i) => <g key={angle} transform={groundTransform(angle)}><path d="M0 0v-8" stroke="#456b62" strokeWidth="1.4"/><circle cx="0" cy={-9 - (i % 2) * 3} r="2.5"/></g>)}
        </g>
      </g>

      <g className="ending-art__house" transform={worldTransform} strokeLinejoin="round">
        {/* The whole house moves as one illustration; the front door remains the zoom anchor. */}
        <path d="M496 561h448v23H496z" fill={night ? "#5d6764" : "#a69b7f"} stroke={ink} strokeWidth="5"/>
        <path d="M510 337h420v225H510z" fill={wall} stroke={ink} strokeWidth="6"/>
        <path d="M510 337h420v225H510z" fill="url(#endingSiding)" opacity=".65"/>
        <path d="M510 337h54v225h-54z" fill={wallShade} opacity=".42"/>
        <path d="M894 337h36v225h-36z" fill={wallShade} opacity=".5"/>
        {brickRows.map(row => <g key={row} stroke={night ? "#65817d" : "#a5ab99"} strokeWidth="1.4" opacity=".48"><path d={`M518 ${365 + row * 27}h34m340 0h30`}/><path d={`M532 ${376 + row * 27}v11m376-11v11`}/></g>)}
        <path d="M482 348 595 213h250l113 135-32 12-206-102-208 102Z" fill={roof} stroke={ink} strokeWidth="7"/>
        <path d="M595 213 720 147l125 66-125 89Z" fill={night ? "#647a79" : "#a1ad9e"} stroke={ink} strokeWidth="6"/>
        <path d="M595 213 720 147l125 66" fill="none" stroke={night ? "#a5aaa0" : "#d6c7a5"} strokeWidth="7"/>
        <path d="m489 350 231-142 231 142" fill="none" stroke={night ? "#263e4b" : "#415761"} strokeWidth="16" strokeLinecap="round"/>
        <path d="m489 350 231-142 231 142" fill="none" stroke={night ? "#809696" : "#789095"} strokeWidth="3" strokeLinecap="round"/>
        {roofTiles.map(index => <path key={index} d={`M${515 + index * 15} ${337 - index * 8.8}l26 9 M${925 - index * 15} ${337 - index * 8.8}l-26 9`} fill="none" stroke={night ? "#789091" : "#77909a"} strokeWidth="2.4" opacity=".55"/>)}
        <path d="M809 189v-64h52v89" fill={night ? "#6c7973" : "#bcad91"} stroke={ink} strokeWidth="5"/>
        <path d="M803 128h65v13h-65z" fill={roof} stroke={ink} strokeWidth="4"/>
        <path d="M809 155h52m-52 22h52" stroke={night ? "#9d9c86" : "#ddc7a2"} strokeWidth="3"/>
        <path d="M678 272a42 42 0 0 1 84 0v44h-84Z" fill={trim} stroke={ink} strokeWidth="5"/>
        <path d="M688 277a32 32 0 0 1 64 0v29h-64Z" fill={glass} stroke={ink} strokeWidth="3"/>
        <path d="M720 245v62m-31-31h62" stroke={paper} strokeWidth="4"/>
        <path d="M675 312h90v8h-90z" fill={night ? "#918a75" : "#c5ab83"} stroke={ink} strokeWidth="3"/>
        {/* Window trim, reflections, shutters, sills and small flower boxes. */}
        {[554, 814].map(x => <g key={x}>
          <path d={`M${x - 13} 387h13v116h-13zm92 0h13v116h-13z`} fill={roof} stroke={ink} strokeWidth="3"/>
          <path d={`M${x} 382h92v127h-92z`} fill={trim} stroke={ink} strokeWidth="4"/>
          <path d={`M${x + 8} 391h76v106h-76z`} fill={glass} stroke={ink} strokeWidth="2"/>
          <path d={`M${x + 46} 391v106m-38-54h76`} stroke={paper} strokeWidth="5"/>
          <path d={`m${x + 12} 414 22-20m-16 36 37-36m1 50 17-17`} stroke={night ? "#f5deac" : "#cfe4df"} strokeWidth="3" opacity=".64"/>
          <path d={`M${x - 6} 503h104v10h-104z`} fill={night ? "#b5a67f" : "#d4ba8e"} stroke={ink} strokeWidth="3"/>
          <path d={`M${x + 5} 512h83l-7 23h-69z`} fill={night ? "#785c47" : "#997653"} stroke={ink} strokeWidth="3"/>
          {[x + 23, x + 45, x + 69].map((flowerX, i) => <g key={flowerX}><path d={`M${flowerX} 516v-22`} stroke="#477366" strokeWidth="2"/><circle cx={flowerX} cy={493 - (i % 2) * 8} r="5" fill={night ? "#e7c482" : "#d88d74"}/></g>)}
        </g>)}
        <path d="M643 571h154v17H643z" fill={night ? "#91866c" : "#c5b38f"} stroke={ink} strokeWidth="4"/>
        <path d="M655 551h130v20H655z" fill={night ? "#b7a989" : "#e1caa2"} stroke={ink} strokeWidth="4"/>
        <path d="M653 366h134v194H653z" fill={night ? "#b1a184" : "#ddc5a0"} stroke={ink} strokeWidth="5"/>
        <path d="M662 375h116v181H662z" fill={night ? "#415861" : "#718884"} stroke={ink} strokeWidth="4"/>
        <path d="M672 384h96v162h-96z" fill={night ? "#405965" : "#7d968c"} stroke={night ? "#6c7c78" : "#abc1ab"} strokeWidth="2"/>
        <path d="M683 393h74v73h-74z" fill={night ? "#536e76" : "#89a7a2"} stroke={night ? "#263e48" : "#566e68"} strokeWidth="3"/>
        <path d="M720 393v73m-37-36h74" stroke={paper} strokeWidth="3" opacity=".74"/>
        <path d="m688 407 15-12m-13 27 31-26" stroke={night ? "#dac49a" : "#d5ebe0"} strokeWidth="2" opacity=".62"/>
        <path d="M672 475h96m-88 9v60m80-60v60" stroke={night ? "#263f49" : "#5c756f"} strokeWidth="2.5"/>
        <circle cx="751" cy="493" r="7" fill={night ? "#e6c38a" : "#d9b576"} stroke={ink} strokeWidth="2"/>
        <path d="M702 374v11m36-11v11" stroke={night ? "#dbcda5" : "#f4dfb4"} strokeWidth="3"/>
        <path d="M673 446h94v49h-94z" fill={night ? "#263e4b" : "#435d61"} stroke={night ? "#d6bd8c" : "#d9bf8c"} strokeWidth="2"/>
        <text x="720" y="465" textAnchor="middle" fill="#f5e5bd" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="7.2" letterSpacing=".2">Thanks for coming over.</text>
        <text x="720" y="482" textAnchor="middle" fill="#e8c596" fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing=".6">— Ixotic</text>
        <path d="M678 508h61" stroke={night ? "#a2b3a3" : "#c5d4b7"} strokeWidth="2" opacity=".6"/>
        <path d="M505 358h430" stroke={night ? "#455d62" : "#7c918c"} strokeWidth="6"/>
        <path d="M526 541h75m239 0h74" stroke={night ? "#5d7977" : "#a4ad9a"} strokeWidth="3" opacity=".65"/>
        <path d="M489 583h462" stroke={night ? "#3a5a59" : "#6f8a76"} strokeWidth="8" strokeLinecap="round"/>
      </g>
    </svg>

    <div className={`ending-art__columns ${panelsVisible ? "ending-art__columns--visible" : ""}`} aria-hidden={!panelsVisible}>
      <aside className="ending-art__column ending-art__column--left" aria-label="A thought to take with you" onMouseEnter={() => setQuotePaused(true)} onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setQuotePaused(false); }} onFocus={() => setQuotePaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) setQuotePaused(false); }}>
        <div className="ending-art__credit-set">
          <span className="ending-art__eyebrow">A thought to take with you</span>
          <p className="ending-art__quote" aria-live={reducedMotion ? "off" : "polite"}>“{quotes[quoteIndex]}”</p>
          <button className="ending-art__next-quote" type="button" onClick={() => setQuoteIndex(index => (index + 1) % quotes.length)} tabIndex={panelsVisible ? 0 : -1} aria-label="Show next thought">Next thought <span aria-hidden="true">→</span></button>
        </div>
      </aside>
      <aside className="ending-art__column ending-art__column--right" aria-label="About and contact">
        {contactCredits}
      </aside>
    </div>
  </section>;
}
