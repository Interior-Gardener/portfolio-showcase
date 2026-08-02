import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, PlayCircle } from "lucide-react";
import { Nav } from "@/components/nav";
import { SceneMount } from "@/components/three/scene-mount";
import { projectBySlug, projects, type ProjectDetail as ProjectDetailType } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const p = projectBySlug(params.slug);
    if (!p) return { meta: [{ title: "Project — Kartik Verma" }] };
    return {
      meta: [
        { title: `${p.title} — Kartik Verma` },
        { name: "description", content: p.blurb },
        { property: "og:title", content: `${p.title} — Kartik Verma` },
        { property: "og:description", content: p.blurb },
      ],
    };
  },
  loader: ({ params }) => {
    const p = projectBySlug(params.slug);
    if (!p) throw notFound();
    return { project: p };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen text-foreground">
      <Nav />
      <div className="pt-40 text-center">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">404</p>
        <h1 className="text-display text-6xl mt-4">Project not found.</h1>
        <Link to="/" className="mt-8 inline-block text-sm underline text-muted-foreground hover:text-foreground">
          ← Back home
        </Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData() as { project: ProjectDetailType };
  const others = projects.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <div className="relative overflow-hidden">
        <div className="bg-aurora opacity-70" aria-hidden />
        <SceneMount
          variant={p.slug === "geoswipe" ? "globe" : "lattice"}
          className="opacity-50 [mask-image:radial-gradient(65%_65%_at_60%_35%,black,transparent)]"
        />
        <section className="relative z-10 pt-32 pb-16 md:pt-40 md:pb-24 px-6">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/"
              hash="projects"
              className="inline-flex items-center gap-2 text-mono text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition"
            >
              <ArrowLeft className="h-3 w-3" /> All projects
            </Link>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-mono text-xs uppercase tracking-[0.25em] text-primary"
            >
              /{p.accent} — {p.tag}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-display text-6xl md:text-8xl mt-4"
            >
              {p.title}
              <span className="text-primary">.</span>
            </motion.h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              {p.blurb}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm text-mono uppercase tracking-widest hover:opacity-90 transition"
              >
                <Github className="h-4 w-4" /> View on GitHub
              </a>
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm text-mono uppercase tracking-widest hover:border-primary hover:text-primary transition"
                >
                  <PlayCircle className="h-4 w-4" /> Watch demo
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="relative z-10 px-6 py-16 border-y border-border bg-card/40">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8">
          <Meta k="Role" v={p.role} />
          <Meta k="Year" v={p.year} />
          <Meta k="Stack" v={p.stack.slice(0, 5).join(" · ") + (p.stack.length > 5 ? " …" : "")} />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">Overview</p>
          </div>
          <div className="md:col-span-8 text-lg leading-relaxed text-foreground/90">
            {p.overview}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-border">
        <div className="mx-auto max-w-5xl grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">Features</p>
            <h3 className="text-display text-4xl mt-2">What it does.</h3>
          </div>
          <ul className="md:col-span-8 space-y-3">
            {p.features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-3 py-3 border-b border-border text-foreground/90"
              >
                <span className="text-primary text-[8px] mt-2">◆</span>
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">Tech stack</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li
                key={s}
                className="text-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-border bg-card/30">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
          {p.highlights.map((h) => (
            <div key={h.k} className="p-6 rounded-lg border border-border bg-background">
              <p className="text-mono text-[10px] uppercase tracking-[0.25em] text-primary">{h.k}</p>
              <p className="mt-3 text-lg">{h.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary">More work</p>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/projects/$slug"
                params={{ slug: o.slug }}
                className="group p-5 rounded-lg border border-border bg-background hover:border-primary transition"
              >
                <p className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">{o.tag}</p>
                <h4 className="text-2xl mt-3 group-hover:text-primary transition">{o.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{o.blurb}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-mono text-[10px] uppercase tracking-widest text-primary">
                  Read <ExternalLink className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-border">
        <div className="mx-auto max-w-5xl text-mono text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Kartik Verma
        </div>
      </footer>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-mono text-[10px] uppercase tracking-[0.25em] text-primary">{k}</p>
      <p className="mt-2 text-foreground/90">{v}</p>
    </div>
  );
}