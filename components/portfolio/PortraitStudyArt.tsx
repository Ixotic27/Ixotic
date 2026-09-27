/** Portrait composition of the same furniture, without stretching the wide room. */
export default function PortraitStudyArt({ night, lamp, watered }: { night: boolean; lamp: boolean; watered: boolean }) {
  return <svg className="study-portrait" viewBox="0 0 600 960" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
    <path fill={night ? "#6d829b" : "#9eb9ce"} d="M0 0h600v720H0z"/>
    <path fill="#c29c79" d="M0 720h600v240H0z"/><path fill="#737a7f" d="M0 710h600v16H0z"/>
    {[770, 825, 880, 935].map((y,i) => <g key={y} stroke="#ad8665" strokeWidth="3"><path d={`M0 ${y}h600`}/><path d={`M${i%2 ? 90 : 180} ${y-50}v50m230-50v50`}/></g>)}
    <path fill="#46565d" d="M389 93h177v135H389z"/><path fill={night ? "#344553" : "#a6d0cc"} d="M400 104h155v114H400z"/>
    <path fill="#f5d795" d="M511 119h23v23h-23z"/><path fill="#536778" d="M400 195h21v-27h25v27h25v-41h30v41h26v-30h28v53H400z"/>
    <path fill="#d2c3ab" d="M474 104h7v114h-7zM400 160h155v7H400zM380 224h195v10H380z"/>
    <path fill="#7d6756" d="M50 172h270v13H50zM72 185h10v20H72zm205 0h10v20h-10z"/>
    {["#cf7d77","#e5c587","#466b87","#8880a8","#759c88"].map((c,i) => <path key={c} fill={c} d={`M${73+i*31} ${110+i%2*13}h24v${62-i%2*13}h-24z`}/>)}
    <path fill="#7e634f" d="M31 348h128v316H31z"/><path fill="#354c51" d="M41 360h108v132H41zM41 507h108v143H41z"/>
    {["#e0bf86","#ce7970","#789c94","#9fa7b8","#d6cbb6"].map((c,i) => <g key={c} fill={c}><path d={`M${47+i*20} ${393+i%3*12}h15v${99-i%3*12}h-15z`}/><path d={`M${47+i*20} ${541+i%2*12}h15v${109-i%2*12}h-15z`}/></g>)}
    <path fill="#795e49" d="M184 469h344v21H184zM203 490h20v225h-20zm285 0h20v225h-20z"/><path fill="#dcbb90" d="M178 456h358v14H178z"/>
    <path fill="#aebbb8" d="M209 261h272v171H209z"/><path fill="#354a4d" d="M217 269h256v137H217z"/>
    <path fill="#657875" d="M331 418h15v6h-15zM328 432h40v20h-40zM309 449h77v7h-77z"/>
    <path fill="#e1d9c5" d="M268 458h157v9H268z"/><path fill="#88958a" d="M275 460h139v3H275z"/>
    {lamp && <path fill="#f6d39a" opacity=".25" d="m184 370-34 84h100l-36-84z"/>}
    <path fill="#465b58" d="M192 370h8v74h-8zM177 445h38v9h-38z"/><path fill={lamp ? "#e8ba72" : "#839791"} d="M180 338h31v10h8v25h-47v-25h8z"/>
    <path fill="#b56951" d="M452 429h26v26h-26zM478 435h8v15h-8z"/>
    <path fill="#879692" d="M205 788h263v102H205z"/><path fill="#bbc2a6" d="M214 798h245v81H214z"/>
    <path fill="#42595c" d="M270 559h133v16h12v141H258V575h12z"/><path fill="#66827e" d="M273 574h126v119H273z"/><path fill="#8aa397" d="M281 583h110v9H281z"/>
    <path fill="#374c50" d="M250 710h174v21H250zM327 731h20v78h-20zM282 807h111v10H282zM277 817h18v13h-18zm102 0h18v13h-18z"/>
    <path fill="var(--cabinet-color)" d="M454 674h127v194H454z"/><path fill="var(--cabinet-light)" d="M463 686h109v76H463zm0 86h109v79H463zM448 663h139v12H448z"/>
    <path fill="#29444d" d="M499 718h37v7h-37zm0 88h37v7h-37z"/>
    <path fill="#ded4ba" d="M485 590h63v68h-8v7h-55z"/><path fill="#6a7665" d="M493 597h47v28h-47z"/><path fill="#b1c18a" d="M499 602h35v18h-35z"/>
    <path fill="#42524c" d="M495 636h18v6h-18zm6-6h6v18h-6z"/><path fill="#af6857" d="M526 638h8v8h-8zm12-9h8v8h-8z"/>
    <path fill="var(--pot-color)" d="M63 791h71v81H63z"/><path fill="var(--pot-light)" d="M54 780h90v17H54zM73 811h8v43h-8z"/>
    <path fill={watered ? "var(--plant-light)" : "var(--plant-color)"} d="M91 682h12v103H91zM61 695h30v30H61zM103 680h31v30h-31zM57 740h35v27H57zM103 726h40v29h-40z"/>
    <path fill="var(--cat-color)" d="M439 902h78v10h20v26H416v-25h23zM440 891h14v20h-14zm46 0h14v20h-14z"/><path fill="var(--cat-light)" d="M443 919h12v3h-12zm28 0h12v3h-12zM453 929h13v3h-13z"/>
    <path fill="#53635f" d="M53 233h105v87H53z"/><path fill="#e3d6bd" d="M61 241h89v71H61z"/><ellipse cx="95" cy="268" rx="16" ry="20" fill="#db735f"/><path fill="#795e49" d="m94 286 7-2 10 21-7 2z"/><circle cx="131" cy="260" r="7" fill="#f4cf80"/>
  </svg>;
}
