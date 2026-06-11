// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

function initMessageListener() {
  if (_messageListenerAdded) return
  _messageListenerAdded = true

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'RUN_ACTION') {
      const actionMap = {
        correct_answers: runCorrectAnswers,
        summarize: runSummarize,
        factcheck: runFactCheck,
        open_panel: () => {
          const sel = getDeepSelection()
          if (sel && !sel.isCollapsed && sel.toString().trim()) {
            showBubble(sel)
          } else {
            openPanel()
            showState(_isLocked ? 'locked' : 'welcome')
          }
        }
      }
      const fn = actionMap[message.action]
      if (fn) {
        Promise.resolve(fn()).catch(() => {})
        sendResponse({ ok: true })
      }
      return true
    }
    
    if (message.type === 'AUTH_STATE_CHANGED') {
      init();
    }
  })
}

function applySiteSettings() {
  try {
    chrome.storage.sync.get(
      ['activeWindowsWhitelist', 'copyPasteWhitelist'],
      data => {
        if (chrome.runtime.lastError) return
        const hostname = window.location.hostname
        const forceVisible = Boolean(data.activeWindowsWhitelist?.[hostname])
        const forceCopyPaste = Boolean(data.copyPasteWhitelist?.[hostname])
        
        window.postMessage({ type: 'PC_CONFIG_UPDATE', forceVisible, forceCopyPaste }, '*')
        
        if (forceCopyPaste) {
          applyCopyPasteOverride()
        }
      }
    )
  } catch (_) {}
}

function cleanup() {
  document.querySelectorAll('#pagemind-panel, #pagemind-bubble, #pm-copy-paste-override')
    .forEach(el => el.remove())
  if (_thinkTimer) clearInterval(_thinkTimer)
  if (_typeTimer) cancelAnimationFrame(_typeTimer)
  if (_hideTimer) clearTimeout(_hideTimer)
  _thinkTimer = null
  _typeTimer = null
  _hideTimer = null
  _bubble = null
  _panel = null
  _panelPos = null
  _busy = false
  _lastAction = null
}

async function init() {
  try {
    cleanup()
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', init)
      return
    }
    _panel = document.createElement('div')
    _panel.id = 'pagemind-panel'
    _panel.innerHTML = buildPanelHTML()
    document.body.appendChild(_panel)

    initDragger()
    wireActionButtons()
    initCopyButton()
    initAskBar()

    const titleEl = document.querySelector('.pm-page-title')
    if (titleEl) titleEl.textContent = document.title || window.location.hostname

    createBubble()
    initSelectionListeners()
    initMessageListener()
    applySiteSettings()

    // Check activation lock
    chrome.runtime.sendMessage({ type: 'CHECK_AUTH' }, res => {
      if (res && res.locked) {
        _isLocked = true;
        hideBubble(); // prevent bubble usage
        showState('locked');
      } else {
        _isLocked = false;
        showState('welcome');
      }
    });

  } catch (e) {
    console.error('[Cortex] Init failed:', e)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

setInterval(() => {
  if (location.href !== _lastURL) {
    _lastURL = location.href
    init()
  }
}, 500)
window.addEventListener('popstate', () => {
  if (location.href !== _lastURL) {
    _lastURL = location.href
    init()
  }
})
