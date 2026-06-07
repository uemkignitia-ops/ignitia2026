import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useIsMobile } from "@/hooks/use-mobile";

// Preload the character model
useGLTF.preload("/3d_models/character-hero.glb");

interface AboutModelProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

const AboutModel = ({ scrollProgressRef }: AboutModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/character-hero.glb");
  const { actions } = useAnimations(animations, group);

  // Material traversal: Fix colors and apply glow enhancements
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      
      // Enable shadow support
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat: any) => {
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;

        // Enhance any glowing parts of the character (cyberpunk style)
        if (mat.emissiveIntensity !== undefined && mat.emissiveIntensity > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 3.0);
        }

        // Clean depth-writing for solid meshes
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  // Autoplay all animations
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    
    // Play all active animations
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset().fadeIn(0.3).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    });
  }, [actions]);

  // Handle frame updates: levitation, scroll-linked translation/scale/rotation, and mouse tracking
  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();
    const progress = scrollProgressRef.current;
    const { width: viewportWidth } = state.viewport;
    
    const isMobile = viewportWidth < 7;

    // 1. Hover/levitate animation (sine wave on Y-axis)
    const hoverOffset = Math.sin(time * 1.5) * 0.08;
    const baseTranslateY = isMobile ? -0.8 : -1.0;
    
    // 2. Interactive scroll-bound keyframing
    let targetX = 0;
    let targetRotY = 0;
    let targetScale = 1.8;

    if (progress < 0.3) {
      // Phase 1: Hero Section -> Mascot is centered & starts moving right
      const p = progress / 0.3; // 0 to 1
      targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : viewportWidth * 0.22, p);
      targetRotY = THREE.MathUtils.lerp(0.5, Math.PI / 4, p);
      targetScale = THREE.MathUtils.lerp(isMobile ? 1.3 : 2.0, isMobile ? 1.0 : 1.4, p);
    } else if (progress < 0.7) {
      // Phase 2: Vision/Clubs Section -> Mascot shifts from Right to Left
      const p = (progress - 0.3) / 0.4; // 0 to 1
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : viewportWidth * 0.22, isMobile ? 0 : -viewportWidth * 0.22, p);
      targetRotY = THREE.MathUtils.lerp(Math.PI / 4, -Math.PI / 3, p);
      targetScale = THREE.MathUtils.lerp(isMobile ? 1.0 : 1.4, isMobile ? 1.15 : 1.6, p);
    } else {
      // Phase 3: IEM-UEM Section -> Mascot does a full 3D sweep back to center
      const p = (progress - 0.7) / 0.3; // 0 to 1
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : -viewportWidth * 0.22, 0, p);
      targetRotY = THREE.MathUtils.lerp(-Math.PI / 3, Math.PI * 2, p);
      targetScale = THREE.MathUtils.lerp(isMobile ? 1.15 : 1.6, isMobile ? 1.4 : 2.1, p);
    }

    // 3. Mouse pointer tracking (X and Y offsets) for active hover feel
    const targetMouseX = state.pointer.x * 0.15;
    const targetMouseY = state.pointer.y * 0.08;

    // Smoothly interpolate positions, rotations, and scales
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseTranslateY + hoverOffset, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY + targetMouseX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetMouseY, 0.05);
    
    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05);
    group.current.scale.setScalar(nextScale);
  });

  return (
    <group ref={group} dispose={null} position={[0, -1.0, 0]} scale={1.8}>
      <primitive object={scene} />
    </group>
  );
};

// Holographic cyber grid under the character
const HolographicGrid = () => {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -1.5;
      // Slowly rotate grid for cyber feel
      gridRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, "#ff5500", "#1e1b4b"]}
      position={[0, -1.5, 0]}
    />
  );
};

interface AboutScrollSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export const AboutScrollScene = ({ scrollProgressRef }: AboutScrollSceneProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
      {/* Background neon glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-[1]" />
      
      <Canvas
        shadows
        gl={{
          antialias: !isMobile,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 40, near: 0.1, far: 100 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={["#050406"]} />

        {/* Ambient cyber violet light */}
        <ambientLight intensity={1.1} color="#151226" />

        {/* Neon Orange/Red key light */}
        <directionalLight
          position={[5, 5, 4]}
          intensity={2.5}
          color="#ff7b00"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Hot pink/violet fill light */}
        <directionalLight
          position={[-5, 3, -3]}
          intensity={2.0}
          color="#ec4899"
        />

        {/* Cyan side rim light */}
        <pointLight position={[3, -1, 3]} intensity={1.5} color="#06b6d4" distance={8} />

        {/* Floating cyber particles */}
        <Sparkles count={40} scale={6} size={2.5} speed={0.4} color="#ff7b00" />
        <Sparkles count={30} scale={6} size={1.8} speed={0.6} color="#06b6d4" />

        <Suspense fallback={null}>
          <AboutModel scrollProgressRef={scrollProgressRef} />
          <HolographicGrid />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.05}
          />

          {!isMobile && (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={1.4}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.6}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.35} darkness={0.75} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-40 bg-black/60 backdrop-blur-sm border border-orange-500/20 px-3 py-1.5 rounded-full text-[9px] text-orange-400 uppercase tracking-[0.2em] font-mono">
        Telemetry Active // Drag to Rotate Mascot
      </div>
    </div>
  );
};

export default AboutScrollScene;
