/* ═══════════════════════════════════════════════════════════════
   PendantChain — the hero centrepiece (react-three-fiber).
   A real chain-physics pendant, inspired by the iJewel3D/WebGi demo.
   A hand-rolled verlet solver hangs an interlocking chrome LINK chain
   between two anchors PINNED TO THE VIEWPORT'S TOP CORNERS; the
   client's iced cross pendant (GLB, generated from their product
   photo) hangs dead-center at the bottom.

   • Desktop: drag the pendant with the mouse — it swings with momentum.
   • Phone: TILT the device — the swing follows gravity (deviceorientation,
     asks iOS permission on first tap). Touch scrolls the page normally.
   • Responsive: anchors track the live corner-to-corner span every
     frame (no fixed-size rig scaled to fit) — segment length, link
     size, gravity and pendant scale all scale uniformly with that
     span, so the chain reads identically on a phone and an ultra-wide
     desktop, just bigger/smaller, and always hangs centered.
   Lazy-loaded; static poster on no-WebGL / reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, Center, Resize, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const PENDANT_SRC = '/assets/pendants/cross.glb'

const N = 30 // chain points — denser than a bare torus chain reads as "fake"
const PEND = 15 // pendant hangs from this point (center of the span)
const ITER = 10 // constraint iterations
const FRICTION = 0.985

// Base tuning, calibrated at a corner-to-corner span of BASE_DISTANCE world
// units. Every live viewport computes unitScale = actualSpan / BASE_DISTANCE
// and multiplies every size/force below by it, so the whole rig scales as
// one uniform object rather than being stretched or left tiny/huge.
const BASE_DISTANCE = 2.3
const BASE_SEG = 0.152 // segment rest length (tight overlap == a real interlocked link chain)
const BASE_LINK_R = 0.09
const BASE_LINK_TUBE = 0.042
const BASE_GRAV_Y = -3.4
const BASE_TILT_G = 4.2 // how strongly phone tilt pushes the swing
const BASE_SAG = 1.7 // initial-pose droop depth before physics takes over
const BASE_PEND_SCALE = 1.35
const BASE_PEND_OFFSET_Y = -0.55

// Chunky oval Cuban-link cross-section (not a thin plain ring) + clearcoat
// for the icy double-specular the real chain photos show.
const LINK_SCALE: [number, number, number] = [1.18, 0.74, 1]
const CHROME = {
  color: '#f5f6f8',
  metalness: 0.95,
  roughness: 0.15,
  envMapIntensity: 1.9,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
} as const

/* The generated cross pendant, normalized + hung from its top. */
function Pendant({ scale, offsetY }: { scale: number; offsetY: number }) {
  const { scene } = useGLTF(PENDANT_SRC)
  return (
    <group position={[0, offsetY, 0]} scale={scale}>
      <Center>
        <Resize>
          <primitive object={scene} />
        </Resize>
      </Center>
    </group>
  )
}

/* Fallback cross (chrome) if the GLB is missing / fails to decode. */
function CrossFallback({ scale = 1 }: { scale?: number }) {
  return (
    <group position={[0, -0.4 * scale, 0]} scale={scale}>
      <mesh>
        <boxGeometry args={[0.17, 0.66, 0.13]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.46, 0.17, 0.13]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
    </group>
  )
}

class PendantBoundary extends Component<{ children: ReactNode; fallbackScale: number }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <CrossFallback scale={this.props.fallbackScale} /> : this.props.children
  }
}

