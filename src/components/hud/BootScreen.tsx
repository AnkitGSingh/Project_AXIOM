'use client'

import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  'AXIOM OS v1.0 INITIALISING...',
  '[████████████████████] 100%',
  'OPERATOR: ANKIT SINGH | CLEARANCE: LEVEL 5',
  'NEURAL LINK: ESTABLISHED',
]

interface Props {
  onComplete: () => void
}

export default function BootScreen({ onComplete }: Props) {
  // lineIdx: the line currently being typed (0-based). When === BOOT_LINES.length, all done.
  const [lineIdx, setLineIdx] = useState(0)
  // displayed: accumulated lines typed so far
  const [displayed, setDisplayed] = useState<string[]>([''])
  const [fading, setFading] = useState(false)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // All lines complete — trigger fade-out
    if (lineIdx >= BOOT_LINES.length) {
      if (doneRef.current) return
      doneRef.current = true
      const t = setTimeout(() => {
        setFading(true)
        setTimeout(() => onCompleteRef.current(), 850)
      }, 650)
      return () => clearTimeout(t)
    }

    const line = BOOT_LINES[lineIdx]
    let charIdx = 0
    let timerId: ReturnType<typeof setTimeout>

    const charDelay = lineIdx === 0 ? 42 : 28

    function tick() {
      charIdx++
      setDisplayed(prev => {
        const next = [...prev.slice(0, lineIdx), line.slice(0, charIdx)]
        return next
      })

      if (charIdx < line.length) {
        timerId = setTimeout(tick, charDelay)
      } else {
        // Line done — pause, then advance to next
        const pauseMs = lineIdx === 0 ? 380 : 210
        timerId = setTimeout(() => {
          setDisplayed(prev => [...prev, ''])
          setLineIdx(i => i + 1)
        }, pauseMs)
      }
    }

    timerId = setTimeout(tick, charDelay)
    return () => clearTimeout(timerId)
  }, [lineIdx])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#030303',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jetbrains), monospace',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Background grid glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(246,206,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          color: '#F6CE6E',
          maxWidth: 720,
          width: '100%',
          padding: '0 40px',
        }}
      >
        {displayed.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)',
              letterSpacing: '0.07em',
              lineHeight: 1.8,
              opacity: i <= lineIdx ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            {line}
            {/* Blinking block cursor on the active line */}
            {i === lineIdx && lineIdx < BOOT_LINES.length && (
              <span style={{ animation: 'bootBlink 1s step-end infinite' }}>█</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bootBlink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
