import { useEffect, useRef, useState } from "react";

/**
 * A soft, spring-trailing custom cursor:
 *  - a small solid dot that tracks the pointer exactly
 *  - a larger ring that lags behind with easing
 *  - the ring expands + fills on interactive elements
 * Disabled on touch devices and when reduced motion is requested.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
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

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;

    const interactive = "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='hover']";

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest?.(interactive)));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border border-primary/60"
        style={{
          width: hovering ? 52 : 32,
          height: hovering ? 52 : 32,
          backgroundColor: hovering ? "color-mix(in oklab, var(--color-primary) 14%, transparent)" : "transparent",
          backdropFilter: hovering ? "invert(4%)" : "none",
          transform: "translate3d(-100px,-100px,0)",
          transition:
            "width 260ms cubic-bezier(.2,.9,.3,1), height 260ms cubic-bezier(.2,.9,.3,1), background-color 260ms ease, border-color 260ms ease",
          willChange: "transform, width, height",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full bg-primary"
        style={{
          width: pressed ? 5 : hovering ? 4 : 7,
          height: pressed ? 5 : hovering ? 4 : 7,
          boxShadow: "0 0 12px color-mix(in oklab, var(--color-primary) 60%, transparent)",
          transform: "translate3d(-100px,-100px,0)",
          transition: "width 180ms ease, height 180ms ease",
          willChange: "transform",
        }}
      />
    </div>
  );
}