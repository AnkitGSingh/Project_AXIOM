export function About() {
  return (
    <div style={{ padding: '2rem 2rem 3rem' }}>

      {/* Header */}
      <h2 style={{
        fontFamily: 'var(--font-orbitron)',
        color: '#F6CE6E',
        fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
        marginBottom: '2rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        &gt; WHO_AM_I
      </h2>

      {/* Card */}
      <div style={{
        background: '#00141e',
        border: '1px solid rgba(246,206,110,0.25)',
        padding: '2rem',
        position: 'relative',
      }}>
        {/* Corner brackets */}
        <span style={{ position: 'absolute', top: -1, left: -1, width: 14, height: 14, borderTop: '2px solid #F6CE6E', borderLeft: '2px solid #F6CE6E' }} />
        <span style={{ position: 'absolute', top: -1, right: -1, width: 14, height: 14, borderTop: '2px solid #F6CE6E', borderRight: '2px solid #F6CE6E' }} />
        <span style={{ position: 'absolute', bottom: -1, left: -1, width: 14, height: 14, borderBottom: '2px solid #F6CE6E', borderLeft: '2px solid #F6CE6E' }} />
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderBottom: '2px solid #F6CE6E', borderRight: '2px solid #F6CE6E' }} />

        <p style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
          color: '#d1d5db',
          lineHeight: 1.7,
          marginBottom: '1.2rem',
        }}>
          I'm{' '}
          <span style={{ color: '#00F2FF', fontWeight: 600 }}>Ankit Singh</span>
          {'. '}Based in Sheffield, UK, where I completed my MSc in Artificial Intelligence at Sheffield Hallam University.
        </p>

        <p style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
          color: '#d1d5db',
          lineHeight: 1.7,
        }}>
          Currently I'm an{' '}
          <span style={{ color: '#F6CE6E', fontWeight: 600 }}>Automation &amp; Workflow Engineer at AdTecher</span>
          {' '}— an NVIDIA Inception Program startup. I don't just build software; I design autonomous systems that bridge the gap between human intent and machine execution.
        </p>
      </div>

      {/* Stat bar */}
      <div style={{
        marginTop: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}>
        {[
          { label: 'Speciality', value: 'AI Automation' },
          { label: 'Location', value: 'Sheffield, UK' },
          { label: 'Status', value: 'Available' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(0,242,255,0.04)',
            border: '1px solid rgba(0,242,255,0.12)',
            padding: '0.75rem 1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.55rem', color: 'rgba(0,242,255,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.78rem', color: '#F6CE6E', letterSpacing: '0.06em' }}>{value}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

