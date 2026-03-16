'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import BootScreen from '@/components/hud/BootScreen'
import Terminal from '@/components/hud/Terminal'
import { SectionOverlay } from '@/components/hud/SectionOverlay'
import { EasterEggOverlay } from '@/components/hud/EasterEggOverlay'

// 3D scene loaded dynamically — no SSR
const AXIOMScene = dynamic(() => import('@/components/3d/AXIOMScene'), { ssr: false })

// ── Root Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#020617',
        margin: 0,
        padding: 0,
        display: 'flex',
        position: 'relative',
      }}
    >
      {/* Boot sequence — renders over everything, fades out when done */}
      {!bootComplete && <BootScreen onComplete={() => setBootComplete(true)} />}

      {/* Section info overlay — slides in from right on terminal commands */}
      <SectionOverlay />

      {/* Easter egg overlay — triggered by typing 'axiom' */}
      <EasterEggOverlay />

      <div className="axiom-grid-board" />
      <div className="axiom-grid-flow" />

      {/* ── Left Panel — Terminal (50vw desktop / 100vw mobile) ── */}
      <div
        style={{
          position: 'relative',
          width: isMobile ? '100%' : '50%',
          height: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Glassmorphism terminal container */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--font-jetbrains)',
            background: 'rgba(8, 8, 8, 0.82)',
            border: '1px solid rgba(246,206,110,0.18)',
            boxShadow: '0 0 40px rgba(246,206,110,0.12), inset 0 0 36px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            margin: '24px',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(246,206,110,0.05), transparent 35%)',
              pointerEvents: 'none',
            }}
          />

          {/* Inner border glow */}
          <div
            style={{
              position: 'absolute',
              inset: 10,
              border: '1px solid rgba(0,242,255,0.1)',
              borderRadius: 8,
              pointerEvents: 'none',
              boxShadow: '0 0 24px rgba(0,242,255,0.06) inset',
            }}
          />

          {/* Terminal chrome header */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '10px 18px 8px',
              borderBottom: '1px solid rgba(246,206,110,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                color: 'rgba(246,206,110,0.55)',
                textTransform: 'uppercase',
              }}
            >
              AXIOM OS v1.0
            </span>
            <span style={{ marginLeft: 'auto', color: 'rgba(0,242,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              OPERATOR: ANKIT SINGH
            </span>
          </div>

          {/* Terminal body — fills remaining space */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              padding: isMobile ? '20px 18px 16px' : '24px 28px 20px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Terminal />
          </div>
        </div>
      </div>

      {/* ── Right Panel — 3D Canvas (50vw desktop / hidden on mobile) ── */}
      {!isMobile && (
        <div
          style={{
            position: 'relative',
            width: '50%',
            height: '100%',
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 28,
              right: 30,
              zIndex: 20,
              color: '#EFD7A0',
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '1.35rem',
              letterSpacing: '0.04em',
              textAlign: 'right',
              textTransform: 'uppercase',
              lineHeight: 1.22,
              textShadow: '0 0 16px rgba(246,206,110,0.28)',
            }}
          >
            <div>AXIOM Interface System v1.0</div>
            <div>Project AXIOM: The Terminal</div>
            <div>Ankit Singh</div>
          </div>

          <AXIOMScene />
        </div>
      )}
    </main>
  )
}
