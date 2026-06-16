import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useIsMobile } from "@/hooks/use-mobile";

// Preload the character model
useGLTF.preload("/3d_models/character-hero-2.glb");

interface CharacterModelProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

const CharacterModel = ({ scrollProgressRef }: CharacterModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/character-hero-2.glb");
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

        // Enhance any glowing parts of the character (e.g. neon trims)
        if (mat.emissiveIntensity !== undefined && mat.emissiveIntensity > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 2.5);
        }

        // Clean depth-writing for solid meshes
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  // Autoplay all embedded animations (idle states, breathing, stance, etc.)
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    // Play the first animation or all animations (fade them in together if needed)
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

    // Check if we are on a smaller screen (mobile)
    const isMobile = viewportWidth < 7;

    // 1. Hover/levitate animation (sine wave on Y-axis)
    const hoverOffset = Math.sin(time * 1.5) * 0.08;
    const baseTranslateY = isMobile ? -0.8 : -1.0;
    group.current.position.y = baseTranslateY + hoverOffset;

    // 2. Responsive scroll-bound horizontal translation (X-axis)
    // On mobile, keep the model centered (0). On desktop, start centered and shift to the right.
    const startX = 0;
    const endX = isMobile ? 0 : viewportWidth * 0.22;
    const targetX = THREE.MathUtils.lerp(startX, endX, progress);

    // 3. Scroll-bound rotation (Y-axis)
    // Starts facing forward with slight depth (0.2 rad), ends at profile view (-Math.PI / 1.8) facing left
    const startRotY = 0.2;
    const endRotY = isMobile ? -Math.PI / 2.5 : -Math.PI / 1.8;
    const targetRotY = THREE.MathUtils.lerp(startRotY, endRotY, progress);

    // 4. Scroll-bound scale (Z-axis zoom)
    // Starts larger, ends slightly pulled back/scaled down
    const startScale = isMobile ? 1.35 : 2.0;
    const endScale = isMobile ? 1.05 : 1.55;
    const targetScale = THREE.MathUtils.lerp(startScale, endScale, progress);

    // 5. Mouse pointer tracking (X and Y offsets) for active hover feel
    const targetMouseX = state.pointer.x * 0.2;
    const targetMouseY = state.pointer.y * 0.1;

    // Smoothly interpolate positions, rotations, and scales for organic feel
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

interface CharacterHeroSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export const CharacterHeroScene = ({ scrollProgressRef }: CharacterHeroSceneProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
      {/* Visual background grid and glows inside the 3D scene box */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-[1]" />

      <Canvas
        shadows
        gl={{
          antialias: !isMobile,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 40, near: 0.1, far: 100 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Removed solid background color to allow comets to show behind */}
        {/* Ambient fill light with violet/blue tint */}
        <ambientLight intensity={0.9} color="#151324" />

        {/* Bright cyan key light representing high-tech theme */}
        <directionalLight
          position={[5, 5, 4]}
          intensity={2.2}
          color="#2df5ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Warm golden/magenta rim light from back-left for contrast */}
        <directionalLight
          position={[-5, 3, -3]}
          intensity={2.0}
          color="#ff3ca0"
        />

        {/* Purple accent lights to cast cool highlights on metallic textures */}
        <pointLight position={[0, 2, 2]} intensity={1.8} color="#a855f7" distance={8} />
        <pointLight position={[2, -1, 3]} intensity={1.2} color="#2df5ff" distance={6} />
        <pointLight position={[-2, -2, 2]} intensity={1.2} color="#ff3ca0" distance={6} />

        <Suspense fallback={null}>
          <CharacterModel scrollProgressRef={scrollProgressRef} />

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
                intensity={1.2}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.5}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      {/* Interactive indicator overlay */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-40 bg-black/50 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-full text-[9px] text-white uppercase tracking-[0.2em]">
        Drag to Orbit Character
      </div>
    </div>
  );
};

export default CharacterHeroScene;
