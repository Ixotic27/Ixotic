"use client";

import PixelStudio, { PixelCity, PixelMark } from "./PixelStudio";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, Menu, X } from "lucide-react";



const projects = [
  { name: "The Leetcode City", kind: "Algorithms, made visible", tags: ["TypeScript", "Next.js", "Algorithms"], art: "city", url: "https://github.com/Ixotic27/The-Leetcode-City", description: "An exploration of data structures and algorithms through visual explanations. Built to turn abstract problems into something you can see, follow, and understand.", focus: "Interactive explanations, reusable web components, and the relationship between an algorithm and its visual representation." },
  { name: "Smart Hospital", kind: "Less waiting. More care.", tags: ["Java", "Queue management", "Systems"], art: "hospital", url: "https://github.com/Ixotic27/Smart-Hospital-Appointment-Real-Time-Queue-Management-System", description: "A hospital appointment and real-time queue management system. An exercise in making a complex, time-sensitive process easier to navigate for patients and staff.", focus: "Appointment scheduling, queue coordination, and clear information about what happens next." },
  { name: "Busted", kind: "A closer look at the headlines", tags: ["Python", "Machine learning", "NLP"], art: "news", url: "https://github.com/Ixotic27/busted-fake-news-detector", description: "A fake-news detection project using machine learning and natural language processing to explore signals of misinformation in written news.", focus: "Text processing, classification, and the challenge of interpreting machine-learning predictions. Predictions are signals to investigate, not a substitute for fact-checking." },
] as const;

