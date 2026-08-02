import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

const ACCENT = { dark: "#ef8b3a", light: "#c95f24" };

function useAccent() {
  const { theme } = useTheme() as { theme?: string };
  return theme === "light" ? ACCENT.light : ACCENT.dark;
}

/* ---------------- GeoSwipe: a gesture-driven globe of geo markers ---------------- */

function fib(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    pts.push(new THREE.Vector3(Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius));
  }
  return pts;
}

function arcGeometry(a: THREE.Vector3, b: THREE.Vector3, lift = 0.45) {
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(a.length() * (1 + lift));
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
}

function Globe({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const { points, arcs } = useMemo(() => {
    const pts = fib(420, 1.6);
    const markers = fib(14, 1.6);
    const arcs: THREE.BufferGeometry[] = [];
    for (let i = 0; i < markers.length - 1; i += 2) {
      arcs.push(arcGeometry(markers[i], markers[i + 1]));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return { points: geo, arcs };
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.12;
    g.rotation.x += (pointer.y * 0.35 - g.rotation.x) * 0.04;
    g.position.y = Math.sin(performance.now() / 2600) * 0.08;
  });

  return (
    <group ref={group}>
      <points geometry={points}>
        <pointsMaterial size={0.028} color={color} transparent opacity={0.85} sizeAttenuation />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.58, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
      </mesh>
      {arcs.map((g, i) => (
        <primitive key={i} object={new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 }))} />
      ))}
      <Orbiters color={color} />
    </group>
  );
}

function Orbiters({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 22;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        r: 1.9 + Math.random() * 0.7,
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.4,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s.phase + t * s.speed;
      dummy.position.set(Math.cos(a) * s.r, Math.sin(a * 0.8 + s.tilt) * s.r * 0.45, Math.sin(a) * s.r);
      dummy.scale.setScalar(0.03);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ---------------- JSW / industrial: a breathing steel lattice ---------------- */

function Lattice({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cols = 14;
  const rows = 8;
  const count = cols * rows;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock, pointer }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const px = (x - cols / 2) * 0.34;
        const pz = (z - rows / 2) * 0.34;
        const d = Math.hypot(px, pz);
        const h = 0.12 + Math.sin(t * 1.1 - d * 1.6 + pointer.x) * 0.16 + 0.16;
        dummy.position.set(px, h / 2 - 0.4, pz);
        dummy.scale.set(0.12, Math.max(0.05, h), 0.12);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    m.rotation.y = Math.sin(t * 0.12) * 0.3 + 0.5;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.7} transparent opacity={0.85} />
    </instancedMesh>
  );
}

/* ---------------- exported canvases ---------------- */

export default function Scene({ variant = "globe" }: { variant?: "globe" | "lattice" }) {
  const color = useAccent();
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, variant === "globe" ? 4.6 : 3.6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color={color} />
      {variant === "globe" ? <Globe color={color} /> : <Lattice color={color} />}
    </Canvas>
  );
}