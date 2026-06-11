export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0' }}>
        <span style={{ color: '#00D1FF' }}>Project</span>Cortex
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#888', maxWidth: '600px', marginTop: '20px' }}>
        The ultimate AI-powered browser extension. Summarize pages, extract answers, and fact-check instantly.
      </p>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#aaa' }}>Get Your License Key</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Contact the developer to purchase a 7-day activation key.</p>
        <button style={{ padding: '15px 30px', background: '#fff', color: '#000', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          Download Extension
        </button>
      </div>

      <p style={{ position: 'absolute', bottom: '20px', color: '#444', fontSize: '0.8rem' }}>
        &copy; 2026 Zenith Open Source Projects. All rights reserved.
      </p>
    </div>
  );
}
