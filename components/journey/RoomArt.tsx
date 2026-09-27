"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import "./room-art.css";

export type RoomAction = "imac" | "gameboy" | "books" | "coffee" | "tennis" | "lamp" | "cat" | "plant" | "music" | "next";

type Props = {
  room: 0 | 1 | 2 | 3;
  night: boolean;
  active: boolean;
  reducedMotion: boolean;
  musicEnabled: boolean;
  onAction: (action: RoomAction) => void;
};

const ink = "#354a4d";
const RoomActiveContext = createContext(true);

function Hotspot({ action, label, onAction, children, className = "" }: { action: RoomAction; label: string; onAction: Props["onAction"]; children: ReactNode; className?: string }) {
  const active = useContext(RoomActiveContext);
  function onKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (active && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onAction(action);
    }
  }
  return <g className={`room-art__hotspot ${className}`} role="button" tabIndex={active ? 0 : -1} aria-label={label} onClick={() => { if (active) onAction(action); }} onKeyDown={onKeyDown}>{children}</g>;
}

function Shell({ room, night, onAction, musicEnabled }: Pick<Props, "room" | "night" | "onAction" | "musicEnabled">) {
  return <>
    <rect width="1440" height="900" fill="var(--room-back)" />
    <path d="M0 0H1440L1230 154H210Z" fill="var(--room-ceiling)" />
    <path d="M0 0 210 154V590L0 900Z" fill="var(--room-side)" />
    <path d="M1440 0 1230 154V590L1440 900Z" fill="var(--room-side-right)" />
    <path d="M210 154H1230V590H210Z" fill="var(--room-wall)" />
    <path d="M0 900 210 590H1230L1440 900Z" fill="var(--room-floor)" />
    <path d="M210 154H1230M210 590H1230M210 154 0 0M1230 154 1440 0M210 590 0 900M1230 590 1440 900" fill="none" stroke="var(--room-line)" strokeWidth="5" />
    <path d="M0 900 515 590M290 900 615 590M580 900 694 590M860 900 742 590M1150 900 833 590M1440 900 925 590" fill="none" stroke="var(--floor-line)" strokeWidth="3" opacity=".7" />
    <path d="M100 756H1340M175 645H1265M205 605H1235" fill="none" stroke="var(--floor-line)" strokeWidth="3" opacity=".6" />
    <path d="M225 172H1215M225 573H1215" fill="none" stroke="var(--trim)" strokeWidth="8" />
    <path d="M26 28 197 159V579L26 825M1414 28 1243 159V579L1414 825" fill="none" stroke="var(--trim)" strokeWidth="7" />
    <g className="room-art__door">
      <path d="M1103 284 1215 261V586H1103Z" fill="#3b5354" stroke="#d4c4a9" strokeWidth="8" />
      <path d="M1120 298 1199 283V568H1120Z" fill={night ? "#476264" : "#76928a"} />
      <path d="M1133 318 1187 308V420L1133 425ZM1133 444 1187 439V545H1133Z" fill="none" stroke="#a9c0af" strokeWidth="3" />
      <circle cx="1138" cy="431" r="7" fill="#dfc58c" />
      <path d="M1083 587H1236L1272 613H1058Z" fill="#8f7159" />
    </g>
    <Hotspot action="next" label={room === 3 ? "Go through the exit door" : "Go to the next room"} onAction={onAction} className="room-art__door-hit">
      <path d="M1095 269 1221 245V590H1095Z" fill="transparent" stroke="transparent" strokeWidth="12" />
      <path className="room-art__door-glint" d="M1210 270V573" stroke="#f6dfa7" strokeWidth="5" />
    </Hotspot>
    <g className="room-art__scroll-note" aria-hidden="true">
      <path d="M935 575 1068 562 1079 599 943 609Z" fill="#e4d5ad" stroke="#775f4b" strokeWidth="2" />
      <text x="952" y="592" transform="rotate(-5 952 592)" fill={ink} fontSize="15" fontWeight="700">Scroll to wander ↓</text>
    </g>
    <Hotspot action="music" label={musicEnabled ? "Mute room music" : "Play room music"} onAction={onAction} className="room-art__music-hit">
      <path d="M278 171H332V224H278Z" fill="#42595c" stroke="#d9c5a5" strokeWidth="5" />
      <circle cx="305" cy="199" r="15" fill="#20373c" stroke="#8ba29a" strokeWidth="3" />
      <circle cx="305" cy="199" r="5" fill="#d9c5a5" />
      <circle cx="321" cy="181" r="3" fill={musicEnabled ? "#e9ca80" : "#7c9691"} />
      <text x="271" y="247" fill="var(--room-text)" fontSize="14" fontWeight="700">music {musicEnabled ? "on" : "off"}</text>
    </Hotspot>
  </>;
}

