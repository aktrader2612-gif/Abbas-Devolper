import { useState, type FormEvent } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Send,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";

/**
 * Editorial Signal direction: Swiss editorial structure, ink navy + warm paper,
 * signal orange accents, asymmetric project compositions, and restrained motion.
 */

const assets = {
  profile: "/manus-storage/muhammad-abbas-profile_e5f7c759.png",
  supporting: "/manus-storage/muhammad-abbas-supporting_9147469f.jpg",
  niwala: "/manus-storage/niwala-tracking_1266e4e6.png",
  blockchain: "/manus-storage/pasted_file_B8NxA8_ChatGPTImageAug18,2026,06_37_29AM_76b1dee7.png",
  cv: "/manus-storage/Muhammad_Abbas_Nadeem_CV_9ef8a535.pdf",
  heroTexture: "/manus-storage/editorial-signal-hero-texture_7270583d.png",
  blueprintTexture: "/manus-storage/editorial-signal-blueprint-texture_f82fa047.png",
  projectMotif: "/manus-storage/editorial-signal-project-motif_2740b82f.png",
  monogram: "/manus-storage/man-monogram_80e7e98b.png",
};

const navItems = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

const projectBriefs = {
  niwala: {
    title: "Niwala — Food Delivery App",
    type: "Mobile product / Delivery",
    summary: "A multi-role Android food-delivery experience designed around live order visibility and clear handoffs between customer, rider, and restaurant.",
    points: ["Multi-role login for customer, rider, and restaurant", "Real-time order tracking and delivery status", "Web admin panel for users, orders, and restaurants", "In-app communication across the delivery journey"],
  },
  blockchain: {
    title: "Blockchain-Based Voting System",
    type: "Web3 concept / Trust",
    summary: "A secure digital voting concept that makes participation anonymous and results tamper-resistant through blockchain-based records.",
    points: ["Transparent and verifiable voting records", "Anonymous voter participation", "Smart-contract-ready trust layer", "A simple dashboard direction for election oversight"],
  },
};

const skills = [
  { title: "Web development", copy: "Responsive front-end interfaces, component thinking, and practical full-stack foundations.", icon: Code2 },
  { title: "Digital media", copy: "YouTube automation, scripting workflows, SEO, editing pipelines, and audience growth.", icon: Youtube },
  { title: "Product tools", copy: "Android Studio, VS Code, MS Office, Canva, and AI-assisted development workflows.", icon: Sparkles },
  { title: "Market discipline", copy: "Technical analysis, chart reading, and risk management across Forex and crypto markets.", icon: BriefcaseBusiness },
];

