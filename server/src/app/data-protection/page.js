import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Data Protection & Security | DPDP Act 2023 & GDPR Compliance | ProjectCortex',
  description: 'Enterprise zero-knowledge security architecture, data minimization, and compliance with Indias Digital Personal Data Protection Act (DPDP Act) 2023.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/data-protection',
  },
};

export default function DataProtectionPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-deep)', marginBottom: '8px' }}>
            Zero-Knowledge Privacy • DPDP Act 2023
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Data Protection & Security
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Standard of Architecture for Client Privacy, Cryptographic Integrity, and Regulatory Compliance
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Zero-Knowledge Architecture</h2>
            <p>
              ProjectCortex is designed from inception with a <strong>Zero-Knowledge Client-Side Principle</strong>. When you highlight text, summarize a document, or ask questions regarding web content, the prompt is packaged locally inside your isolated browser sandbox and transmitted directly to your selected inference provider (Groq LPU or OpenRouter) via TLS 1.3 encryption.
            </p>
            <p>
              <strong>No prompt payload, webpage screenshot, or contextual highlight ever touches or gets stored on ProjectCortex database servers.</strong> ProjectCortex backend infrastructure exists exclusively for license key authentication and rate-limiting integrity.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Compliance with Digital Personal Data Protection (DPDP) Act, 2023 (India)</h2>
            <p>
              As a Data Fiduciary operating in compliance with India&apos;s landmark <strong>Digital Personal Data Protection Act, 2023</strong>:
            </p>
            <ul>
              <li><strong>Lawful Consent & Purpose Limitation:</strong> We collect only the minimum digital identifiers strictly necessary to activate your license (anonymous hardware ID hash and license token).</li>
              <li><strong>Right to Information:</strong> You have the right to request a summary of any metadata associated with your license key.</li>
              <li><strong>Right to Correction & Erasure:</strong> You may request complete unlinkage and erasure of your hardware ID from our licensing database at any time through our automated reset tool or by contacting the Grievance Officer.</li>
              <li><strong>No Commercial Profiling:</strong> We do not engage in behavioural tracking, user profiling, or advertising data brokerage.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Cryptographic Storage & Security Measures</h2>
            <p>
              To ensure state-of-the-art protection of license databases and authentication records:
            </p>
            <div className="security-grid">
              <div className="security-card">
                <div className="security-title">Encryption In-Transit</div>
                <div className="security-desc">All API handshakes enforce TLS 1.3 with forward secrecy. HTTP endpoints are strictly rejected with HSTS.</div>
              </div>
              <div className="security-card">
                <div className="security-title">Database AES-256 At-Rest</div>
                <div className="security-desc">License credentials and hashed install IDs are stored on encrypted PostgreSQL volumes hosted in secure cloud data centers.</div>
              </div>
              <div className="security-card">
                <div className="security-title">Local Key Sandboxing</div>
                <div className="security-desc">Your personal Groq or OpenRouter API keys remain stored exclusively in Chrome&apos;s sandboxed <code>chrome.storage.local</code> on your device.</div>
              </div>
              <div className="security-card">
                <div className="security-title">No Remote Executable Code</div>
                <div className="security-desc">Full compliance with Chrome Web Store Manifest V3: zero eval(), no dynamic external script loading, zero third-party telemetry scripts.</div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Data Retention Schedule</h2>
            <p>
              Our retention standards are strictly bounded:
            </p>
            <ul>
              <li><strong>License Records:</strong> Stored for the duration of the active subscription plus 90 days for support restoration, after which expired/unused records may be purged.</li>
              <li><strong>API Verification Logs:</strong> Ephemeral server access logs (install ID timestamp) rotate on a rolling 1,000-entry ceiling. Older entries are permanently deleted.</li>
              <li><strong>User Feedback:</strong> Retained only for software quality improvement; install IDs are optionally detached upon user request.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Exercising Your Data Protection Rights</h2>
            <p>
              To exercise your statutory rights under the DPDP Act 2023, GDPR, or CCPA (such as requesting deletion of your install ID or license records), contact our compliance office at <a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a>. Requests are verified and processed within 7 business days without fee.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
