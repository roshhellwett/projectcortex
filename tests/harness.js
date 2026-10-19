/*
 * Test harness for ProjectCortex.
 *
 * Loads the browser-only content scripts into a Node VM context with a small
 * chrome/DOM stub so the pure logic (MCQ parsing, markdown rendering, fuzzy
 * search, workflow and recall storage) can be exercised without a browser.
 *
 * No third party dependencies: this runs on plain Node.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.resolve(__dirname, '..')

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

function createChromeStub() {
  const store = { sync: {}, local: {} }

  const makeArea = areaName => ({
    get(keys, cb) {
      const source = store[areaName] || {}
      const out = {}
      if (keys === null || keys === undefined) {
        Object.assign(out, clone(source))
      } else if (typeof keys === 'string') {
        if (keys in source) out[keys] = clone(source[keys])
      } else if (Array.isArray(keys)) {
        keys.forEach(key => { if (key in source) out[key] = clone(source[key]) })
      } else {
        Object.keys(keys).forEach(key => {
          out[key] = key in source ? clone(source[key]) : clone(keys[key])
        })
      }
      if (typeof cb === 'function') setTimeout(() => cb(out), 0)
      return Promise.resolve(out)
    },
    set(payload, cb) {
      Object.keys(payload || {}).forEach(key => { store[areaName][key] = clone(payload[key]) })
      if (typeof cb === 'function') setTimeout(cb, 0)
      return Promise.resolve()
    },
    remove(keys, cb) {
      const list = Array.isArray(keys) ? keys : [keys]
      list.forEach(key => { delete store[areaName][key] })
      if (typeof cb === 'function') setTimeout(cb, 0)
      return Promise.resolve()
    },
    clear(cb) {
      store[areaName] = {}
      if (typeof cb === 'function') setTimeout(cb, 0)
      return Promise.resolve()
    }
  })

  return {
    __store: store,
    storage: {
      sync: makeArea('sync'),
      local: makeArea('local'),
      onChanged: { addListener() {}, removeListener() {} }
    },
    runtime: {
      lastError: undefined,
      getManifest: () => ({ version: '11.3.0-test' }),
      sendMessage() { return Promise.resolve({}) },
      onMessage: { addListener() {}, removeListener() {} },
      openOptionsPage() {},
      getURL: p => 'chrome-extension://test/' + (p || '')
    },
    tabs: {
      query(_q, cb) { if (typeof cb === 'function') cb([]); return Promise.resolve([]) },
      sendMessage() { return Promise.resolve() },
      reload() {},
      onRemoved: { addListener() {} }
    },
    alarms: { get(_n, cb) { cb(null) }, create() {}, onAlarm: { addListener() {} } },
    contextMenus: { removeAll(cb) { cb() }, create() {}, onClicked: { addListener() {} } },
    commands: { onCommand: { addListener() {} } }
  }
}

function createClassList() {
  const names = new Set()
  return {
    add(...list) { list.forEach(name => names.add(name)) },
    remove(...list) { list.forEach(name => names.delete(name)) },
    contains(name) { return names.has(name) },
    toggle(name, force) {
      const on = force === undefined ? !names.has(name) : Boolean(force)
      if (on) names.add(name)
      else names.delete(name)
      return on
    },
    get length() { return names.size },
    item(index) { return [...names][index] || null },
    toString() { return [...names].join(' ') }
  }
}

function createElementStub(tag) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(),
    nodeType: 1,
    parentNode: null,
    childNodes: [],
    style: {},
    dataset: {},
    attributes: {},
    textContent: '',
    innerHTML: '',
    className: '',
    classList: createClassList(),
    setAttribute(k, v) { this.attributes[k] = v },
    getAttribute(k) {
      return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null
    },
    appendChild(child) {
      child.parentNode = this
      this.childNodes.push(child)
      return child
    },
    removeChild(child) {
      const at = this.childNodes.indexOf(child)
      if (at >= 0) this.childNodes.splice(at, 1)
      child.parentNode = null
      return child
    },
    remove() { if (this.parentNode) this.parentNode.removeChild(this) },
    addEventListener() {},
    removeEventListener() {},
    closest() { return null },
    querySelector() { return null },
    querySelectorAll() { return [] },
    getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 } },
    focus() {},
    select() {},
    contains() { return false },
    scrollIntoView() {},
    attachShadow() { return createElementStub('div') }
  }
  return el
}

function createDocumentStub() {
  return {
    title: 'Test Page',
    readyState: 'complete',
    documentElement: createElementStub('html'),
    head: createElementStub('head'),
    body: createElementStub('body'),
    activeElement: null,
    addEventListener() {},
    removeEventListener() {},
    createElement: tag => createElementStub(tag),
    createTextNode: text => ({ nodeType: 3, nodeValue: String(text), textContent: String(text) }),
    createDocumentFragment: () => createElementStub('fragment'),
    createTreeWalker: () => ({ nextNode: () => null }),
    querySelector() { return null },
    querySelectorAll() { return [] },
    getElementById() { return null },
    execCommand() { return true },
    contains() { return true }
  }
}

/**
 * Loads content scripts into one shared VM context.
 * Files execute in the same order as the manifest, so cross-file globals behave
 * exactly as they do inside the extension.
 */
function createEnvironment(files) {
  const chrome = createChromeStub()
  const document = createDocumentStub()

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    cancelAnimationFrame() {},
    queueMicrotask,
    innerWidth: 1280,
    innerHeight: 800,
    chrome,
    document,
    navigator: {
      userAgent: 'node-test',
      clipboard: { writeText: () => Promise.resolve() },
      hardwareConcurrency: 4
    },
    location: { href: 'https://example.com/guide', hostname: 'example.com', pathname: '/guide' },
    localStorage: {
      _data: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null },
      setItem(k, v) { this._data[k] = String(v) },
      removeItem(k) { delete this._data[k] }
    },
    fetch: () => Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('')
    }),
    AbortController,
    URL,
    TextEncoder,
    TextDecoder,
    Node: { ELEMENT_NODE: 1, TEXT_NODE: 3, DOCUMENT_FRAGMENT_NODE: 11 },
    NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3 },
    // content_ui.js registers window level error boundaries at load time.
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true }
  }

  const context = vm.createContext(sandbox)
  sandbox.window = sandbox

  const loaded = []
  for (const file of files) {
    const code = fs.readFileSync(path.join(ROOT, file), 'utf8')
    vm.runInContext(code, context, { filename: file, displayErrors: true })
    loaded.push(file)
  }

  return { sandbox, chrome, document, loaded }
}

module.exports = { createEnvironment, createChromeStub, createDocumentStub, createElementStub, createClassList, ROOT }
