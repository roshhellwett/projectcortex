'use client';
import { useState, useEffect } from 'react';
import './../globals.css';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${password}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLicenses(data.licenses);
        setLoggedIn(true);
        setError('');
      } else {
        setError(data.error);
        setLoggedIn(false);
      }
    } catch (err) {
      setError('Failed to connect');
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLicenses();
  };

  const generateKeys = async () => {
    const input = window.prompt("How many keys would you like to generate? (1-100)", "5");
    if (!input) return;
    
    const count = parseInt(input, 10);
    if (isNaN(count) || count < 1 || count > 100) {
      showToast('Please enter a valid number between 1 and 100.');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', count })
      });
      if (res.ok) {
        showToast(`${count} new keys generated successfully!`);
        fetchLicenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const revokeKey = async (id) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke', id })
      });
      if (res.ok) {
        showToast('Key revoked instantly.');
        fetchLicenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'active').length,
    expired: licenses.filter(l => l.status === 'expired' || l.status === 'revoked').length,
  };

  if (!loggedIn) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div className="ambient-glow"></div>
        <div className="glass-panel animate-fade-up" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Admin Login</h2>
          <p style={{ color: '#888', margin: '0 0 24px 0', fontSize: '14px' }}>Enter your master password to access the Cortex DRM vault.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" 
              className="premium-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Admin Password"
              autoFocus
            />
            <button type="submit" className="premium-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Unlock Vault'}
            </button>
          </form>
          {error && <p style={{ color: '#ff4444', marginTop: '16px', fontSize: '14px', background: 'rgba(255, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px' }}>
      {toast && (
        <div className="glass-panel animate-fade-up" style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px', background: 'var(--primary)', color: '#000', fontWeight: 'bold', zIndex: 100 }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Cortex Command Center</h1>
            <p style={{ color: '#888', margin: 0 }}>Manage your extension licenses and track usage.</p>
          </div>
          <button className="premium-button" onClick={generateKeys}>+ Generate Keys</button>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Total Licenses</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.total}</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '2px solid #4ade80' }}>
            <div style={{ color: '#888', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Active Users</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80' }}>{stats.active}</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '2px solid #ef4444' }}>
            <div style={{ color: '#888', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Expired / Revoked</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{stats.expired}</div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', color: '#888', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>License Key</th>
                <th style={{ padding: '16px 24px', color: '#888', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', color: '#888', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Expires At</th>
                <th style={{ padding: '16px 24px', color: '#888', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(lic => (
                <tr key={lic.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '15px' }}>{lic.license_key}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
                      background: lic.status === 'active' ? 'rgba(74, 222, 128, 0.1)' : lic.status === 'unused' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: lic.status === 'active' ? '#4ade80' : lic.status === 'unused' ? '#aaa' : '#ef4444'
                    }}>
                      {lic.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#888', fontSize: '14px' }}>
                    {lic.expires_at ? new Date(lic.expires_at).toLocaleString() : 'Never'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {lic.status !== 'revoked' && (
                      <button onClick={() => revokeKey(lic.id)} style={{ padding: '8px 16px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='#fff'}} onMouseLeave={e => {e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#ef4444'}}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {licenses.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No licenses found. Generate some keys!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
