/* ═══════════════════════════════════════════════════════════════
   Hero3D — the interactive 3D grill showpiece (react-three-fiber).
   A real GLB grill model (generated from the shop's own grill photo)
   floats on black; drag to spin it (PresentationControls, springy
   snap-back — works with touch too), lit by a hand-built monochrome
   light rig so the chrome reads without any coloured HDRI cast. If
   the model fails to load, it falls back to the framed-photo plaque.
   Lazy-loaded on any WebGL device (see HeroGrill.tsx); the static
   poster renders on no-WebGL / reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
import { Component, Suspense, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  PresentationControls,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  RoundedBox,
  Center,
  Resize,
  Bounds,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import * as THREE from 'three'

const MODEL_SRC = '/assets/grill/grill.glb'
const GRILL_IMG = '/assets/grill/hero.webp'
const IMG_RATIO = 1600 / 1072

/* ── The real 3D model ─────────────────────────────────────────── */
function GrillModel({ autoRotate }: { autoRotate: boolean }) {
  const { scene } = useGLTF(MODEL_SRC)
  const ref = useRef<THREE.Group>(null)
  // optional slow turntable; off by default (drag-only)
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.3
  })
  return (
    <group ref={ref} scale={3.7} position={[0, -0.05, 0]}>
      <Center>
        <Resize>
          <primitive object={scene} />
        </Resize>
      </Center>
    </group>
  )
}
useGLTF.preload(MODEL_SRC)

/* ── Fallback: the framed grill photo on a chrome plaque ───────── */
function Plaque() {
  const tex = useTexture(GRILL_IMG)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const pw = 2.62
  const ph = pw / IMG_RATIO
  const border = 0.3
  return (
    <group>
      <RoundedBox args={[pw + border, ph + border, 0.16]} radius={0.07} smoothness={6}>
        <meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.16} envMapIntensity={1.15} />
      </RoundedBox>
      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[pw, ph]} />
        <meshStandardMaterial map={tex} roughness={0.42} metalness={0.18} envMapIntensity={0.5} />
      </mesh>
    </group>
  )
}

/* Render the plaque if the GLB throws (missing / decode error). */
class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Plaque /> : this.props.children
  }
}

export default function Hero3D({ autoRotate = false }: { autoRotate?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />

      <Suspense fallback={null}>
        {/* Bounds auto-frames the model to whatever the canvas's aspect ratio
            is (observe = re-fit on resize), so the grill reads correctly
            whether the stage is wide (desktop) or narrow/short (mobile),
            instead of relying on one fixed scale + fov for every viewport. */}
        <Bounds fit clip observe margin={1.2}>
          <PresentationControls global snap polar={[-0.25, 0.25]} azimuth={[-0.6, 0.6]}>
            <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
              <ModelBoundary>
                <GrillModel autoRotate={autoRotate} />
              </ModelBoundary>
            </Float>
          </PresentationControls>
        </Bounds>

        {/* monochrome reflection rig — white/grey only, no colour cast */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2} position={[0, 3, 3]} scale={[6, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.2} position={[-4, 0, 2]} scale={[3, 6, 1]} color="#dfe2e7" />
          <Lightformer form="rect" intensity={1.2} position={[4, -1, 2]} scale={[3, 6, 1]} color="#aab0b8" />
        </Environment>

        <ContactShadows position={[0, -1.55, 0]} opacity={0.45} blur={2.6} scale={7} far={2.2} color="#000000" />
      </Suspense>
    </Canvas>
  )
}
