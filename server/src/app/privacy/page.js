import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy | Chrome Web Store Compliant | ProjectCortex',
  description: 'Official Chrome Web Store and global privacy policy for ProjectCortex AI browser extension detailing permissions, zero telemetry, and client privacy.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--emerald)', marginBottom: '8px' }}>
            Transparency & Security
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Last Updated: September 2026 • Official Chrome Web Store Disclosure
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Single Purpose Declaration</h2>
            <p>
              ProjectCortex is an enterprise AI browser extension built for professionals, students, and researchers. Its <strong>single purpose</strong> is to provide on-demand, contextual AI assistance—including text summarization, definition lookup, live fact-checking, and page analysis—directly within the active browser tab upon explicit user invocation.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Strict Privacy Commitments</h2>
            <div className="pledge-grid">
              <div className="pledge-card">
                <div className="pledge-icon">🛡️</div>
                <div className="pledge-title">No Sale of Personal Data</div>
                <div className="pledge-desc">We never sell, monetize, broker, or trade user data, browsing activity, or telemetry to third parties.</div>
              </div>
              <div className="pledge-card">
                <div className="pledge-icon">🔒</div>
                <div className="pledge-title">Zero Browsing History Storage</div>
                <div className="pledge-desc">No browsing URLs, page contents, or text selections are ever retained on ProjectCortex servers.</div>
              </div>
              <div className="pledge-card">
                <div className="pledge-icon">🚫</div>
                <div className="pledge-title">No Remote Executable Code</div>
                <div className="pledge-desc">Strictly adheres to Manifest V3. All logic is packaged inside the extension archive without external scripts.</div>
              </div>
              <div className="pledge-card">
                <div className="pledge-icon">⚡</div>
                <div className="pledge-title">Direct Client-to-LPU In-Flight</div>
                <div className="pledge-desc">Inference prompts stream directly from your browser to Groq or OpenRouter via encrypted TLS 1.3 channels.</div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Browser Permissions & Justifications</h2>
            <p>ProjectCortex requests only the minimal permissions required for core utility:</p>
            <table className="perm-table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Statutory & Technical Justification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>activeTab</code></td>
                  <td>Grants temporary access to read the currently active webpage only when the user highlights text or triggers the Cortex toolbar icon. No background tab snooping.</td>
                </tr>
                <tr>
                  <td><code>storage</code></td>
                  <td>Allows saving your license key, model preferences, and personal API keys locally on your device via <code>chrome.storage.local</code>.</td>
                </tr>
                <tr>
                  <td><code>alarms</code></td>
                  <td>Enables periodic background interval checks (e.g. daily license validity verification).</td>
                </tr>
                <tr>
                  <td><code>contextMenus</code></td>
                  <td>Adds right-click shortcuts (&ldquo;Summarize with Cortex&rdquo;, &ldquo;Explain selection&rdquo;) for rapid workflow access.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <h2>4. Information We Collect & Process</h2>
            <p>We process only two categories of minimal information:</p>
            <ul>
              <li><strong>License Authentication Data:</strong> When activating, the extension sends your license key (e.g. <code>CORTEX-XXXX-XXX</code>) and a one-way hashed hardware identifier (UUID derived from browser install metadata). This is strictly used to enforce single-device license locking and prevent mass piracy.</li>
              <li><strong>Anonymous Error & Feedback Submissions (Optional):</strong> If you explicitly submit feedback or error reports via the extension popup, your message and star rating are recorded to improve software reliability.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Third-Party AI Inference Providers</h2>
            <p>
              When invoking AI analysis, prompts are forwarded to the inference gateway configured in your settings:
            </p>
            <ul>
              <li><strong>Groq:</strong> Subject to <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Groq Privacy Policy</a>. Groq does not use customer API inputs to train models.</li>
              <li><strong>OpenRouter:</strong> Subject to <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer">OpenRouter Privacy Policy</a>. Data is routed directly to the selected model provider (e.g. DeepSeek, Meta, Mistral).</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Contact Privacy & Grievance Officer</h2>
            <p>
              For inquiries, data erasure requests, or privacy compliance questions under Indian DPDP Act 2023 or global frameworks, email our designated privacy team at <a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a>.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
