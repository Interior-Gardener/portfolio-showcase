import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, ArrowUpRight } from "lucide-react";
import kartik from "@/assets/kartik.jpg";
import jsw from "@/assets/jsw.jpg";
import railway from "@/assets/central-railway.jpg";
import somaiya from "@/assets/somaiya.jpg";
import ciia1 from "@/assets/ciia-1.jpg";
import ciia2 from "@/assets/ciia-2.jpg";
import jswWork1 from "@/assets/jsw-work-1.jpg";
import jswWork2 from "@/assets/jsw-work-2.jpg";
import strawHat from "@/assets/straw-hat-kv.png";
import resume from "@/assets/resume.pdf?url";
import { Nav } from "@/components/nav";
import { SceneMount } from "@/components/three/scene-mount";
import { projects as projectData } from "@/lib/projects";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <Projects />
      <About />
      <Crew />
      <Skills />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
      <div className="bg-aurora opacity-70" aria-hidden />
      <SceneMount variant="globe" className="opacity-70 [mask-image:radial-gradient(70%_70%_at_50%_45%,black,transparent)]" />
      <div className="relative z-10 mx-auto max-w-6xl grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-mono text-xs uppercase tracking-[0.25em] text-primary mb-6"
          >
            ◆ Mumbai, India · Available Summer 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-display text-6xl md:text-8xl lg:text-9xl leading-[0.9]"
          >
            Kartik
            <br />
            <span className="italic text-primary">Verma</span>—
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-5 max-w-xl text-lg md:text-xl italic text-foreground/80 leading-relaxed border-l-2 border-primary pl-4"
          >
            “Turning problems into possibilities, one line at a time.”
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Full-stack engineer & AI/ML student building things that ship — from
            steel-plant workflow automation at{" "}
            <span className="text-foreground">JSW</span> to gesture-driven
            heritage exploration in <span className="text-foreground">GeoSwipe</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#projects"
              className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm text-mono uppercase tracking-widest hover:opacity-90 transition"
            >
              See projects →
            </a>
            <a
              href={resume}
              download="Kartik_Verma_Resume.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm text-mono uppercase tracking-widest hover:border-primary hover:text-primary transition"
            >
              <Download className="h-3.5 w-3.5" /> Download Résumé
            </a>
            <a
              href={resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm text-mono uppercase tracking-widest hover:border-primary hover:text-primary transition"
            >
              View Résumé
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="md:col-span-4 relative"
        >
          <div className="aspect-[4/5] relative overflow-hidden rounded-md border border-border">
            <img
              src={kartik}
              alt="Kartik Verma"
              className="absolute inset-0 h-full w-full object-cover grayscale hover:grayscale-0 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
          <div className="mt-3 flex justify-between text-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Fig. 01</span>
            <span>B.Tech · CE (AIML Hons)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Flask", "React", "Node.js", "MongoDB", "Redis", "Oracle DB",
    "Three.js", "Socket.IO", "Docker", "AWS", "Agentic AI", "Razorpay",
  ];
  return (
    <div className="border-y border-border py-4 overflow-hidden bg-card/40">
      <div className="flex gap-10 whitespace-nowrap text-mono text-sm text-muted-foreground" style={{ animation: "kv-scroll 40s linear infinite" }}>
        {[...items, ...items, ...items].map((s, i) => (
          <span key={i} className="flex items-center gap-10">
            {s}
            <span className="text-primary">◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes kv-scroll { to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function SectionHeader({ n, kicker, title }: { n: string; kicker: string; title: string }) {
  return (
    <div className="mb-14 flex items-end justify-between gap-6 border-b border-border pb-6">
      <div>
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">
          {n} — {kicker}
        </p>
        <h2 className="text-display text-5xl md:text-6xl mt-3">{title}</h2>
      </div>
    </div>
  );
}

function Work() {
  const roles = [
    {
      logo: jsw,
      company: "JSW Steel",
      role: "Software Developer Intern · On-site",
      when: "Jun 2025 — Jul 2025",
      bullets: [
        "Built a full-stack Flask + Oracle DB application for Roll Shop automation.",
        "Shipped industrial workflow automation, asset lifecycle & 15+ production reports.",
      ],
    },
    {
      logo: null,
      company: "Claidroid Technologies",
      role: "Machine Learning Intern · Remote",
      when: "Dec 2024 — Jan 2025",
      bullets: [
        "Built an AI-powered Hospital Management System with Agentic AI.",
        "Integrated predictive models, Weather APIs and inventory data for resource allocation.",
      ],
    },
    {
      logo: railway,
      company: "Central Railway",
      role: "Technical Intern · On-site",
      when: "Jul 2024 — Aug 2024",
      bullets: [
        "Studied Mumbai EMU operations, maintenance workflows & safety protocols.",
        "Exposure to large-scale hardware infrastructure and industrial systems.",
      ],
    },
  ];
  return (
    <section id="work" className="relative px-6 py-24 md:py-32 overflow-hidden">
      <SceneMount
        variant="lattice"
        className="opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_35%,transparent)]"
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader n="01" kicker="Experience" title="Where I've worked." />
        <ol className="space-y-2">
          {roles.map((r, i) => (
            <li key={i} className="group grid md:grid-cols-12 gap-6 py-8 border-b border-border hover:bg-card/40 transition rounded-md px-2">
              <div className="md:col-span-2 flex items-start">
                {r.logo ? (
                  <div className="h-14 w-14 rounded-md bg-white p-2 flex items-center justify-center">
                    <img src={r.logo} alt={r.company} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-md border border-border flex items-center justify-center text-mono text-xs text-muted-foreground">
                    AI
                  </div>
                )}
              </div>
              <div className="md:col-span-7">
                <h3 className="text-2xl md:text-3xl">
                  {r.company}
                  <span className="text-primary">.</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{r.role}</p>
                <ul className="mt-4 space-y-2 text-sm md:text-base text-foreground/90">
                  {r.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-primary mt-2 text-[8px]">◆</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3 md:text-right text-mono text-xs uppercase tracking-widest text-muted-foreground">
                {r.when}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="px-6 py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-6xl">
        <SectionHeader n="02" kicker="Selected work" title="Things I've built." />
        <div className="grid md:grid-cols-3 gap-6">
          {projectData.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group relative block p-6 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:border-primary hover:-translate-y-1 transition duration-300 h-full"
            >
              <div className="flex items-start justify-between">
                <span className="text-mono text-xs text-primary">/{p.accent}</span>
                <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">{p.tag}</span>
              </div>
              <h3 className="text-3xl mt-8 flex items-center gap-2">
                {p.title}
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-2 transition-all text-primary" />
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 6).map((s) => (
                  <li key={s} className="text-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-border text-muted-foreground">
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-block text-mono text-[10px] uppercase tracking-widest text-primary">
                Read case →
              </span>
            </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[ciia1, ciia2, jswWork1, jswWork2].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="aspect-square overflow-hidden rounded-md border border-border relative group"
            >
              <img src={img} alt="On-ground work" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
              <span className="absolute bottom-2 left-2 text-mono text-[10px] uppercase tracking-widest text-white/90 bg-black/40 px-2 py-0.5 rounded">
                {["CIIA-5", "GeoSwipe Booth", "JSW Dev", "JSW Team"][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <SectionHeader n="03" kicker="About" title="Hi — I'm Kartik." />
          <div className="flex items-center gap-4 mt-6">
            <div className="h-16 w-16 rounded-md bg-white p-2 flex items-center justify-center">
              <img src={somaiya} alt="Somaiya" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-sm">
              <p className="text-foreground">K. J. Somaiya Institute of Technology</p>
              <p className="text-muted-foreground">B.Tech CE (AIML Honors) · CGPA 9.04</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            I like problems where software meets the real world — steel mills, railway
            depots, hospitals, classrooms. My favourite kind of code is the kind that
            gets used the morning after you write it.
          </p>
          <p>
            Right now I'm studying Computer Engineering with an AI/ML honors track at
            KJSIT, Mumbai. Off-hours I play <em className="text-primary">squash</em>,{" "}
            <em className="text-primary">chess</em> and{" "}
            <em className="text-primary">badminton</em>, and I represented KJSIT & Mumbai
            University at the All India University Matches 2025-26.
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return SkillsInner();
}

function SkillsInner() {
  const groups = [
    { k: "Languages", v: "C · Java · Python · JavaScript" },
    { k: "Frameworks", v: "React · Node · Express · Flask · Django · Tailwind" },
    { k: "Databases", v: "MongoDB · MySQL · Oracle · Supabase" },
    { k: "Platforms", v: "AWS · Docker · Git · Redis · Atlas · Render" },
  ];
  return (
    <section className="px-6 py-16 border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl grid md:grid-cols-4 gap-8">
        {groups.map((g) => (
          <div key={g.k}>
            <p className="text-mono text-[10px] uppercase tracking-[0.25em] text-primary">{g.k}</p>
            <p className="mt-3 text-foreground">{g.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  const items = [
    "National-Level Innovation Showcase — CIIA-5, Nehru Science Centre (2025-26)",
    "Winner — IET Intech 2k26 (National Level) · Project Atomix",
    "Runner-up — AI-Robo Festival 2026 · Project GeoSwipe",
    "Letters of appreciation from Somaiya College — CIIA-5 & AIU Squash",
    "Amazon AWS Academy Graduate — Cloud Foundations",
    "Represented KJSIT & Mumbai University at All India University Matches 2025-26",
  ];
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader n="04" kicker="Signals" title="Some recent wins." />
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          {items.map((it, i) => (
            <li key={i} className="flex gap-4 py-3 border-b border-border">
              <span className="text-mono text-xs text-primary pt-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-foreground/90">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-6xl">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">05 — Contact</p>
        <h2 className="text-display text-6xl md:text-8xl mt-4 leading-[0.9]">
          Let's build
          <br />
          <span className="italic text-primary">something</span>.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { k: "Email", v: "kartikverma2204@gmail.com", href: "mailto:kartikverma2204@gmail.com" },
            { k: "LinkedIn", v: "in/kartikverma2204", href: "https://www.linkedin.com/in/kartikverma2204" },
            { k: "GitHub", v: "@Interior-Gardener", href: "https://github.com/Interior-Gardener" },
          ].map((c) => (
            <a key={c.k} href={c.href} target="_blank" rel="noreferrer" className="p-6 rounded-lg border border-border hover:border-primary hover:bg-background transition group">
              <p className="text-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{c.k}</p>
              <p className="mt-3 text-lg group-hover:text-primary transition">{c.v} →</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 text-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>© {new Date().getFullYear()} Kartik Verma</span>
        <span>Built in Mumbai · Instrument Serif × Inter</span>
      </div>
    </footer>
  );
}