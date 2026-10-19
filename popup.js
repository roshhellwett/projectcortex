// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT
let activeTab = null;
let pageAvailable = false;
let busy = false;
const actionButtons = [...document.querySelectorAll('[data-action], [data-workflow]')];
const status = document.getElementById('status');
const error = document.getElementById('pm-error');

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

function setBusy(value) {
  busy = value;
  actionButtons.forEach(button => { button.disabled = value || !pageAvailable; });
  document.querySelector('main').setAttribute('aria-busy', String(value));
  status.textContent = value ? 'Opening in your page…' : '';
}

// Bound the entire exchange, including selection capture.
function sendToPage(message, retries = 2) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const timer = setTimeout(() => finish(reject, new Error('The page did not respond in time. Please try again.')), 6000);

    const attempt = (remaining) => {
      try {
        chrome.tabs.sendMessage(activeTab.id, message, { frameId: 0 }, response => {
          const runtimeError = chrome.runtime.lastError;
          if (runtimeError) {
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), 250);
              return;
            }
            return finish(reject, new Error('Cortex is not connected to this tab. Please refresh the page once, then open Cortex again.'));
          }
          if (!response?.ok) {
            return finish(reject, new Error(response?.error || 'The page could not start this action. Refresh it and try again.'));
          }
          finish(resolve, response);
        });
      } catch (_) {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 250);
          return;
        }
        finish(reject, new Error('The extension connection was lost. Reopen Cortex and try again.'));
      }
    };
    attempt(retries);
  });
}

async function runAction(action) {
  if (busy || !pageAvailable) return;
  error.hidden = true;
  setBusy(true);
  try {
    const capture = await sendToPage({ type: 'CAPTURE_SELECTION' });
    const selectionText = capture.selectionText?.trim() || '';
    if (['define', 'factcheck', 'correct_answers'].includes(action) && !selectionText) {
      throw new Error('Select a term, claim, or question on the page first, then reopen Cortex.');
    }
    await sendToPage({ type: 'RUN_ACTION', action, selectionText });
    window.close();
  } catch (err) {
    showError(err.message);
  } finally {
    setBusy(false);
  }
}

async function runWorkflow(workflow) {
  if (busy || !pageAvailable) return;
  error.hidden = true;
  setBusy(true);
  try {
    const capture = await sendToPage({ type: 'CAPTURE_SELECTION' });
    const selectionText = capture.selectionText?.trim() || '';
    await sendToPage({ type: 'RUN_WORKFLOW', workflow, selectionText });
    window.close();
  } catch (err) {
    showError(err.message);
  } finally {
    setBusy(false);
  }
}

actionButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.workflow) {
      runWorkflow(button.dataset.workflow);
    } else {
      runAction(button.dataset.action);
    }
  });
});

const openSettingsFn = async () => {
  try {
    const hostname = activeTab?.url ? new URL(activeTab.url).hostname : '';
    await chrome.storage.local.set({ settingsTargetHost: hostname });
    await chrome.runtime.openOptionsPage();
    window.close();
  } catch (_) {
    showError('Settings could not open. Reopen the extension and try again.');
  }
};
document.getElementById('openSettings')?.addEventListener('click', openSettingsFn);
document.getElementById('openSettingsHeader')?.addEventListener('click', openSettingsFn);

async function initialize() {
  try {
    document.getElementById('popup-version').textContent = `v${chrome.runtime.getManifest().version}`;
    [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(activeTab?.url || 'about:blank');
    pageAvailable = Boolean(activeTab?.id) && ['http:', 'https:'].includes(url.protocol)
      && url.hostname !== 'chromewebstore.google.com'
      && !(url.hostname === 'chrome.google.com' && url.pathname.startsWith('/webstore'));
    document.getElementById('pageTitle').textContent = activeTab?.title || 'No webpage selected';
    document.getElementById('pageHost').textContent = pageAvailable ? url.hostname : 'Open a regular webpage to use the assistant';
    setBusy(false);
    if (!pageAvailable) {
      showError('Browser pages, the Web Store, and local files cannot use this launcher. Settings are still available.');
    } else {
      try {
        const capture = await sendToPage({ type: 'CAPTURE_SELECTION' });
        if (capture?.readingMetrics?.readingTimeFormatted) {
          const chip = document.getElementById('pageReadingChip');
          const timeText = document.getElementById('pageReadingTime');
          if (chip && timeText) {
            timeText.textContent = `${capture.readingMetrics.readingTimeFormatted} read`;
            chip.style.display = 'inline-flex';
          }
        }
      } catch (_) {}
    }
  } catch (_) {
    document.getElementById('pageTitle').textContent = 'Page unavailable';
    showError('Unable to read the active tab. Reopen Cortex to reconnect.');
  }
}
initialize();
