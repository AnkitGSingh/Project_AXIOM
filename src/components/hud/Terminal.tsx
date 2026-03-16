'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

const CYAN = '#00F2FF'
const GOLD = '#F6CE6E'
const DIM_GOLD = 'rgba(246,206,110,0.55)'

// ── Types ─────────────────────────────────────────────────────────────────────
type MsgKind = 'cmd' | 'response' | 'system' | 'error'

interface TMsg {
  id: string
  kind: MsgKind
  text: string
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 14 }: { text: string; speed?: number }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(0)
  }, [text])

  useEffect(() => {
    if (idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), speed)
    return () => clearTimeout(t)
  }, [idx, text.length, speed])

  return <>{text.slice(0, idx)}</>
}

// ── Local command registry ────────────────────────────────────────────────────
const LOCAL_COMMANDS: Record<string, string> = {
  help: [
    'AXIOM Command Registry:',
    '  about      — Operator profile',
    '  projects   — Project matrix',
    '  skills     — Tech stack readout',
    '  contact    — Open communication channels',
    '  hire him   — Deploy contact form',
    '  clear      — Purge terminal buffer',
    '  [anything] — Query AXIOM AI directly',
  ].join('\n'),
  skills: [
    'Primary Stack  : Python · TypeScript · Next.js · FastAPI · PostgreSQL',
    'AI / ML        : LangChain · PyTorch · HuggingFace · OpenAI · Bedrock',
    'Infrastructure : AWS · Vercel · Docker · GitHub Actions',
    'Speciality     : AI automation pipelines · ad spend protection systems',
  ].join('\n'),
  contact: [
    'Communication channels:',
    '  Email    →  ankit [at] adtecher.com',
    '  GitHub   →  github.com/ankitgsingh',
    '  LinkedIn →  linkedin.com/in/ankitgsingh',
    'Ping dispatched. OPERATOR will respond within 24h.',
  ].join('\n'),
}