function Window({ night, x = 944, y = 201, width = 195, height = 280 }: { night: boolean; x?: number; y?: number; width?: number; height?: number }) {
  return <g>
    <rect x={x} y={y} width={width} height={height} fill="#3c5457" stroke="#e0cfac" strokeWidth="9" />
    <rect x={x + 12} y={y + 12} width={width - 24} height={height - 24} fill={night ? "#344653" : "#9ec4c3"} />
    {night ? <><circle cx={x + width * .71} cy={y + 64} r="25" fill="#eed6a1" /><circle cx={x + width * .77} cy={y + 56} r="25" fill="#344653" /><path d={`M${x + 38} ${y + 48}h3m68 65h3m25-80h3m-95 118h3`} stroke="#f2d9a8" strokeWidth="3" strokeLinecap="round" /></> : <><circle cx={x + width * .7} cy={y + 67} r="29" fill="#f1d49a" /><path d={`M${x + 15} ${y + 140}q45-35 82 0t85 0`} fill="none" stroke="#dfe5cb" strokeWidth="16" /></>}
    <path d={`M${x + 12} ${y + height - 92}q34-43 73-9 29-47 92-18v119H${x + 12}Z`} fill={night ? "#455d61" : "#6c9292"} />
    <path d={`M${x + width / 2} ${y + 5}v${height - 10}M${x + 5} ${y + height / 2}h${width - 10}`} stroke="#e0cfac" strokeWidth="9" />
    <path d={`M${x - 9} ${y + height}h${width + 18}l13 17H${x - 22}Z`} fill="#b89574" />
  </g>;
}

function Cat({ onAction }: Pick<Props, "onAction">) {
  return <Hotspot action="cat" label="Pet the cat" onAction={onAction} className="room-art__cat-hit">
    <g className="room-art__cat">
      <ellipse cx="754" cy="777" rx="88" ry="16" fill="#52605a" opacity=".23" />
      <path className="room-art__cat-tail" d="M810 746q71-75 87-8 6 37-25 45" fill="none" stroke="#e6c89c" strokeWidth="20" strokeLinecap="round" />
      <path d="M686 734q39-31 105-4 28 15 18 47-30 26-103 13-31-17-20-56Z" fill="#f1dab2" stroke="#987c62" strokeWidth="3" />
      <path d="M685 746q-10-48 19-66l13 21 18-22q29 15 29 57-12 30-45 32-29-1-34-22Z" fill="#f1dab2" stroke="#987c62" strokeWidth="3" />
      <path d="m695 698 6-24 16 24m17 0 17-25 5 36" fill="#e6c89c" stroke="#987c62" strokeWidth="3" />
      <path d="M704 725h8m22 0h8" stroke={ink} strokeWidth="4" strokeLinecap="round" className="room-art__cat-eyes" />
      <path d="m722 740 4 3 4-3m-4 3v5m-23-8-26-5m26 13-27 5m57-13 25-5m-25 13 28 5" fill="none" stroke="#8e7764" strokeWidth="2" strokeLinecap="round" />
      <path d="M746 785q0 14-19 13m60-20q3 15-14 17" fill="none" stroke="#d1ad86" strokeWidth="9" strokeLinecap="round" />
    </g>
  </Hotspot>;
}

function Plant({ onAction, watered, x = 382, y = 642 }: Pick<Props, "onAction"> & { watered: boolean; x?: number; y?: number }) {
  return <Hotspot action="plant" label="Water the plant" onAction={onAction}>
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="93" rx="56" ry="11" fill="#475c58" opacity=".18" />
      <path d="M-34 34H34L27 90H-27Z" fill="#b38065" stroke="#805e4b" strokeWidth="3" />
      <path d="M-40 28H40V39H-40Z" fill="#d0a082" />
      <path d="M0 30V-69M-2 7q-22-42-55-34M2-11q34-47 59-54M1-37q-15-40-10-70" fill="none" stroke="#587466" strokeWidth="6" />
      <path d="M-4-48q-57-57-64-14 27 25 64 14Zm10-13q27-57 64-39-3 38-64 39Zm-9 40q-50-25-54 12 27 21 54-12Zm7-10q53-31 63 4-22 28-63-4Z" fill="#66827e" stroke="#3e665f" strokeWidth="2" />
      {watered && <><path d="m-27-59 5-10 5 10-5 7zM29-80l5-10 5 10-5 7z" fill="#c6e4dc" /><path d="M-26 55h49" stroke="#e0b697" strokeWidth="3" /></>}
    </g>
  </Hotspot>;
}

