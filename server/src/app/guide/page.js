'use client';
import { useEffect, useRef } from 'react';
import '../globals.css';
import LiveBackground from '../../components/LiveBackground';

export default function Guide() {
  const mainRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mainRef.current) {
        mainRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        mainRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <main ref={mainRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--background)' }}>
      <LiveBackground />
      <div className="spotlight"></div>
      <div className="ambient-mesh">
        <div className="ambient-orb-1"></div>
        <div className="ambient-orb-2"></div>
      </div>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 5%', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Cortex Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em', color: 'var(--foreground)' }}>
            Project<span style={{ color: 'var(--primary)' }}>Cortex</span>
          </span>
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="/guide" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Setup Guide</a>
          <a href="/#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Pricing</a>
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

      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 5% 120px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="enterprise-gradient-text" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: '700', margin: '0 0 16px 0', letterSpacing: '-0.03em' }}>
            Setup Guide
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Follow these simple steps to install and activate ProjectCortex in your browser.
          </p>
        </div>

        {/* Demo Video */}
        <div className="reveal" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 60px rgba(138, 43, 226, 0.15)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', marginBottom: '60px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', zIndex: 10 }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', border: '1px solid rgba(0,0,0,0.1)' }}></div>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', border: '1px solid rgba(0,0,0,0.1)' }}></div>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', border: '1px solid rgba(0,0,0,0.1)' }}></div>
          </div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ width: '100%', height: 'auto', display: 'block', paddingTop: '40px' }}
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Step 1 */}
          <div className="feature-card reveal float-anim" style={{ animationDelay: '0s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '18px', border: '1px solid rgba(138,43,226,0.3)' }}>1</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>Download & Prepare</h2>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px', paddingLeft: '24px', margin: 0 }}>
              <li><strong>Download</strong> the project `.zip` file using the button in the top right.</li>
              <li><strong>Extract</strong> the downloaded `.zip` file to a folder.</li>
              <li>Inside, you will find a folder named <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--foreground)' }}>projectcortex-main</code>.</li>
              <li><strong>Rename</strong> that folder exactly to: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)' }}>projectcortex</code>.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="feature-card reveal float-anim" style={{ animationDelay: '1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '18px', border: '1px solid rgba(138,43,226,0.3)' }}>2</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>Relocate to C: Drive</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px', margin: '0 0 16px 0' }}>
              Move the renamed <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--foreground)' }}>projectcortex</code> folder into your root <strong>C:\ drive</strong>. 
            </p>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span style={{ color: '#a1a1aa', fontSize: '14px', fontFamily: 'monospace' }}>C:\projectcortex</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="feature-card reveal float-anim" style={{ animationDelay: '2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '18px', border: '1px solid rgba(138,43,226,0.3)' }}>3</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>Browser Installation</h2>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px', paddingLeft: '24px', margin: 0 }}>
              <li>Open your Chromium-based browser (Chrome, Edge, Brave, etc).</li>
              <li>Go to the <strong>Extensions Settings</strong> page (e.g., <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>chrome://extensions</code>).</li>
              <li>Turn ON <strong>Developer Mode</strong> (usually a toggle in the top right corner).</li>
              <li>Click the <strong>Load unpacked</strong> button.</li>
              <li>Select the <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>C:\projectcortex</code> folder.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="feature-card reveal float-anim" style={{ animationDelay: '3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '18px', border: '1px solid rgba(138,43,226,0.3)' }}>4</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>Configuration & Activation</h2>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px', paddingLeft: '24px', margin: 0 }}>
              <li>Click the <strong>Extensions puzzle icon</strong> in your browser toolbar and pin ProjectCortex.</li>
              <li>Click the ProjectCortex icon and select <strong>Settings</strong>.</li>
              <li>Enter your Activation Key.</li>
              <li>Select your preferred AI Model and behavior settings.</li>
              <li>Turn ON the main <strong>Toggle button</strong> to enable the extension.</li>
              <li><strong>Restart your browser</strong> to ensure the background services initialize properly.</li>
            </ul>
          </div>

        </div>

        {/* Troubleshooting Fallback */}
        <div className="reveal" style={{ marginTop: '80px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 59, 48, 0.02) 100%)', border: '1px solid rgba(255, 59, 48, 0.3)', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 30px rgba(255, 59, 48, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255, 59, 48, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff3b30', margin: 0, letterSpacing: '-0.02em' }}>Troubleshooting</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
              If ProjectCortex isn't appearing or working on a webpage after installation, follow these quick steps:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#ff3b30', fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>STEP A</div>
                <div style={{ color: 'var(--foreground)', fontSize: '15px', lineHeight: '1.5' }}>Click the extension icon in the toolbar and go to <strong>Settings</strong>.</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#ff3b30', fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>STEP B</div>
                <div style={{ color: 'var(--foreground)', fontSize: '15px', lineHeight: '1.5' }}><strong>Refresh</strong> the Settings page to ensure data is synced.</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#ff3b30', fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>STEP C</div>
                <div style={{ color: 'var(--foreground)', fontSize: '15px', lineHeight: '1.5' }}>Turn the master <strong>Toggle ON</strong> again.</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#ff3b30', fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>STEP D</div>
                <div style={{ color: 'var(--foreground)', fontSize: '15px', lineHeight: '1.5' }}><strong>Refresh the web page</strong> you are trying to use it on (do not restart the browser).</div>
              </div>
            </div>
          </div>
        </div>
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
              <a href="/#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Features</a>
              <a href="/#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--foreground)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Pricing</a>
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
          <span>&copy; {new Date().getFullYear()} ProjectCortex.</span>
          <span>Idea of <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>roshhellwett</a></span>
        </div>
      </footer>
    </main>
  );
}
