import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, Outline, Selection, Select } from "@react-three/postprocessing";

useGLTF.preload("/3d_models/Ultralak_FAQ_Model.glb");

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

const FAQModel = () => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3d_models/Ultralak_FAQ_Model.glb");
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

  // Adjust position and scale so it sits nicely in the hero area
  return (
    <group ref={group} dispose={null} position={[0, -1.5, 0]} scale={1.2}>
      <primitive object={scene} />
    </group>
  );
};

export const FAQHeroScene = () => (
  <div className="w-full h-full pointer-events-none">
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 2.5,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 1.5, 6.0], fov: 45, near: 0.1, far: 1000 }}
      style={{ pointerEvents: "auto" }}
    >
      {/* Extreme lighting to make the model extremely bright */}
      <ambientLight intensity={6.0} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={6.0} color="#ffd700" />
      <directionalLight position={[-6, 4, 2]} intensity={7.0} color="#9333ea" />

      {/* Heavy front fill light */}
      <directionalLight position={[0, 5, 8]} intensity={6.0} color="#ffffff" />

      <pointLight position={[0, 0.4, 1.4]} intensity={15.0} color="#ffffff" distance={8} decay={2} />
      <pointLight position={[3, 2, -4]} intensity={10.0} color="#facc15" distance={12} decay={2} />
      <pointLight position={[-3, 2, -3]} intensity={8.0} color="#581c87" distance={15} decay={2} />

      <Suspense fallback={null}>
        <Selection>
          <Select enabled>
            <FAQModel />
          </Select>
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.35} darkness={0.7} />
            <Outline
              blur
              visibleEdgeColor={0xffffff}
              hiddenEdgeColor={0xffffff}
              edgeStrength={10.0}
              width={1000}
            />
          </EffectComposer>
        </Selection>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 2 - 0.5}
        />
      </Suspense>
    </Canvas>
  </div>
);