// ── Terminal ──────────────────────────────────────────────────────────────────
export default function Terminal() {
  const [messages, setMessages] = useState<TMsg[]>([
    { id: 'boot', kind: 'system', text: "Terminal active. Type 'help' for commands." },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const triggerArcReactorPulse = useAXIOMStore(s => s.triggerArcReactorPulse)
  const setCameraZoomHead = useAXIOMStore(s => s.setCameraZoomHead)
  const setActivePanel = useAXIOMStore(s => s.setActivePanel)
  const triggerEasterEgg = useAXIOMStore(s => s.triggerEasterEgg)
  const systemInitialized = useAXIOMStore(s => s.systemInitialized)
  const setSystemInitialized = useAXIOMStore(s => s.setSystemInitialized)
  const setPhase = useAXIOMStore(s => s.setPhase)
  const transmissionSuccess = useAXIOMStore(s => s.transmissionSuccess)
  const setTransmissionSuccess = useAXIOMStore(s => s.setTransmissionSuccess)

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const addMsg = useCallback((kind: MsgKind, text: string) => {
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, kind, text },
    ])
  }, [])

  // Log "TRANSMISSION SUCCESSFUL" when the contact form completes
  useEffect(() => {
    if (!transmissionSuccess) return
    addMsg('response', 'TRANSMISSION SUCCESSFUL. AXIOM OUT.')
    setTransmissionSuccess(false)
  }, [transmissionSuccess, addMsg, setTransmissionSuccess])

  const handleSubmit = useCallback(async () => {
    const raw = input.trim()
    if (!raw || isLoading) return

    const cmd = raw.toLowerCase()

    addMsg('cmd', raw)
    setHistory(prev => [raw, ...prev])
    setHistoryIdx(-1)
    setInput('')

    // ── clear ──────────────────────────────────────────────────────────────
    if (cmd === 'clear') {
      setMessages([{ id: 'cleared', kind: 'system', text: "Buffer purged. Type 'help' for commands." }])
      return
    }

    // ── project number shortcuts 00-06 ────────────────────────────────────
    const PROJECT_EXPAND: Record<string, string> = {
      '00': 'Tell me about the Omnipotent App flagship project in detail.',
      '01': 'Tell me about the First Aid Buddy Bot project in detail.',
      '02': 'Tell me about the Maze Runner Robot project in detail.',
      '03': 'Tell me about the Digit Recognition project in detail.',
      '04': 'Tell me about the IPL Score Scraper project in detail.',
      '05': 'Tell me about the GODL1KE project in detail.',
      '06': 'Tell me about the ML Medical Imaging project in detail.',
    }
    if (PROJECT_EXPAND[cmd]) {
      if (!systemInitialized) {
        addMsg('error', 'AXIOM: Core offline — initialize the system before querying the neural link.')
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: PROJECT_EXPAND[cmd] }] }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        addMsg('response', data.text ?? 'AXIOM: Signal ambiguous. Please rephrase your query.')
      } catch {
        addMsg('error', 'AXIOM: Neural link degraded. Ensure AWS credentials are configured.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    // ── projects — print list inline + open panel ─────────────────────────
    if (cmd === 'projects') {
      triggerArcReactorPulse()
      setActivePanel('projects')
      addMsg(
        'response',
        'AXIOM: Project Matrix — 7 active deployments:\n\n' +
        '  00. Omnipotent App          — Flagship · Automation Hub · Systems of Systems\n' +
        '  01. First Aid Buddy Bot    — RAG · Python · Claude API\n' +
        '  02. Maze Runner Robot      — Webots · BFS/DFS · Sensor Fusion\n' +
        '  03. Digit Recognition      — TensorFlow · CNN · MNIST\n' +
        '  04. IPL Score Scraper      — BeautifulSoup · Pandas · Matplotlib\n' +
        '  05. GODL1KE                — Search AI · Vanilla JS · SHU API\n' +
        '  06. ML Medical Imaging     — Deep Learning · CNN · 79% accuracy\n\n' +
        'Which one should I expand for you?',
      )
      return
    }

    // ── about — Camera zoom to head + open panel ───────────────────────────
    if (cmd === 'about') {
      setCameraZoomHead(true)
      setActivePanel('about')
      addMsg(
        'response',
        'AXIOM: Loading operator profile. Optical sensors redirecting. Panel deployed.',
      )
      setTimeout(() => setCameraZoomHead(false), 8000)
      return
    }

    // ── skills — open panel ────────────────────────────────────────────────
    if (cmd === 'skills') {
      setActivePanel('skills')
      addMsg('response', LOCAL_COMMANDS['skills'])
      return
    }

    // ── contact — open panel ───────────────────────────────────────────────
    if (cmd === 'contact') {
      setActivePanel('contact')
      addMsg('response', LOCAL_COMMANDS['contact'])
      return
    }
    // ── hire him — open contact panel ─────────────────────────────────────────
    if (cmd === 'hire him') {
      setActivePanel('contact')
      addMsg('response', 'AXIOM: Smart move. Opening secure transmission channel — make it count.')
      return
    }
    // ── axiom — hidden easter egg ──────────────────────────────────────────
    if (cmd === 'axiom') {
      triggerEasterEgg()
      addMsg('response', 'AXIOM: ██████ CLASSIFIED SEQUENCE ACTIVATED ██████')
      return
    }

    // ── remaining local commands (help, etc.) ─────────────────────────────
    if (LOCAL_COMMANDS[cmd]) {
      addMsg('response', LOCAL_COMMANDS[cmd])
      return
    }

    // ── AI fallback — AWS Bedrock ──────────────────────────────────────────
    if (!systemInitialized) {
      addMsg('error', 'AXIOM: Core offline — initialize the system before querying the neural link.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: raw }] }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      addMsg('response', data.text ?? 'AXIOM: Signal ambiguous. Please rephrase your query.')
    } catch {
      addMsg('error', 'AXIOM: Neural link degraded. Ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are configured.')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, addMsg, triggerArcReactorPulse, setCameraZoomHead, setActivePanel, triggerEasterEgg, systemInitialized])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHistoryIdx(prev => {
          const next = Math.min(prev + 1, history.length - 1)
          if (history[next] !== undefined) setInput(history[next])
          return next
        })
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHistoryIdx(prev => {
          const next = Math.max(prev - 1, -1)
          setInput(next === -1 ? '' : (history[next] ?? ''))
          return next
        })
      }
    },
    [handleSubmit, history],
  )

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'var(--font-jetbrains), monospace',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        cursor: 'text',
      }}
      onClick={() => { if (systemInitialized) inputRef.current?.focus() }}
    >
      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 12,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(246,206,110,0.2) transparent',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: 6,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: 'clamp(0.75rem, 1.3vw, 1rem)',
            }}
          >
            {msg.kind === 'cmd' && (
              <>
                <span style={{ color: CYAN }}>{'> '}</span>
                <span style={{ color: GOLD }}>{msg.text}</span>
              </>
            )}
            {msg.kind === 'response' && (
              <span style={{ color: CYAN }}>
                <TypewriterText text={msg.text} speed={12} />
              </span>
            )}
            {msg.kind === 'system' && (
              <span style={{ color: DIM_GOLD }}>{msg.text}</span>
            )}
            {msg.kind === 'error' && (
              <span style={{ color: '#FF4C4C' }}>{msg.text}</span>
            )}
          </div>
        ))}

        {isLoading && (
          <div
            style={{ color: CYAN, fontSize: 'clamp(0.75rem, 1.3vw, 1rem)', opacity: 0.8 }}
          >
            <span style={{ animation: 'termBlink 0.7s step-end infinite' }}>
              AXIOM IS THINKING...
            </span>
          </div>
        )}

        {/* ── Initialize System button \u2014 shown until system is activated \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
        {!systemInitialized && (
          <div style={{ margin: '14px 0 6px' }}>
            <button
              onClick={() => {
                // Resume audio context (required for browsers that block autoplay)
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Howler = (window as any).Howler
                  if (Howler?.ctx?.state === 'suspended') Howler.ctx.resume()
                } catch { /* audio not critical */ }
                setPhase(AnimationPhase.IDLE)
                setSystemInitialized(true)
                addMsg('system', 'AXIOM CORE ONLINE. Neural link established. All systems operational. Query away.')
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,242,255,0.45)',
                color: CYAN,
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: 'clamp(0.62rem, 1.1vw, 0.78rem)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '10px 22px',
                cursor: 'pointer',
                boxShadow: '0 0 18px rgba(0,242,255,0.15), inset 0 0 12px rgba(0,242,255,0.06)',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(0,242,255,0.35), inset 0 0 20px rgba(0,242,255,0.12)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = CYAN
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(0,242,255,0.15), inset 0 0 12px rgba(0,242,255,0.06)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,242,255,0.45)'
              }}
            >
              <span style={{ opacity: 0.6 }}>▶</span>
              {' '}INITIALIZE SYSTEM
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(246,206,110,0.18)',
          paddingTop: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Prompt character */}
          <span
            style={{
              color: CYAN,
              fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {'>'}
          </span>

          {/* Fake display of typed text + blinking cursor */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              minHeight: '1.4em',
            }}
          >
            <span
              style={{
                color: GOLD,
                fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
                fontFamily: 'var(--font-jetbrains), monospace',
                whiteSpace: 'pre',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {input}
            </span>
            <span
              style={{
                color: GOLD,
                fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
                animation: systemInitialized ? 'termCursorBlink 1s step-end infinite' : 'none',
                opacity: systemInitialized ? 1 : 0.2,
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              █
            </span>

            {/* Hidden real input — positioned behind visual display */}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 'inherit',
                color: 'transparent',
                caretColor: 'transparent',
              }}
              autoFocus={false}
              disabled={!systemInitialized || isLoading}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes termCursorBlink { 50% { opacity: 0; } }
        @keyframes termBlink { 40% { opacity: 0.2; } }
      `}</style>
    </div>
  )
}
