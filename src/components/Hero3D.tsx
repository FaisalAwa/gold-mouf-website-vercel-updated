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

/* The real GLB was scanned from the shop's actual 10 × 10 (20-tooth) set —
   that exact tooth count gets the high-fidelity scan. Every other preset
   renders a procedural chrome grill built to match its tooth count, reusing
   the same monochrome material so it doesn't read as a different asset. */
const REAL_SCAN_TEETH = 20

/* ── The real scanned 3D model (only for the 10 × 10 preset) ────── */
function RealGrillScan() {
  const { scene } = useGLTF(MODEL_SRC)
  return <primitive object={scene} />
}
useGLTF.preload(MODEL_SRC)

/* ── Procedural grill — arranges chrome teeth to match a tooth count
   so every preset (6×6, 8×8, 12×12, Full Set) visibly differs ──── */
function ProceduralGrillModel({ teeth }: { teeth: number }) {
  const topCount = Math.ceil(teeth / 2)
  const bottomCount = teeth - topCount
  const rowGap = 1.05

  const buildRow = (count: number, y: number, curveSign: number) => {
    const spread = 0.3 + count * 0.05
    return Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1
      const x = t * spread
      const arch = curveSign * (1 - t * t) * 0.14
      const toothW = 0.1
      const toothH = 0.32 - Math.abs(t) * 0.04
      return (
        <RoundedBox key={`${y}-${i}`} args={[toothW, toothH, 0.16]} radius={0.028} smoothness={3} position={[x, y + arch, 0]}>
          <meshStandardMaterial color="#d7dade" metalness={1} roughness={0.14} envMapIntensity={1.2} />
        </RoundedBox>
      )
    })
  }

  return (
    <group>
      {buildRow(topCount, rowGap / 2, -1)}
      {buildRow(bottomCount, -rowGap / 2, 1)}
    </group>
  )
}

/* ── Model stage — swaps scan vs. procedural, shared drag/float rig ─ */
function GrillModel({ autoRotate, teeth }: { autoRotate: boolean; teeth: number }) {
  const ref = useRef<THREE.Group>(null)
  // optional slow turntable; off by default (drag-only)
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.3
  })
  return (
    <group ref={ref} position={[0, -0.05, 0]}>
      <Center>
        <Resize>{teeth === REAL_SCAN_TEETH ? <RealGrillScan /> : <ProceduralGrillModel teeth={teeth} />}</Resize>
      </Center>
    </group>
  )
}

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

export default function Hero3D({ autoRotate = false, teeth = REAL_SCAN_TEETH }: { autoRotate?: boolean; teeth?: number }) {
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
        <Bounds fit clip observe margin={1.2} key={teeth}>
          <PresentationControls global snap polar={[-0.25, 0.25]} azimuth={[-0.6, 0.6]}>
            <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
              <ModelBoundary>
                <GrillModel autoRotate={autoRotate} teeth={teeth} />
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
