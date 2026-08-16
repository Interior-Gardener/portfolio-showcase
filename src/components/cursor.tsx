import { useEffect, useRef, useState } from "react";

/**
 * Ghost-trail cursor: a leading "face" ghost that tracks the pointer, followed by
 * 19 progressively smaller, slower ghosts that lag behind with easing transitions.
 * Scaled and themed to the site's ember/primary palette.
 * Disabled on touch devices and when reduced motion is requested.
 */
const COUNT = 20;
const LEAD_SIZE = 30; // px

export function Cursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const interactive =
      "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='hover']";

    const onMove = (e: PointerEvent) => {
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest?.(interactive)));
      const nodes = rootRef.current?.children;
      if (!nodes) return;
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i] as HTMLElement;
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const scale = pressed ? 0.85 : hovering ? 1.25 : 1;

  return (
    <div
      aria-hidden
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 250ms ease" }}
    >
      {Array.from({ length: COUNT }).map((_, i) => {
        const size = (LEAD_SIZE - i * 1.2) * scale;
        const mix = 100 - i * 4;
        return (
          <div
            key={i}
            className="kv-ghost"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2 + 13,
              marginTop: -size / 2 + 13,
              zIndex: COUNT - i,
              background:
                i === 0
                  ? "var(--color-primary)"
                  : `color-mix(in oklab, var(--color-primary) ${mix}%, var(--color-muted-foreground))`,
              opacity: i === 0 ? 0.95 : Math.max(0.08, 0.7 - i * 0.032),
              boxShadow:
                i === 0
                  ? "0 0 18px color-mix(in oklab, var(--color-primary) 55%, transparent)"
                  : "none",
              transition: `left ${(i * 0.05).toFixed(2)}s cubic-bezier(.175,.885,.32,1.275), top ${(i * 0.05).toFixed(2)}s cubic-bezier(.175,.885,.32,1.275), width 220ms ease, height 220ms ease, margin 220ms ease`,
              animationDelay: `${(i / 30).toFixed(3)}s`,
            }}
          >
            {i === 0 && (
              <>
                <div className="kv-arms">
                  <div className="kv-arm" />
                  <div className="kv-arm" />
                </div>
                <div className="kv-inner">
                  <div className="kv-mouth" />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}