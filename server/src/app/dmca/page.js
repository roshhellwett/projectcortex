import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'DMCA & Copyright Compliance Policy | ProjectCortex',
  description: 'Digital Millennium Copyright Act (DMCA) notice and Indian Copyright Act 1957 compliance details for ProjectCortex AI browser extension.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/dmca',
  },
};

export default function DmcaPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-deep)', marginBottom: '8px' }}>
            Intellectual Property & Fair Dealing
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            DMCA & Copyright Compliance
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Effective Date: January 1, 2026 • Last Reviewed: September 2026
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Statement of Principle</h2>
            <p>
              ProjectCortex, an initiative under Zenith Open Source Projects (&ldquo;ProjectCortex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), respects the intellectual property rights of creators, publishers, and content owners worldwide. We comply fully with the <strong>Digital Millennium Copyright Act (17 U.S.C. § 512)</strong> (&ldquo;DMCA&rdquo;) as well as the <strong>Indian Copyright Act, 1957 (as amended)</strong>, specifically safe harbor provisions and fair dealing exemptions under Section 52.
            </p>
            <p>
              ProjectCortex operates strictly as a client-side browser extension and local AI augmentation tool. It does not host, index, mirror, or publicly retransmit copyright-protected content on proprietary servers. All webpage text processing occurs transiently in client volatile memory upon explicit user invocation.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Safe Harbor & Fair Dealing (Section 52, Indian Copyright Act)</h2>
            <p>
              Under Section 52(1)(a) of the Indian Copyright Act, 1957, fair dealing with any work for the purpose of private or personal use, including research, criticism, or review, does not constitute an infringement of copyright. ProjectCortex provides tools to assist users in reading, reviewing, and analyzing public text already legitimately accessed by the user in their own web browser.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. DMCA Notice of Claimed Infringement</h2>
            <p>
              If you are a copyright owner or an agent authorized to act on their behalf, and you believe that any material or software distributed via ProjectCortex infringes upon your copyright, you may submit a formal notification to our Designated Copyright Agent with the following statutory requirements:
            </p>
            <ul>
              <li><strong>Physical or electronic signature</strong> of the person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed, or a representative list if multiple works are covered.</li>
              <li><strong>Identification of the material</strong> claimed to be infringing or to be the subject of infringing activity, with reasonably sufficient information to permit us to locate the material (such as exact URLs or file paths).</li>
              <li><strong>Your contact information</strong>, including your full name, legal mailing address, telephone number, and official email address.</li>
              <li><strong>A good faith statement</strong> that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li><strong>A statement under penalty of perjury</strong> that the information in the notification is accurate, and that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Designated Copyright Agent Contact</h2>
            <div className="contact-box">
              <strong>Zenith Open Source Projects — Copyright Compliance Office</strong><br />
              Attn: Designated DMCA Agent<br />
              Email: <a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a><br />
              Jurisdiction: Republic of India<br />
              Official Repository: <a href="https://github.com/roshhellwett/projectcortex" target="_blank" rel="noopener noreferrer">github.com/roshhellwett/projectcortex</a>
            </div>
          </section>

          <section className="legal-section">
            <h2>5. Counter-Notification Procedures</h2>
            <p>
              If you believe that your content or key was removed or disabled as a result of mistake or misidentification, you may submit a counter-notification in writing to our Designated Agent containing:
            </p>
            <ul>
              <li>Your physical or electronic signature.</li>
              <li>Identification of the material that has been removed or to which access has been disabled, and the location where it appeared.</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
              <li>Your name, address, telephone number, and a statement consenting to the jurisdiction of the competent courts in India or relevant international jurisdiction.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Repeat Infringer Policy</h2>
            <p>
              In accordance with Section 512(i) of the DMCA and Indian IT rules, ProjectCortex maintains a strict policy to terminate, in appropriate circumstances, access licenses and subscriptions of users who are found to be repeat or willful infringers of intellectual property rights.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
