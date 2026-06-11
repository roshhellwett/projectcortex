// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

function applyCopyPasteOverride() {
  if (window._pmCssObserver) return
  const style = document.createElement('style')
  style.id = 'pm-copy-paste-override'
  style.textContent =
    '*, html, body, div, p, span, a, h1, h2, h3, h4, h5, h6, table, tr, td, th, ul, ol, li, section, article, main, header, footer, form, label, input, textarea { user-select: auto !important; -webkit-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; -webkit-touch-callout: default !important; pointer-events: auto !important; }'
  document.head.appendChild(style)

  let reinsertCount = 0
  let lastReset = Date.now()

  window._pmCssObserver = new MutationObserver(() => {
    const now = Date.now()
    if (now - lastReset > 2000) {
      reinsertCount = 0
      lastReset = now
    }

    if (!document.getElementById('pm-copy-paste-override')) {
      document.head.appendChild(style)
      reinsertCount++
    } else if (document.head.lastElementChild !== style) {
      document.head.appendChild(style)
      reinsertCount++
    }

    // If we fight another script 50 times in 2 seconds, surrender to prevent browser crash
    if (reinsertCount > 50) {
      window._pmCssObserver.disconnect()
      console.warn('ProjectCortex: CSS observer disabled to prevent infinite loop.')
    }
  })
  window._pmCssObserver.observe(document.head, { childList: true })
}
