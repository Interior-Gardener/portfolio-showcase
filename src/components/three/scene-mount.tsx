import { lazy, Suspense, useEffect, useState } from "react";

const Scene = lazy(() => import("./scenes"));

/**
 * Client-only mount for the WebGL scenes. Renders nothing during SSR and on
 * devices/users that prefer reduced motion.
 */
export function SceneMount({
  variant = "globe",
  className = "",
}: {
  variant?: "globe" | "lattice";
  className?: string;
}) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 640;
    setOk(!reduced && !small);
  }, []);

  if (!ok) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Suspense fallback={null}>
        <Scene variant={variant} />
      </Suspense>
    </div>
  );
}