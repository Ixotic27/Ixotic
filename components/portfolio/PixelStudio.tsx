"use client";
import { useState } from "react";

export function PixelMark() {
  return <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="crispEdges"><path d="M9 0h6v6h3v3h6v6h-6v3h-3v6H9v-6H6v-3H0V9h6V6h3z"/><path d="M9 9h6v6H9z" fill="var(--paper)"/></svg>;
}

export function PixelCity() {
  return <svg className="pixel-city" viewBox="0 0 600 320" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M0 260h600v60H0z" fill="#b6b1ca"/>
    <path d="M50 102h40V82h60v20h40v170H50zM210 160h30v-30h70v30h20v112H210zM355 68h35V38h40v30h35v204H355zM490 145h60v127h-60z" fill="#ed663e"/>
    {[70,110,150,250,290,375,415,510].map((x,i)=><g key={x} fill="#f9d997">{[0,1,2,3].map(y=><rect key={y} x={x} y={(i<3?122:i<5?176:i<7?96:172)+y*28} width="12" height="14"/>)}</g>)}
    <path d="M0 271h600v8H0zM25 301h40v5H25zm80 0h40v5h-40zm80 0h40v5h-40zm80 0h40v5h-40zm80 0h40v5h-40zm80 0h40v5h-40zm80 0h40v5h-40z" fill="#51465c"/>
    <path d="M480 42h16V26h40v16h16v12h-72zM205 65h14V51h40v14h16v12h-70z" fill="#f5f0e8"/>
  </svg>;
}

export default function PixelStudio() {
  const [night, setNight] = useState(false);
  return <div className="pixel-studio">
    <svg className="studio-art" viewBox="0 0 480 350" role="img" aria-label={night ? "Pixel art computer showing a mountain landscape under the stars" : "Pixel art computer showing a sunny mountain landscape"} shapeRendering="crispEdges">
      <path d="M86 46h280v12h12v200h-12v12H86v-12H74V58h12z" fill="#313b32"/>
      <path d="M94 62h264v166H94z" fill={night ? "#29384b" : "#cddbc7"}/>
      {night ? <g fill="#f4db9d"><path d="M291 79h14v14h-14zM303 91h14v14h-14zM303 79h14v12h-14z"/><path d="M117 88h4v4h-4zm55 31h4v4h-4zm62-38h4v4h-4zm103 52h4v4h-4zm-128-24h4v4h-4z"/></g> : <><path d="M285 78h32v8h8v32h-8v8h-32v-8h-8V86h8z" fill="#f1834e"/><path d="M112 101h16V89h32v12h16v10h-64zM210 125h12v-9h25v9h12v9h-49z" fill="#f5f1dd"/></>}
      <path d="M94 190h24v-18h20v-18h22v-20h22v20h22v18h22v18h20v38H94z" fill={night ? "#465e63" : "#829776"}/>
      <path d="M191 210h22v-20h22v-20h22v-22h24v-20h24v20h18v22h20v20h15v38H191z" fill={night ? "#668378" : "#a4b293"}/>
      <path d="M94 214h62v-10h52v12h60v-12h48v10h42v14H94z" fill={night ? "#384c49" : "#5a7250"}/>
      <path d="M107 239h28v6h-28z" fill="#a6b599"/><rect x="340" y="239" width="8" height="8" fill="#f1834e"/>
      <path d="M208 270h40v24h32v12H176v-12h32z" fill="#313b32"/>
      <path d="M142 316h170v8H142v8h184v-16h-14" fill="#a6ad9d"/>
      <path d="M21 307h34v-35H21z" fill="#db7852"/><path d="M27 272v-52h10v52zM37 244h18v-19h-9v9h-9zM27 237H9v-23h9v13h9z" fill="#647d57"/>
      <path d="M401 106v93h18v-18h12v-12h18v-12h-12v-12h-12v-12h-12v-27z" fill="#f1834e"/><path d="M413 120v59h6v-10h12v-12h-6v-12h-12z" fill="#f5d0a3"/>
      <path d="M393 259h12v-12h8v12h12v8h-12v12h-8v-12h-12zM50 86h8v-8h6v8h8v6h-8v8h-6v-8h-8z" fill="#f1834e"/>
      <path d="M3 338h454v3H3z" fill="#c9ccbf"/>
    </svg>
    <div className="studio-caption"><span>A little corner of my world.</span><button aria-pressed={night} onClick={() => setNight(!night)}><span className="pixel-status"/>{night ? "Switch to day" : "Switch to night"}</button></div>
  </div>;
}