function scrollToId(id: string, close?: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  close?.();
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedProject, setSelectedProject] = useState<keyof typeof projectBriefs | null>(null);
  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: (data, variables) => {
      setSent(true);
      const form = document.querySelector<HTMLFormElement>(".contact-form");
      form?.reset();
      window.setTimeout(() => setSent(false), 4200);
      if (data.notificationStatus === "failed") {
        console.warn("Contact saved, but notification providers are not configured yet.", variables.email);
      }
    },
  });

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    contactMutation.mutate({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Muhammad Abbas Nadeem home">
          <span className="wordmark-mark"><img src={assets.monogram} alt="M.A.N. monogram" /></span>
          <span className="wordmark-name">Muhammad Abbas Nadeem <em>/ Web Developer</em></span>
        </a>
        <nav className="desktop-nav editorial-rail" aria-label="Primary navigation">
          {navItems.map(([label, id], index) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
        <a className="header-contact" href="https://mail.google.com/mail/?view=cm&fs=1&to=abbasbaloch2612@gmail.com&su=Portfolio%20conversation" target="_blank" rel="noreferrer">Let&apos;s talk <ArrowUpRight size={16} /></a>
        <button className="menu-trigger" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && <div className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(([label, id], index) => <a key={id} href={`#${id}`} onClick={() => scrollToId(id, () => setMenuOpen(false))}>{label}<ArrowUpRight size={15} /></a>)}
      </div>}

      <main id="top">
        <section className="hero section-dark">
          <div className="hero-texture" style={{ backgroundImage: `url(${assets.heroTexture})` }} />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-line" /> Available for thoughtful digital work</div>
              <p className="hero-kicker">Muhammad Abbas Nadeem</p>
              <h1>Interfaces that<br /><span>move work</span><br />forward.</h1>
              <p className="hero-intro">Web developer and fresh IT graduate building useful digital experiences with a practical eye for detail, product thinking, and modern tools.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">See selected work <ArrowUpRight size={17} /></a>
                <a className="button button-ghost" href={assets.cv} target="_blank" rel="noreferrer"><Download size={16} /> Download CV</a>
              </div>
              <div className="hero-meta"><span><MapPin size={15} /> Lahore, Punjab</span><span><Minus size={15} /> Pakistan</span><span><Mail size={15} /> Available for opportunities</span></div>
            </div>
            <div className="hero-portrait reveal reveal-delay-1">
              <div className="portrait-frame"><img src={assets.profile} alt="Muhammad Abbas Nadeem in a suit" /></div>
              <div className="portrait-note"><span>Currently</span><strong>Making useful things<br />for the web.</strong></div>
              <span className="hero-stamp">M.A.N.<br /><small>WEB / 2026</small></span>
            </div>
          </div>
          <div className="hero-bottom container"><span>Scroll to explore</span><div className="scroll-line" /><span>Explore the work</span></div>
        </section>

        <section id="about" className="about-section section-paper section-pad">
          <div className="container about-grid">
            <div className="section-marker"><div className="marker-line" /><p>About the person</p></div>
            <div className="about-copy">
              <p className="section-kicker">Profile / A clear point of view</p>
              <h2>Curiosity is useful.<br /><i>Consistency is better.</i></h2>
              <div className="about-columns">
                <p>I&apos;m Muhammad Abbas Nadeem, a motivated fresh IT graduate from Jhang now based in Lahore. I enjoy turning rough ideas into simple, clear, and usable digital experiences.</p>
                <p>My background combines web development with YouTube automation and financial trading. That mix keeps me close to both the craft of making and the discipline of improving.</p>
              </div>
              <div className="fact-row">
                <div><span>Education</span><strong>BS Information Technology</strong></div>
                <div><span>Languages</span><strong>English · Urdu · Punjabi</strong></div>
                <div><span>Focus</span><strong>Web products & digital media</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section section-blue section-pad">
          <div className="blueprint-overlay" style={{ backgroundImage: `url(${assets.blueprintTexture})` }} />
          <div className="container">
            <div className="section-heading-row">
              <div><p className="section-kicker"><span className="signal-bar" />Capability stack</p><h2>Tools for making<br /><span>momentum visible.</span></h2></div>
              <p className="heading-aside">A practical toolkit built around shipping, learning quickly, and keeping the result easy to use.</p>
            </div>
            <div className="skills-list">
              {skills.map(({ title, copy, icon: Icon }, index) => <article className="skill-item" key={title}><span className="skill-number">0{index + 1}</span><Icon size={22} strokeWidth={1.5} /><div><h3>{title}</h3><p>{copy}</p></div><ArrowUpRight className="skill-arrow" size={18} /></article>)}
            </div>
            <div className="skill-tags"><span>HTML / CSS / JavaScript</span><span>React foundations</span><span>Android Studio</span><span>Git mindset</span><span>AI-assisted workflows</span><span>Risk-aware thinking</span></div>
          </div>
        </section>

        <section id="projects" className="projects-section section-pad section-motif">
          <div className="motif-image" style={{ backgroundImage: `url(${assets.projectMotif})` }} />
          <div className="container">
            <div className="section-heading-row projects-intro"><div><p className="section-kicker">Selected work</p><h2>Two builds.<br /><span>One useful habit.</span></h2></div><p className="heading-aside">Projects where a clear user journey matters more than unnecessary noise.</p></div>
            <article className="project-card project-orange">
              <div className="project-image"><img src={assets.niwala} alt="Niwala food delivery tracking interface" /><div className="image-label"><i />Product flow</div></div>
              <div className="project-content"><p className="project-type"><span className="signal-bar" /> Selected case study</p><h3>Niwala — Food<br /><em>Delivery App</em></h3><p>A food-delivery experience with live order tracking, clear user flows, and an admin view for managing orders and restaurants.</p><button className="text-link project-trigger" type="button" onClick={() => setSelectedProject("niwala")}>View project brief <ArrowUpRight size={16} /></button></div>
            </article>
            <article className="project-card project-ink">
              <div className="project-content"><p className="project-type"><span className="signal-bar" /> Selected case study</p><h3>Blockchain-Based<br /><em>Voting System</em></h3><p>A transparent voting concept built around tamper-proof records, verifiable results, and visible trust.</p><button className="text-link project-trigger" type="button" onClick={() => setSelectedProject("blockchain")}>View project brief <ArrowUpRight size={16} /></button></div>
              <div className="project-image"><img src={assets.blockchain} alt="Blockchain voting system dashboard" /><div className="image-label"><i />Trust layer</div></div>
            </article>
          </div>
        </section>

        <section id="experience" className="experience-section section-cream section-pad">
          <div className="container experience-grid">
            <div className="section-marker"><div className="marker-line" /><p>Experience / Education</p></div>
            <div className="experience-content"><p className="section-kicker">The long view</p><h2>Work that taught me<br /><i>how to keep going.</i></h2>
              <div className="timeline">
                <div className="timeline-item"><span className="timeline-date">2022 — present</span><div><h3>YouTube Automation</h3><p>Content Creator & Channel Manager</p><span>Managed scripting, editing workflows, SEO, audience growth, AdSense monetization, and brand collaborations.</span></div></div>
                <div className="timeline-item"><span className="timeline-date">2023 — 2025</span><div><h3>Financial Trading</h3><p>Trader · Forex & Crypto Markets</p><span>Applied technical analysis, chart reading, disciplined strategy, and risk management across active markets.</span></div></div>
                <div className="timeline-item"><span className="timeline-date">2022 — 2026</span><div><h3>BS Information Technology</h3><p>University of Jhang</p><span>Focused on software fundamentals, problem solving, web development, and a modern AI-assisted way of learning.</span></div></div>
              </div>
              <div className="certification"><FileText size={22} /><div><span>Certification</span><strong>Office Management · Grade A</strong><small>INFOCS Computer Literacy Center · 272 / 300</small></div><Check size={18} /></div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-dark section-pad">
          <div className="container contact-grid">
            <div className="contact-copy"><p className="section-kicker">Start a conversation</p><h2>Have a useful<br /><span>idea in mind?</span></h2><p>Tell me what you are building, what needs to be clearer, or where the next version should go. I&apos;ll bring a practical perspective and a willingness to learn fast.</p><div className="contact-details"><a href="https://mail.google.com/mail/?view=cm&fs=1&to=abbasbaloch2612@gmail.com&su=Portfolio%20conversation" target="_blank" rel="noreferrer"><Mail size={17} /> abbasbaloch2612@gmail.com</a><a href="tel:+923290990550"><Phone size={17} /> 0329 0990550</a><span><MapPin size={17} /> Lahore, Punjab, Pakistan</span></div><div className="social-row"><a href="https://mail.google.com/mail/?view=cm&fs=1&to=abbasbaloch2612@gmail.com&su=Portfolio%20conversation" target="_blank" rel="noreferrer" aria-label="Email Muhammad Abbas Nadeem"><Mail size={17} /></a><a href="https://wa.me/923290990550" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><ExternalLink size={17} /></a><a href={assets.cv} target="_blank" rel="noreferrer" aria-label="Open CV"><FileText size={17} /></a></div></div>
            <form className="contact-form" onSubmit={submitContact}><div className="form-top"><span>Send a brief</span></div><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Message<textarea required name="message" rows={4} placeholder="What are you working on?" /></label><button className="button button-primary" type="submit" disabled={contactMutation.isPending}>{sent ? <><Check size={17} /> Message received</> : <><Send size={17} /> {contactMutation.isPending ? "Sending…" : "Send message"}</>}</button>{contactMutation.error && <small className="form-note form-error" role="alert">{contactMutation.error.message || "Unable to send your message right now. Please try again."}</small>}<small className="form-note">Your message is securely saved and routed to Muhammad Abbas Nadeem.</small></form>
          </div>
        </section>
      </main>

      {selectedProject && <div className="project-modal-backdrop" role="presentation" onClick={() => setSelectedProject(null)}>
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" aria-label="Close project brief" onClick={() => setSelectedProject(null)}><X size={18} /></button>
          <p className="section-kicker"><span className="signal-bar" /> Portfolio artifact</p>
          <h2 id="project-modal-title">{projectBriefs[selectedProject].title}</h2>
          <p className="modal-type">{projectBriefs[selectedProject].type}</p>
          <p className="modal-summary">{projectBriefs[selectedProject].summary}</p>
          <div className="modal-points">{projectBriefs[selectedProject].points.map((point) => <span key={point}><Check size={15} /> {point}</span>)}</div>
          <a className="button button-primary" href={`https://mail.google.com/mail/?view=cm&fs=1&to=abbasbaloch2612@gmail.com&su=${encodeURIComponent(projectBriefs[selectedProject].title + " project inquiry")}`} target="_blank" rel="noreferrer">Ask about this project <ArrowUpRight size={17} /></a>
        </div>
      </div>}

      <footer className="site-footer"><div className="container footer-grid"><a className="footer-mark" href="#top"><img src={assets.monogram} alt="" /><span>Muhammad Abbas Nadeem<br /><small>Web Developer & Trader</small></span></a><div className="footer-links"><a href="#about">About</a><a href="#projects">Work</a><a href="#contact">Contact</a></div><span className="copyright">© 2026 M.A.N.</span></div></footer>
      <a className="whatsapp-float" href="https://wa.me/923290990550" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={21} /></a>
    </div>
  );
}
