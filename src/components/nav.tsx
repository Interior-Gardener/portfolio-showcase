import { Link } from "@tanstack/react-router";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-mono text-xs uppercase tracking-[0.2em] text-foreground">
          KV<span className="text-primary">.</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/support"
              className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest text-mono hover:opacity-90 transition"
            >
              Support
            </Link>
          </li>
        </ul>
        <Link
          to="/support"
          className="md:hidden px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest text-mono"
        >
          Support
        </Link>
      </nav>
    </header>
  );
}