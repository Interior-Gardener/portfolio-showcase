import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Ember = { id: number; left: number; size: number; delay: number; duration: number; drift: number };

export function BackgroundFX() {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const count = window.innerWidth < 768 ? 14 : 26;
    setEmbers(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 14,
        duration: 16 + Math.random() * 18,
        drift: (Math.random() - 0.5) * 120,
      })),
    );
  }, []);

  return (
    <>
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-primary z-[60]"
        aria-hidden
      />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        {/* soft moving aurora wash */}
        <div className="bg-aurora opacity-40" />

        {/* engineering grid */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.35]" />

        {/* slow sweeping light */}
        <motion.div
          className="absolute -inset-x-1/2 top-0 h-[60vh] blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 70%)",
          }}
          animate={{ x: ["-10%", "18%", "-10%"], y: ["0%", "35%", "0%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* drifting embers */}
        {embers.map((e) => (
          <motion.span
            key={e.id}
            className="absolute bottom-[-6vh] rounded-full bg-primary/60"
            style={{ left: `${e.left}%`, width: e.size, height: e.size }}
            animate={{ y: ["0vh", "-110vh"], x: [0, e.drift], opacity: [0, 0.8, 0] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* vignette + grain */}
        <div className="absolute inset-0 bg-vignette" />
        <div className="absolute inset-0 bg-noise opacity-[0.05]" />
      </div>
    </>
  );
}
