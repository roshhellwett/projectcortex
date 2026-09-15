import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Grievance Redressal Mechanism | Government of India IT Rules Compliance | ProjectCortex',
  description: 'Statutory grievance redressal mechanism and Grievance Officer details under Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021.',
  alternates: {
    canonical: 'https://projectcortex.vercel.app/grievance',
  },
};

export default function GrievancePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <SiteHeader />

      <article className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--emerald)', marginBottom: '8px' }}>
            Government of India • Statutory Compliance
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Grievance Redressal Mechanism
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Under Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
          </p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Overview & Regulatory Framework</h2>
            <p>
              In accordance with the <strong>Information Technology Act, 2000</strong> and <strong>Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, ProjectCortex maintains a formal, transparent grievance redressal mechanism to address complaints, grievances, and inquiries regarding user rights, service operations, and compliance.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Designated Grievance Officer Details</h2>
            <p>
              Users in India and globally may direct any concerns, disputes, or complaints regarding ProjectCortex software, activation keys, content processing, or privacy directly to our designated officer:
            </p>
            <div className="officer-card">
              <div className="officer-header">
                <div className="officer-badge">Designated Grievance Officer</div>
                <div className="officer-gov">Information Technology Act, 2000 (India)</div>
              </div>
              <table className="officer-table">
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>Grievance Officer, ProjectCortex / Zenith</td>
                  </tr>
                  <tr>
                    <td><strong>Designation:</strong></td>
                    <td>Chief Compliance & Grievance Redressal Officer</td>
                  </tr>
                  <tr>
                    <td><strong>Official Email:</strong></td>
                    <td><a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a></td>
                  </tr>
                  <tr>
                    <td><strong>Secondary Contact:</strong></td>
                    <td><a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer">@roshhellwett (Executive Channel)</a></td>
                  </tr>
                  <tr>
                    <td><strong>Jurisdiction:</strong></td>
                    <td>New Delhi, Republic of India</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Statutory Timelines for Grievance Resolution</h2>
            <p>
              Under Rule 3(2)(a) of the IT Rules 2021, ProjectCortex adheres to the following strict response schedule:
            </p>
            <div className="timeline-grid">
              <div className="timeline-box">
                <div className="timeline-time">Within 24 Hours</div>
                <div className="timeline-desc">Formal acknowledgment of receipt and assignment of a unique Grievance Tracking Ticket ID.</div>
              </div>
              <div className="timeline-box">
                <div className="timeline-time">Within 15 Days</div>
                <div className="timeline-desc">Complete investigation, review, and resolution or written explanation of the grievance.</div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. How to File a Grievance</h2>
            <p>
              To ensure speedy investigation, please submit your grievance to <a href="mailto:zenithprojects@icloud.com">zenithprojects@icloud.com</a> with the subject line <code>[GRIEVANCE REDRESSAL - IT RULES]</code> and include:
            </p>
            <ul>
              <li><strong>Complainant Information:</strong> Full legal name, contact email, and country/state of residence.</li>
              <li><strong>Subject Category:</strong> 
                <ul>
                  <li>Account / License Activation & Billing</li>
                  <li>Data Protection & Privacy (DPDP Act 2023)</li>
                  <li>Content Safety & Model Behavior</li>
                  <li>Intellectual Property / Copyright Concern</li>
                </ul>
              </li>
              <li><strong>Details of Concern:</strong> A clear, concise statement explaining the exact nature of the grievance and any relevant URLs, screenshots, or install IDs.</li>
              <li><strong>Declaration:</strong> A confirmation that the information supplied is true and accurate to the best of your knowledge.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Grievance Appellate Committee (GAC) Notice</h2>
            <p>
              In accordance with Rule 3A of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Amendment Rules, 2022, if any user is aggrieved by an order or decision of the Grievance Officer, or if no decision is received within the statutory timeframe, they may prefer an appeal to the <strong>Grievance Appellate Committee (GAC)</strong> constituted by the Central Government of India via the official portal at <a href="https://gac.gov.in" target="_blank" rel="noopener noreferrer">https://gac.gov.in</a> within thirty (30) days from receipt of such communication.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
