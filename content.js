// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

function injectMainWorldHacks() {
  try {
    if (document.getElementById('pc-main-hacks')) return;
    const script = document.createElement('script');
    script.id = 'pc-main-hacks';
    script.textContent = `
      (() => {
        let _forceVisible = false;
        let _forceCopyPaste = false;
        window.addEventListener('message', e => {
          if (e.data && e.data.type === 'PC_CONFIG_UPDATE') {
            _forceVisible = !!e.data.forceVisible;
            _forceCopyPaste = !!e.data.forceCopyPaste;
          }
        });
        let _origHidden = null;
        let _origVisState = null;
        try { _origHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden'); } catch (_) {}
        try { _origVisState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState'); } catch (_) {}
        try {
          Object.defineProperty(Document.prototype, 'hidden', {
            get: function() { return _forceVisible ? false : (_origHidden ? _origHidden.get.call(this) : false); },
            configurable: true
          });
          Object.defineProperty(Document.prototype, 'visibilityState', {
            get: function() { return _forceVisible ? 'visible' : (_origVisState ? _origVisState.get.call(this) : 'visible'); },
            configurable: true
          });
        } catch (_) {}
        const origDocAddEL = document.addEventListener.bind(document);
        document.addEventListener = function(type, listener, options) {
          if (_forceVisible && type === 'visibilitychange') return;
          return origDocAddEL.apply(this, arguments);
        };
        const origWinAddEL = window.addEventListener.bind(window);
        window.addEventListener = function(type, listener, options) {
          if (_forceVisible && (type === 'blur' || type === 'focus' || type === 'visibilitychange')) return;
          return origWinAddEL.apply(this, arguments);
        };
        try {
          let _onvis = null;
          Object.defineProperty(document, 'onvisibilitychange', {
            get: () => _forceVisible ? null : _onvis,
            set: fn => { if (!_forceVisible) _onvis = fn; },
            configurable: true
          });
          let _onblur = null;
          Object.defineProperty(window, 'onblur', {
            get: () => _forceVisible ? null : _onblur,
            set: fn => { if (!_forceVisible) _onblur = fn; },
            configurable: true
          });
          let _onfocus = null;
          Object.defineProperty(window, 'onfocus', {
            get: () => _forceVisible ? null : _onfocus,
            set: fn => { if (!_forceVisible) _onfocus = fn; },
            configurable: true
          });
        } catch (_) {}
        const origHasFocus = document.hasFocus ? document.hasFocus.bind(document) : () => true;
        document.hasFocus = function() { return _forceVisible ? true : origHasFocus.apply(this); };
        
        const blockEvents = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart'];
        blockEvents.forEach(evt => {
          window.addEventListener(evt, e => {
            if (_forceCopyPaste) e.stopImmediatePropagation();
          }, true);
        });

        const origPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
          if (_forceCopyPaste) {
            if (blockEvents.includes(this.type)) return;
            if (this.type === 'keydown' || this.type === 'keyup') {
              if ((this.ctrlKey || this.metaKey) && ['c', 'v', 'x', 'a', 'C', 'V', 'X', 'A'].includes(this.key)) {
                return;
              }
            }
            if (this.type === 'mousedown') {
              const t = this.target && this.target.tagName ? this.target.tagName.toUpperCase() : '';
              if (t !== 'BUTTON' && t !== 'A' && t !== 'INPUT' && t !== 'SELECT' && t !== 'TEXTAREA') {
                return;
              }
            }
          }
          return origPreventDefault.apply(this, arguments);
        };
        
        try {
          const origRemoveAll = Selection.prototype.removeAllRanges;
          const origEmpty = Selection.prototype.empty;
          const origCollapse = Selection.prototype.collapse;
          
          Selection.prototype.removeAllRanges = function() {
            if (_forceCopyPaste) return;
            return origRemoveAll.apply(this, arguments);
          };
          Selection.prototype.empty = function() {
            if (_forceCopyPaste) return;
            return origEmpty?.apply(this, arguments);
          };
          Selection.prototype.collapse = function() {
            if (_forceCopyPaste) return;
            return origCollapse?.apply(this, arguments);
          };
        } catch (_) {}
        
        const clearInlineStyles = () => {
          if (!_forceCopyPaste) return;
          document.querySelectorAll('[style*="user-select"], [onselectstart], [onmousedown], [oncopy], [oncontextmenu]').forEach(el => {
            el.style.userSelect = 'auto';
            el.style.webkitUserSelect = 'auto';
            el.removeAttribute('onselectstart');
            el.removeAttribute('onmousedown');
            el.removeAttribute('oncopy');
            el.removeAttribute('oncontextmenu');
          });
        };
        window.addEventListener('load', clearInlineStyles);
        setInterval(clearInlineStyles, 2000);
      })();
    `;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.warn('ProjectCortex: Main world injection blocked by CSP');
  }
}
injectMainWorldHacks();

