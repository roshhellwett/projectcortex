import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Terms of Service | ProjectCortex',
  description: 'Enterprise terms of service, subscription validity, license grants, and fair use conditions for ProjectCortex AI browser extension.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/terms',
  },
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-deep)', marginBottom: '8px' }}>
            Agreement & License Grant
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Standard Enterprise Agreement • Governing Use of ProjectCortex Software & APIs
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By installing, downloading, activating, or accessing the ProjectCortex browser extension or associated backend services provided by Zenith Open Source Projects (&ldquo;Zenith&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be legally bound by these Terms of Service. If you do not agree to these terms, do not install or use ProjectCortex.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. License Grant & Device Authorization</h2>
            <p>
              Subject to valid license key activation, Zenith grants you a revocable, non-exclusive, non-transferable, limited personal license to install and execute ProjectCortex in accordance with these conditions:
            </p>
            <ul>
              <li><strong>Single-Device Hardware Binding:</strong> Unless an enterprise multi-seat license is explicitly contracted, each license key binds cryptographically to a single hardware installation ID. Moving a license to a replacement machine requires resetting the hardware link via official support or self-service tools.</li>
              <li><strong>Duration & Expiration:</strong> Each license is granted for a specific duration (e.g. 30, 90, or 365 days). Validity begins upon initial client-side activation. When the duration elapses, the license enters expired status unless extended.</li>
              <li><strong>No Reverse Engineering:</strong> You agree not to decompile, reverse engineer, disassemble, modify, create derivative works from, or circumvent the proprietary activation or license verification logic of ProjectCortex.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Third-Party Inference & Model Usage</h2>
            <p>
              ProjectCortex functions as a client-side interface orchestrating AI queries to third-party endpoints including Groq LPU and OpenRouter. You acknowledge that:
            </p>
            <ul>
              <li>You are solely responsible for obtaining and maintaining valid API credentials from supported providers if using self-provided key configurations.</li>
              <li>AI models may occasionally generate inaccurate, incomplete, or speculative outputs (&ldquo;hallucinations&rdquo;). ProjectCortex does not warrant the factual correctness of AI responses.</li>
              <li>Users must independently verify critical medical, legal, financial, or academic conclusions.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Disclaimers & Limitation of Liability</h2>
            <p>
              PROJECTCORTEX IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW IN INDIA AND INTERNATIONAL JURISDICTIONS, ZENITH OPEN SOURCE PROJECTS AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, GOODWILL, REVENUE, OR SERVICE INTERRUPTIONS ARISING FROM USE OF THE EXTENSION.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the substantive laws of the <strong>Republic of India</strong>, without giving effect to any principles of conflicts of law. Any legal proceeding or dispute arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in <strong>New Delhi, India</strong>.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Support & Inquiries</h2>
            <p>
              For enterprise licensing, custom institutional arrangements, or inquiries concerning these Terms, contact our legal desk at <a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a> or message <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer">@roshhellwett on Telegram</a>.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