function Study({ night, onAction, lampOn, watered }: Pick<Props, "night" | "onAction"> & { lampOn: boolean; watered: boolean }) {
  return <>
    <Window night={night} x={930} y={196} width={197} height={278} />
    <path d="M440 249H835v15H440Z" fill="#8a6b55" /><path d="M457 264h13v29h-13zm347 0h13v29h-13z" fill="#665343" />
    {Array.from({ length: 10 }, (_, i) => <g key={i}><path d={`M${454 + i * 25} ${190 + i % 3 * 8}h${18 + i % 2 * 4}v${59 - i % 3 * 8}h-${18 + i % 2 * 4}z`} fill={["#c4846b", "#d2b783", "#78928b", "#aeb5aa", "#826e68"][i % 5]} /><path d={`M${461 + i * 25} 222h8`} stroke="#efdfbd" strokeWidth="2" /></g>)}
    <path d="M767 208h44v41h-44Z" fill="#49635f" /><path d="m789 209 12-27 12 12-12 30" fill="#729179" />
    <path d="M356 590H967l-46 48H308Z" fill="#e0bc91" stroke="#8d6a50" strokeWidth="4" /><path d="M308 638H921v29H308Z" fill="#8a6b52" /><path d="M348 667h35v145h-35zm509 0h35v145h-35z" fill="#745945" /><path d="M356 667h27v34h-27zm501 0h35v34h-35z" fill="#a47d5f" />
    <path d="M517 313H794q18 0 18 18v199q0 18-18 18H517q-18 0-18-18V331q0-18 18-18Z" fill="#bdc8c1" stroke="#687f7b" strokeWidth="4" />
    <path d="M512 327H799V510H512Z" fill="#304c54" />
    <path d="M518 334H793V505H518Z" fill={night ? "#4a7180" : "#8dbdc0"} />
    <path d="M518 458q65-96 139-15 80-101 136-38v100H518Z" fill="#567e7a" /><path d="M518 482q56-50 124 3 81-75 151-16v36H518Z" fill="#355b5d" />
    <path d="M518 334H793v18H518Z" fill="#e2dfcc" opacity=".88" /><circle cx="531" cy="343" r="3" fill="#c78670" /><circle cx="542" cy="343" r="3" fill="#d5b67d" /><circle cx="553" cy="343" r="3" fill="#7da49b" />
    <rect x="550" y="374" width="66" height="77" rx="4" fill="#e6d5b4" opacity=".92" /><path d="M566 395h34m-34 10h26m-26 10h29" stroke="#537470" strokeWidth="4" />
    <rect x="637" y="391" width="68" height="57" rx="4" fill="#d6e0c8" opacity=".91" /><path d="M650 433v-20l13-12 10 11 11-7 8 28Z" fill="#7e9a89" />
    <text x="548" y="489" fill="#eff0dc" fontSize="16" fontWeight="700">Welcome in.</text>
    <circle cx="655" cy="528" r="6" fill="#718985" /><path d="M642 548h27l13 43h-53z" fill="#a2aea8" /><path d="M608 587h92l11 8H597Z" fill="#b7c1b8" />
    <Hotspot action="imac" label="Use the iMac" onAction={onAction} className="room-art__imac-hit"><path d="M495 308H816V555H495Z" fill="transparent" /></Hotspot>
    <path d="M488 598H730l27 17H461Z" fill="#e2dfcb" stroke="#a6aaa0" strokeWidth="2" /><path d="M502 603H715m-204 5h210" stroke="#9ca9a1" strokeWidth="2" strokeDasharray="11 4" />
    {lampOn && <path d="M442 550 355 615H535Z" fill="#f9ddaa" opacity=".28" />}
    <path d="M418 558 451 486l20 10-17 60Z" fill="#425d5c" /><path d="M450 489 520 465" stroke="#425d5c" strokeWidth="7" /><path d="M439 553h30l21 38h-73Z" fill={lampOn ? "#d7ae79" : "#718881"} /><path d="M414 594h73" stroke="#465d5a" strokeWidth="7" />
    <Hotspot action="lamp" label="Toggle the desk lamp" onAction={onAction}><path d="M405 457H501V602H405Z" fill="transparent" /></Hotspot>
    <path d="M751 578h37l8 41h-52Z" fill="#b7775f" /><path d="M754 576h30" stroke="#edd6ac" strokeWidth="5" /><path d="M787 582q32-2 21 26-7 13-21 3" fill="none" stroke="#b7775f" strokeWidth="7" />
    <path d="M844 588h62l7 8h-73z" fill="#d9d0b8" /><path d="M847 526h57v61h-57z" fill="#d9d0b8" stroke="#8d9c91" strokeWidth="3" /><path d="M853 534h45v35h-45z" fill="#6e8b7e" /><path d="M856 539h39v25h-39z" fill="#a8b994" /><path d="M854 575h16m-8-8v16" stroke="#435851" strokeWidth="4" /><circle cx="886" cy="579" r="4" fill="#ae6d61" /><circle cx="897" cy="575" r="4" fill="#ae6d61" />
    <Hotspot action="gameboy" label="Play the Game Boy" onAction={onAction}><path d="M830 516H924V618H830Z" fill="transparent" /></Hotspot>
    <path d="M75 373 218 377v270L75 698Z" fill="#806b5a" stroke="#615143" strokeWidth="4" /><path d="M87 398 205 399v91L87 509Zm0 127 118-18v111L87 665Z" fill="#4f5751" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${99 + i * 11} ${420 - i * 2}l9 1v${65 + i * 2}l-9 1z`} fill={["#c0baa0", "#d48d73", "#7b9890", "#c3a781"][i % 4]} />)}
    <path d="M102 550h82v59l-82 19z" fill="#d1cbb3" /><path d="M110 563h55m-55 12h41m-41 12h57" stroke="#6f8c82" strokeWidth="3" />
    <Hotspot action="books" label="Browse the bookshelf" onAction={onAction}><path d="M70 364 221 365v341L70 710Z" fill="transparent" /></Hotspot>
    <Plant onAction={onAction} watered={watered} x={286} y={688} />
    <path d="M477 722 934 713l90 130H375Z" fill="#849894" opacity=".77" /><path d="M445 747h515M418 790h568" stroke="#c4cbb5" strokeWidth="4" />
    <Cat onAction={onAction} />
  </>;
}

function Library({ night, onAction, watered }: Pick<Props, "night" | "onAction"> & { watered: boolean }) {
  return <>
    <Window night={night} x={930} y={203} width={170} height={240} />
    <path d="M390 208H884V589H390Z" fill="#665847" stroke="#cfb18b" strokeWidth="6" />
    <path d="M408 222H865V565H408Z" fill="#475453" />
    {[310,400,490].map(y => <path key={y} d={`M400 ${y}H875v15H400Z`} fill="#a28061" />)}
    {Array.from({ length: 51 }, (_, i) => { const shelf = Math.floor(i / 17); const col = i % 17; const x = 417 + col * 26; const y = 228 + shelf * 91 + (i % 4) * 5; const h = 79 - (i % 4) * 5; return <g key={i}><rect x={x} y={y} width={20 + i % 3} height={h} fill={["#bd876a", "#d6bd8e", "#8ca497", "#b3b7ad", "#6f8a89", "#d6a77a"][i % 6]} /><path d={`M${x + 5} ${y + 15}h${10 + i % 3}`} stroke="#ead9b8" strokeWidth="2" opacity=".8" /></g>; })}
    <Hotspot action="books" label="Browse the library journals" onAction={onAction}><path d="M388 202H888V592H388Z" fill="transparent" /></Hotspot>
    <path d="M402 640 870 640 982 768H284Z" fill="#758e8a" opacity=".6" /><path d="M341 696h585m-554 34h522" stroke="#c3c8af" strokeWidth="4" />
    <path d="M639 598h153l23 24H623Z" fill="#d2ad85" /><path d="M657 620h18v125h-18zm122 0h18v125h-18z" fill="#725b49" />
    <path d="M700 582h77l8 17h-83z" fill="#e0d7bc" /><path d="M708 575h65v9h-65z" fill="#b87c61" /><path d="M713 587h55" stroke="#8f6b56" strokeWidth="2" />
    <path d="M493 532q0-31 28-31h81q27 0 27 31v126H493Z" fill="#4e6a68" stroke="#d0b38e" strokeWidth="5" /><path d="M513 535q13-13 96 0v96h-96Z" fill="#71908a" /><path d="M480 610q-16-7-23 7v61h47v-68Zm150 0q19-7 25 7v61h-48v-68Z" fill="#46615f" /><path d="M503 657h105v36H503Z" fill="#385653" /><path d="M519 694h20v70h-20zm69 0h20v70h-20z" fill="#735945" />
    <path d="M243 490h104v132l-104 31z" fill="#9b7c61" /><path d="M250 501h90v55l-90 20z" fill="#745e4d" /><path d="M262 516h13v43h-13zm18-5h16v45h-16zm20 5h14v34h-14z" fill="#d7c79f" /><path d="M266 595h69v5h-69zm0 14h52v5h-52z" fill="#d4bb8c" />
    <Plant onAction={onAction} watered={watered} x={939} y={663} />
    <path d="M285 236h74v86h-74Z" fill="#445c5c" stroke="#d6c8a9" strokeWidth="6" /><path d="M295 246h54v66h-54Z" fill="#e2d9ba" /><path d="M309 284q15-30 30-2l-5 14h-21Z" fill="#9bb2a4" /><circle cx="324" cy="270" r="10" fill="#c98f74" />
    <Cat onAction={onAction} />
  </>;
}

function Kitchen({ night, onAction, watered, coffeeSip }: Pick<Props, "night" | "onAction"> & { watered: boolean; coffeeSip: number }) {
  return <>
    <Window night={night} x={860} y={215} width={222} height={235} />
    <path d="M244 226H760V496H244Z" fill="#d7d7bf" /><path d="M260 239H744V480H260Z" fill="#e6e2cf" />
    {[0,1,2,3,4,5].map(i => <path key={i} d={`M${260 + i * 80} 239v241`} stroke="#c8c9b7" strokeWidth="2" />)}
    {[0,1,2].map(i => <path key={i} d={`M260 ${300 + i * 60}H744`} stroke="#c8c9b7" strokeWidth="2" />)}
    <path d="M295 338h306v101H295z" fill="#79938a" stroke="#6a8078" strokeWidth="6" /><path d="M307 350h282v77H307z" fill="#a9b7a4" />
    <path d="M330 346h16v84h-16zm229 0h16v84h-16z" fill="#d9bd91" />
    <path d="M235 494H1225v52H235Z" fill="#d5b38b" stroke="#8a6d54" strokeWidth="4" /><path d="M210 546H1246v45H210Z" fill="#947457" />
    <path d="M247 592H602v165H247Z" fill="#81938a" stroke="#496765" strokeWidth="4" /><path d="M618 592H966v165H618Z" fill="#81938a" stroke="#496765" strokeWidth="4" /><path d="M982 592H1210v165H982Z" fill="#81938a" stroke="#496765" strokeWidth="4" />
    <path d="M264 614H585M635 614H949M999 614H1193" stroke="#b7c3aa" strokeWidth="5" /><path d="M432 640h26m328 0h26m280 0h26" stroke="#ddcfad" strokeWidth="6" strokeLinecap="round" />
    <path d="M522 468h200l22 29H501Z" fill="#e3dac4" /><path d="M570 479h105q-8 12-52 12t-53-12Z" fill="#8da6a0" /><path d="M617 464v-67q0-20 20-20 18 0 18 20" fill="none" stroke="#4a6967" strokeWidth="10" /><path d="M634 463h33" stroke="#4a6967" strokeWidth="8" />
    <path d="M803 470h138l17 25H784Z" fill="#445c5c" /><circle cx="830" cy="483" r="8" fill="#718b82" /><circle cx="905" cy="483" r="8" fill="#718b82" />
    <path d="M772 438h81l14 30h-109Z" fill="#c48e70" /><path d="M788 422h51v18h-51z" fill="#e1d6bd" /><path d="M789 418h49" stroke="#b68368" strokeWidth="5" /><path d="M853 438q29-10 24 14-4 17-21 12" fill="none" stroke="#c48e70" strokeWidth="7" />
    <Hotspot action="coffee" label="Make a cup of coffee" onAction={onAction}><path d="M742 401H894V506H742Z" fill="transparent" /></Hotspot>
    <path d="M349 335h69v20h-69z" fill="#d0ab82" /><path d="M353 319h60v17h-60z" fill="#778f87" /><path d="M458 352h38v80h-38z" fill="#b88669" /><path d="M468 325h18v28h-18z" fill="#d2b990" />
    <Plant onAction={onAction} watered={watered} x={1113} y={465} />
    <Hotspot action="coffee" label="Take a sip of coffee" onAction={onAction} className="room-art__coffee-hit"><g key={coffeeSip} className={coffeeSip > 0 ? "room-art__coffee-foreground room-art__coffee-sip" : "room-art__coffee-foreground"}>
      <path d="M400 900q21-95 95-132l84-29q25-5 34 22l-35 29q-65 23-81 110Z" fill="#c39278" stroke="#755c50" strokeWidth="4" /><path d="M1044 900q-21-95-95-132l-84-29q-25-5-34 22l35 29q65 23 81 110Z" fill="#c39278" stroke="#755c50" strokeWidth="4" />
      <path d="M418 900q19-72 61-108l43 29q-23 32-25 79Zm608 0q-19-72-61-108l-43 29q23 32 25 79Z" fill="#4c6969" />
      <path d="M650 780q0-60 68-60t68 60l-13 31H663Z" fill="#f0e1c6" stroke="#9c8068" strokeWidth="4" /><ellipse cx="718" cy="755" rx="49" ry="18" fill="#6f5548" /><path d="M788 749q55-4 45 38-5 28-42 16" fill="none" stroke="#ead9b9" strokeWidth="13" />
      <path d="M580 748q34-14 77 9l-8 24q-39-9-70 9m285-42q-34-14-77 9l8 24q39-9 70 9" fill="#c39278" stroke="#755c50" strokeWidth="3" />
      <path className="room-art__steam" d="M686 718q-16-19 0-36t0-31m32 64q-16-19 0-36t0-31m32 67q-16-19 0-36t0-31" fill="none" stroke="#e9e4d4" strokeWidth="4" strokeLinecap="round" opacity=".8" />
    </g></Hotspot>
  </>;
}

function Sports({ night, onAction }: Pick<Props, "night" | "onAction">) {
  return <>
    <Window night={night} x={930} y={213} width={175} height={255} />
    <path d="M346 208h512v195H346Z" fill="#405d5e" stroke="#d7c8a8" strokeWidth="8" /><path d="M360 222h484v167H360Z" fill="#9bb0a1" /><path d="M359 313q139-95 240 0 115-100 246-18v94H359Z" fill="#648879" />
    <path d="M424 240h357v5H424zm0 17h292v5H424z" fill="#e2dac0" opacity=".65" />
    <path d="M320 556 1025 554 1190 793H136Z" fill="#5c817d" stroke="#d1b18b" strokeWidth="11" />
    <path d="M674 556 674 793M335 636H1073" stroke="#e6e6d5" strokeWidth="5" />
    <path d="M295 600h795v43H295Z" fill="#d8dfce" opacity=".84" stroke="#536864" strokeWidth="4" />
    {[0,1,2,3].map(i => <path key={i} d={`M297 ${608 + i * 9}H1089`} stroke="#76918a" strokeWidth="2" />)}
    {Array.from({ length: 32 }, (_, i) => <path key={i} d={`M${311 + i * 24} 602v40`} stroke="#76918a" strokeWidth="2" />)}
    <path d="M290 593h9v75h-9zm797 0h9v75h-9z" fill="#384e4f" />
    <path d="M294 793h46v107h-46zm699 0h46v107h-46z" fill="#644f42" />
    <path d="M449 478q8-68 79-83l86 9q31 20 37 74l-14 94H453Z" fill="#d7b692" stroke="#675947" strokeWidth="4" />
    <path d="M480 467q2-37 38-45l79 7q24 16 22 43l-8 105H478Z" fill="#66827e" />
    <path d="M517 410q-17-23-5-48 17-29 64-29t68 28q8 32-12 52-22 25-62 29-35-4-53-32Z" fill="#c58f73" stroke="#6f574b" strokeWidth="4" />
    <path d="M510 382q-15-57 58-65 65-3 76 49-25-19-49-11-45 2-85 27Z" fill="#354a4d" /><path d="M539 392h7m49 0h7" stroke="#384b4a" strokeWidth="4" strokeLinecap="round" /><path d="M561 418q15 9 29-1" fill="none" stroke="#8a5c4d" strokeWidth="3" />
    <path d="M482 462q-54 10-93 74l67 31 46-65m118-34q58 10 101 71l-65 29-52-70" fill="#66827e" stroke="#425f5c" strokeWidth="4" />
    <path d="M386 530q-24 8-18 29t31 21l61-13-12-34z" fill="#c58f73" stroke="#6f574b" strokeWidth="3" /><path d="M686 531q32 2 37 28t-22 31l-50-20 18-37z" fill="#c58f73" stroke="#6f574b" strokeWidth="3" />
    <path d="M710 560q64-51 86-14 16 34-55 59Z" fill="#a96b59" stroke="#e3bc95" strokeWidth="7" /><path d="M758 561 814 529" stroke="#d4a87f" strokeWidth="9" strokeLinecap="round" />
    <circle cx="786" cy="612" r="13" fill="#f3eacb" stroke="#d7ccad" strokeWidth="2" />
    <Hotspot action="tennis" label="Play table tennis" onAction={onAction}><path d="M278 304H1054V807H278Z" fill="transparent" /></Hotspot>
    <path d="M234 373h65v122h-65z" fill="#8a7059" /><path d="M241 382h51v102h-51z" fill="#506a66" /><path d="M252 399h29m-29 12h24m-24 12h28" stroke="#e0d6b8" strokeWidth="3" />
    <Cat onAction={onAction} />
  </>;
}

function MobileControls({ onAction, musicEnabled }: Pick<Props, "onAction" | "musicEnabled">) {
  return <g className="room-art__mobile-controls">
    <Hotspot action="music" label={musicEnabled ? "Mute room music" : "Play room music"} onAction={onAction}>
      <path d="M824 159h61v59h-61z" fill="#415d5d" stroke="#d8c7a5" strokeWidth="5" />
      <circle cx="854" cy="188" r="18" fill="#253e43" stroke="#a2b6a8" strokeWidth="3" /><circle cx="854" cy="188" r="7" fill="#cfb58c" />
      <circle cx="877" cy="170" r="4" fill={musicEnabled ? "#f4d28d" : "#7e9892"} />
    </Hotspot>
    <Hotspot action="next" label="Continue to the next room" onAction={onAction}>
      <path d="M778 630 879 614 890 668 786 687Z" fill="#e3d3ad" stroke="#7f654e" strokeWidth="4" />
      <text x="799" y="658" fill={ink} fontSize="18" fontWeight="800">Next room →</text>
    </Hotspot>
  </g>;
}

export default function RoomArt({ room, night, active, reducedMotion, musicEnabled, onAction }: Props) {
  const [lampOn, setLampOn] = useState(true);
  const [watered, setWatered] = useState(false);
  const [coffeeHot, setCoffeeHot] = useState(false);
  const [coffeeSip, setCoffeeSip] = useState(0);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setPhone(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function handleAction(action: RoomAction) {
    if (action === "lamp") setLampOn(current => !current);
    if (action === "plant") setWatered(true);
    if (action === "coffee") { setCoffeeHot(true); setCoffeeSip(current => current + 1); }
    onAction(action);
  }
  return <RoomActiveContext.Provider value={active}><svg className={`room-art room-art--${night ? "night" : "day"}${active ? " room-art--active" : ""}${reducedMotion ? " room-art--still" : ""}${coffeeHot ? " room-art--coffee-hot" : ""}`} viewBox="0 0 1440 900" preserveAspectRatio={phone ? "xMidYMid slice" : "none"} role="group" aria-label={["Illustrated study with computer, books, window, and cat", "Illustrated library with shelves and a reading chair", "Illustrated kitchen with coffee in your hands", "Illustrated games room with table tennis"][room]}>
    <Shell room={room} night={night} onAction={handleAction} musicEnabled={musicEnabled} />
    {room === 0 && <Study night={night} onAction={handleAction} lampOn={lampOn} watered={watered} />}
    {room === 1 && <Library night={night} onAction={handleAction} watered={watered} />}
    {room === 2 && <Kitchen night={night} onAction={handleAction} watered={watered} coffeeSip={coffeeSip} />}
    {room === 3 && <Sports night={night} onAction={handleAction} />}
    <MobileControls onAction={handleAction} musicEnabled={musicEnabled} />
  </svg></RoomActiveContext.Provider>;
}
