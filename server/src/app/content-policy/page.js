import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Content Policy & Acceptable Use | ProjectCortex',
  description: 'Ethical guidelines, prohibited activities, academic integrity safeguards, and acceptable use terms for ProjectCortex AI browser extension.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/content-policy',
  },
};

export default function ContentPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-deep)', marginBottom: '8px' }}>
            Acceptable Use & Ethical AI
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Content & Acceptable Use Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Guiding Safe, Transparent, and Responsible AI Interaction in the Web Browser
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Purpose & Guiding Principles</h2>
            <p>
              ProjectCortex provides advanced AI productivity, summarization, research, and analysis capabilities directly in your browser. We are committed to fostering a safe, legal, and ethical environment for all users, institutions, and content publishers. This Policy governs all interactions with ProjectCortex software, APIs, and connected inference models.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Permitted & Intended Uses</h2>
            <p>ProjectCortex is designed and licensed exclusively for:</p>
            <ul>
              <li><strong>Academic & Professional Research:</strong> Summarizing scientific literature, whitepapers, news reports, and documentation.</li>
              <li><strong>Coding & Engineering Support:</strong> Explaining complex codebase fragments, API documentation, and syntax troubleshooting.</li>
              <li><strong>Language & Literacy Assistance:</strong> Defining obscure terms, simplifying intricate jargon, and translating foreign text.</li>
              <li><strong>Personal Productivity:</strong> Digesting long-form articles, meeting transcripts, and educational lecture notes.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Prohibited Activities</h2>
            <p>You may not use ProjectCortex to engage in, foster, or facilitate any of the following activities:</p>
            <div className="prohibited-grid">
              <div className="prohibited-box">
                <div className="prohibited-badge">Prohibited</div>
                <h4>Malware & Cybersecurity Abuse</h4>
                <p>Generating exploit payloads, reverse engineering protected authentication barriers, or facilitating denial of service (DoS) attacks.</p>
              </div>
              <div className="prohibited-box">
                <div className="prohibited-badge">Prohibited</div>
                <h4>Live Proctored Exam Fraud</h4>
                <p>Using automated scraping or overlays to circumvent anti-cheating measures on accredited, live proctored certification or university exams.</p>
              </div>
              <div className="prohibited-box">
                <div className="prohibited-badge">Prohibited</div>
                <h4>Harassment & Hate Speech</h4>
                <p>Synthesizing abusive, defamatory, sexually explicit, or hateful content targeting protected classes or individuals.</p>
              </div>
              <div className="prohibited-box">
                <div className="prohibited-badge">Prohibited</div>
                <h4>Unauthorized Commercial Reselling</h4>
                <p>Reverse engineering license key algorithms, cracking activation mechanisms, or selling unauthorized clone distributions.</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Academic Integrity & Responsible Authorship</h2>
            <p>
              While ProjectCortex is an exceptional research accelerator, we advocate for the highest standards of scholastic integrity. Students, researchers, and professionals are expected to:
            </p>
            <ul>
              <li>Critically evaluate all AI-generated summaries and verify citations against primary source documents.</li>
              <li>Comply with their university or publisher guidelines regarding AI assistance disclosure.</li>
              <li>Avoid representing raw machine-generated output as unassisted original human scholarship.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Upstream Inference Model Provider Terms</h2>
            <p>
              When configuring API keys for Groq (Meta LLaMA, OpenAI GPT-OSS, Qwen) or OpenRouter (DeepSeek R1, Grok, Anthropic Claude), users remain additionally bound by the respective acceptable use policies of those model creators and inference hosts. ProjectCortex does not override or disable upstream safety guardrails.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Violations & License Revocation</h2>
            <p>
              Zenith Open Source Projects reserves the right to immediately terminate or revoke licenses, without prior notice or refund, for any account found in material violation of this Content Policy or applicable cyber law.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
