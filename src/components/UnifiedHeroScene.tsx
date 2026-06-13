import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

// Preload both models
useGLTF.preload("/3d_models/intro.glb");
useGLTF.preload("/3d_models/character-hero-2.glb");

// Helper to determine transparent volumetric layers in Vader model
function isVolumetricMesh(mesh: THREE.Mesh, mat: any): boolean {
  const meshName = (mesh.name ?? "").toLowerCase();
  const matName = (mat.name ?? "").toLowerCase();
  const combined = `${meshName} ${matName}`;

  const VOLUMETRIC_KEYWORDS = [
    "smoke", "cloud", "fog", "mist", "ring", "haze",
    "aura", "glow", "vfx", "fx", "effect", "particle",
    "dust", "vapor", "wisp", "trail", "atmos", "ambient",
    "plasma", "energy", "embers", "scatter",
  ];
  if (VOLUMETRIC_KEYWORDS.some((kw) => combined.includes(kw))) return true;
  if (mat.opacity !== undefined && mat.opacity < 0.98) return true;
  if (mat.alphaMap != null) return true;
  if (mat.transparent === true && mat.opacity < 0.98) return true;

  return false;
}

// ── VADER MODEL (intro.glb) ──────────────────────────────────────────────────
interface VaderModelProps {
  visible: boolean;
}

const VaderModel = ({ visible }: VaderModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/intro.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      mats.forEach((mat: any) => {
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;

        if (isVolumetricMesh(mesh, mat)) {
          mat.transparent = true;
          mat.depthWrite = false;
          mat.depthTest = true;
          mat.alphaTest = 0.005;
          mat.side = THREE.DoubleSide;
          mesh.renderOrder = 2;
        } else {
          mat.depthWrite = true;
          mat.depthTest = true;
          mesh.renderOrder = 1;
          if (mat.emissiveIntensity != null && mat.emissiveIntensity > 0) {
            mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 1.5);
          }
        }
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset().fadeIn(0.2).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    });
  }, [actions]);

  return (
    <group ref={group} visible={visible} dispose={null} position={[0, -1.3, 0]} scale={0.8}>
      <primitive object={scene} />
    </group>
  );
};

// ── MASCOT MODEL (character-hero-2.glb) ──────────────────────────────────────
interface MascotModelProps {
  visible: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
}

const MascotModel = ({ visible, scrollProgressRef }: MascotModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/character-hero-2.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat: any) => {
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;

        if (mat.emissiveIntensity !== undefined && mat.emissiveIntensity > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 2.5);
        }

        mat.depthWrite = true;
        mat.depthTest = true;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset().fadeIn(0.3).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    });
  }, [actions]);

  useFrame((state) => {
    if (!group.current || !visible) return;

    const time = state.clock.getElapsedTime();
    const progress = scrollProgressRef.current;
    const { width: viewportWidth } = state.viewport;
    const isMobile = viewportWidth < 7;

    // Levitation on Y-axis
    const hoverOffset = Math.sin(time * 1.5) * 0.08;
    const baseTranslateY = isMobile ? -0.8 : -1.0;
    group.current.position.y = baseTranslateY + hoverOffset;

    // Mascot Scroll Progress: Map progress [0.45, 1.0] -> [0, 1]
    const mascotProgress = Math.max(0, (progress - 0.45) / 0.55);

    // Mascot horizontal translation (X-axis)
    const startX = 0; // Centered
    const endX = isMobile ? 0 : viewportWidth * 0.22; // Shifts right next to about card
    const targetX = THREE.MathUtils.lerp(startX, endX, mascotProgress);

    // Mascot rotation (Y-axis)
    const startRotY = 0.2; // Facing forward
    const endRotY = isMobile ? -Math.PI / 2.5 : -Math.PI / 1.8; // Profile view
    const targetRotY = THREE.MathUtils.lerp(startRotY, endRotY, mascotProgress);

    // Mascot scale
    const startScale = isMobile ? 1.35 : 2.0;
    const endScale = isMobile ? 1.05 : 1.55;
    const targetScale = THREE.MathUtils.lerp(startScale, endScale, mascotProgress);

    // Mouse tilt tracking
    const targetMouseX = state.pointer.x * 0.15;
    const targetMouseY = state.pointer.y * 0.08;

    // Lerp positions
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY + targetMouseX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetMouseY, 0.05);

    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05);
    group.current.scale.setScalar(nextScale);
  });

  return (
    <group ref={group} visible={visible} dispose={null} position={[0, -1.0, 0]} scale={1.8}>
      <primitive object={scene} />
    </group>
  );
};

// ── CAMERA CONTROLLER ────────────────────────────────────────────────────────
interface CameraControllerProps {
  scrollProgressRef: React.MutableRefObject<number>;
  controlsRef: React.RefObject<any>;
}

