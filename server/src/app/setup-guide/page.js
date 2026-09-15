'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import '../globals.css';

const faqs = [
  {
    q: 'Can I install ProjectCortex on Brave, Microsoft Edge, or Arc?',
    a: 'Yes! ProjectCortex is fully compatible with any Chromium-based browser including Google Chrome, Brave, Microsoft Edge, Arc, Opera, and Vivaldi. Simply click "Add to Chrome" from the Chrome Web Store in your respective browser.'
  },
  {
    q: 'How do I activate my license key?',
    a: 'After installing the extension, click the ProjectCortex icon in your browser toolbar. A sleek prompt will appear asking for your activation key (formatted as CORTEX-XXXX-XXX). Paste your key and click "Activate". Your hardware identifier will be linked and all AI features unlocked immediately.'
  },
  {
    q: 'How do I switch between Groq LPU and OpenRouter models?',
    a: 'Click the Cortex icon, navigate to Settings (gear icon), and select your desired Provider. Groq offers ultra-low-latency LPU inference (GPT-OSS 120B, Qwen 3.6, LLaMA 3.3), while OpenRouter gives access to frontier models like DeepSeek R1 and Grok 2.'
  },
  {
    q: 'What if I need to move my license to a new computer or laptop?',
    a: 'Your license key is bound to a single hardware install ID. If you change computers or reinstall your operating system, simply contact our 24/7 support channel on Telegram (@roshhellwett) or email zenithprojects@icloud.com to reset your hardware linkage instantly.'
  },
  {
    q: 'Does ProjectCortex collect my browsing history or prompts?',
    a: 'No. ProjectCortex operates under a strict Zero-Knowledge Client Architecture. Prompts are packaged in volatile client memory and sent directly via TLS 1.3 to your chosen AI gateway. No prompt text or browsing URLs are ever saved on ProjectCortex servers.'
  }
];

