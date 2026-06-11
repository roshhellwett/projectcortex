// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

// The endpoint of our Vercel API
// In development, this could be http://localhost:3000
const API_BASE = 'https://projectcortex.vercel.app';

function generateInstallId() {
  return 'idx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function getAuthState() {
  return new Promise(resolve => {
    chrome.storage.local.get(['authToken', 'installId', 'lastVerifyTime'], data => {
      resolve(data);
    });
  });
}

export async function checkAuthStatus() {
  const state = await getAuthState();
  
  if (!state.installId) {
    const newId = generateInstallId();
    chrome.storage.local.set({ installId: newId });
    return { locked: true, reason: 'NO_TOKEN', installId: newId };
  }

  if (!state.authToken) {
    return { locked: true, reason: 'NO_TOKEN', installId: state.installId };
  }

  // Check if we need to ping the server (every 24 hours)
  const now = Date.now();
  const lastVerify = state.lastVerifyTime || 0;
  
  if (now - lastVerify > 24 * 60 * 60 * 1000) {
    // We need to re-verify online
    try {
      const res = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: state.authToken })
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Token is invalid or expired or revoked
        chrome.storage.local.remove(['authToken']);
        return { locked: true, reason: data.error || 'EXPIRED', installId: state.installId };
      }
      
      // Token is valid! Update the last verify time.
      chrome.storage.local.set({ lastVerifyTime: now, seed: data.seed });
      return { locked: false, seed: data.seed, installId: state.installId };
      
    } catch (e) {
      // Offline fallback: If fetch fails due to network, we allow them to continue
      // since they already had a token, but we don't update lastVerifyTime.
      // Next time they launch online, it will try again.
      console.warn('Cortex Auth: Offline, relying on cached token.', e);
      return { locked: false, offline: true, installId: state.installId };
    }
  }

  // Token exists and was verified recently
  return { locked: false, installId: state.installId };
}

export async function activateLicense(licenseKey) {
  const state = await getAuthState();
  let installId = state.installId;
  if (!installId) {
    installId = generateInstallId();
    chrome.storage.local.set({ installId });
  }

  try {
    const res = await fetch(`${API_BASE}/api/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, installId })
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error };
    }

    chrome.storage.local.set({ 
      authToken: data.token, 
      lastVerifyTime: Date.now() 
    });
    
    // Broadcast to all tabs to sync the new auth state immediately
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' }).catch(() => {}));
    });
    
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Network error connecting to activation server.' };
  }
}
