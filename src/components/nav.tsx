import { Link } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border"
    >
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-mono text-xs uppercase tracking-[0.2em] text-foreground">
          KV<span className="text-primary">.</span>
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </li>
          <li>
            <Link
              to="/support"
              className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest text-mono hover:opacity-90 transition"
            >
              Support
            </Link>
          </li>
        </ul>
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <Link
            to="/support"
            className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest text-mono"
          >
            Support
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}