export default function SetupGuide() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      {/* Mouse Spotlight */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(212, 160, 23, 0.08), transparent 40%)`,
          transition: 'background 0.1s ease'
        }}
      />

      <SiteHeader />

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="guideBadgeRow">
            <span className="guideBadge">Official Web Store Guide</span>
            <span className="guideVerified">
              <span className="dotGreen" />
              1-Click Instant Install
            </span>
          </div>
          <h1 className="guideTitle">
            Install & Activate ProjectCortex
          </h1>
          <p className="guideSub">
            Get started in under 60 seconds directly from the Chrome Web Store. No complex sideloading, no developer mode required.
          </p>
          
          <div className="heroCtaRow">
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cwsInstallBtn"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
              <span>Add to Chrome • Free Web Store Install</span>
            </a>
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" className="licenseCtaBtn">
              Get Activation Key
            </a>
          </div>
        </div>

        {/* 3 Step Installation Walkthrough */}
        <div className="stepsContainer">
          {/* STEP 1 */}
          <div className="stepCard">
            <div className="stepHeader">
              <div className="stepNum">1</div>
              <div>
                <span className="stepSub">Chrome Web Store</span>
                <h2 className="stepTitle">Add ProjectCortex to Browser</h2>
              </div>
            </div>
            <p className="stepDesc">
              Visit the official Chrome Web Store listing page and click the blue <strong>&ldquo;Add to Chrome&rdquo;</strong> button. When prompted with the permission dialog, click <strong>&ldquo;Add extension&rdquo;</strong>.
            </p>
            <div className="stepVisual">
              <div className="stepBadge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Google Verified Manifest V3 Standard • Zero Remote Code • Safe & Audited</span>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="stepCard">
            <div className="stepHeader">
              <div className="stepNum">2</div>
              <div>
                <span className="stepSub">Browser Toolbar</span>
                <h2 className="stepTitle">Pin Cortex for 1-Click Access</h2>
              </div>
            </div>
            <p className="stepDesc">
              In the top-right corner of your browser toolbar, click the Extensions puzzle icon (<span style={{ fontSize: '16px' }}>🧩</span>), locate <strong>ProjectCortex</strong>, and click the <strong>Pin icon</strong> (<span style={{ fontSize: '16px' }}>📌</span>) so it stays visible for instant access.
            </p>
            <div className="shortcutTip">
              <div className="shortcutIcon">⚡</div>
              <div>
                <strong>Pro-Tip Keyboard Shortcut:</strong> You can open ProjectCortex on any active tab by pressing <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> (or customize shortcuts in <code>chrome://extensions/shortcuts</code>).
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="stepCard">
            <div className="stepHeader">
              <div className="stepNum">3</div>
              <div>
                <span className="stepSub">Instant Activation</span>
                <h2 className="stepTitle">Enter Your License Key & Select Model</h2>
              </div>
            </div>
            <p className="stepDesc">
              Click the newly pinned ProjectCortex icon. On the activation screen, paste your assigned license key (e.g. <code>CORTEX-XXXX-XXX</code>) and click <strong>Activate</strong>.
            </p>
            <div className="keyCardDemo">
              <div className="keyCardTop">
                <span className="keyCardTitle">ProjectCortex Activation</span>
                <span className="keyCardStatus">Ready</span>
              </div>
              <div className="keyCardInputFake">
                <code>CORTEX-7A2F-9B1</code>
                <span className="keyCardBtnFake">Activated ✓</span>
              </div>
              <p className="keyCardNote">
                Your key links securely to your device. Next, pick Groq LPU (GPT-OSS 120B) or OpenRouter (DeepSeek R1) in Settings and start summarizing!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ & Troubleshooting Accordion */}
        <div style={{ marginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber-deep)' }}>
              Help & Verification
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0', color: '#1a1a1a' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#666', fontSize: '14.5px', margin: 0 }}>
              Everything you need to know about installation, model gateways, and licensing.
            </p>
          </div>

          <div className="faqList">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className={`faqItem ${isOpen ? 'open' : ''}`}>
                  <button className="faqQuestion" onClick={() => toggleFaq(idx)} aria-expanded={isOpen}>
                    <span>{faq.q}</span>
                    <span className="faqToggleIcon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faqAnswer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Help CTA Card */}
        <div className="supportCard">
          <div className="supportContent">
            <h3>Need Live Assistance or Custom Enterprise Seats?</h3>
            <p>
              Our engineering and operations team is available around the clock. Contact us directly via Telegram or email for rapid onboarding.
            </p>
          </div>
          <div className="supportBtns">
            <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" className="btn primary">
              Telegram Support (@roshhellwett)
            </a>
            <a href="mailto:zenithprojects@icloud.com" className="btn ghost">
              Email Support Desk
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style jsx>{`
        .guideBadgeRow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .guideBadge {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #b8860b;
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .guideVerified {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          background: rgba(5, 150, 105, 0.1);
          border: 1px solid rgba(5, 150, 105, 0.25);
          padding: 4px 10px;
          border-radius: 20px;
        }

        .dotGreen {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        .guideTitle {
          font-size: clamp(2.4rem, 5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #1a1a1a;
          margin: 0 0 16px;
          line-height: 1.15;
        }

        .guideSub {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 32px;
        }

        .heroCtaRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .cwsInstallBtn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          background: #1a1a1a;
          color: #e1d7c2;
          font-weight: 700;
          font-size: 15px;
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .cwsInstallBtn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .licenseCtaBtn {
          display: inline-flex;
          align-items: center;
          padding: 14px 22px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #1a1a1a;
          font-weight: 600;
          font-size: 14.5px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .licenseCtaBtn:hover {
          background: #fff;
          transform: translateY(-1px);
        }

        /* Steps */
        .stepsContainer {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stepCard {
          background: rgba(245, 240, 232, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
        }

        .stepCard:hover {
          border-color: rgba(212, 160, 23, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
        }

        .stepHeader {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .stepNum {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #1a1a1a;
          color: #e1d7c2;
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stepSub {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b8860b;
        }

        .stepTitle {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 2px 0 0;
        }

        .stepDesc {
          font-size: 15px;
          line-height: 1.65;
          color: #444;
          margin: 0 0 20px;
        }

        .stepVisual {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 14px 18px;
        }

        .stepBadge {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .shortcutTip {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(212, 160, 23, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 13.5px;
          line-height: 1.55;
          color: #333;
        }

        .shortcutIcon {
          font-size: 18px;
          color: #d4a017;
        }

        kbd {
          background: #1a1a1a;
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          font-family: monospace;
        }

        .keyCardDemo {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 20px;
        }

        .keyCardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .keyCardTitle {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .keyCardStatus {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          background: rgba(5, 150, 105, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .keyCardInputFake {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 10px;
          padding: 8px 14px;
          margin-bottom: 10px;
        }

        .keyCardInputFake code {
          font-family: monospace;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .keyCardBtnFake {
          background: #059669;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .keyCardNote {
          font-size: 12.5px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        /* FAQ */
        .faqList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faqItem {
          background: rgba(245, 240, 232, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .faqItem.open {
          border-color: rgba(212, 160, 23, 0.4);
          background: rgba(245, 240, 232, 0.95);
        }

        .faqQuestion {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 18px 24px;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .faqToggleIcon {
          font-size: 20px;
          font-weight: 400;
          color: #b8860b;
        }

        .faqAnswer {
          padding: 0 24px 20px;
          font-size: 14px;
          line-height: 1.65;
          color: #555;
        }

        .faqAnswer p {
          margin: 0;
        }

        /* Support CTA */
        .supportCard {
          margin-top: 60px;
          background: #1a1a1a;
          color: #e1d7c2;
          border-radius: 20px;
          padding: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .supportContent h3 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 6px;
          color: #fff;
        }

        .supportContent p {
          font-size: 14px;
          color: #bbb;
          margin: 0;
          max-width: 500px;
          line-height: 1.5;
        }

        .supportBtns {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn.primary {
          background: #d4a017;
          color: #1a1a1a;
        }

        .btn.primary:hover {
          background: #e2b027;
        }

        .btn.ghost {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn.ghost:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 640px) {
          .stepCard {
            padding: 24px 20px;
          }
          .supportCard {
            padding: 24px 20px;
          }
          .supportBtns {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .btn {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
