// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

function cancelTypewriter() {
  if (_typeTimer) {
    cancelAnimationFrame(_typeTimer)
    _typeTimer = null
  }
  const cursor = document.querySelector('.pm-cursor')
  if (cursor) cursor.remove()
}

function stopThinking() {
  if (_thinkTimer) {
    clearInterval(_thinkTimer)
    _thinkTimer = null
  }
}

function startThinking(baseText) {
  stopThinking()
  let dots = 0
  setLoadingLabel(baseText || 'Thinking')
  _thinkTimer = setInterval(() => {
    dots = (dots + 1) % 4
    setLoadingLabel((baseText || 'Thinking') + '.'.repeat(dots))
  }, 350)
}

function showState(name) {
  cancelTypewriter()
  if (name !== 'loading') {
    stopThinking()
    setLoadingSub('')
  }
  document
    .querySelectorAll('#pagemind-panel .pm-state')
    .forEach(s => s.classList.remove('active'))
  const el = document.getElementById('pm-state-' + name)
  if (el) el.classList.add('active')
}

function setLoadingLabel(text) {
  const el = document.getElementById('pm-loading-label')
  if (el) el.textContent = text
}

function setLoadingSub(text) {
  const el = document.getElementById('pm-loading-sub')
  if (el) el.textContent = text
}

function showError(msg) {
  const el = document.getElementById('pm-error-msg')
  if (el) el.textContent = String(msg || '').substring(0, 800)
  showState('error')
}

function typeText(el, text, speed) {
  cancelTypewriter()
  el.innerHTML = ''
  if (!text) return

  let i = 0
  let lastTime = 0
  const cursor = document.createElement('span')
  cursor.className = 'pm-cursor'
  el.appendChild(cursor)

  const delay = speed || (text.length > 800 ? 8 : text.length > 300 ? 15 : 25)

  function frame(time) {
    if (time - lastTime < delay) { _typeTimer = requestAnimationFrame(frame); return }
    if (i < text.length) {
      lastTime = time
      cursor.insertAdjacentText('beforebegin', text[i])
      i++
      _typeTimer = requestAnimationFrame(frame)
    } else {
      _typeTimer = null
    }
  }
  _typeTimer = requestAnimationFrame(frame)
}

function showGenericResult(actionLabel, content) {
  const clean = sanitizeText(content)
  const actionEl = document.getElementById('pm-result-action')
  const genericEl = document.getElementById('pm-generic-result')
  const mcqEl = document.getElementById('pm-mcq-result')
  const copyBtn = document.getElementById('pm-copy-btn')
  const bodyEl = document.getElementById('pm-result-body')
  if (actionEl) actionEl.textContent = '\u2713 ' + actionLabel
  if (genericEl) genericEl.style.display = 'block'
  if (mcqEl) mcqEl.style.display = 'none'
  if (copyBtn) copyBtn.dataset.content = clean
  showState('result')
  if (bodyEl) typeText(bodyEl, clean)
}

function renderOptions(options) {
  const list = document.getElementById('pm-options-list')
  if (!list) return
  list.innerHTML = ''
  options.forEach((opt, idx) => {
    const label = opt.label || String.fromCharCode(65 + idx)
    const div = document.createElement('div')
    div.className = 'pm-option'
    div.id = 'pm-opt-' + opt.index
    div.innerHTML = `
      <div class="pm-option-badge">${label}</div>
      <div class="pm-option-text">${esc(opt.text)}</div>
    `
    list.appendChild(div)
  })
}

function showCorrectAnswer(question, options, matched) {
  const actionEl = document.getElementById('pm-result-action')
  const genericEl = document.getElementById('pm-generic-result')
  const mcqEl = document.getElementById('pm-mcq-result')
  const copyBtn = document.getElementById('pm-copy-btn')
  const questionEl = document.querySelector('.pm-mcq-question')
  const cardEl = document.querySelector('.pm-answer-card')
  if (!actionEl || !mcqEl || !questionEl || !cardEl) {
    showError('UI elements missing. Try refreshing the page.')
    return
  }

  actionEl.textContent = '\u2713 Answer Found'
  if (genericEl) genericEl.style.display = 'none'
  mcqEl.style.display = 'block'
  questionEl.textContent = sanitizeText(question)

  document.querySelectorAll('.pm-option').forEach(el => el.classList.remove('pm-option--correct'))
  const correctEl = document.getElementById('pm-opt-' + matched.index)
  if (correctEl) {
    correctEl.classList.add('pm-option--correct')
    const badge = correctEl.querySelector('.pm-option-badge')
    if (badge) badge.textContent = '\u2713'
  }

  cardEl.innerHTML = `
    <div class="pm-answer-kicker">Correct Answer</div>
    <div class="pm-answer-value">
      <div class="pm-answer-num">${matched.label}</div>
      <div class="pm-answer-txt">${esc(sanitizeText(matched.text))}</div>
    </div>
  `

  if (copyBtn) copyBtn.dataset.content = matched.label + '. ' + sanitizeText(matched.text)
  showState('result')
}

