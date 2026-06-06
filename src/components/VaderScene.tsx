import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

useGLTF.preload("/3d_models/intro.glb");

// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE OF THE WHITE-FACE BUG
// The previous code applied depthWrite=false to EVERY mesh, including the
// character's emissive visor/faceplate. Without depth writing, the visor's
// bright pixels have no Z-order context and collapse into a flat white blob.
//
// THE FIX: Classify each mesh before touching its material.
//   • Volumetric (smoke/fog/aura rings) → depthWrite=false, renderOrder=2
//   • Solid (character armor, visor shell, body) → depthWrite=true, renderOrder=1
//
// Three.js rendering order for this scene:
//   1. Solid character parts write to depth buffer (renderOrder=1)
//   2. Transparent smoke reads depth buffer, blends correctly (renderOrder=2)
//      → smoke behind character is correctly culled by depth test
//      → smoke in front of character blends over it
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true when a mesh is volumetric (smoke, fog, cloud, aura, glow ring).
 * Uses three independent heuristics so unknown naming conventions still work.
 *
 * DEBUG TIP: If the face is still broken, uncomment the console.log below to
 * print every mesh + material name. Add any unrecognised volumetric names to
 * the keywords array.
 */
function isVolumetricMesh(mesh: THREE.Mesh, mat: any): boolean {
  const meshName = (mesh.name ?? "").toLowerCase();
  const matName = (mat.name ?? "").toLowerCase();
  const combined = `${meshName} ${matName}`;

  // console.log("[VaderScene] mesh:", mesh.name, "| mat:", mat.name,
  //   "| opacity:", mat.opacity, "| alphaMap:", !!mat.alphaMap,
  //   "| transparent:", mat.transparent);

  // ① Explicit keyword match — covers most GLB exports from Blender / Maya / Cinema 4D
  const VOLUMETRIC_KEYWORDS = [
    "smoke", "cloud", "fog", "mist", "ring", "haze",
    "aura", "glow", "vfx", "fx", "effect", "particle",
    "dust", "vapor", "wisp", "trail", "atmos", "ambient",
    "plasma", "energy", "embers", "scatter",
  ];
  if (VOLUMETRIC_KEYWORDS.some((kw) => combined.includes(kw))) return true;

  // ② Opacity-based: artists set opacity < 1 on transparent layers.
  //    We use < 0.98 to give a small tolerance above pure-white float precision.
  if (mat.opacity !== undefined && mat.opacity < 0.98) return true;

  // ③ Alpha map: a dedicated alpha-channel texture strongly implies a
  //    soft-edge transparent sprite or fog card.
  if (mat.alphaMap != null) return true;

  // ④ Already flagged transparent AND low opacity in the exported GLB.
  //    Note: we intentionally do NOT classify mat.transparent===true alone,
  //    because emissive visor materials may have transparent=true for blending
  //    while still being a "solid" element that must write to the depth buffer.
  if (mat.transparent === true && mat.opacity < 0.98) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// VaderModel
// ─────────────────────────────────────────────────────────────────────────────

interface ModelProps {
  cameraTargetRef: React.MutableRefObject<THREE.Vector3>;
}

const VaderModel = ({ cameraTargetRef: _cameraTargetRef }: ModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/intro.glb");
  const { actions } = useAnimations(animations, group);

  // ── Material traversal ────────────────────────────────────────────────────
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      mats.forEach((mat: any) => {
        // Always correct colour space so textures don't look washed out
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;

        if (isVolumetricMesh(mesh, mat)) {
          // ── SMOKE / FOG / AURA RINGS ────────────────────────────────────
          // depthWrite=false is the critical setting: it prevents the bounding
          // box of each transparent layer from masking geometry behind it.
          // Renders AFTER the character (renderOrder=2) so it can read the
          // already-written depth values and sort correctly.
          mat.transparent = true;
          mat.depthWrite = false;   // ← THE key fix; do NOT apply this to solid meshes
          mat.depthTest = true;    // still reads depth, so smoke behind char is culled
          mat.alphaTest = 0.005;   // discard near-invisible edge pixels cleanly
          mat.side = THREE.DoubleSide;
          mesh.renderOrder = 2;
        } else {
          // ── SOLID CHARACTER PARTS (armor, body, visor shell, platform) ──
          // Must write depth so the character correctly occludes smoke rings
          // and prevents the white-face artefact.
          mat.depthWrite = true;
          mat.depthTest = true;
          mesh.renderOrder = 1;

          // Boost pre-existing emissive glow (visor, light strips, etc.)
          // without touching meshes that have no emissive to begin with.
          if (mat.emissiveIntensity != null && mat.emissiveIntensity > 0) {
            mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 1.5);
          }
        }

        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  // ── Start all embedded GLB animations ────────────────────────────────────
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset().fadeIn(0.2).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    });
  }, [actions]);

  return (
    <group ref={group} dispose={null} position={[0, -1.3, 0]} scale={0.8}>
      <primitive object={scene} />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CameraController
// Lerps the Three.js camera toward the GSAP-animated ref values every frame,
// giving a smooth deceleration that feels organic rather than mechanical.
// ─────────────────────────────────────────────────────────────────────────────

const CameraController = ({
  cameraPosRef,
  cameraTargetRef,
}: {
  cameraPosRef: React.MutableRefObject<THREE.Vector3>;
  cameraTargetRef: React.MutableRefObject<THREE.Vector3>;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (!controlsRef.current) return;
    camera.position.lerp(cameraPosRef.current, 0.05);
    controlsRef.current.target.lerp(cameraTargetRef.current, 0.05);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      // Phase 2 plunges to z≈0.12 — minDistance MUST be well below that
      minDistance={0.05}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2 + 0.1}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VaderScene (exported)
// ─────────────────────────────────────────────────────────────────────────────

interface SceneProps {
  cameraPosRef: React.MutableRefObject<THREE.Vector3>;
  cameraTargetRef: React.MutableRefObject<THREE.Vector3>;
}

export const VaderScene = ({ cameraPosRef, cameraTargetRef }: SceneProps) => (
  <div className="absolute inset-0 w-full h-full z-0">
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
        powerPreference: "high-performance",
      }}
      // near=0.01 prevents clipping during the Phase-2 plunge
      camera={{ position: [6.0, 5.0, 14.0], fov: 45, near: 0.01, far: 1000 }}
    >
      <color attach="background" args={["#050406"]} />

      {/* Soft purple-black fill — keeps the dark areas from going fully black */}
      <ambientLight intensity={1.0} color="#180e29" />

      {/* Golden key light from upper-right — casts a luxurious warm glow on the character */}
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffd700" />

      {/* Deep purple fill from the left — creates contrast against the gold */}
      <directionalLight position={[-6, 4, 2]} intensity={2.0} color="#9333ea" />

      {/* Intense purple/white visor accent — sits just in front of the character's face. */}
      <pointLight
        position={[0, 0.4, 1.4]}
        intensity={6.0}
        color="#e9d5ff"
        distance={8}
        decay={2}
      />

      {/* Golden rim light from behind — adds cinematic depth separation */}
      <pointLight
        position={[3, 2, -4]}
        intensity={3.0}
        color="#facc15"
        distance={12}
        decay={2}
      />

      {/* Deep violet rim light from the opposite side */}
      <pointLight
        position={[-3, 2, -3]}
        intensity={4.0}
        color="#581c87"
        distance={15}
        decay={2}
      />

      <Suspense fallback={null}>
        <VaderModel cameraTargetRef={cameraTargetRef} />
        <CameraController
          cameraPosRef={cameraPosRef}
          cameraTargetRef={cameraTargetRef}
        />
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
          <Vignette
            eskil={false}
            offset={0.35}
            darkness={0.7}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  </div>
);