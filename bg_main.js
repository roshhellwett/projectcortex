// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

import { handleAIRequest } from './bg_api.js';
import { checkAuthStatus, activateLicense } from './bg_auth.js';

const extractHostname = url => {
  try { return new URL(url).hostname; } catch { return ''; }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_AUTH') {
    checkAuthStatus().then(sendResponse);
    return true;
  }

  if (message.type === 'ACTIVATE_LICENSE') {
    activateLicense(message.licenseKey).then(sendResponse);
    return true;
  }

  if (message.type === 'AI_REQUEST') {
    handleAIRequest(message.payload, sendResponse);
    return true; // Keep message channel open for async response
  }
  if (message.type === 'OPEN_OPTIONS') {
    const hostname = message.hostname || extractHostname(sender?.tab?.url);
    chrome.storage.local.set({ settingsTargetHost: hostname || '' }, () => {
      chrome.runtime.openOptionsPage();
    });
  }
});
