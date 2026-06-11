'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState('');

  const fetchLicenses = async () => {
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
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLicenses();
  };

  const generateKeys = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', count: 5 })
      });
      if (res.ok) fetchLicenses();
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
      if (res.ok) fetchLicenses();
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: '50px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
        <h2>Cortex Admin</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Admin Password"
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }}
          />
          <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Cortex Admin Dashboard</h2>
        <button onClick={generateKeys} style={{ padding: '10px 20px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Generate 5 Keys</button>
      </div>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#222', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>License Key</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Expires At</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map(lic => (
            <tr key={lic.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #333', fontFamily: 'monospace' }}>{lic.license_key}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                <span style={{ 
                  padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                  background: lic.status === 'active' ? '#1b5e20' : lic.status === 'unused' ? '#424242' : '#b71c1c'
                }}>
                  {lic.status.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{lic.expires_at ? new Date(lic.expires_at).toLocaleString() : '-'}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                {lic.status !== 'revoked' && (
                  <button onClick={() => revokeKey(lic.id)} style={{ padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Revoke</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
