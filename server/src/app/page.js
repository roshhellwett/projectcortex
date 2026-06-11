import './globals.css';

export const metadata = {
  title: 'ProjectCortex - Enterprise AI Extension',
  description: 'The ultimate AI-powered browser extension for professionals.',
};

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="ambient-glow"></div>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 48px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            PROJECT<span style={{ color: 'var(--primary)' }}>CORTEX</span>
          </span>
        </div>
        <a href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Admin Login</a>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', textAlign: 'center', padding: '100px 20px 0 20px' }}>
        <div className="glass-panel animate-fade-up" style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '30px', marginBottom: '24px', fontSize: '13px', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ✨ Version 2.2 Now Live
        </div>
        
        <h1 className="animate-fade-up delay-100" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', margin: '0', lineHeight: '1.1', maxWidth: '800px' }}>
          Supercharge your browser with <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(0, 209, 255, 0.4)' }}>Intelligent AI</span>.
        </h1>
        
        <p className="animate-fade-up delay-200" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#888', maxWidth: '600px', margin: '30px auto', lineHeight: '1.6' }}>
          Instantly summarize long articles, fact-check dubious claims, and answer complex questions without ever leaving your current tab.
        </p>
        
        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          <button className="premium-button" style={{ fontSize: '16px', padding: '16px 32px' }}>
            Download Extension
          </button>
          <a href="mailto:developer@example.com" style={{ textDecoration: 'none' }}>
            <button className="glass-panel" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontSize: '16px', padding: '16px 32px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
              Contact Sales
            </button>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: '1000px', margin: '100px auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: '0 20px' }}>
        {[
          { title: 'Instant Summarization', desc: 'Distill 10,000 word articles into 3 bullet points in under 2 seconds.' },
          { title: 'Live Fact-Checking', desc: 'Highlight any claim and verify it against real-time data.' },
          { title: 'Military-Grade Security', desc: 'Your API keys are encrypted locally. The code is obfuscated and tamper-proof.' }
        ].map((feat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '30px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(0, 209, 255, 0.1)', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }}></div>
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{feat.title}</h3>
            <p style={{ color: '#888', margin: '0', lineHeight: '1.5' }}>{feat.desc}</p>
          </div>
        ))}
      </section>

      <footer style={{ textAlign: 'center', padding: '40px', borderTop: '1px solid var(--border)', color: '#555', fontSize: '14px' }}>
        &copy; 2026 Zenith Open Source Projects. All rights reserved.
      </footer>
    </main>
  );
}