function openPanel() {
  const panel = document.getElementById('pagemind-panel')
  if (!panel) return
  if (!panel.classList.contains('pm-open')) {
    if (_panelPos) {
      panel.style.left = _panelPos.x + 'px'
      panel.style.top = _panelPos.y + 'px'
      panel.style.transform = 'none'
      panel.classList.add('pm-positioned')
    } else {
      panel.classList.remove('pm-positioned')
    }
    panel.classList.add('pm-open')
  }
}

function closePanel() {
  const panel = document.getElementById('pagemind-panel')
  if (panel) panel.classList.remove('pm-open')
}

function buildPanelHTML() {
  return `
    <div class="pm-header">
      <div class="pm-logo">
        <svg viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="pm-logo-text">Cortex</span>
        <span class="pm-badge">AI</span>
      </div>
      <div class="pm-header-actions">
        <button class="pm-icon-btn" id="pm-close-btn">
          <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <div class="pm-page-info">
      <div class="pm-page-type">AI ASSISTANT</div>
      <div class="pm-page-title">Select text or use actions below</div>
    </div>

    <div class="pm-body">

      <div id="pm-state-locked" class="pm-state">
        <div class="pm-section-label">Activation Required</div>
        <p style="font-size: 13px; color: #aaa; margin-bottom: 12px; line-height: 1.4;">
          Your 7-day license has expired or is invalid. Please enter a valid license key to continue using Cortex.
        </p>
        <input type="text" id="pm-license-input" placeholder="CORTEX-XXXX-XXXX" style="width: 100%; box-sizing: border-box; background: #111; color: #fff; border: 1px solid #333; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; margin-bottom: 10px; outline: none;"/>
        <button class="pm-action-btn" id="pm-action-activate" style="width: 100%; text-align: center; justify-content: center; background: #2196F3; border: none; font-weight: bold;">Activate License</button>
      </div>

      <div id="pm-state-welcome" class="pm-state">
        <div class="pm-section-label">Quick Actions</div>
        <div class="pm-actions-grid">
          <button class="pm-action-btn" id="pm-action-summarize">\uD83D\uDCC4 Summarize Page</button>
          <button class="pm-action-btn" id="pm-action-factcheck">\uD83D\uDD0D Fact Check</button>
          <button class="pm-action-btn" id="pm-action-correct">\uD83C\uDFAF Correct Answer</button>
          <button class="pm-action-btn" id="pm-action-settings">\u2699\uFE0F Settings</button>
        </div>
        <div class="pm-divider"></div>
        <div class="pm-section-label">Ask About Page</div>
        <p class="pm-welcome-hint">Type a question related to this page in the field below.</p>
      </div>

      <div id="pm-state-loading" class="pm-state">
        <div class="pm-loading-wrap">
          <div class="pm-loader"></div>
          <div class="pm-loading-label" id="pm-loading-label">Processing\u2026</div>
          <div class="pm-loading-sub" id="pm-loading-sub"></div>
        </div>
      </div>

      <div id="pm-state-result" class="pm-state">
        <div class="pm-result-header">
          <span class="pm-result-action" id="pm-result-action">\u2713 Done</span>
          <button class="pm-back-btn" id="pm-back-btn">\u2190 Back</button>
        </div>
        <div id="pm-generic-result">
          <div class="pm-result-body" id="pm-result-body"></div>
        </div>
        <div id="pm-mcq-result" style="display:none">
          <div class="pm-mcq-question"></div>
          <div id="pm-options-list"></div>
          <div class="pm-answer-card"></div>
        </div>
        <div class="pm-result-footer">
          <button class="pm-copy-btn" id="pm-copy-btn">
            <svg width="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
      </div>

      <div id="pm-state-error" class="pm-state">
        <div class="pm-error-wrap">
          <div class="pm-error-icon">\u26A0</div>
          <div class="pm-error-msg" id="pm-error-msg"></div>
          <div class="pm-error-actions">
            <button class="pm-retry-btn" id="pm-error-retry">\u21BB Retry</button>
            <button class="pm-back-btn" id="pm-error-back">\u2190 Back</button>
          </div>
        </div>
      </div>

    </div>

    <div class="pm-ask-bar">
      <input type="text" id="pm-ask-input" placeholder="Ask about this page\u2026" />
      <button id="pm-ask-send">
        <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `
}