function ProjectArt({ kind }: { kind: string }) {
  if (kind === "city") return <div className="project-art city-art" aria-hidden="true">
    <div className="art-topline"><span>THE LEETCODE CITY</span><span>↗</span></div>
    <PixelCity/>
    <div className="city-caption">A new way<br/>through the problem.</div><span className="art-footnote">Visual study / Algorithms as architecture</span>
  </div>;
  if (kind === "hospital") return <div className="project-art hospital-art" aria-hidden="true">
    <div className="art-topline"><span>SMART HOSPITAL</span><span className="medical-cross">+</span></div>
    <div className="queue-card"><span className="queue-status"><i/> You’re in good hands</span><p>Your turn,<br/>without the uncertainty.</p><div className="ticket"><span>YOUR NUMBER</span><strong>A–024</strong><div><span>General consultation</span><span>↗</span></div></div><div className="queue-track"><span/><span/><span/><span/></div><span className="queue-small">A little clarity goes a long way.</span></div>
    <span className="art-footnote">Interface concept / Care in the details</span>
  </div>;
  return <div className="project-art news-art" aria-hidden="true"><div className="art-topline"><span>INFORMATION IS NOT ALWAYS TRUTH.</span><span>↗</span></div><div className="news-paper"><span>THE DAILY DOUBT</span><div className="news-rule"/><p>Too good<br/>to be<br/><em>true?</em></p><div className="news-columns"/></div><div className="busted-stamp">BUSTED.</div><span className="art-footnote">Visual study / Question the headline</span></div>;
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  async function copyEmail() {
    try { await navigator.clipboard.writeText("ishant.off@gmail.com"); setCopyStatus("Email copied"); }
    catch { setCopyStatus("Copy this address: ishant.off@gmail.com"); }
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" id="home">
      <a href="#home" className="brand" aria-label="Ixotic home"><PixelMark/><span>ixotic</span></a>
      <span className="header-caption">Developer by trade.<br/>Curious by nature.</span>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} id="main-navigation" aria-label="Main navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work <span>03</span></a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" className="nav-contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={17}/></a>
      </nav>
      <button className="menu-button icon-button" ref={menuButton} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-intro"><span className="status-dot"/> Creative developer & curious human</div>
        <div className="hero-copy"><h1 id="hero-title">Small details.<br/>Big character<span className="orange-period">.</span></h1><p>I turn complex ideas into thoughtful<br className="desktop-break"/> digital experiences. With a little<br className="desktop-break"/> curiosity, and a lot of character.</p><a href="#work" className="work-link"><span className="circle-arrow"><ArrowDown size={20}/></span>Explore my work</a></div>
        <PixelStudio/>
        <div className="hero-bottom"><span>Code is the medium.<br/>Experience is the point.</span><span className="hero-signature" aria-hidden="true">IXOTIC<span><PixelMark/></span></span><a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span>Scroll to discover</span><ArrowDown size={17}/></a></div>
      </section>

      <section id="work" className="work-section" aria-labelledby="work-title">
        <div className="section-heading"><div><span className="section-kicker">A few things I’ve put into the world</span><h2 id="work-title">Selected work<span className="heading-count">(03)</span></h2></div><span className="section-aside">Different challenges.<br/>Same attention to detail.</span></div>
        <div className="project-grid">{projects.map((project, index) => <article className={`project project-${index}`} key={project.name}>
          <button className="project-visual" onClick={() => setSelected(index)} aria-label={`Explore ${project.name}`}><ProjectArt kind={project.art}/><span className="project-open"><ArrowUpRight size={24}/></span></button>
          <div className="project-meta"><div><h3><button onClick={() => setSelected(index)}>{project.name}</button></h3><p>{project.kind}</p></div><span>{project.tags[0]}<br/>{project.tags[1]}</span></div>
        </article>)}</div>
        <a className="archive-link" href="https://github.com/Ixotic27" target="_blank" rel="noopener noreferrer"><span>There’s more in the workshop.</span><span>Explore my GitHub <ArrowUpRight size={20}/></span></a>
      </section>

      <section id="about" className="about-section" aria-labelledby="about-title">
        <div className="about-side"><span className="section-kicker">The person behind the pixels</span><div className="pixel-monogram" aria-hidden="true"><span>i.</span><PixelMark/></div><span className="about-signoff">Always a work in progress.</span></div>
        <div className="about-copy"><h2 id="about-title">Curiosity first.<br/>Everything else follows.</h2><p>I’m Ixotic, a creative developer working at the intersection of design and engineering. I like taking things apart, understanding how they work, and putting them back together a little differently.</p><p>From visualizing algorithms to building useful systems, I care about the logic under the surface as much as the feeling on the screen.</p><div id="capabilities" className="capabilities"><div><span>01</span><h3>Thoughtful interfaces</h3><p>React / Next.js / TypeScript</p></div><div><span>02</span><h3>Playful interactions</h3><p>CSS / Canvas / Motion</p></div><div><span>03</span><h3>Solid foundations</h3><p>Java / Python / Node.js</p></div></div></div>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="contact-top"><span>Have something in mind?</span><span>Good things start with a conversation.</span></div><a className="contact-title" href="mailto:ishant.off@gmail.com"><h2 id="contact-title">Let’s make<br/>it interesting.</h2><span className="contact-arrow"><ArrowUpRight strokeWidth={1.2}/></span></a><div className="contact-bottom"><div className="email-group"><a href="mailto:ishant.off@gmail.com">ishant.off@gmail.com</a><button className="icon-button" aria-label="Copy email address" onClick={copyEmail}>{copyStatus === "Email copied" ? <Check size={18}/> : <Copy size={18}/>}</button><span role="status" className="copy-status">{copyStatus}</span></div><a href="https://github.com/Ixotic27" target="_blank" rel="noopener noreferrer">Find me on GitHub <ArrowUpRight size={18}/></a></div></section>
    </main>
    <footer className="site-footer"><a href="#home" className="brand" aria-label="Ixotic back to top"><PixelMark/><span>ixotic</span></a><span>Made with intent. And a little obsession.</span><a href="#home">Back to top <ArrowUpRight size={16}/></a></footer>

    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selected !== null && <div className="dialog-inner"><button className="dialog-close icon-button" aria-label="Close project details" onClick={() => setSelected(null)}><X/></button><span className="section-kicker">A closer look</span><h2 id="project-dialog-title">{projects[selected].name}</h2><p>{projects[selected].description}</p><h3>The focus</h3><p>{projects[selected].focus}</p><div className="project-tags">{projects[selected].tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={projects[selected].url} className="dialog-link" target="_blank" rel="noopener noreferrer">Explore the source on GitHub <ArrowUpRight size={19}/></a><span className="dialog-note">Portfolio artwork is a visual study of the project.</span></div>}
    </dialog>
  </>;
}

