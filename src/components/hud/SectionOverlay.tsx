'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAXIOMStore } from '@/lib/store/useAXIOMStore'
import { projects } from '@/lib/data/projects'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'

const CYAN = '#00F2FF'
const GOLD = '#F6CE6E'

function ProjectsGrid() {
  return (
    <div style={{ padding: '2rem 2rem 4rem' }}>
      <h2
        style={{
          fontFamily: 'var(--font-orbitron)',
          color: GOLD,
          fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
          marginBottom: '2rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        &gt; PROJECT_MATRIX
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {projects.map(p => (
          <div
            key={p.id}
            style={{
              background: '#00141e',
              border: '1px solid rgba(246,206,110,0.25)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {/* Title + status badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  color: CYAN,
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  flex: 1,
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.58rem',
                  color:
                    p.status === 'LIVE'
                      ? '#22c55e'
                      : p.status === 'DEMO'
                        ? GOLD
                        : '#9ca3af',
                  border: '1px solid currentColor',
                  padding: '2px 6px',
                  flexShrink: 0,
                  letterSpacing: '0.06em',
                  alignSelf: 'flex-start',
                }}
              >
                {p.status}
              </span>
            </div>

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'var(--font-orbitron)',
                color: 'rgba(246,206,110,0.55)',
                fontSize: '0.62rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              {p.tagline}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                color: '#9ca3af',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                flex: 1,
              }}
            >
              {p.description}
            </p>

            {/* Tech stack chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {p.techStack.map(t => (
                <span
                  key={t}
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.58rem',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid #374151',
                    color: '#d1d5db',
                    padding: '2px 6px',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.58rem',
                  color: CYAN,
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  border: `1px solid rgba(0,242,255,0.3)`,
                  padding: '4px 10px',
                  textTransform: 'uppercase',
                }}
              >
                GITHUB →
              </a>
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.58rem',
                    color: GOLD,
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    border: `1px solid rgba(246,206,110,0.3)`,
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                  }}
                >
                  DEMO →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionOverlay() {
  const activePanel = useAXIOMStore(s => s.activePanel)
  const setActivePanel = useAXIOMStore(s => s.setActivePanel)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <AnimatePresence>
      {activePanel && (
        <motion.div
          key={activePanel}
          initial={{ x: '100%', opacity: 0.6 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: isMobile ? '100%' : '52%',
            height: '100%',
            zIndex: 50,
            background: 'rgba(2, 6, 23, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(0,242,255,0.18)',
            boxShadow: '-12px 0 60px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* ── Header ──────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 22px',
              borderBottom: '1px solid rgba(0,242,255,0.12)',
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              background: 'rgba(2, 6, 23, 0.99)',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.62rem',
                color: 'rgba(0,242,255,0.45)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              AXIOM :: {activePanel.toUpperCase()}
            </span>
            <button
              onClick={() => setActivePanel(null)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,242,255,0.22)',
                color: CYAN,
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                padding: '6px 14px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              CLOSE ×
            </button>
          </div>

          {/* ── Panel Content ────────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activePanel === 'projects' && <ProjectsGrid />}
            {activePanel === 'about' && <About />}
            {activePanel === 'skills' && <Skills />}
            {activePanel === 'contact' && <Contact />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