const CameraController = ({ scrollProgressRef, controlsRef }: CameraControllerProps) => {
  const { camera } = useThree();

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const { width: viewportWidth } = camera.viewport;
    const isMobile = viewportWidth < 7;

    const targetCamPos = new THREE.Vector3();
    const targetCamTarget = new THREE.Vector3();

    if (progress < 0.45) {
      // --- VADER SCENE PHASE ---
      // Map progress [0, 0.45] -> t [0, 1]
      const t = progress / 0.45;

      const pStart = new THREE.Vector3(6.0, 5.0, 14.0);
      const tStart = new THREE.Vector3(0.0, -0.4, 0.0);

      const pMid = new THREE.Vector3(0.0, -0.2, 2.8);
      const tMid = new THREE.Vector3(0.0, -0.2, 0.0);

      const pEnd = new THREE.Vector3(0.0, -0.1, 0.45);
      const tEnd = new THREE.Vector3(0.0, -0.1, 0.0);

      if (t < 0.6) {
        // Orbit sweep: Cubic Bezier curve
        const tOrbit = t / 0.6;
        const oneMinusT = 1 - tOrbit;
        const pCtrl1 = new THREE.Vector3(-4.0, 4.0, 12.0);
        const pCtrl2 = new THREE.Vector3(-6.0, 0.5, 5.0);

        targetCamPos.x =
          oneMinusT ** 3 * pStart.x +
          3 * oneMinusT ** 2 * tOrbit * pCtrl1.x +
          3 * oneMinusT * tOrbit ** 2 * pCtrl2.x +
          tOrbit ** 3 * pMid.x;

        targetCamPos.y =
          oneMinusT ** 3 * pStart.y +
          3 * oneMinusT ** 2 * tOrbit * pCtrl1.y +
          3 * oneMinusT * tOrbit ** 2 * pCtrl2.y +
          tOrbit ** 3 * pMid.y;

        targetCamPos.z =
          oneMinusT ** 3 * pStart.z +
          3 * oneMinusT ** 2 * tOrbit * pCtrl1.z +
          3 * oneMinusT * tOrbit ** 2 * pCtrl2.z +
          tOrbit ** 3 * pMid.z;

        targetCamTarget.lerpVectors(tStart, tMid, tOrbit);
      } else {
        // Visor plunge
        const tPlunge = (t - 0.6) / 0.4;
        targetCamPos.lerpVectors(pMid, pEnd, tPlunge);
        targetCamTarget.lerpVectors(tMid, tEnd, tPlunge);
      }
    } else {
      // --- MASCOT SHOWCASE PHASE ---
      const t = (progress - 0.45) / 0.55;

      const pMascotCam = new THREE.Vector3(0, 0, isMobile ? 6.5 : 5.5);
      const tMascotCam = new THREE.Vector3(0, isMobile ? -0.8 : -1.0, 0);

      const pEnd = new THREE.Vector3(0.0, -0.1, 0.45);
      const tEnd = new THREE.Vector3(0.0, -0.1, 0.0);

      // Pull back quickly in the first 20% of the mascot phase
      const tPull = Math.min(1, t * 5);

      targetCamPos.lerpVectors(pEnd, pMascotCam, tPull);
      targetCamTarget.lerpVectors(tEnd, tMascotCam, tPull);
    }

    // Smooth lerp camera position and control target
    camera.position.lerp(targetCamPos, 0.06);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetCamTarget, 0.06);
      controlsRef.current.update();
    }
  });

  return null;
};

// ── UNIFIED HERO SCENE (Canvas Wrapper) ──────────────────────────────────────
interface UnifiedHeroSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export const UnifiedHeroScene = ({ scrollProgressRef }: UnifiedHeroSceneProps) => {
  const controlsRef = useRef<any>(null);

  // Track visibility reactively at render-time for direct DOM updates
  const progressVal = scrollProgressRef.current;
  const showVader = progressVal < 0.45;
  const showMascot = progressVal >= 0.45;

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: "high-performance",
        }}
        // Setup initial camera (same as Vader start)
        camera={{ position: [6.0, 5.0, 14.0], fov: 40, near: 0.01, far: 1000 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={["#050406"]} />

        {/* Ambient deep cyber violet fill */}
        <ambientLight intensity={1.1} color="#151226" />

        {/* Cinematic Key Golden/Orange light (sweeps across) */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          color="#ffd700"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Neon Pink/Magenta fill from opposite side */}
        <directionalLight
          position={[-6, 4, 2]}
          intensity={2.0}
          color="#9333ea"
        />

        {/* Neon Visor glow helper */}
        <pointLight position={[0, 0.4, 1.4]} intensity={6.0} color="#e9d5ff" distance={8} decay={2} />

        {/* Subtle cyan rim highlight */}
        <pointLight position={[3, -1, 3]} intensity={1.5} color="#06b6d4" distance={8} />

        {/* Floating cyber particles */}
        <Sparkles count={40} scale={6} size={2.2} speed={0.4} color="#ff7b00" />
        <Sparkles count={30} scale={6} size={1.5} speed={0.6} color="#06b6d4" />

        <Suspense fallback={null}>
          {/* Render both models, visibility is driven inside useFrame and state */}
          <VaderModel visible={showVader} />
          <MascotModel visible={showMascot} scrollProgressRef={scrollProgressRef} />

          <CameraController scrollProgressRef={scrollProgressRef} controlsRef={controlsRef} />

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.05}
          />

          <EffectComposer disableNormalPass>
            <Bloom
              intensity={1.4}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.35} darkness={0.75} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-40 bg-black/60 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-full text-[9px] text-white uppercase tracking-[0.2em] font-mono">
        Interact // Drag to Rotate Mascot
      </div>
    </div>
  );
};

export default UnifiedHeroScene;
