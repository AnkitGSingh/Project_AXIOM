'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import DroneModel from './DroneModel'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'
import { LoadingScreen } from '@/components/hud/LoadingScreen'

// Drives IDLE → LANDING phase on mount
function LandingTrigger() {
  const phase    = useAXIOMStore((s) => s.phase)
  const setPhase = useAXIOMStore((s) => s.setPhase)

  useEffect(() => {
    if (phase !== AnimationPhase.IDLE) return
    const t = setTimeout(() => setPhase(AnimationPhase.LANDING), 800)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  return null
}

function Lights() {
  return (
    <>
      {/* Soft ambient */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Key light — top front */}
      <pointLight position={[2, 5, 4]} intensity={4} color="#ffffff" distance={12} decay={2} />

      {/* Fill light — left side */}
      <pointLight position={[-3, 2, 3]} intensity={1.5} color="#d0e8ff" distance={10} decay={2} />

      {/* Rim light — back right */}
      <pointLight position={[3, 1, -3]} intensity={1.2} color="#ffffff" distance={8} decay={2} />

      {/* Hemisphere — sky/ground */}
      <hemisphereLight args={['#b0c8e8', '#1a1a2e', 0.5]} />
    </>
  )
}

// ── Camera Controller — lerps toward head on "about" command ─────────────────
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0)
const HEAD_TARGET    = new THREE.Vector3(0, 0.3, 0)
const DEFAULT_CAM    = new THREE.Vector3(0, 0.2, 6.0)
const HEAD_CAM       = new THREE.Vector3(0, 0.5, 3.0)
const _tmpVec        = new THREE.Vector3()

function CameraController() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef      = useRef<any>(null)
  const cameraZoomHead   = useAXIOMStore((s) => s.cameraZoomHead)

  useFrame((state, delta) => {
    const ctrl = controlsRef.current
    if (!ctrl) return

    const goalTarget = cameraZoomHead ? HEAD_TARGET : DEFAULT_TARGET
    const goalCam    = cameraZoomHead ? HEAD_CAM    : DEFAULT_CAM

    ctrl.target.lerp(goalTarget, delta * 3.0)
    state.camera.position.lerp(_tmpVec.copy(goalCam), delta * 2.0)
    ctrl.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={3}
      maxDistance={9}
      enableDamping
      dampingFactor={0.05}
      autoRotate
      autoRotateSpeed={0.18}
    />
  )
}

export default function AXIOMScene() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // On mobile: 3D Canvas is removed from DOM entirely (not just hidden)
  if (isMobile) return null

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <LoadingScreen />
      <Canvas
        camera={{ position: [0, 0.2, 6.0], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Lights />
        <LandingTrigger />

        <Suspense fallback={null}>
          <DroneModel />
          <Environment preset="city" />
        </Suspense>

        <CameraController />
      </Canvas>
    </div>
  )
}