function createBubble() {
  try {
    _bubble = document.createElement('div')
    _bubble.id = 'pagemind-bubble'
    _bubble.innerHTML =
      '<button id="pm-bubble-correct">\uD83C\uDFAF Correct Answer</button>' +
      '<button id="pm-bubble-factcheck">\uD83D\uDD0D Fact Check</button>' +
      '<button id="pm-bubble-summarize">\uD83D\uDCC4 Summarize</button>'
    document.body.appendChild(_bubble)
    
    _bubble.addEventListener('mousedown', e => { e.preventDefault() })

    _bubble.querySelector('#pm-bubble-correct')?.addEventListener('click', () => {
      hideBubble()
      runCorrectAnswers()
    })
    _bubble.querySelector('#pm-bubble-factcheck')?.addEventListener('click', () => {
      hideBubble()
      runFactCheck()
    })
    _bubble.querySelector('#pm-bubble-summarize')?.addEventListener('click', () => {
      hideBubble()
      runSummarize()
    })
  } catch (_) {}
}

function hideBubble() {
  if (_bubble) _bubble.classList.remove('visible')
}

function showBubble(sel) {
  if (!_bubble || !sel || sel.isCollapsed || !sel.toString().trim()) {
    hideBubble()
    return
  }

  try {
    const container =
      sel.rangeCount > 0
        ? sel.getRangeAt(0).commonAncestorContainer
        : null
    if (container && isOurElement(
      container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement
    )) {
      hideBubble()
      return
    }
  } catch (_) {}

  try {
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (!rect || (!rect.width && !rect.height)) {
      hideBubble()
      return
    }

    _bubble.classList.add('visible')
    const bw = _bubble.offsetWidth
    const bh = _bubble.offsetHeight

    let left = rect.left + rect.width / 2 - bw / 2
    let top = rect.bottom + 8

    if (top + bh > window.innerHeight) {
      top = rect.top - bh - 8
    }

    if (left < 8) left = 8
    if (left + bw > window.innerWidth - 8) {
      left = window.innerWidth - bw - 8
    }

    _bubble.style.left = left + 'px'
    _bubble.style.top = top + 'px'
  } catch (_) {
    hideBubble()
  }
}

function scheduleBubbleCheck(delay = 200) {
  clearTimeout(_hideTimer)
  _hideTimer = setTimeout(() => {
    const sel = getDeepSelection()
    if (sel && !sel.isCollapsed && sel.toString().trim()) {
      showBubble(sel)
    } else {
      hideBubble()
    }
  }, delay)
}

function savePanelPos(x, y) {
  _panelPos = { x, y }
  try { localStorage.setItem('pc_panel_pos', JSON.stringify(_panelPos)) } catch (_) {}
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max))
}

function initDragger() {
  const header = document.querySelector('.pm-header')
  if (!header) return

  header.addEventListener('mousedown', e => {
    if (e.target.closest('button, input, select, textarea')) return
    _drag = true
    if (!_panel) return
    const rect = _panel.getBoundingClientRect()
    _sx = e.clientX
    _sy = e.clientY
    _sl = rect.left
    _st = rect.top
    _panel.style.transform = 'none'
    _panel.classList.add('pm-dragging')
    e.preventDefault()
  })

  if (_dragListenersAdded) return
  _dragListenersAdded = true

  document.addEventListener('mousemove', e => {
    if (!_drag || !_panel) return
    const x = clamp(_sl + (e.clientX - _sx), 0, window.innerWidth - 100)
    const y = clamp(_st + (e.clientY - _sy), 0, window.innerHeight - 100)
    _panel.style.left = x + 'px'
    _panel.style.top = y + 'px'
  })

  document.addEventListener('mouseup', () => {
    if (!_drag || !_panel) return
    _drag = false
    _panel.classList.remove('pm-dragging')
    const x = clamp(parseInt(_panel.style.left) || 24, 0, window.innerWidth - 100)
    const y = clamp(parseInt(_panel.style.top) || 100, 0, window.innerHeight - 100)
    _panel.style.left = x + 'px'
    _panel.style.top = y + 'px'
    savePanelPos(x, y)
  })
}

