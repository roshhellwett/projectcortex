// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

'use client';
import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      document.querySelectorAll('.card, .feature-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      document.body.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      {/* Global Mouse Spotlight */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 9998,
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(212, 160, 23, 0.08), transparent 40%)`,
          transition: 'background 0.1s ease'
        }}
      />

      {/* Navigation */}
      <nav className="navbar-wrapper">
        <div className="navbar-inner">
          <a href="#" className="logo-circle" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <img src="/logo.png" alt="Cortex Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          </a>
          
          <div className="nav-links-pill">
            <a href="#" className="active">Home</a>
            <a href="#features">Features</a>
            <a href="/setup-guide">Setup Guide</a>
            <a href="https://t.me/roshhellwett">Pricing</a>
          </div>
          
          <a href="https://t.me/roshhellwett" className="nav-btn">Get License</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container hero-section reveal">
        <div className="hero-content">
          <div className="hero-subtitle">ProjectCortex Enterprise</div>
          <h1 className="hero-title">Your personal AI assistant, right inside your browser.</h1>
          <a href="https://drive.google.com/drive/folders/19xYd3LPdYIJ3fpsCbbUkMH5IzndQpS6b" className="btn-primary">Get Extension</a>
          
          <div className="social-links">
            <a href="https://t.me/roshhellwett" className="social-icon" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </a>
            <a href="https://github.com/roshhellwett" className="social-icon" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://linkedin.com/in/roshhellwett" className="social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
          
          {/* Scroll Indicator */}
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6, animation: 'bounce 2s infinite' }}>
            <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#1a1a1a' }}>Scroll</span>
            <div style={{ width: '20px', height: '32px', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', justifyContent: 'center', padding: '4px' }}>
              <div style={{ width: '4px', height: '6px', background: '#1a1a1a', borderRadius: '2px', animation: 'scrollWheel 1.5s infinite' }}></div>
            </div>
          </div>

        </div>
        <div className="hero-image">
          <div className="mockup-container">
            <div className="mockup-header">
              <div className="mockup-brand">
                <img src="/logo.png" alt="Cortex Logo" />
                <span className="mockup-title">Cortex</span>
                <span className="mockup-badge">AI</span>
              </div>
              <div className="mockup-close">×</div>
            </div>
            
            <div className="mockup-section">
              <div className="mockup-section-title muted">AI ASSISTANT</div>
              <div className="mockup-text-muted">ProjectCortex | Enterprise AI Browser Extension</div>
            </div>
            
            <div className="mockup-section">
              <div className="mockup-section-title">QUICK ACTIONS</div>
              <div className="mockup-grid">
                <div className="mockup-btn">🎯 Correct Answer</div>
                <div className="mockup-btn">🔍 Fact Check</div>
                <div className="mockup-btn">📄 Summarize</div>
                <div className="mockup-btn">📖 Define</div>
              </div>
              <div className="mockup-btn full">⚙️ Settings</div>
            </div>
            
            <div className="mockup-section" style={{ borderBottom: 'none', paddingBottom: '24px' }}>
              <div className="mockup-section-title">ASK ABOUT PAGE</div>
              <div className="mockup-text-muted">Type a question related to this page in the field below.</div>
              <div className="mockup-input-wrapper">
                <input type="text" className="mockup-input" placeholder="Type to ask AI..." disabled />
                <div className="mockup-send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Services) */}
      <section id="features" className="container reveal">
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">Everything you need, directly on the page</p>
        </div>
        
        <div className="services-grid">
          <div className="card">
            <h3 className="card-title">Highlight & Ask</h3>
            <p className="card-desc">Just select any text on your screen and click to summarize, explain, or rewrite it using top-tier AI models.</p>
            <div className="tags-container">
              <div className="tag">Document Summarization</div>
              <div className="tag">Live Fact-Checking</div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Instant Test Helper</h3>
            <p className="card-desc">Stuck on a multiple-choice question? Cortex reads the options directly from the page and highlights the correct answer for you.</p>
            <div className="tags-container">
              <div className="tag">Instant Answers</div>
              <div className="tag">High Accuracy</div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Always Online</h3>
            <p className="card-desc">We automatically route your requests between Groq and OpenRouter. If one API goes down, the other takes over instantly.</p>
            <div className="tags-container">
              <div className="tag">Groq Integration</div>
              <div className="tag">OpenRouter Backup</div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Your Own License Key</h3>
            <p className="card-desc">No complicated setups. Buy a license key, activate the extension in your browser, and it&apos;s yours to use securely.</p>
            <div className="tags-container">
              <div className="tag">JWT Verification</div>
              <div className="tag">Zero-Touch Management</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (About Me) */}
      <section id="how-it-works" className="container reveal" style={{ marginTop: '40px' }}>
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
        </div>
        
        <p className="about-desc">
          It&apos;s simple: install the extension, activate your license key, and you&apos;re good to go. The AI interface floats discreetly over your current webpage. No clunky sidebars, no copying and pasting into other tabs—just fast, accurate answers exactly when you need them.
        </p>
        
        <div className="showcase-grid">
          {/* Mockup 1: Summary */}
          <div className="mockup-container flat">
            <div className="mockup-header">
              <div className="mockup-brand">
                <img src="/logo.png" alt="Cortex Logo" />
                <span className="mockup-title">Cortex</span>
                <span className="mockup-badge">AI</span>
              </div>
              <div className="mockup-close">×</div>
            </div>
            <div className="mockup-section" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px' }}>
              <div className="mockup-section-title muted" style={{ marginBottom: '4px' }}>AI ASSISTANT</div>
              <div className="mockup-text-muted">React Documentation</div>
            </div>
            <div className="mockup-body-scroll">
              <div className="mockup-top-bar">
                <div className="mockup-status"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> SELECTION SUMMARY</div>
                <div className="mockup-back-btn">← Back</div>
              </div>
              <div className="mockup-paragraph"><strong>Understanding React Hooks</strong>Hooks are functions that let you &quot;hook into&quot; React state and lifecycle features from function components. They don&apos;t work inside classes.</div>
              <div className="mockup-paragraph" style={{ marginTop: 'auto' }}><strong>Rules of Hooks</strong>Only call Hooks at the top level. Don&apos;t call Hooks inside loops, conditions, or nested functions.</div>
            </div>
            <div className="mockup-footer">
              <div className="mockup-input-wrapper" style={{ marginTop: 0 }}>
                <input type="text" className="mockup-input" placeholder="Type to ask AI..." disabled />
                <div className="mockup-send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup 2: MCQ Solver */}
          <div className="mockup-container flat">
            <div className="mockup-header">
              <div className="mockup-brand">
                <img src="/logo.png" alt="Cortex Logo" />
                <span className="mockup-title">Cortex</span>
                <span className="mockup-badge">AI</span>
              </div>
              <div className="mockup-close">×</div>
            </div>
            <div className="mockup-section" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px' }}>
              <div className="mockup-section-title muted" style={{ marginBottom: '4px' }}>AI ASSISTANT</div>
              <div className="mockup-text-muted">AWS Certification Quiz</div>
            </div>
            <div className="mockup-body-scroll">
              <div className="mockup-top-bar">
                <div className="mockup-status"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ANSWER FOUND</div>
                <div className="mockup-back-btn">← Back</div>
              </div>
              <div className="mockup-question">Which AWS service should you use to run a serverless application without managing infrastructure?</div>
              <div className="mockup-option">
                <div className="mockup-option-label">A</div>
                Amazon EC2
              </div>
              <div className="mockup-option correct">
                <div className="mockup-option-label">B</div>
                AWS Lambda
              </div>
              <div className="mockup-option">
                <div className="mockup-option-label">C</div>
                Amazon S3
              </div>
            </div>
            <div className="mockup-footer">
              <div className="mockup-input-wrapper" style={{ marginTop: 0 }}>
                <input type="text" className="mockup-input" placeholder="Type to ask AI..." disabled />
                <div className="mockup-send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup 3: Definition */}
          <div className="mockup-container flat">
            <div className="mockup-header">
              <div className="mockup-brand">
                <img src="/logo.png" alt="Cortex Logo" />
                <span className="mockup-title">Cortex</span>
                <span className="mockup-badge">AI</span>
              </div>
              <div className="mockup-close">×</div>
            </div>
            <div className="mockup-section" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px' }}>
              <div className="mockup-section-title muted" style={{ marginBottom: '4px' }}>AI ASSISTANT</div>
              <div className="mockup-text-muted">GitHub Pull Request</div>
            </div>
            <div className="mockup-body-scroll">
              <div className="mockup-top-bar">
                <div className="mockup-status"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> DEFINITION</div>
                <div className="mockup-back-btn">← Back</div>
              </div>
              <div className="mockup-paragraph"><strong>Definition: Polymorphism</strong>In programming, polymorphism refers to the ability of a variable, function, or object to take on multiple forms. It allows entities of different types to be treated as instances of the same class.</div>
              <div className="mockup-paragraph" style={{ marginTop: 'auto' }}><strong>Context</strong>This concept is heavily used in Object-Oriented design patterns to improve code reusability...</div>
            </div>
            <div className="mockup-footer">
              <div className="mockup-input-wrapper" style={{ marginTop: 0 }}>
                <input type="text" className="mockup-input" placeholder="Type to ask AI..." disabled />
                <div className="mockup-send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>



      {/* Footer */}
      <footer className="footer-section reveal">
        <div className="container footer-content">
          <div className="footer-brand">
            <img src="/logo.png" alt="Cortex Logo" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
            <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>ProjectCortex</span>
          </div>
          <div className="footer-links">
            <a href="https://t.me/roshhellwett">Telegram</a>
            <a href="https://github.com/roshhellwett/projectcortex">GitHub</a>
            <a href="mailto:zenithprojects@icloud.com">Contact</a>
          </div>
          <div className="footer-copy">
            &copy; 2026 Zenith Open Source Projects. Built by roshhellwett.
          </div>
        </div>
      </footer>
    </main>
  );
}
