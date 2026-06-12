import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoaderCoreProps {
  progress: number;
  isMobile: boolean;
}

const LoaderCore = ({ progress, isMobile }: LoaderCoreProps) => {
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ringGoldRef = useRef<THREE.Mesh>(null);
  const ringChromeRef = useRef<THREE.Mesh>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Scale reacts to loading progress (starts compact, expands as loading completes)
    const baseScale = 0.95 + (progress / 100) * 0.55; // grows from 0.95 to 1.5
    const pulse = Math.sin(time * 4) * 0.04;
    const currentScale = baseScale + pulse;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale);

      // Acceleration based on loading progress
      const rotationSpeed = 1.0 + (progress / 100) * 2.5; // up to 3.5x speed

      // Rotate the entire assembly slowly
      groupRef.current.rotation.y = time * 0.15 * rotationSpeed;
    }

    // Opposite rotations on gold/chrome gimbal rings to look complex and mechanical
    if (ringGoldRef.current) {
      ringGoldRef.current.rotation.x = time * 0.5 * (1 + (progress / 100) * 1.5);
      ringGoldRef.current.rotation.y = time * 0.3;
    }

    if (ringChromeRef.current) {
      ringChromeRef.current.rotation.y = -time * 0.6 * (1 + (progress / 100) * 1.5);
      ringChromeRef.current.rotation.z = time * 0.25;
    }

    // Inner core pulses emissive intensity
    if (innerCoreRef.current) {
      const mat = innerCoreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = (1.5 + Math.sin(time * 8) * 0.7) * (1 + (progress / 100) * 1.5);
      }
      innerCoreRef.current.rotation.z = -time * 0.8;
    }

    // Gentle glass shell rotation
    if (outerGlassRef.current) {
      outerGlassRef.current.rotation.y = -time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Inner Quantum Energy Core (Glowing Cyan) */}
      <mesh ref={innerCoreRef}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#00ffc8"
          emissive="#00ffc8"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Middle Gimbal Ring 1: Rich Polished Gold */}
      <mesh ref={ringGoldRef}>
        <torusGeometry args={[1.15, 0.07, isMobile ? 10 : 16, isMobile ? 48 : 80]} />
        <meshStandardMaterial
          color="#d4af37" // Metallic Gold
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* 3. Middle Gimbal Ring 2: Chrome / Silver Steel */}
      <mesh ref={ringChromeRef} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.05, isMobile ? 8 : 12, isMobile ? 40 : 64]} />
        <meshStandardMaterial
          color="#a1a1aa" // Chrome
          roughness={0.1}
          metalness={0.98}
        />
      </mesh>

      {/* 4. Outer Holographic Orbit Track (Faint wireframe) */}
      <mesh rotation={[0, -Math.PI / 4, 0]}>
        <torusGeometry args={[1.82, 0.012, 6, isMobile ? 32 : 48]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.42}
          wireframe
        />
      </mesh>

      {/* 5. Outer Refracting Physical Glass containment shell */}
      <mesh ref={outerGlassRef}>
        <sphereGeometry args={[2.0, isMobile ? 20 : 32, isMobile ? 20 : 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={isMobile ? 0.2 : 0.3}
          roughness={isMobile ? 0.15 : 0.08}
          metalness={0.1}
          transmission={isMobile ? 0.7 : 0.92} // Glass transmission
          thickness={isMobile ? 0.2 : 0.6} // Glass refraction thickness
          ior={isMobile ? 1.2 : 1.48} // Index of refraction for physical glass
          clearcoat={isMobile ? 0 : 1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </group>
  );
};

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    let rafId = 0;
    let finishTimeoutId = 0;
    const start = performance.now();
    const duration = isMobile ? 1800 : 1500;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOutQuart(t) * 100);

      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
        return;
      }

      finishTimeoutId = window.setTimeout(() => {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("ignitia:loader-complete"));
      }, isMobile ? 320 : 240);
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(finishTimeoutId);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          style={{ background: "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.18), transparent 25%), radial-gradient(circle at 80% 20%, rgba(255,215,0,0.16), transparent 22%), #050406" }}
        >
          {/* Animated grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/3 w-44 md:w-64 h-44 md:h-64 rounded-full bg-primary/15 blur-[75px] md:blur-[100px] animate-pulse-glow" />
          <div
            className="absolute bottom-1/3 right-1/3 w-36 md:w-48 h-36 md:h-48 rounded-full bg-secondary/12 blur-[60px] md:blur-[80px] animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />

          {/* 3D WebGL Holographic Loader Viewport */}
          <div className="w-64 h-64 relative mb-4 z-10 rounded-full overflow-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
            <Canvas
              gl={{
                antialias: !isMobile,
                toneMapping: THREE.ACESFilmicToneMapping,
                powerPreference: "high-performance",
              }}
              dpr={isMobile ? 1 : [1, 1.5]}
              camera={{ position: [0, 0, 5], fov: 40 }}
              className="w-full h-full"
            >
              {/* Soft atmospheric base fill */}
              <ambientLight intensity={0.75} color="#1c1836" />

              {/* Cyan key light to reflect off metal surfaces */}
              <pointLight position={[6, 5, 5]} intensity={3.5} color="#2df5ff" />

              {/* Hot pink fill light from opposite angle */}
              <pointLight position={[-6, -4, 4]} intensity={2.8} color="#ff3ca0" />

              {/* Golden rim light from behind to highlight glass boundaries */}
              <directionalLight position={[0, 6, -5]} intensity={2.5} color="#ffd700" />

              <Sparkles count={isMobile ? 15 : 40} scale={4.5} size={1.8} speed={0.4} color="#a855f7" />
              <Sparkles count={isMobile ? 10 : 25} scale={4.5} size={1.2} speed={0.5} color="#00ffc8" />

              <Suspense fallback={null}>
                <LoaderCore progress={progress} isMobile={isMobile} />
              </Suspense>
            </Canvas>
          </div>

          {/* Logo reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl font-bold gradient-text mb-6 relative z-10"
            style={{ textShadow: "0 0 24px hsl(270 70% 60% / 0.35)" }}
          >
            IGNITIA '26
          </motion.h1>

          {/* Loading bar */}
          <div className="w-48 h-1 rounded-full bg-muted/30 overflow-hidden relative z-10">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background:
                  "linear-gradient(90deg, hsl(270 70% 60%), hsl(45 95% 55% / 0.55))",
                boxShadow: "0 0 10px hsl(270 70% 60% / 0.5)",
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-4 font-mono relative z-10 text-center tracking-[0.18em]"
          >
            LOADING... {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