function wireActionButtons() {
  try {
    document.getElementById('pm-action-summarize')?.addEventListener('click', runSummarize)
    document.getElementById('pm-action-factcheck')?.addEventListener('click', runFactCheck)
    document.getElementById('pm-action-correct')?.addEventListener('click', runCorrectAnswers)
    document.getElementById('pm-action-settings')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'OPEN_OPTIONS',
        hostname: window.location.hostname,
      })
    })

    document.getElementById('pm-action-activate')?.addEventListener('click', () => {
      const key = document.getElementById('pm-license-input')?.value?.trim();
      if (!key) return showError('Please enter a license key');
      showState('loading');
      setLoadingLabel('Verifying license...');
      chrome.runtime.sendMessage({ type: 'ACTIVATE_LICENSE', licenseKey: key }, res => {
        if (res?.success) {
          showState('welcome');
          // Re-init completely to unlock features
          init();
        } else {
          showError(res?.error || 'Activation failed');
        }
      });
    });

    document.getElementById('pm-close-btn')?.addEventListener('click', closePanel)
    document.getElementById('pm-back-btn')?.addEventListener('click', () => showState(_isLocked ? 'locked' : 'welcome'))
    document.getElementById('pm-error-back')?.addEventListener('click', () => showState(_isLocked ? 'locked' : 'welcome'))
    document.getElementById('pm-error-retry')?.addEventListener('click', () => {
      if (_isLocked) return showState('locked');
      if (!_lastAction) return
      showState('loading')
      const a = _lastAction
      if (a.name === 'correct_answers') runCorrectAnswers()
      else if (a.name === 'factcheck') runFactCheck()
      else if (a.name === 'summarize') runSummarize()
      else if (a.name === 'ask' && a.question) runAsk(a.question)
    })
  } catch (_) {}
}

function initCopyButton() {
  document.getElementById('pm-copy-btn')?.addEventListener('click', async function () {
    const text = this.dataset.content || ''
    if (!text) return
    const btn = this
    const orig = btn.innerHTML

    function done() {
      btn.innerHTML =
        '<svg width="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!'
      setTimeout(() => { if (document.contains(btn)) btn.innerHTML = orig }, 1500)
    }

    try {
      await navigator.clipboard.writeText(text)
      done()
    } catch (_) {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        done()
      } catch (_) {}
    }
  })
}

function initAskBar() {
  const askInput = document.getElementById('pm-ask-input')
  const askSend = document.getElementById('pm-ask-send')

  function handleAsk() {
    const q = askInput.value.trim()
    if (!q) return
    runAsk(q)
  }

  askSend?.addEventListener('click', handleAsk)
  askInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAsk()
  })
}

function initSelectionListeners() {
  if (_selectionListenersAdded) return
  _selectionListenersAdded = true

  let _clickedOutsideAt = 0

  document.addEventListener('mousedown', e => {
    if (_bubble && !_bubble.contains(e.target)) {
      _clickedOutsideAt = Date.now()
      hideBubble()
    }
  })

  document.addEventListener('mouseup', e => {
    if (Date.now() - _clickedOutsideAt < 100) { _clickedOutsideAt = 0; return }
    if (_bubble && _bubble.contains(e.target)) return
    if (isOurElement(e.target)) { hideBubble(); return }

    scheduleBubbleCheck(200)
  })

  document.addEventListener('selectionchange', () => {
    if (Date.now() - _clickedOutsideAt < 500) { _clickedOutsideAt = 0; return }
    scheduleBubbleCheck(300)
  })

  document.addEventListener('scroll', hideBubble, true)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideBubble()
  })
}
