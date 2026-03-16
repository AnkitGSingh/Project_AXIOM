'use client';

const skillCategories = [
  {
    title: 'AI / ML',
    skills: ['Python', 'LangChain', 'AWS Bedrock', 'Deep Learning', 'RAG']
  },
  {
    title: 'Frontend',
    skills: ['TypeScript', 'React', 'Next.js 14', 'Three.js / R3F', 'Tailwind CSS']
  },
  {
    title: 'Backend',
    skills: ['FastAPI', 'Node.js', 'PostgreSQL', 'API Design']
  },
  {
    title: 'DevOps & Tools',
    skills: ['Docker', 'GitHub Actions', 'Vercel', 'Git']
  }
];

export function Skills() {
  return (
    <div style={{ padding: '2rem 2rem 3rem' }}>

      <h2 style={{
        fontFamily: 'var(--font-orbitron)',
        color: '#F6CE6E',
        fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
        marginBottom: '2rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        TECHNICAL_SPECS
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {skillCategories.map((category) => (
          <div
            key={category.title}
            style={{
              background: '#00141e',
              border: '1px solid rgba(246,206,110,0.25)',
              padding: '1.25rem',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '0.72rem',
              color: '#00F2FF',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(0,242,255,0.15)',
            }}>
              {category.title}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {category.skills.map(skill => (
                <span
                  key={skill}
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.62rem',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid #374151',
                    color: '#d1d5db',
                    padding: '3px 8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
