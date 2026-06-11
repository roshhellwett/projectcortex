'use client';
import { useEffect } from 'react';
import './globals.css';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--background)' }}>
      <div className="ambient-mesh">
        <div className="ambient-orb-1"></div>
        <div className="ambient-orb-2"></div>
      </div>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 5%', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Cortex Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em', color: 'var(--foreground)' }}>
            Project<span style={{ color: 'var(--primary)' }}>Cortex</span>
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>How it Works</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Pricing</a>
          <a href="/guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Setup Guide</a>
          <a href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Admin</a>
          <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
            <button className="premium-button" style={{ fontSize: '14px', padding: '10px 22px' }}>
              Download
            </button>
          </a>
        </div>
        <div className="mobile-cta" style={{ display: 'none' }}>
          <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
            <button className="premium-button" style={{ fontSize: '13px', padding: '8px 16px' }}>Download</button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 5% 80px 5%' }}>
        <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '980px', marginBottom: '28px', fontSize: '13px', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.02em', background: 'var(--primary-light)', border: '1px solid rgba(0,113,227,0.15)' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>
          v2.2 Now Available
        </div>
        
        <h1 className="animate-fade-up delay-100" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: '700', margin: '0', lineHeight: '1.08', maxWidth: '800px', letterSpacing: '-0.04em', color: 'var(--foreground)' }}>
          Your browser,{' '}<br/>
          <span style={{ color: 'var(--primary)' }}>supercharged</span> with AI.
        </h1>
        
        <p className="animate-fade-up delay-200" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '580px', margin: '24px auto 0 auto', lineHeight: '1.5', fontWeight: '400' }}>
          Summarize documents. Fact-check claims. Answer questions. All without leaving your tab.
        </p>
        
        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
            <button className="premium-button glow-btn" style={{ fontSize: '17px', padding: '16px 36px' }}>
              Download Free
            </button>
          </a>
          <a href="/guide" style={{ textDecoration: 'none' }}>
            <button style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontSize: '17px', padding: '16px 20px', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity='0.7'} onMouseLeave={e => e.target.style.opacity='1'}>
              Setup Guide →
            </button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="reveal" style={{ maxWidth: '1080px', margin: '40px auto 100px auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '700', margin: '0 0 12px 0', letterSpacing: '-0.03em', color: 'var(--foreground)' }}>Built for professionals.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>Speed, accuracy, and absolute security — in every interaction.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="feature-card float-anim" style={{ animationDelay: '0s' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Context-Aware AI</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0', lineHeight: '1.5', fontSize: '15px' }}>Highlight any text to summarize, explain, or instantly solve multiple-choice questions.</p>
          </div>

          <div className="feature-card float-anim" style={{ animationDelay: '2s' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(52, 199, 89, 0.15)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(52, 199, 89, 0.3)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Resilient Routing</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0', lineHeight: '1.5', fontSize: '15px' }}>Automatic failover between Groq and OpenRouter. Zero downtime, always.</p>
          </div>

          <div className="feature-card float-anim" style={{ animationDelay: '4s' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255, 59, 48, 0.15)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 59, 48, 0.3)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Enterprise DRM</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0', lineHeight: '1.5', fontSize: '15px' }}>Cryptographic license keys with offline validation. Generate, track, and revoke from one dashboard.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="reveal" style={{ background: 'var(--surface)', padding: '100px 5%' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '700', margin: '0 0 12px 0', letterSpacing: '-0.03em', color: 'var(--foreground)' }}>Three steps. That's it.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>From highlight to insight in seconds.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="step-circle" style={{ margin: '0 auto 20px auto' }}>1</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Select Text</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '15px' }}>Highlight any content on any webpage. A floating action bar appears instantly.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="step-circle" style={{ margin: '0 auto 20px auto' }}>2</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Choose Action</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '15px' }}>Tap Summarize, Fact Check, or Correct Answer. The extension handles the rest.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="step-circle" style={{ margin: '0 auto 20px auto' }}>3</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Get Results</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '15px' }}>Formatted results stream directly into an elegant in-page panel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="reveal" style={{ maxWidth: '1080px', margin: '100px auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '700', margin: '0 0 12px 0', letterSpacing: '-0.03em', color: 'var(--foreground)' }}>Enterprise Licensing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Self-host the dashboard or use our cloud. Transparent pricing.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--foreground)' }}>7-Day Trial</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, marginTop: '8px', fontSize: '15px', lineHeight: '1.5' }}>Full access for 7 days. Connect with us to receive your license key.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--foreground)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Summarization</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Live Fact Checking</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Unlimited Prompts</li>
            </ul>
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
              <button style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)', borderRadius: '980px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.25s' }} onMouseEnter={e => {e.target.style.background='var(--primary)'; e.target.style.color='#fff'}} onMouseLeave={e => {e.target.style.background='transparent'; e.target.style.color='var(--primary)'}}>Request Trial</button>
            </a>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--primary)' }}>
            <div style={{ position: 'absolute', top: '0', right: '0', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '5px 14px', borderBottomLeftRadius: '12px', letterSpacing: '0.03em' }}>POPULAR</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--primary)' }}>Enterprise</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, marginTop: '8px', fontSize: '15px', lineHeight: '1.5' }}>Permanent licensing for your team with full admin dashboard access.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--foreground)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Everything in Trial</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Permanent Keys</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Admin Dashboard</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--primary)', fontWeight: '700' }}>✓</span> Priority Support</li>
            </ul>
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
              <button className="premium-button glow-btn" style={{ width: '100%' }}>Contact Sales</button>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '80px 5% 100px 5%', background: 'var(--surface)' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Ready to work smarter?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>Download ProjectCortex and experience the difference.</p>
        <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ textDecoration: 'none' }}>
          <button className="premium-button glow-btn" style={{ fontSize: '17px', padding: '16px 40px' }}>
            Download Free
          </button>
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 5%', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <img src="/logo.png" alt="Cortex Logo" style={{ width: '22px', height: '22px', borderRadius: '4px' }} />
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>ProjectCortex</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '280px', lineHeight: '1.5' }}>Enterprise AI browser extension for reading, research, and data extraction.</p>
          </div>
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ color: 'var(--foreground)', fontSize: '13px', letterSpacing: '0.02em' }}>Product</strong>
              <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Features</a>
              <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Pricing</a>
              <a href="/guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Setup Guide</a>
              <a href="https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Download</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ color: 'var(--foreground)', fontSize: '13px', letterSpacing: '0.02em' }}>Contact</strong>
              <a href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Admin Dashboard</a>
              <a href="mailto:zenithprojects@icloud.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>zenithprojects@icloud.com</a>
              <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Telegram</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1080px', margin: '32px auto 0 auto', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 Zenith Open Source Projects. All rights reserved.</span>
          <span>Designed for Enterprise</span>
        </div>
      </footer>
    </main>
  );
}
