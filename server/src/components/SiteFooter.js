import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="master-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <img src="/logo.png" alt="ProjectCortex Logo" className="footer-logo" />
              <div>
                <span className="brand-name">ProjectCortex</span>
                <span className="brand-tagline">Enterprise AI Browser Extension</span>
              </div>
            </div>
            <p className="footer-mission">
              Transforming how professionals, engineers, and researchers interact with the live web through high-speed LPU inference, multi-engine routing, and zero-knowledge client privacy.
            </p>
            <div className="footer-social-row">
              <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="Telegram Community">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                <span>Telegram</span>
              </a>
              <a href="https://github.com/roshhellwett/projectcortex" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="GitHub Repository">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span>GitHub</span>
              </a>
              <a href="mailto:zenithprojects@icloud.com" className="social-pill" aria-label="Email Support">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>Email</span>
              </a>
            </div>
            <div className="store-badge-row">
              <span className="cws-verified-badge">
                <span className="cws-dot" />
                Chrome Web Store Verified • MV3
              </span>
            </div>
          </div>

          {/* Column 2: Product & Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product & Setup</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home & Overview</Link></li>
              <li><Link href="/#features">Core Features</Link></li>
              <li><Link href="/setup-guide">Chrome Web Store Setup Guide</Link></li>
              <li><a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer">Licensing & Activation Keys</a></li>
              <li><Link href="/sitemap.xml">XML Search Engine Sitemap</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & India Compliance */}
          <div className="footer-col">
            <h4 className="footer-col-title">Compliance & Legal</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/dmca">DMCA & Copyright Notice</Link></li>
              <li><Link href="/grievance">Grievance Redressal (Govt of India)</Link></li>
              <li><Link href="/content-policy">Content & Acceptable Use Policy</Link></li>
              <li><Link href="/data-protection">Data Protection (DPDP Act 2023)</Link></li>
            </ul>
          </div>

          {/* Column 4: AI Engines & Operations */}
          <div className="footer-col">
            <h4 className="footer-col-title">Engines & Operations</h4>
            <ul className="footer-links-list">
              <li><span className="engine-link">Groq LPU (GPT-OSS 120B, Qwen 3.6)</span></li>
              <li><span className="engine-link">OpenRouter (DeepSeek R1, Grok 2)</span></li>
              <li><Link href="/admin">Operations Console</Link></li>
              <li><a href="mailto:zenithprojects@icloud.com">Official Grievance Officer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            &copy; {new Date().getFullYear()} Zenith Open Source Projects. Built with pride by <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer">roshhellwett</a>.
          </div>
          <div className="legal-disclaimer-note">
            Compliant with Government of India Information Technology (Intermediary Guidelines) Rules, 2021 & Digital Personal Data Protection Act, 2023.
          </div>
        </div>
      </div>
    </footer>
  );
}
