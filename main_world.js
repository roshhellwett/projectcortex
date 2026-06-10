// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

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