function Necklace() {
  const { viewport } = useThree()

  // Anchors sit EXACTLY at the top-left / top-right corners of the current
  // viewport (not a fixed-size rig scaled to "fit") — the chain always
  // starts at the corners and the pendant always hangs dead-center.
  const halfW = viewport.width / 2
  const topY = viewport.height / 2
  const anchorL = useMemo(() => new THREE.Vector3(-halfW, topY, 0), [halfW, topY])
  const anchorR = useMemo(() => new THREE.Vector3(halfW, topY, 0), [halfW, topY])

  // Segment length, link size, gravity and pendant scale all scale with the
  // live corner-to-corner span, so proportions stay identical on any device.
  const unitScale = THREE.MathUtils.clamp(viewport.width / BASE_DISTANCE, 0.65, 5)
  const segLen = BASE_SEG * unitScale
  const linkR = BASE_LINK_R * unitScale
  const linkTube = BASE_LINK_TUBE * unitScale
  const gravY = BASE_GRAV_Y * unitScale
  const tiltG = BASE_TILT_G * unitScale
  const pendantScale = BASE_PEND_SCALE * unitScale
  const pendantOffsetY = BASE_PEND_OFFSET_Y * unitScale

  const group = useRef<THREE.Group>(null)
  // Computed once on mount — anchors/scale below are re-read live every
  // frame in useFrame, so a later resize re-targets the pin smoothly
  // instead of resetting the whole simulation.
  const pts = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const t = i / (N - 1)
        const x = THREE.MathUtils.lerp(anchorL.x, anchorR.x, t)
        const y = THREE.MathUtils.lerp(anchorL.y, anchorR.y, t) - Math.sin(t * Math.PI) * BASE_SAG * unitScale
        return new THREE.Vector3(x, y, 0)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const prev = useMemo(() => pts.map((p) => p.clone()), [pts])
  const links = useRef<Array<THREE.Mesh | null>>([])
  const pendant = useRef<THREE.Group>(null)
  const drag = useRef(false)
  const local = useRef(new THREE.Vector3())
  const tilt = useRef(0)
  const clock = useRef(0)
  const tmp = useMemo(
    () => ({
      mid: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      qr: new THREE.Quaternion(),
      z: new THREE.Vector3(0, 0, 1),
    }),
    [],
  )

  // phone tilt → horizontal gravity (asks iOS permission on first tap)
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) tilt.current = THREE.MathUtils.clamp(e.gamma / 40, -1, 1)
    }
    const enable = () => window.addEventListener('deviceorientation', onOrient)
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined
    if (D && typeof D.requestPermission === 'function') {
      const ask = () => {
        D.requestPermission!()
          .then((r) => {
            if (r === 'granted') enable()
          })
          .catch(() => {})
      }
      window.addEventListener('touchend', ask, { once: true })
      return () => {
        window.removeEventListener('touchend', ask)
        window.removeEventListener('deviceorientation', onOrient)
      }
    }
    enable()
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 50)
    clock.current += dt
    const gy = gravY * dt * dt
    const gx = tilt.current * tiltG * dt * dt

    for (let i = 1; i < N - 1; i++) {
      if (drag.current && i === PEND) continue
      const p = pts[i]
      const pr = prev[i]
      const vx = (p.x - pr.x) * FRICTION
      const vy = (p.y - pr.y) * FRICTION
      const vz = (p.z - pr.z) * FRICTION
      pr.copy(p)
      p.x += vx + gx
      p.y += vy + gy
      p.z += vz
    }

    if (drag.current) {
      prev[PEND].copy(pts[PEND])
      pts[PEND].set(local.current.x, local.current.y, 0)
    } else {
      pts[PEND].x += Math.sin(clock.current * 1.1) * 0.0016 // gentle idle sway
    }

    for (let k = 0; k < ITER; k++) {
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i]
        const b = pts[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dz = b.z - a.z
        const d = Math.hypot(dx, dy, dz) || 1e-6
        const f = ((d - segLen) / d) * 0.5
        const ox = dx * f
        const oy = dy * f
        const oz = dz * f
        const aPinned = i === 0 || (drag.current && i === PEND)
        const bPinned = i + 1 === N - 1 || (drag.current && i + 1 === PEND)
        if (!aPinned) {
          a.x += ox
          a.y += oy
          a.z += oz
        }
        if (!bPinned) {
          b.x -= ox
          b.y -= oy
          b.z -= oz
        }
      }
      pts[0].copy(anchorL)
      pts[N - 1].copy(anchorR)
      if (drag.current) pts[PEND].set(local.current.x, local.current.y, 0)
    }

    // interlocking links: align each to its segment, alternate 90° roll
    for (let i = 0; i < N - 1; i++) {
      const m = links.current[i]
      if (!m) continue
      tmp.mid.addVectors(pts[i], pts[i + 1]).multiplyScalar(0.5)
      tmp.dir.subVectors(pts[i + 1], pts[i]).normalize()
      tmp.q.setFromUnitVectors(tmp.z, tmp.dir)
      if (i % 2 === 1) {
        tmp.qr.setFromAxisAngle(tmp.dir, Math.PI / 2)
        tmp.q.premultiply(tmp.qr)
      }
      m.position.copy(tmp.mid)
      m.quaternion.copy(tmp.q)
    }

    if (pendant.current) {
      pendant.current.position.copy(pts[PEND])
      const up = pts[PEND - 1]
      pendant.current.rotation.z = -Math.atan2(pts[PEND].x - up.x, up.y - pts[PEND].y) * 0.4
    }
  })

  const setLocal = (e: ThreeEvent<PointerEvent>) => {
    local.current.copy(e.point)
    group.current?.worldToLocal(local.current)
  }

  return (
    <group ref={group}>
      {/* mouse-only drag surface — touch is left free to scroll / tilt */}
      <mesh
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          if (e.pointerType !== 'mouse') return
          drag.current = true
          setLocal(e)
        }}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          if (drag.current) setLocal(e)
        }}
        onPointerUp={() => {
          drag.current = false
        }}
        onPointerLeave={() => {
          drag.current = false
        }}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* interlocking chain links — chunky oval Cuban-link cross-section */}
      {Array.from({ length: N - 1 }, (_, i) => (
        <mesh
          key={i}
          scale={LINK_SCALE}
          ref={(el) => {
            links.current[i] = el
          }}
        >
          <torusGeometry args={[linkR, linkTube, 10, 18]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}

      {/* pendant */}
      <group ref={pendant}>
        <PendantBoundary fallbackScale={pendantScale}>
          <Suspense fallback={<CrossFallback scale={pendantScale} />}>
            <Pendant scale={pendantScale} offsetY={pendantOffsetY} />
          </Suspense>
        </PendantBoundary>
      </group>
    </group>
  )
}

export default function PendantChain() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 4, 5]} intensity={1.8} />
      <directionalLight position={[-3, 1, 4]} intensity={0.8} />
      <Suspense fallback={null}>
        <Necklace />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[8, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2.4} position={[-5, 1, 3]} scale={[3, 8, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2.4} position={[5, 0, 3]} scale={[3, 8, 1]} color="#eef0f3" />
          <Lightformer form="ring" intensity={2.2} position={[2, 0.5, 5]} scale={5} color="#ffffff" />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
