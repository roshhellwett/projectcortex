import './globals.css';

export const metadata = {
  title: 'ProjectCortex | Enterprise AI Browser Extension',
  description: 'The ultimate AI-powered browser extension for professionals. Context-aware AI, live fact-checking, and enterprise DRM.',
};

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="ambient-glow"></div>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 5%', alignItems: 'center', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Cortex Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
          <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '0.05em' }}>
            PROJECT<span style={{ color: 'var(--primary)' }}>CORTEX</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>Features</a>
          <a href="#how-it-works" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>How it Works</a>
          <a href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>Admin Vault</a>
          <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
            <button className="premium-button glow-btn" style={{ fontSize: '14px', padding: '10px 20px' }}>
              Download Now
            </button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', textAlign: 'center', padding: '100px 5% 60px 5%' }}>
        <div className="glass-panel animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', marginBottom: '32px', fontSize: '13px', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(0, 209, 255, 0.1)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 8px var(--primary)' }}></span>
          Version 2.2 Live
        </div>
        
        <h1 className="animate-fade-up delay-100" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: '900', margin: '0', lineHeight: '1.1', maxWidth: '900px', letterSpacing: '-0.02em' }}>
          Browse with an <br/><span className="enterprise-gradient-text" style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.1)' }}>Intelligent</span> <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(0, 209, 255, 0.4)' }}>Co-Pilot</span>.
        </h1>
        
        <p className="animate-fade-up delay-200" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: '#999', maxWidth: '650px', margin: '32px auto', lineHeight: '1.6' }}>
          ProjectCortex is an enterprise-grade Chrome extension that brings context-aware LLMs directly into your active tab. Summarize documents, extract data, and fact-check live text instantly.
        </p>
        
        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
            <button className="premium-button glow-btn" style={{ fontSize: '18px', padding: '18px 40px' }}>
              Download Extension
            </button>
          </a>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <button className="glass-panel" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', fontSize: '18px', padding: '18px 40px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.02)'}>
              Explore Features
            </button>
          </a>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', margin: '0 0 16px 0' }}>Enterprise Capabilities</h2>
          <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Built from the ground up for professionals who demand speed, accuracy, and absolute security.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          <div className="feature-card">
            <div style={{ width: '50px', height: '50px', background: 'rgba(0, 209, 255, 0.1)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px 0' }}>Context-Aware AI</h3>
            <p style={{ color: '#888', margin: '0', lineHeight: '1.6' }}>Highlight any text on any website to summarize it, explain complex topics, or instantly solve multiple-choice questions with 99% accuracy.</p>
          </div>

          <div className="feature-card">
            <div style={{ width: '50px', height: '50px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px 0' }}>Resilient AI Routing</h3>
            <p style={{ color: '#888', margin: '0', lineHeight: '1.6' }}>Never experience downtime. ProjectCortex automatically falls back between Groq and OpenRouter nodes if a rate limit is hit or a model goes offline.</p>
          </div>

          <div className="feature-card">
            <div style={{ width: '50px', height: '50px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px 0' }}>Cryptographic DRM Vault</h3>
            <p style={{ color: '#888', margin: '0', lineHeight: '1.6' }}>Secure, offline-capable licensing system. Admins can generate, track, and instantly revoke cryptographic license keys via the Next.js Command Center.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '100px 5%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', margin: '0 0 16px 0' }}>Seamless Integration</h2>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>How ProjectCortex transforms your workflow.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', position: 'relative' }}>
            <div>
              <div className="step-circle">1</div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Select Target Text</h4>
              <p style={{ color: '#888', lineHeight: '1.6' }}>Simply highlight any text, article, or question on your current webpage. A floating action bubble will instantly appear.</p>
            </div>
            <div>
              <div className="step-circle">2</div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Choose Action</h4>
              <p style={{ color: '#888', lineHeight: '1.6' }}>Click "Summarize", "Fact Check", or "Correct Answer". The extension securely parses the DOM context.</p>
            </div>
            <div>
              <div className="step-circle">3</div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Get Live Results</h4>
              <p style={{ color: '#888', lineHeight: '1.6' }}>Our ultra-fast LLM routing network processes the prompt and streams the formatted result back directly into your browser panel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: '1000px', margin: '100px auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', margin: '0 0 16px 0' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#888', fontSize: '1.2rem' }}>Get started with a trial or unlock the full power of ProjectCortex.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>7-Day Trial</h3>
            <p style={{ color: '#888', marginBottom: '30px', flex: 1, marginTop: '20px' }}>Experience the full power of Cortex for 7 days. Connect with us to get your temporary license key.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>✓ Instant Summarization</li>
              <li>✓ Live Fact Checking</li>
              <li>✓ Unlimited Basic Prompts</li>
            </ul>
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
              <button className="premium-button" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Request Trial Key</button>
            </a>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--primary)', background: 'rgba(0, 209, 255, 0.03)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderBottomLeftRadius: '12px', textTransform: 'uppercase' }}>Most Popular</div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: 'var(--primary)' }}>Enterprise</h3>
            <p style={{ color: '#888', marginBottom: '30px', flex: 1, marginTop: '20px' }}>Secure, permanent licensing for your entire team. Access to the DRM vault.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>✓ Everything in Trial</li>
              <li>✓ Permanent License Keys</li>
              <li>✓ Admin Dashboard Access</li>
              <li>✓ Priority Telegram Support</li>
            </ul>
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
              <button className="premium-button glow-btn" style={{ width: '100%' }}>Contact Sales</button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ textAlign: 'center', padding: '100px 5%' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '24px' }}>Ready to supercharge your workflow?</h2>
        <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
          <button className="premium-button glow-btn" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Download ProjectCortex Free
          </button>
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: '#000', padding: '40px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Cortex Logo" style={{ width: '24px', height: '24px', borderRadius: '4px', filter: 'grayscale(100%) brightness(200%)' }} />
              <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.05em', color: '#fff' }}>
                PROJECTCORTEX
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '13px', maxWidth: '300px' }}>The definitive enterprise browser extension for AI-assisted reading, research, and data extraction.</p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</strong>
              <a href="#features" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>Features</a>
              <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>Download Extension</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</strong>
              <a href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>DRM Vault Login</a>
              <a href="mailto:support@zenith.org" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#888'}>Support</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '13px' }}>
          <span>&copy; 2026 Zenith Open Source Projects. All rights reserved.</span>
          <span>Designed with ♥️ for Enterprise</span>
        </div>
      </footer>
    </main>
  );
}