;(function () {
  if (window.__projectCortexLoaded) {
    init()
    return
  }
  window.__projectCortexLoaded = true

  const SYSTEM_PROMPT_MCQ =
    'You are an expert test-taker. You will be given a raw text extraction from a webpage containing a multiple choice question.\n' +
    'Extract the exact question, all options, and determine the correct answer.\n' +
    'Respond EXACTLY in this format with NO conversational text:\n\n' +
    'QUESTION: <Question text>\n' +
    'OPTIONS:\n' +
    'A) <Option 1>\n' +
    'B) <Option 2>\n' +
    'C) <Option 3>\n' +
    'D) <Option 4>\n\n' +
    'ANSWER: <Correct Letter>'

  const MCQ_SELECTOR =
    '.options, .answers, .choices, .mcq, .quiz, .question, .exam, ' +
    '[class*="option"], [class*="answer"], [class*="choice"], ' +
    '[class*="mcq"], [class*="quiz"], [class*="question"], ' +
    'ol, ul, table, form, section, fieldset'

  function isOurElement(el) {
    return Boolean(
      el?.closest?.('#pagemind-panel, #pagemind-bubble')
    )
  }

  function getDeepSelection() {
    let sel = window.getSelection()
    let active = document.activeElement
    while (active && active.shadowRoot) {
      if (active.shadowRoot.getSelection) {
        const s = active.shadowRoot.getSelection()
        if (s && s.rangeCount > 0 && !s.isCollapsed) sel = s
      }
      active = active.shadowRoot.activeElement
    }
    return sel
  }

  function getDeepSelectionText() {
    const sel = getDeepSelection()
    let text = sel?.toString() || ''
    if (!text && document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      try {
        const ta = document.activeElement
        text = ta.value.substring(ta.selectionStart, ta.selectionEnd)
      } catch (e) {}
    }
    return text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
  }

  function getCleanText(el) {
    if (!el) return ''
    const clone = el.cloneNode(true)
    clone
      .querySelectorAll(
        '#pagemind-panel,#pagemind-bubble,script,style,noscript'
      )
      .forEach(n => n.remove())

    clone.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(n => {
      const span = document.createElement('span')
      span.textContent = '[ ] '
      if (n.parentNode) n.parentNode.replaceChild(span, n)
    })

    clone.querySelectorAll('div, p, li, h1, h2, h3, h4, h5, h6, tr').forEach(n => {
      n.appendChild(document.createTextNode('\n'))
    })
    clone.querySelectorAll('br').forEach(n => {
      if (n.parentNode) n.parentNode.replaceChild(document.createTextNode('\n'), n)
    })

    return (
      (clone.innerText || clone.textContent || '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    )
  }

  function esc(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const SANITIZE_RULES = [
    [/\$\$([\s\S]*?)\$\$/g, '$1'],
    [/\$([^$\n]+)\$/g, '$1'],
    [/\\boxed\{([^}]*)\}/g, '$1'],
    [/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2'],
    [/\\(?:text|textbf|textit|texttt|mathrm|displaystyle|emph)\{([^}]*)\}/g, '$1'],
    [/\\(times|div|pm|cdot)/g, m => ({ times:'\u00D7', div:'\u00F7', pm:'\u00B1', cdot:'\u00B7' })[m.slice(1)] || m],
    [/\\%/g, '%'],
    [/_\{([^}]*)\}/g, '_$1'],
    [/\^\{([^}]*)\}/g, '^$1'],
    [/\{([^}]*)\}/g, '$1'],
    [/\\\\/g, '\\'],
    [/\\[a-zA-Z]+/g, ''],
    [/^#{1,6}\s+/gm, ''],
    [/\*\*([^*]+)\*\*/g, '$1'],
    [/__([^_]+)__/g, '$1'],
    [/\*([^*]+)\*/g, '$1'],
    [/\[([^\]]+)\]\([^)]+\)/g, '$1'],
    [/`([^`]+)`/g, '$1'],
    [/^---+\s*$/gm, ''],
    [/\n{3,}/g, '\n\n'],
  ]

  function sanitizeText(text) {
    if (!text) return ''
    let s = String(text)
    for (const [re, replacement] of SANITIZE_RULES) {
      s = s.replace(re, replacement)
    }
    return s.trim()
  }

  function getPageContext(el) {
    let container = el
    while (container && container.parentElement && !/^(MAIN|ARTICLE|BODY)$/i.test(container.tagName)) {
      const len = (container.innerText || container.textContent || '').length
      if (len > 3000) break
      container = container.parentElement
    }
    const text = getCleanText(container)
    return text.length > 8000 ? text.substring(0, 8000) : text
  }

  function getSettings() {
    return new Promise(resolve => {
      if (!chrome?.storage?.sync) {
        resolve({ apiKey: '', model: 'llama-3.1-8b-instant', apiProvider: 'groq', customEndpoint: '' })
        return
      }
      try {
        chrome.storage.sync.get(
          ['apiKey', 'model', 'apiProvider', 'customEndpoint', 'customModel'],
          data => {
            if (chrome.runtime.lastError) {
              resolve({ apiKey: '', model: 'llama-3.1-8b-instant', apiProvider: 'groq', customEndpoint: '' })
              return
            }
            let model = data.model || 'llama-3.1-8b-instant'
            if (model === 'custom') {
              model = data.customModel || 'llama-3.1-8b-instant'
            }
            resolve({
              apiKey: data.apiKey || '',
              model,
              apiProvider: data.apiProvider || 'groq',
              customEndpoint: data.customEndpoint || '',
            })
          }
        )
      } catch {
        resolve({ apiKey: '', model: 'llama-3.1-8b-instant', apiProvider: 'groq', customEndpoint: '' })
      }
    })
  }

  function callAI(payload) {
    return new Promise((resolve, reject) => {
      let timedOut = false
      let globalTimeout = null
      let settling = false

      const settle = (fn, val) => {
        if (settling) return
        settling = true
        if (globalTimeout) clearTimeout(globalTimeout)
        fn(val)
      }

      const send = () => {
        globalTimeout = setTimeout(() => {
          timedOut = true
          settle(reject, new Error('__SW_DEAD__'))
        }, 55000)

        try {
          chrome.runtime.sendMessage(
            { type: 'AI_REQUEST', payload },
            response => {
              if (timedOut) return
              const err = chrome.runtime.lastError
              if (err) {
                if (err.message?.includes('context') || err.message?.includes('startup') ||
                    err.message?.includes('connection') || err.message?.includes('receiving end')) {
                  settle(reject, new Error('__SW_DEAD__'))
                } else {
                  settle(reject, new Error(err.message))
                }
                return
              }
              if (!response) {
                settle(reject, new Error('__SW_DEAD__'))
                return
              }
              if (response.error === 'NO_KEY') {
                settle(reject, new Error('__NO_KEY__'))
                return
              }
              if (response.error) {
                settle(reject, new Error(response.error))
                return
              }
              settle(resolve, response?.result || '')
            }
          )
        } catch (e) {
          settle(reject, new Error('__SW_DEAD__'))
        }
      }

      send()
    })
  }

  let _busy = false
  let _lastAction = null

  function guard(fn) {
    return async function () {
      if (_busy) return
      _busy = true
      try {
        await fn.apply(this, arguments)
      } catch (_) {}
      finally {
        _busy = false
      }
    }
  }

  function handleAIError(err) {
    const msg = err.message || ''
    if (msg === '__NO_KEY__') {
      showError('No API key configured. Open Settings to add one, then click Retry.')
      return
    }
    if (msg === '__SW_DEAD__') {
      showError('Extension was unloaded. Click Retry to wake it up and try again.')
      return
    }
    if (/rate limit|too many|429/i.test(msg)) {
      showError('Rate limit reached. AI services need a moment to cool down. Click Retry in a few seconds.')
      return
    }
    if (/quota|insufficient|billing|credits/i.test(msg)) {
      showError('Account quota exhausted. Add credits at your provider\'s website, then click Retry.')
      return
    }
    if (/auth|unauthorized|invalid key|key.*reject/i.test(msg)) {
      showError('API key is invalid or expired. Check your key in Settings, then click Retry.')
      return
    }
    if (/access denied|403/i.test(msg)) {
      showError('Access denied by provider. Check billing or try the other provider in Settings.')
      return
    }
    if (/model.*not found|model.*not available|does not exist/i.test(msg)) {
      showError('The selected model is not available. Open Settings and pick a different model.')
      return
    }
    if (/timed out/i.test(msg)) {
      showError('Request timed out. The provider may be slow or your network may have issues. Click Retry.')
      return
    }
    if (/network|internet|connection/i.test(msg)) {
      showError('Network error. Check your internet connection, then click Retry.')
      return
    }
    if (/empty response/i.test(msg)) {
      showError('AI returned nothing. The model or provider may be overloaded. Try again.')
      return
    }
    showError(msg)
  }

  function applyCopyPasteOverride() {
    if (window._pmCssObserver) return
    const style = document.createElement('style')
    style.id = 'pm-copy-paste-override'
    style.textContent =
      '*, html, body, div, p, span, a, h1, h2, h3, h4, h5, h6, table, tr, td, th, ul, ol, li, section, article, main, header, footer, form, label, input, textarea { user-select: auto !important; -webkit-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; -webkit-touch-callout: default !important; }'
    document.head.appendChild(style)

    window._pmCssObserver = new MutationObserver(() => {
      if (!document.getElementById('pm-copy-paste-override')) {
        document.head.appendChild(style)
      } else if (document.head.lastElementChild !== style) {
        document.head.appendChild(style)
      }
    })
    window._pmCssObserver.observe(document.head, { childList: true })
  }

  function buildPrompt(selectedText, contextText) {
    return (
      `I have selected a specific question from a web page: "${selectedText}"\n\n` +
      `Here is a snippet of the page that contains my question and its options:\n---\n${contextText}\n---\n\n` +
      `CRITICAL INSTRUCTION: You MUST find the options specifically for the question I selected. DO NOT solve any other questions found in the page snippet. Ignore the rest of the page. Only extract the question matching my selected text, its options, and the correct answer. Respond ONLY with the requested exact format.`
    )
  }

  function parseAiResponse(response) {
    let cleanResponse = String(response || '').trim()
    cleanResponse = cleanResponse.replace(/^```[a-z]*\n/im, '').replace(/\n```$/im, '').trim()

    const lines = cleanResponse.split('\n').map(l => l.trim())
    let question = ''
    let options = []
    let answerLetter = ''

    let state = 'NONE'
    for (const line of lines) {
      if (/^\**QUESTION\s*:?\**\s*/i.test(line)) {
        question = line.replace(/^\**QUESTION\s*:?\**\s*/i, '').trim()
        state = 'Q'
        continue
      }
      if (/^\**OPTIONS\s*:?\**\s*/i.test(line)) {
        state = 'O'
        continue
      }
      if (/^\**ANSWER\s*:?\**\s*/i.test(line)) {
        answerLetter = line.replace(/^\**ANSWER\s*:?\**\s*/i, '').trim()
        state = 'A'
        continue
      }

      if (state === 'Q') {
        if (line) question += ' ' + line
      } else if (state === 'O') {
        if (line) {
          const m = line.match(/^([A-Za-z0-9])[\)\.]?\s*(.+)/)
          if (m) {
            options.push({
              index: options.length + 1,
              label: m[1].toUpperCase(),
              text: m[2]
            })
          }
        }
      }
    }

    if (!question || options.length < 2 || !answerLetter) return null

    const matched = options.find(o => o.label === answerLetter)
    return { question, options, matched }
  }

  function callAIAction(settings, action, prompt, systemPrompt) {
    return callAI({
      prompt,
      systemPrompt,
      action,
      apiKey: settings.apiKey,
      model: settings.model,
      apiProvider: settings.apiProvider,
      customEndpoint: settings.customEndpoint,
    })
  }

  const runCorrectAnswers = guard(async function () {
    _lastAction = { name: 'correct_answers' }
    const selectedText = getDeepSelectionText()

    if (!selectedText) {
      showError('Please select the question text first.')
      return
    }

    openPanel()
    showState('loading')
    startThinking('Analyzing Page & Finding Answer...')

    const container = getSelectedContainer()
    if (!container) {
      showError('Could not find the selected text container.')
      return
    }

    const contextText = getPageContext(container)
    const prompt = buildPrompt(selectedText, contextText)

    const settings = await getSettings()
    setLoadingSub(`${settings.apiProvider} · ${settings.model}`)

    try {
      const response = await callAIAction(settings, 'correct_answers', prompt, SYSTEM_PROMPT_MCQ)
      let parsed = parseAiResponse(response)

      if (!parsed) {
        startThinking('Re-checking formatting')
        const retryResponse = await callAIAction(
          settings,
          'correct_answers',
          prompt + "\n\nPlease follow the format EXACTLY. Output QUESTION, OPTIONS, and ANSWER.",
          SYSTEM_PROMPT_MCQ
        )
        parsed = parseAiResponse(retryResponse)
      }

      if (parsed) {
        renderOptions(parsed.options)
        showCorrectAnswer(parsed.question, parsed.options, parsed.matched)
      } else {
        showError('Could not parse the AI response. The page might not contain a recognizable multiple choice question.')
      }
    } catch (err) {
      handleAIError(err)
    }
  })

  function getSelectedContainer() {
    const sel = getDeepSelection()
    if (!sel?.rangeCount) return null
    const node = sel.getRangeAt(0).startContainer
    return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement
  }

  const runSummarize = guard(async function () {
    _lastAction = { name: 'summarize' }
    openPanel()
    showState('loading')
    startThinking('Reading page')

    const selectedText = getDeepSelectionText()
    const pageText = selectedText || getCleanText(document.body)

    if (!pageText || pageText.length < 50) {
      showError('Not enough content to summarize. Select text or load a page with more content.')
      return
    }

    const truncated = pageText.substring(0, 15000)
    const wasTruncated = pageText.length > 15000
    const settings = await getSettings()
    setLoadingSub(`${settings.apiProvider} · ${settings.model}`)

    try {
      startThinking('Summarizing')
      const label = selectedText ? 'Selection' : 'Page'
      const response = await callAIAction(
        settings,
        'summarize',
        'Summarize the following content in a clear, structured way:\n\n' + truncated,
        'You are an expert summarizer. Create a concise, well-structured summary highlighting key points, main ideas, and important details. Use clear paragraphs and bullet points where appropriate.'
      )
      const note = wasTruncated ? '\n\n---\nNote: The content was longer than what was sent to the AI. The summary may not cover everything.' : ''
      showGenericResult(label + ' Summary', response + note)
    } catch (err) {
      handleAIError(err)
    }
  })

  const runFactCheck = guard(async function () {
    _lastAction = { name: 'factcheck' }
    const selectedText = getDeepSelectionText()

    if (!selectedText) {
      showError('Please select text on the page to fact-check, then click Fact Check again.')
      return
    }

    openPanel()
    showState('loading')
    startThinking('Examining claim')

    const settings = await getSettings()
    setLoadingSub(`${settings.apiProvider} · ${settings.model}`)

    try {
      startThinking('Cross-referencing')
      const pageText = getCleanText(document.body).substring(0, 8000)
      const contextHint = pageText.length > 50
        ? '\n\nPage context (for reference):\n' + pageText
        : ''
      const response = await callAIAction(
        settings,
        'factcheck',
        `Fact-check this claim:\n\n"${selectedText}"${contextHint}`,
        'You are a fact-checking expert. Analyze claims and provide verdicts with evidence and reasoning. Be objective and cite sources when possible.'
      )
      showGenericResult('Fact Check', response)
    } catch (err) {
      handleAIError(err)
    }
  })

  const runAsk = guard(async function (question) {
    if (!question?.trim()) return
    _lastAction = { name: 'ask', question }

    const inp = document.getElementById('pm-ask-input')
    if (inp) inp.value = ''

    openPanel()
    showState('loading')
    startThinking('Thinking')

    const fullPageText = getCleanText(document.body)
    const truncated = fullPageText.substring(0, 12000)
    const wasTruncated = fullPageText.length > 12000
    const settings = await getSettings()
    setLoadingSub(`${settings.apiProvider} · ${settings.model}`)

    const pageContext = truncated
      ? `Based on this page content, answer the question.\n\nPAGE CONTENT:\n${truncated}\n\nQUESTION: ${question}`
      : 'Answer this question: ' + question

    try {
      const response = await callAIAction(
        settings,
        'ask',
        pageContext,
        'You are a helpful AI assistant. Answer questions accurately based on the provided context. If the answer is not in the context, say so.'
      )
      const note = wasTruncated ? '\n\n---\nNote: The page content was longer than what was sent to the AI. The answer may not reflect the full page.' : ''
      showGenericResult('Answer', response + note)
    } catch (err) {
      handleAIError(err)
    }
  })

  let _typeTimer = null
  let _thinkTimer = null

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
    if (!panel ) return
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
      fab.classList.add('pm-active')
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

  let _bubble = null
  let _hideTimer = null

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

  let _panel = null
  let _panelPos = null

  try {
    const saved = localStorage.getItem('pc_panel_pos')
    if (saved) _panelPos = JSON.parse(saved)
  } catch (_) {}

  function savePanelPos(x, y) {
    _panelPos = { x, y }
    try { localStorage.setItem('pc_panel_pos', JSON.stringify(_panelPos)) } catch (_) {}
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(v, max))
  }

  let _dragListenersAdded = false
  let _drag = false
  let _sx, _sy, _sl, _st

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
      document.getElementById('pm-close-btn')?.addEventListener('click', closePanel)
      document.getElementById('pm-back-btn')?.addEventListener('click', () => showState('welcome'))
      document.getElementById('pm-error-back')?.addEventListener('click', () => showState('welcome'))
      document.getElementById('pm-error-retry')?.addEventListener('click', () => {
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

  let _selectionListenersAdded = false

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

  let _messageListenerAdded = false

  function initMessageListener() {
    if (_messageListenerAdded) return
    _messageListenerAdded = true

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'RUN_ACTION') {
        const actionMap = {
          correct_answers: runCorrectAnswers,
          summarize: runSummarize,
          factcheck: runFactCheck,
        }
        const fn = actionMap[message.action]
        if (fn) {
          Promise.resolve(fn()).catch(() => {})
          sendResponse({ ok: true })
        }
        return true
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

  function init() {
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

      showState('welcome')
    } catch (e) {
      console.error('[Cortex] Init failed:', e)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  let _lastURL = location.href
  const origPushState = history.pushState
  const origReplaceState = history.replaceState
  history.pushState = function () {
    origPushState.apply(this, arguments)
    _lastURL = location.href
    init()
  }
  history.replaceState = function () {
    origReplaceState.apply(this, arguments)
    _lastURL = location.href
    init()
  }
  window.addEventListener('popstate', () => {
    if (location.href !== _lastURL) {
      _lastURL = location.href
      init()
    }
  })
})()
