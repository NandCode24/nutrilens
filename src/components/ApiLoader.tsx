"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/**
 * ApiLoader (Enhanced Neon Sweep)
 * - compact: w-20 h-20 on mobile, w-24 h-24 on desktop
 * - neon sweep + rotating dual torus + particle ribbon + color shift
 * - GPU-friendly: simple geometries + additive blending
 *
 * Added:
 * - Rotating playful taglines that change every few seconds
 * - Minimal accessibility attributes
 */

export default function ApiLoader() {
  // rotating taglines
const messages = useMemo(
  () => [
    // 🌿 Quick hydration + warmups
    "💧 Sip water — tiny habit, big boost.",
    "🧘 Take 3 deep breaths — reset in 10s.",
    "🚶 Quick stretch — wake up your body.",
    "⬆️ Take two flights of stairs later — small win!",

    // 🥗 Food nudges
    "🍎 Add one fruit today — colorful fuel.",
    "🥜 Choose nuts over chips — crunchy + smart.",
    "🍽️ Try a protein-rich snack for steady energy.",
    "🥦 Toss a green leaf into your next meal.",

    // ⚖️ Balanced-mind tips
    "⏱️ Eat slowly — let your body tell you it’s full.",
    "📵 Put the phone down while eating — taste more!",
    "😴 Short power nap? 20 minutes = refreshed.",
    "🌙 Wind down 30 min before bed — sleepy vibes.",

    // 🧠 Small habit nudges
    "📝 Plan one healthy meal for tomorrow.",
    "📅 Move for 5 minutes every hour — micro breaks.",
    "🧃 Replace one sugary drink with water today.",
    "🧑‍🍳 Cook one simple meal — you got this!",

    // 💪 Active prompts
    "🏃 Walk brisk for 10 min — heart says thanks.",
    "🧍 Stand up now and shake it out for 30s.",
    "🧘‍♀️ Try a 1-min breathing pause — instant calm.",
    "🚴 Swap one idle screen for a short walk.",

    // 🔎 Awareness + reflection
    "🔍 Notice hunger vs boredom — choose wisely.",
    "🎯 Small wins stack — one step at a time.",
    "👏 Celebrate one healthy choice today — nice!",
    "🌟 You’re investing in your future self — keep going.",

    // 🍋 Fun food facts / encouragement
    "🍋 Lemon in water? Tasty hydration hack.",
    "🍫 Dark chocolate > milk for a small treat.",
    "🥤 Try sparkling water with lime — fizzy swap!",
    "🍽️ Half-plate veggies = nutrient jackpot.",

    // ✨ Finisher nudges
    "🌈 Consistency > perfection — tiny steps win.",
    "💚 NutriLens: one scan, smarter choices.",
  ],
  []
);

  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * messages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 6800); // rotate every 6.8 s
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center pointer-events-none">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <Canvas camera={{ position: [0, 0, 4.3], fov: 55 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 4]} intensity={1.2} />
            <LoaderScene />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </div>

        <motion.p
          key={index}
          className="mt-2 text-[11px] sm:text-xs font-semibold text-emerald-200 tracking-wider select-none"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {messages[index]}
        </motion.p>
      </div>
    </div>
  );
}

/* Scene containing all parts */
function LoaderScene() {
  return (
    <>
      <NeonCore />
      <DualTorus />
      <SweepRing />
      <ParticleRibbon count={14} />
      <CameraFloat />
    </>
  );
}

/* Neon Core: glowing sphere with additive emissive */
function NeonCore() {
  const ref = useRef<THREE.Mesh | null>(null);
  const matRef = useRef<any>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = t * 0.6;
    if (matRef.current)
      matRef.current.emissiveIntensity = 1 + Math.abs(Math.sin(t * 2)) * 1.2;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.45, 48, 48]} />
      <meshStandardMaterial
        ref={matRef}
        color={"#0ea5a4"}
        emissive={"#34d399"}
        emissiveIntensity={1.2}
        roughness={0.15}
        metalness={0.9}
      />
      <Html center>
        {/* soft CSS halo for bloom-like effect */}
        <div
          style={{
            width: 240,
            height: 240,
            marginTop: -120,
            marginLeft: -120,
            filter: "blur(22px)",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(59,130,246,0.08) 35%, rgba(139,92,246,0.02) 70%)",
            borderRadius: "50%",
            transform: "scale(0.35)",
            pointerEvents: "none",
          }}
        />
      </Html>
    </mesh>
  );
}

/* DualTorus: two torus rings rotating opposite directions with additive blending */
function DualTorus() {
  const refA = useRef<THREE.Mesh | null>(null);
  const refB = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (refA.current) {
      refA.current.rotation.z = t * 0.9;
      refA.current.rotation.x = Math.sin(t * 0.35) * 0.06 + 0.18;
    }
    if (refB.current) {
      refB.current.rotation.z = -t * 0.55;
      refB.current.rotation.x = Math.cos(t * 0.25) * 0.04 - 0.12;
    }
  });

  return (
    <>
      <mesh ref={refA} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.05, 0.035, 30, 120]} />
        <meshBasicMaterial
          color={"#22c55e"}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={refB} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.03, 30, 120]} />
        <meshBasicMaterial
          color={"#60a5fa"}
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/* SweepRing: radar-like sweep that brightens pixels as it passes */
function SweepRing() {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.z = t * 2.6;
      // modulate opacity for a trailing sweep
      (ref.current.material as any).opacity = 0.85 + Math.sin(t * 2.6) * 0.08;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.98, 1.02, 256]} />
      <meshBasicMaterial
        color={"#a78bfa"}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
      {/* Thin fast-highlight arc */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.01]}>
        <ringGeometry args={[0.995, 1.02, 64, 1, 0, Math.PI / 6]} />
        <meshBasicMaterial
          color={"#f472b6"}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </mesh>
  );
}

/* ParticleRibbon: orbiting small spheres that trail around the core */
function ParticleRibbon({ count = 14 }: { count?: number }) {
  const groupRef = useRef<THREE.Group | null>(null);

  const particles = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.25;
      const y = (Math.random() - 0.5) * 0.22;
      const scale = 0.03 + Math.random() * 0.04;
      const phase = Math.random() * Math.PI * 2;
      return { angle, radius, y, scale, phase };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      const p: any = particles[idx];
      const ang = p.angle + t * (0.6 + idx * 0.015);
      const x = Math.cos(ang) * p.radius;
      const z = Math.sin(ang) * p.radius;
      child.position.set(x, p.y + Math.sin(t * 1.4 + p.phase) * 0.02, z);
      child.scale.setScalar(p.scale * (0.9 + Math.sin(t * 3 + p.phase) * 0.18));
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color={
              i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#60a5fa" : "#f472b6"
            }
            emissive={
              i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#60a5fa" : "#f472b6"
            }
            emissiveIntensity={0.6}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* subtle camera float for life */
function CameraFloat() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    camera.position.z = 4.25 + Math.sin(t * 0.6) * 0.035;
    camera.position.x = Math.sin(t * 0.24) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}
