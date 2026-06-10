// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function clickFab(tab) {
  if (!tab?.id) return false;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const fab = document.getElementById('pagemind-fab');
        if (fab) fab.click();
      }
    });
    return true;
  } catch {
    return false;
  }
}

function getHostnameFromUrl(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

function setLoading(loading) {
  document.getElementById('loading').classList.toggle('visible', loading);
  document.querySelectorAll('.btn').forEach(b => b.disabled = loading);
}

async function sendAction(tab, action) {
  return new Promise(resolve => {
    const timeout = setTimeout(() => resolve(null), 5000);
    chrome.tabs.sendMessage(tab.id, { type: 'RUN_ACTION', action }, response => {
      clearTimeout(timeout);
      resolve((chrome.runtime.lastError || !response?.ok) ? null : response);
    });
  });
}

const btnMap = [
  ['openPanel', async () => {
    const tab = await getActiveTab();
    if (!tab) return;
    await clickFab(tab);
    window.close();
  }],
  ['factCheck', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    setLoading(true);
    const res = await sendAction(tab, 'factcheck');
    if (!res) await clickFab(tab);
    window.close();
  }],
  ['correctAnswers', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    setLoading(true);
    const res = await sendAction(tab, 'correct_answers');
    if (!res) await clickFab(tab);
    window.close();
  }],
  ['summarize', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    setLoading(true);
    const res = await sendAction(tab, 'summarize');
    if (!res) await clickFab(tab);
    window.close();
  }],
  ['openSettings', async () => {
    const tab = await getActiveTab();
    const hostname = getHostnameFromUrl(tab?.url);
    if (hostname) {
      chrome.storage.local.set({ settingsTargetHost: hostname }, () => {
        chrome.runtime.openOptionsPage();
        window.close();
      });
      return;
    }
    chrome.runtime.openOptionsPage();
    window.close();
  }],
];

for (const [id, handler] of btnMap) {
  document.getElementById(id)?.addEventListener('click', handler);
}
